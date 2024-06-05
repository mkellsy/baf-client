import * as Interfaces from "@mkellsy/hap-device";

import { Capabilities, Connection } from "@mkellsy/baf";

import equals from "deep-equal";

import { Command } from "../Interfaces/Command";
import { Common } from "./Common";
import { DeviceType } from "../Interfaces/DeviceType";
import { FanState } from "./FanState";

/**
 * Defines a fan device.
 */
export class Fan extends Common implements Interfaces.Fan {
    /**
     * Creates a fan device.
     *
     * ```js
     * const fan = new Fan(connection, capabilities);
     * ```
     *
     * @param connection The main connection to the device.
     * @param capabilities Device capabilities from discovery.
     */
    constructor(connection: Connection, capabilities: Capabilities) {
        super(Interfaces.DeviceType.Fan, connection, {
            id: capabilities.id,
            name: `${capabilities.name} ${DeviceType.Fan}`,
            suffix: DeviceType.Fan,
        });

        this.fields.set("state", { type: "String", values: ["On", "Off"] });
        this.fields.set("speed", { type: "Integer", min: 0, max: 7 });
        this.fields.set("whoosh", { type: "String", values: ["On", "Off"] });
        this.fields.set("auto", { type: "String", values: ["On", "Off"] });

        if (capabilities.eco) {
            this.fields.set("eco", { type: "String", values: ["On", "Off"] });
        }
    }

    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * fan.update({ SwitchedLevel: "On", FanSpeed: 7 });
     * ```
     *
     * @param status The current device state.
     */
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

    /**
     * Controls this device.
     *
     * ```js
     * fan.set({ state: "On", speed: 3 });
     * ```
     *
     * @param status Desired device state.
     */
    public set(status: FanState): Promise<void> {
        const command = new Command(this.connection);

        const whoosh = status.whoosh === "On" ? 0x01 : 0x00;
        const eco = status.eco === "On" ? 0x01 : 0x0;

        switch (status.state) {
            case "On":
                command.push([0xd8, 0x02, 0x01], [0xf0, 0x02, status.speed]);
                break;

            case "Off":
                command.push([0xd8, 0x02, 0x00]);
                break;

            case "Auto":
                command.push([0xd8, 0x02, 0x02]);
                break;
        }

        command.push([0xd0, 0x03, whoosh]);

        if (this.capabilities.eco) {
            command.push([0x88, 0x04, eco]);
        }

        return command.execute();
    }
}
