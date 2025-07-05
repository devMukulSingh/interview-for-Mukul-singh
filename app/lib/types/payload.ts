

type TDragon = {
    capsule: string | null;
    mass_returned_kg: number | null;
    mass_returned_lbs: number | null;
    flight_time_sec: number | null;
    manifest: string | null;
    water_landing: boolean | null;
    land_landing: boolean | null;
};

export type TPayload = {
    dragon: TDragon;
    name: string;
    type: string;
    reused: boolean;
    launch: string; // Reference to launch ID
    customers: string[]; // Array of customer names
    norad_ids: string[]; // Array of NORAD IDs
    nationalities: string[]; // Array of nationalities
    manufacturers: string[]; // Array of manufacturers
    mass_kg: number;
    mass_lbs: number;
    orbit: string;
    reference_system: string;
    regime: string;
    longitude: number | null;
    semi_major_axis_km: number | null;
    eccentricity: number | null;
    periapsis_km: number | null;
    apoapsis_km: number | null;
    inclination_deg: number | null;
    period_min: number | null;
    lifespan_years: number | null;
    epoch: string | null;
    mean_motion: number | null;
    raan: number | null;
    arg_of_pericenter: number | null;
    mean_anomaly: number | null;
    id: string;
};
