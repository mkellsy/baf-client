import * as Baf from "@mkellsy/baf";
import * as Interfaces from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Common } from "./Common";
import { DeviceType } from "../Interfaces/DeviceType";

export class Occupancy extends Common implements Interfaces.Occupancy {
    constructor(connection: Baf.Connection, capabilities: Baf.Capabilities) {
        super(Interfaces.DeviceType.Occupancy, connection, {
            id: capabilities.id,
            name: `${capabilities.name} ${DeviceType.Occupancy}`,
            suffix: DeviceType.Occupancy,
        });
    }

    public update(status: Interfaces.AreaStatus): void {
        const previous = { ...this.status };

        if (status.OccupancyStatus != null) {
            this.state.state = status.OccupancyStatus === "Occupied" ? "Occupied" : "Unoccupied";
        }

        if (!equals(this.state, previous)) {
            this.emit("Update", this, this.state);
        }
    }

    public set(_state: unknown): void {}
}
