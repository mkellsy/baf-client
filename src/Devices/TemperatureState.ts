import { DeviceState } from "@mkellsy/hap-device";

/**
 * Defines a temperature sensor's current status response.
 * @public
 */
export interface TemperatureState extends DeviceState {
    /**
     * Sensors with secondary state values are automatic in nature.
     */
    state: "Auto";

    /**
     * The sensors's temprature level.
     */
    temprature: number;
}
