import { DeviceType, ZoneStatus } from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Capabilities } from "../../Response/Capabilities";
import { Command } from "../../Connection/Command";
import { Connection } from "../../Connection/Connection";
import { Common } from "../Common";
import { Dimmer } from "./Dimmer";
import { DimmerState } from "./DimmerState";
import { Devices } from "../Devices";

/**
 * Defines a dimmable light device.
 * @public
 */
export class DimmerController extends Common<DimmerState> implements Dimmer {
    /**
     * Creates a dimmable light device.
     *
     * ```js
     * const dimmer = new DimmerController(connection, capabilities, Devices.Downlight);
     * ```
     *
     * @param connection - The main connection to the device.
     * @param capabilities - Device capabilities from discovery.
     * @param type - The device type to tell the difference from an uplight and downlight.
     */
    constructor(connection: Connection, capabilities: Capabilities, type: Devices) {
        super(
            DeviceType.Dimmer,
            connection,
            {
                id: capabilities.id,
                name: `${capabilities.name} ${type}`,
                suffix: type,
            },
            { state: "Off", level: 0 },
        );

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
     * @param status - The current device state.
     */
    public update(status: ZoneStatus): void {
        const previous = { ...this.status };

        if (status.Level != null) {
            this.state.state = status.Level > 0 ? "On" : "Off";
            this.state.level = status.Level;
        }

        if (this.initialized && !equals(this.state, previous)) {
            this.emit("Update", this, this.state);
        }

        this.initialized = true;
    }

    /**
     * Controls this device.
     *
     * ```js
     * dimmer.set({ state: "On", level: 50 });
     * ```
     *
     * @param status - Desired device state.
     */
    public set(status: DimmerState): Promise<void> {
        return new Promise((resolve, reject) => {
            const command = new Command(this.connection);

            const state = status.state === "On" ? 0x01 : 0x00;
            const suffix = this.suffix === Devices.Downlight.toString() ? 1 : 2;

            command.push([0x90, 0x05, suffix], [0xa0, 0x04, state]);

            if (status.state === "On") {
                command.push([0xa8, 0x04, status.level]);
            }

            command
                .execute()
                .then(() => {
                    this.connection.write([0x12, 0x04, 0x1a, 0x02, 0x08, 0x03]); // software
                    this.connection.write([0x12, 0x04, 0x1a, 0x02, 0x08, 0x06]); // capabilities
                    this.connection.write([0x12, 0x02, 0x1a, 0x00]);

                    resolve();
                })
                .catch((error) => reject(error));
        });
    }
}
