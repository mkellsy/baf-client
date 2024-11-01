/**
 * Contains device information and capibilities.
 * @private
 */
export interface Capabilities {
    /**
     * The id of the device, typically the mac address.
     */
    id: string;

    /**
     * The name of the device.
     */
    name: string;

    /**
     * The device model.
     */
    model: string;

    /**
     * The firmware version of the device.
     */
    firmware: string;

    /**
     * The mac address of the device.
     */
    mac: string;

    /**
     * Is fan functions supported.
     */
    fan: boolean;

    /**
     * Is there a downlight.
     */
    downlight: boolean;

    /**
     * Is there an uplight.
     */
    uplight: boolean;

    /**
     * Is there a temperature sensor.
     */
    temperature: boolean;

    /**
     * Is there a humidity sensor.
     */
    humidity: boolean;

    /**
     * Is there an occupancy sensor.
     */
    occupancy: boolean;

    /**
     * Is there luminance control.
     */
    luminance: boolean;

    /**
     * Is there a speaker.
     */
    speaker: boolean;

    /**
     * Is there a uvc light.
     */
    uvc: boolean;

    /**
     * Is eco mode supported.
     */
    eco: boolean;
}
