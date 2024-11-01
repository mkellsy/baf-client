/**
 * Stores information about the current state of a sensor device.
 * @private
 */
export interface SensorState {
    /**
     * The id of the sensor device.
     */
    id: string;

    /**
     * The current temperature in celsius.
     */
    temperature: number;

    /**
     * The current relative humidity.
     */
    humidity: number;
}
