import * as Interfaces from "@mkellsy/hap-device";

import { Capabilities, Connection } from "@mkellsy/baf";

import equals from "deep-equal";

import { Common } from "./Common";
import { DeviceType } from "../Interfaces/DeviceType";

/**
 * Defines a humidity sensor device.
 */
export class Humidity extends Common implements Interfaces.Humidity {
    /**
     * Creates a humidity sensor device.
     *
     * ```js
     * const sensor = new Humidity(connection, capabilities);
     * ```
     *
     * @param connection The main connection to the device.
     * @param capabilities Device capabilities from discovery.
     */
    constructor(connection: Connection, capabilities: Capabilities) {
        super(Interfaces.DeviceType.Humidity, connection, {
            id: capabilities.id,
            name: `${capabilities.name} ${DeviceType.Humidity}`,
            suffix: DeviceType.Humidity,
        });

        this.state = { state: "Auto" };
    }

    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * sensor.update({ Humidity: 42.3 });
     * ```
     *
     * @param status The current device state.
     */
    public update(status: Interfaces.AreaStatus): void {
        const previous = { ...this.status };

        if (status.Humidity != null) {
            this.state.humidity = status.Humidity;
        }

        if (!equals(this.state, previous)) {
            this.emit("Update", this, this.state);
        }
    }

    /**
     * Controls this device (not supported).
     */
    public set = (): Promise<void> => Promise.resolve();
}
