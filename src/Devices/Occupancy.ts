import * as Baf from "@mkellsy/baf";
import * as Interfaces from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Common } from "./Common";
import { DeviceType } from "../Interfaces/DeviceType";

/**
 * Defines a occupancy sensor device.
 */
export class Occupancy extends Common implements Interfaces.Occupancy {
    /**
     * Creates a occupancy sensor device.
     *
     * ```js
     * const sensor = new Occupancy(connection, capabilities);
     * ```
     *
     * @param connection The main connection to the device.
     * @param capabilities Device capabilities from discovery.
     */
    constructor(connection: Baf.Connection, capabilities: Baf.Capabilities) {
        super(Interfaces.DeviceType.Occupancy, connection, {
            id: capabilities.id,
            name: `${capabilities.name} ${DeviceType.Occupancy}`,
            suffix: DeviceType.Occupancy,
        });
    }

    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * sensor.update({ OccupancyStatus: "Occupied" });
     * ```
     *
     * @param status The current device state.
     */
    public update(status: Interfaces.AreaStatus): void {
        const previous = { ...this.status };

        if (status.OccupancyStatus != null) {
            this.state.state = status.OccupancyStatus === "Occupied" ? "Occupied" : "Unoccupied";
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
