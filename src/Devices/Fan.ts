import * as Baf from "@mkellsy/baf";
import * as Interfaces from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Common } from "./Common";

export class Fan extends Common implements Interfaces.Fan {
    constructor(connection: Baf.Connection, capabilities: Baf.Capabilities) {
        super(Interfaces.DeviceType.Fan, connection, {
            id: capabilities.id,
            name: `${capabilities.name} Fan`,
            suffix: "Fan",
        });

        this.fields.set("state", { type: "String", values: ["On", "Off"] });
        this.fields.set("speed", { type: "Integer", min: 0, max: 7 });
        this.fields.set("whoosh", { type: "String", values: ["On", "Off"] });
        this.fields.set("auto", { type: "String", values: ["On", "Off"] });

        if (capabilities.eco) {
            this.fields.set("eco", { type: "String", values: ["On", "Off"] });
        }
    }

    public update(status: Interfaces.ZoneStatus): void {
        const previous = { ...this.status };

        this.state = {
            ...previous,
            state: status.SwitchedLevel || "Unknown",
            whoosh: status.WhooshLevel || "Unknown",
            auto: status.AutoLevel || "Unknown",
            speed: status.FanSpeed || 0,
        };

        if (this.capabilities.eco) {
            this.state.eco = status.EcoLevel || "Unknown";
        }

        if (!equals(this.state, previous)) {
            this.emit("Update", this, this.state);
        }
    }

    public set(status: Partial<Interfaces.DeviceState>): void {
        if (status.state === "Off") {
            this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xd8, 0x02, 0x00]);
        } else {
            this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xd8, 0x02, 0x01]);
            this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xf0, 0x02, status.speed || 0]);
        }

        if (status.whoosh === "On") {
            this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xd0, 0x03,  0x01]);
        } else {
            this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xd0, 0x03, 0x00]);
        }

        if (status.eco === "On") {
            this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0x88, 0x04, 0x01]);
        } else {
            this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0x88, 0x04, 0x0]);
        }

        if (status.auto === "On") {
            this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xd8, 0x02, 0x02]);
        }
    }
}
