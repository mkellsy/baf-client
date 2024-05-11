import * as Baf from "@mkellsy/baf";
import * as Interfaces from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Common } from "./Common";
import { LightPosition } from "../Interfaces/LightPosition";

export class Dimmer extends Common implements Interfaces.Dimmer {
    constructor(connection: Baf.Connection, capabilities: Baf.Capabilities, position: LightPosition) {
        super(Interfaces.DeviceType.Dimmer, connection, {
            id: capabilities.id,
            name: `${capabilities.name} ${position}`,
            suffix: position,
        });

        this.fields.set("state", { type: "String", values: ["On", "Off"] });
        this.fields.set("level", { type: "Integer", min: 0, max: 100 });
    }

    public update(status: Interfaces.ZoneStatus): void {
        const previous = { ...this.status };

        if (status.Level != null) {
            this.state.state = status.Level > 0 ? "On" : "Off";
            this.state.level = status.Level;
        }

        if (!equals(this.state, previous)) {
            this.emit("Update", this, this.state);
        }
    }

    public set(status: Partial<Interfaces.DeviceState>): void {
        if (status.state === "Off") {
            // TURN OFF
        } else {
            // SET LEVEL
        }
    }
}
