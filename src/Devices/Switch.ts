import * as Interfaces from "@mkellsy/hap-device";

import { Capabilities, Connection } from "@mkellsy/baf";

import equals from "deep-equal";

import { Command } from "../Interfaces/Command";
import { Common } from "./Common";
import { DeviceType } from "../Interfaces/DeviceType";
import { SwitchState } from "./SwitchState";

/**
 * Defines a on/off switch device.
 */
export class Switch extends Common implements Interfaces.Switch {
    /**
     * Creates a dimmable light device.
     *
     * ```js
     * const switch = new Switch(connection, capabilities, DeviceType.UVC);
     * ```
     *
     * @param connection The main connection to the device.
     * @param capabilities Device capabilities from discovery.
     * @param type The device type to tell the difference from a light and uvc.
     */
    constructor(connection: Connection, capabilities: Capabilities, type: DeviceType) {
        super(Interfaces.DeviceType.Switch, connection, {
            id: capabilities.id,
            name: `${capabilities.name} ${type}`,
            suffix: type,
        });

        this.fields.set("state", { type: "String", values: ["On", "Off"] });
    }

    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * switch.update({ SwitchedLevel: "On" });
     * ```
     *
     * @param status The current device state.
     */
    public update(status: Interfaces.ZoneStatus): void {
        const previous = { ...this.status };

        if (status.SwitchedLevel != null) {
            this.state.state = status.SwitchedLevel === "On" ? "On" : "Off";
        }

        if (!equals(this.state, previous)) {
            this.emit("Update", this, this.state);
        }
    }

    /**
     * Controls this device.
     *
     * ```js
     * switch.set({ state: "On" });
     * ```
     *
     * @param status Desired device state.
     */
    public set(status: SwitchState): Promise<void> {
        const command = new Command(this.connection);
        const state = status.state === "On" ? 0x01 : 0x00;

        command.push([0xe0, 0x0a, state]);

        return command.execute();
    }
}
