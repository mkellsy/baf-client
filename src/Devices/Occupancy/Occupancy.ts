import * as Interfaces from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Capabilities } from "../Capabilities";
import { Common } from "../Common";
import { Connection } from "../../Connection/Connection";
import { DeviceType } from "../DeviceType";
import { OccupancyState } from "./OccupancyState";

/**
 * Defines a occupancy sensor device.
 * @public
 */
export class Occupancy extends Common<OccupancyState> implements Interfaces.Occupancy {
    /**
     * Creates a occupancy sensor device.
     *
     * ```js
     * const sensor = new Occupancy(connection, capabilities);
     * ```
     *
     * @param connection - The main connection to the device.
     * @param capabilities - Device capabilities from discovery.
     */
    constructor(connection: Connection, capabilities: Capabilities) {
        super(
            Interfaces.DeviceType.Occupancy,
            connection,
            {
                id: capabilities.id,
                name: `${capabilities.name} ${DeviceType.Occupancy}`,
                suffix: DeviceType.Occupancy,
            },
            { state: "Unoccupied" },
        );
    }

    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * sensor.update({ OccupancyStatus: "Occupied" });
     * ```
     *
     * @param status - The current device state.
     */
    public update(status: Interfaces.AreaStatus): void {
        const previous = { ...this.status };

        if (status.OccupancyStatus != null) {
            this.state.state = status.OccupancyStatus === "Occupied" ? "Occupied" : "Unoccupied";
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
