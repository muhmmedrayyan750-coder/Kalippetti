const fetch = globalThis.fetch || require('node-fetch');

const JSON_BLOB_ID = '019f3bdb-faa6-7f7f-8f01-68d01c3219b0';
const JSON_BLOB_URL = `https://jsonblob.com/api/jsonBlob/${JSON_BLOB_ID}`;

(async () => {
  try {
    const res = await fetch(JSON_BLOB_URL);
    if (!res.ok) {
      console.error('Failed to fetch JSON blob', res.status);
      process.exit(1);
    }
    const data = await res.json();
    const products = Array.isArray(data.products) ? data.products : [];

    const newProduct = {
      id: `p-${Date.now()}`,
      title: 'Play & Learn Intelligence Book for Kids | Interactive Musical Educational Toy',
      description: `🎓 Interactive Musical Learning Book for Smart Little Minds (Age 3+)\nTurn everyday playtime into a fun learning experience with this Interactive Musical Intelligence Book. Designed especially for toddlers and preschoolers, this engaging educational toy helps children learn alphabets, numbers, animals, sounds, and more — all through touch and sound.\n\n🔊 Touch & Learn Audio Technology: Each page is touch-sensitive. When your child presses an image, they hear alphabet pronunciation, word & spelling, clear child-friendly audio.\n\n📚 Complete Early Learning in One Book: Covers ABC, Numbers 1–10, Animals & sounds, Fruits & vegetables, Vehicles, Shapes & colors, Relationships, Musical instruments.\n\n🎵 15 Built-in Musical Songs — improve memory and listening skills.\n\n🧠 Supports Early Skill Development: Vocabulary, listening, hand-eye coordination.\n\n🎁 Perfect Gift for Toddlers (3+ Years)\n\nBattery Requirement: 3 × AA Batteries (Not Included).`,
      price: 750,
      originalPrice: 858,
      category: 'Learning Toys',
      imageUrl: 'https://kidzage.com/cdn/shop/files/PLAY_LEARN_PINK_1_ceb6c6fe-91b3-48e7-aaab-26ba9ca2b6a2.webp?v=1777180309&width=600',
      rating: 4.5,
      reviewsCount: 12,
      inStock: true
    };

    // Avoid duplicates by title
    const exists = products.some(p => p.title === newProduct.title || p.imageUrl === newProduct.imageUrl);
    if (exists) {
      console.log('Product already exists in remote store, skipping.');
      process.exit(0);
    }

    products.push(newProduct);
    data.products = products;

    const putRes = await fetch(JSON_BLOB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data, null, 2),
    });
    if (!putRes.ok) {
      console.error('Failed to update JSON blob', putRes.status);
      process.exit(1);
    }
    console.log('Product added to remote store successfully.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
