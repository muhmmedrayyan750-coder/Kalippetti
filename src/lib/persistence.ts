import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';

export const SHOP_STORAGE_KEYS = {
  products: 'kalippetti_products',
  ads: 'kalippetti_ads',
  campaign: 'kalippetti_campaign',
  orders: 'kalippetti_orders',
  settings: 'kalippetti_settings',
  cart: 'kalippetti_cart',
} as const;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const isFirebaseConfigured = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

let firebaseApp: FirebaseApp | null = null;
let firestore: Firestore | null = null;

if (isFirebaseConfigured) {
  firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  firestore = getFirestore(firebaseApp);
}

export const isRemoteSyncEnabled = () => Boolean(firestore);

const readLocalValue = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const writeLocalValue = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
};

const JSON_BLOB_ID = '019f3bdb-faa6-7f7f-8f01-68d01c3219b0';
const JSON_BLOB_URL = `https://jsonblob.com/api/jsonBlob/${JSON_BLOB_ID}`;

export const pullFromRemote = async (): Promise<void> => {
  try {
    const res = await fetch(JSON_BLOB_URL);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, val]) => {
          if (val !== null && val !== undefined) {
            localStorage.setItem(`kalippetti_${key}`, JSON.stringify(val));
          }
        });
        window.dispatchEvent(new Event('local-update'));
      }
    }
  } catch (err) {
    console.error('Failed to pull from JSON Blob:', err);
  }
};

export const pushToRemote = async (): Promise<void> => {
  try {
    const payload: Record<string, unknown> = {};
    const keys = ['products', 'ads', 'campaign', 'orders', 'settings', 'users'];
    keys.forEach(k => {
      const val = localStorage.getItem(`kalippetti_${k}`);
      payload[k] = val ? JSON.parse(val) : null;
    });

    await fetch(JSON_BLOB_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Failed to push to JSON Blob:', err);
  }
};

export const readStoredData = async <T>(key: string, fallback: T | null = null): Promise<T | null> => {
  if (firestore) {
    try {
      const snapshot = await getDoc(doc(firestore, 'siteData', key));
      if (snapshot.exists()) {
        const remoteValue = snapshot.data()?.value as T | undefined;
        if (remoteValue !== undefined) {
          writeLocalValue(key, remoteValue);
          return remoteValue;
        }
      }
    } catch (error) {
      console.error('Failed to load remote data from firestore:', error);
    }
  } else {
    // Try syncing from JSON Blob first to get the latest changes
    await pullFromRemote();
  }

  return readLocalValue<T>(`kalippetti_${key}`) ?? readLocalValue<T>(key) ?? fallback;
};

export const writeStoredData = async <T>(key: string, value: T): Promise<void> => {
  const localKey = key.startsWith('kalippetti_') ? key : `kalippetti_${key}`;
  writeLocalValue(localKey, value);
  window.dispatchEvent(new Event('local-update'));

  if (firestore) {
    try {
      await setDoc(doc(firestore, 'siteData', key), { value }, { merge: true });
    } catch (error) {
      console.error('Failed to save remote data to firestore:', error);
    }
  } else {
    await pushToRemote();
  }
};

