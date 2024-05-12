import * as Baf from "@mkellsy/baf";
import * as Interfaces from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Common } from "./Common";
import { DeviceType } from "../Interfaces/DeviceType";

export class Dimmer extends Common implements Interfaces.Dimmer {
    constructor(connection: Baf.Connection, capabilities: Baf.Capabilities, type: DeviceType) {
        super(Interfaces.DeviceType.Dimmer, connection, {
            id: capabilities.id,
            name: `${capabilities.name} ${type}`,
            suffix: type,
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
        switch (this.suffix) {
            case DeviceType.Uplight:
                if (status.state === "Off") {
                    this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0x90, 0x05, 2]);
                    this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xa0, 0x04, 0x00]);
                } else {
                    this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0x90, 0x05, 2]);
                    this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xa0, 0x04, 0x01]);
                    this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xa8, 0x04, status.level || 0]);
                }

                break;

            case DeviceType.Downlight:
                if (status.state === "Off") {
                    this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0x90, 0x05, 1]);
                    this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xa0, 0x04, 0x00]);
                } else {
                    this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0x90, 0x05, 1]);
                    this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xa0, 0x04, 0x01]);
                    this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xa8, 0x04, status.level || 0]);
                }

                break;
        }
    }
}
