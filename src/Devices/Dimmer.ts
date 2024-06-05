import * as Interfaces from "@mkellsy/hap-device";

import { Capabilities, Connection } from "@mkellsy/baf";

import equals from "deep-equal";

import { Command } from "../Interfaces/Command";
import { Common } from "./Common";
import { DimmerState } from "./DimmerState";
import { DeviceType } from "../Interfaces/DeviceType";

const LEVEL_MULTIPLIER: number = 100;

/**
 * Defines a dimmable light device.
 */
export class Dimmer extends Common implements Interfaces.Dimmer {
    /**
     * Creates a dimmable light device.
     *
     * ```js
     * const dimmer = new Dimmer(connection, capabilities, DeviceType.Downlight);
     * ```
     *
     * @param connection The main connection to the device.
     * @param capabilities Device capabilities from discovery.
     * @param type The device type to tell the difference from an uplight and
     *             downlight.
     */
    constructor(connection: Connection, capabilities: Capabilities, type: DeviceType) {
        super(Interfaces.DeviceType.Dimmer, connection, {
            id: capabilities.id,
            name: `${capabilities.name} ${type}`,
            suffix: type,
        });

        this.fields.set("state", { type: "String", values: ["On", "Off"] });
        this.fields.set("level", { type: "Integer", min: 0, max: 100 });
    }

    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * dimmer.update({ Level: 100 });
     * ```
     *
     * @param status The current device state.
     */
    public update(status: Interfaces.ZoneStatus): void {
        const previous = { ...this.status };

        if (status.Level != null) {
            this.state.state = status.Level > 0 ? "On" : "Off";
            this.state.level = status.Level * LEVEL_MULTIPLIER;
        }

        if (!equals(this.state, previous)) {
            this.emit("Update", this, this.state);
        }
    }

    /**
     * Controls this device.
     *
     * ```js
     * dimmer.set({ state: "On", level: 50 });
     * ```
     *
     * @param status Desired device state.
     */
    public set(status: DimmerState): Promise<void> {
        const command = new Command(this.connection);

        const state = status.state === "On" ? 0x01 : 0x00;
        const suffix = this.suffix === DeviceType.Downlight.toString() ? 1 : 2;
        const level = status.level / LEVEL_MULTIPLIER;

        command.push([0x90, 0x05, suffix], [0xa0, 0x04, state]);

        if (status.state === "On") {
            command.push([0xa8, 0x04, level]);
        }

        return command.execute();
    }
}
