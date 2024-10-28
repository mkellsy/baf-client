import { DeviceState } from "@mkellsy/hap-device";

/**
 * Defines a humidity sensor's current status response.
 * @public
 */
export interface HumidityState extends DeviceState {
    /**
     * Sensors with secondary state values are automatic in nature.
     */
    state: "Auto";

    /**
     * The sensors's humidity level.
     */
    humidity: number;
}
