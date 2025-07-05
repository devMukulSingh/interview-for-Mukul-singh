export type TLaunchPad = {
    images: {
        large: string[]; // Array of large image URLs
    };
    name: string;
    full_name: string;
    locality: string;
    region: string;
    latitude: number;
    longitude: number;
    launch_attempts: number;
    launch_successes: number;
    rockets: string[]; // Array of rocket IDs (or references to rocket entities)
    timezone: string;
    launches: string[]; // Array of launch IDs (or references to launch entities)
    status: "retired" | "active" | "inactive"; // Assuming common statuses
    details: string;
    id: string;
};