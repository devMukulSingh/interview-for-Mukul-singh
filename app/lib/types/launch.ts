type Failure = {
    time: number | null;
    altitude: number | null;
    reason: string;
};

type Fairings = {
    reused: boolean;
    recovery_attempt: boolean;
    recovered: boolean;
    ships: string[]; // Array of ships (strings, assuming IDs or names)
};

export type Links = {
    patch: {
        small: string;
        large: string;
    };
    reddit: {
        campaign: string | null;
        launch: string | null;
        media: string | null;
        recovery: string | null;
    };
    flickr: {
        small: string[];
        original: string[];
    };
    presskit: string | null;
    webcast: string;
    youtube_id: string;
    article: string;
    wikipedia: string;
};

type Core = {
    core: string;
    flight: number;
    gridfins: boolean;
    legs: boolean;
    reused: boolean;
    landing_attempt: boolean;
    landing_success: boolean | null;
    landing_type: string | null;
    landpad: string | null;
};

export type TLaunch = {
    fairings: Fairings;
    links: Links;
    static_fire_date_utc: string;
    static_fire_date_unix: number;
    net: boolean;
    window: number;
    rocket: string; // ID or name of the rocket
    success: boolean;
    failures: Failure[];
    details: string;
    crew: string[]; // Array of crew members (strings, assuming IDs or names)
    ships: string[]; // Array of ships (strings, assuming IDs or names)
    capsules: string[]; // Array of capsules (strings, assuming IDs or names)
    payloads: string[]; // Array of payload IDs
    launchpad: string; // Launchpad ID
    flight_number: number;
    name: string;
    date_utc: string;
    date_unix: number;
    date_local: string;
    date_precision: "hour" | "minute" | "second"; // Precision of the date
    upcoming: boolean;
    cores: Core[];
    auto_update: boolean;
    tbd: boolean;
    launch_library_id: string | null;
    id: string; // Launch ID
};