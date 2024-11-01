import { AreaStatus, Temperature as TemperatureInterface } from "@mkellsy/hap-device";

/**
 * Defines a temperature sensor device.
 * @public
 */
export interface Temperature extends TemperatureInterface {
    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * sensor.update({ Temperature: 22.3 });
     * ```
     *
     * @param status - The current device state.
     */
    update(status: AreaStatus): void;
}
