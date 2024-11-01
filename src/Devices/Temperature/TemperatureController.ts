import { AreaStatus, DeviceType } from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Capabilities } from "../../Response/Capabilities";
import { Common } from "../Common";
import { Connection } from "../../Connection/Connection";
import { Devices } from "../Devices";
import { Temperature } from "./Temperature";
import { TemperatureState } from "./TemperatureState";

/**
 * Defines a temperature sensor device.
 * @public
 */
export class TemperatureController extends Common<TemperatureState> implements Temperature {
    /**
     * Creates a temperature sensor device.
     *
     * ```js
     * const sensor = new TemperatureController(connection, capabilities);
     * ```
     *
     * @param connection - The main connection to the device.
     * @param capabilities - Device capabilities from discovery.
     */
    constructor(connection: Connection, capabilities: Capabilities) {
        super(
            DeviceType.Temperature,
            connection,
            {
                id: capabilities.id,
                name: `${capabilities.name} ${Devices.Temperature}`,
                suffix: Devices.Temperature,
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
     * @param status - The current device state.
     */
    public update(status: AreaStatus): void {
        const previous = { ...this.status };

        if (status.Temperature != null) {
            this.state.temprature = status.Temperature;
        }

        if (!equals(this.state, previous)) {
            this.emit("Update", this, this.state);
        }

        this.initialized = true;
    }

    /**
     * Controls this device (not supported).
     */
    public set = (): Promise<void> => Promise.resolve();
}
