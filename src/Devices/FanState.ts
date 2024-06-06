import { DeviceState } from "@mkellsy/hap-device";

/**
 * Defines a fan's current status response.
 */
export interface FanState extends DeviceState {
    /**
     * Is the fan on, off, or set to auto.
     */
    state: "On" | "Off" | "Auto";

    /**
     * The fan's speed setting.
     */
    speed: number;

    /**
     * Determines if the fan's whoosh mode is on or off.
     */
    whoosh: "On" | "Off";

    /**
     * Determines if the fan's eco mode is on or off.
     */
    eco?: "On" | "Off";
}
