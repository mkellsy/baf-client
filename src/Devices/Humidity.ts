import * as Baf from "@mkellsy/baf";
import * as Interfaces from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Common } from "./Common";

export class Humidity extends Common implements Interfaces.Humidity {
    constructor(connection: Baf.Connection, capabilities: Baf.Capabilities) {
        super(Interfaces.DeviceType.Humidity, connection, {
            id: capabilities.id,
            name: `${capabilities.name} Humidity`,
            suffix: "Humidity",
        });

        this.state = { state: "Auto" };
    }

    public update(status: Interfaces.AreaStatus): void {
        const previous = { ...this.status };

        if (status.Humidity != null) {
            this.state.humidity = status.Humidity;
        }

        if (!equals(this.state, previous)) {
            this.emit("Update", this, this.state);
        }
    }

    public set(_state: unknown): void {}
}
