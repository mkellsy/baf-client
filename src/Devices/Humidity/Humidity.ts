import { AreaStatus, Humidity as HumidityInterface } from "@mkellsy/hap-device";

import { HumidityState } from "./HumidityState";

/**
 * Defines a humidity sensor device.
 * @public
 */
export interface Humidity extends HumidityInterface {
    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * sensor.update({ Humidity: 42.3 });
     * ```
     *
     * @param status - The current device state.
     */
    update(status: AreaStatus): void;

    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    readonly status: HumidityState;
}
