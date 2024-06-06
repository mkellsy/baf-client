import * as Interfaces from "@mkellsy/hap-device";

import { Capabilities, Connection } from "@mkellsy/baf";

import equals from "deep-equal";

import { Common } from "./Common";
import { DeviceType } from "../Interfaces/DeviceType";
import { TemperatureState } from "./TemperatureState";

/**
 * Defines a temperature sensor device.
 */
export class Temperature extends Common<TemperatureState> implements Interfaces.Temperature {
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
    constructor(connection: Connection, capabilities: Capabilities) {
        super(
            Interfaces.DeviceType.Temperature,
            connection,
            {
                id: capabilities.id,
                name: `${capabilities.name} ${DeviceType.Temperature}`,
                suffix: DeviceType.Temperature,
            },
            { state: "Auto", temprature: 0 },
        );
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
    public set = (): Promise<void> => Promise.resolve();
}
