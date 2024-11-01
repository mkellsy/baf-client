import { AreaStatus, DeviceType } from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Capabilities } from "../../Response/Capabilities";
import { Common } from "../Common";
import { Connection } from "../../Connection/Connection";
import { Devices } from "../Devices";
import { Occupancy } from "./Occupancy";
import { OccupancyState } from "./OccupancyState";

/**
 * Defines a occupancy sensor device.
 * @public
 */
export class OccupancyController extends Common<OccupancyState> implements Occupancy {
    /**
     * Creates a occupancy sensor device.
     *
     * ```js
     * const sensor = new OccupancyController(connection, capabilities);
     * ```
     *
     * @param connection - The main connection to the device.
     * @param capabilities - Device capabilities from discovery.
     */
    constructor(connection: Connection, capabilities: Capabilities) {
        super(
            DeviceType.Occupancy,
            connection,
            {
                id: capabilities.id,
                name: `${capabilities.name} ${Devices.Occupancy}`,
                suffix: Devices.Occupancy,
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
    public update(status: AreaStatus): void {
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
