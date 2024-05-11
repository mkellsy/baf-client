import * as Baf from "@mkellsy/baf";
import * as Interfaces from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Common } from "./Common";

export class Temperature extends Common implements Interfaces.Temperature {
    constructor(connection: Baf.Connection, capabilities: Baf.Capabilities) {
        super(Interfaces.DeviceType.Temperature, connection, {
            id: capabilities.id,
            name: `${capabilities.name} Temperature`,
            suffix: "Temperature",
        });

        this.state = { state: "Auto" };
    }

    public update(status: Interfaces.AreaStatus): void {
        const previous = { ...this.status };

        if (status.Temperature != null) {
            this.state.temprature = status.Temperature;
        }

        if (!equals(this.state, previous)) {
            this.emit("Update", this, this.state);
        }
    }

    public set(_state: unknown): void {}
}
