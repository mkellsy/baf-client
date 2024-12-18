import { DeviceType, ZoneStatus } from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Capabilities } from "../../Response/Capabilities";
import { Command } from "../../Connection/Command";
import { Common } from "../Common";
import { Connection } from "../../Connection/Connection";
import { Devices } from "../Devices";
import { Fan } from "./Fan";
import { FanState } from "./FanState";

/**
 * Defines a fan device.
 * @public
 */
export class FanController extends Common<FanState> implements Fan {
    /**
     * Creates a fan device.
     *
     * ```js
     * const fan = new FanController(connection, capabilities);
     * ```
     *
     * @param connection - The main connection to the device.
     * @param capabilities - Device capabilities from discovery.
     */
    constructor(connection: Connection, capabilities: Capabilities) {
        super(
            DeviceType.Fan,
            connection,
            {
                id: capabilities.id,
                name: `${capabilities.name} ${Devices.Fan}`,
                suffix: Devices.Fan,
            },
            { state: "Off", speed: 0, whoosh: "Off", eco: "Off" },
        );

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
     * @param status - The current device state.
     */
    public update(status: ZoneStatus): void {
        const previous = { ...this.status };

        this.state = {
            ...previous,
            state: status.SwitchedLevel || "Unknown",
            whoosh: status.WhooshLevel || "Unknown",
            speed: status.FanSpeed || 0,
        };

        if (this.capabilities.eco) {
            this.state.eco = status.EcoLevel || "Unknown";
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
     * fan.set({ state: "On", speed: 3 });
     * ```
     *
     * @param status - Desired device state.
     */
    public set(status: FanState): Promise<void> {
        return new Promise((resolve, reject) => {
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
