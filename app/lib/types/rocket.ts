
type TDimensions = {
    meters: number;
    feet: number;
};

type TThrust = {
    kN: number;
    lbf: number;
};

type TFirstStage = {
    thrust_sea_level: TThrust;
    thrust_vacuum: TThrust;
    reusable: boolean;
    engines: number;
    fuel_amount_tons: number;
    burn_time_sec: number;
};

type TSecondStage = {
    thrust: TThrust;
    payloads: {
        composite_fairing: {
            height: TDimensions;
            diameter: TDimensions;
        };
        option_1: string;
    };
    reusable: boolean;
    engines: number;
    fuel_amount_tons: number;
    burn_time_sec: number;
};

type TEngine = {
    isp: {
        sea_level: number;
        vacuum: number;
    };
    thrust_sea_level: TThrust;
    thrust_vacuum: TThrust;
    number: number;
    type: string;
    version: string;
    layout: string;
    engine_loss_max: number;
    propellant_1: string;
    propellant_2: string;
    thrust_to_weight: number;
};

type TLandingLegs = {
    number: number;
    material: string | null;
};

type TPayloadWeight = {
    id: string;
    name: string;
    kg: number;
    lb: number;
};

type TFlickrImages = string[];

export type TRocket = {
    height: TDimensions;
    diameter: TDimensions;
    mass: {
        kg: number;
        lb: number;
    };
    first_stage: TFirstStage;
    second_stage: TSecondStage;
    engines: TEngine;
    landing_legs: TLandingLegs;
    payload_weights: TPayloadWeight[];
    flickr_images: TFlickrImages;
    name: string;
    type: string;
    active: boolean;
    stages: number;
    boosters: number;
    cost_per_launch: number;
    success_rate_pct: number;
    first_flight: string;
    country: string;
    company: string;
    wikipedia: string;
    description: string;
    id: string;
};
