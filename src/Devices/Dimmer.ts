import * as Baf from "@mkellsy/baf";
import * as Interfaces from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Common } from "./Common";
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
    constructor(connection: Baf.Connection, capabilities: Baf.Capabilities, type: DeviceType) {
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
     * @param status Partial desired device state.
     */
    public set(status: Partial<Interfaces.DeviceState>): Promise<void> {
        const waits: Promise<void>[] = [];

        switch (this.suffix) {
            case DeviceType.Uplight:
                if (status.state === "Off") {
                    waits.push(this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0x90, 0x05, 2]));
                    waits.push(this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xa0, 0x04, 0x00]));
                } else {
                    waits.push(this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0x90, 0x05, 2]));
                    waits.push(this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xa0, 0x04, 0x01]));

                    waits.push(
                        this.connection.write([
                            0x12,
                            0x07,
                            0x12,
                            0x05,
                            0x1a,
                            0x03,
                            0xa8,
                            0x04,
                            (status.level || 0) / LEVEL_MULTIPLIER,
                        ]),
                    );
                }

                break;

            case DeviceType.Downlight:
                if (status.state === "Off") {
                    waits.push(this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0x90, 0x05, 1]));
                    waits.push(this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xa0, 0x04, 0x00]));
                } else {
                    waits.push(this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0x90, 0x05, 1]));
                    waits.push(this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xa0, 0x04, 0x01]));

                    waits.push(
                        this.connection.write([
                            0x12,
                            0x07,
                            0x12,
                            0x05,
                            0x1a,
                            0x03,
                            0xa8,
                            0x04,
                            (status.level || 0) / LEVEL_MULTIPLIER,
                        ]),
                    );
                }

                break;
        }

        return new Promise((resolve, reject) => {
            Promise.all(waits)
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    }
}
