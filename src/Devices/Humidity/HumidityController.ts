import { AreaStatus, DeviceType } from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Capabilities } from "../../Response/Capabilities";
import { Common } from "../Common";
import { Connection } from "../../Connection/Connection";
import { Humidity } from "./Humidity";
import { HumidityState } from "./HumidityState";
import { Devices } from "../Devices";

/**
 * Defines a humidity sensor device.
 * @public
 */
export class HumidityController extends Common<HumidityState> implements Humidity {
    /**
     * Creates a humidity sensor device.
     *
     * ```js
     * const sensor = new HumidityController(connection, capabilities);
     * ```
     *
     * @param connection - The main connection to the device.
     * @param capabilities - Device capabilities from discovery.
     */
    constructor(connection: Connection, capabilities: Capabilities) {
        super(
            DeviceType.Humidity,
            connection,
            {
                id: capabilities.id,
                name: `${capabilities.name} ${Devices.Humidity}`,
                suffix: Devices.Humidity,
            },
            { state: "Auto", humidity: 0 },
        );
    }

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
    public update(status: AreaStatus): void {
        const previous = { ...this.status };

        if (status.Humidity != null) {
            this.state.humidity = status.Humidity;
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
