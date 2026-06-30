// Shared types across the application

export interface SiteSettings {
    siteName: string;
    logoPart1: string;
    logoPart2: string;
    contactNumber: string;
    officialEmail: string;
    welcomeMessage: string;
    primaryColor: string;
    secondaryColor: string;
    instagramUrl?: string;
    facebookUrl?: string;
    shippingCharge: number;
    freeShippingThreshold: number;
}
