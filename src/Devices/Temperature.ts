import * as Baf from "@mkellsy/baf";
import * as Interfaces from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Common } from "./Common";
import { DeviceType } from "../Interfaces/DeviceType";

/**
 * Defines a temperature sensor device.
 */
export class Temperature extends Common implements Interfaces.Temperature {
    /**
     * Creates a temperature sensor device.
     *
     * ```js
     * const sensor = new Temperature(connection, capabilities);
     * ```
     *
     * @param connection The main connection to the device.
     * @param capabilities Device capabilities from discovery.
     */
    constructor(connection: Baf.Connection, capabilities: Baf.Capabilities) {
        super(Interfaces.DeviceType.Temperature, connection, {
            id: capabilities.id,
            name: `${capabilities.name} ${DeviceType.Temperature}`,
            suffix: DeviceType.Temperature,
        });

        this.state = { state: "Auto" };
    }

    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * sensor.update({ Temperature: 22.3 });
     * ```
     *
     * @param status The current device state.
     */
    public update(status: Interfaces.AreaStatus): void {
        const previous = { ...this.status };

        if (status.Temperature != null) {
            this.state.temprature = status.Temperature;
        }

        if (!equals(this.state, previous)) {
            this.emit("Update", this, this.state);
        }
    }

    /**
     * Controls this device (not supported).
     */
    public set(): void {}
}
