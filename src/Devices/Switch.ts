import * as Baf from "@mkellsy/baf";
import * as Interfaces from "@mkellsy/hap-device";

import equals from "deep-equal";

import { Common } from "./Common";
import { DeviceType } from "../Interfaces/DeviceType";

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
    constructor(connection: Baf.Connection, capabilities: Baf.Capabilities, type: DeviceType) {
        super(Interfaces.DeviceType.Switch, connection, {
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
     * switch.update({ SwitchedLevel: "On" });
     * ```
     *
     * @param status The current device state.
     */
    public update(status: Interfaces.ZoneStatus): void {
        const previous = { ...this.status };

        if (status.Level != null) {
            this.state.state = status.SwitchedLevel;
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
     * @param status Partial desired device state.
     */
    public set(status: Partial<Interfaces.DeviceState>): void {
        switch (this.suffix) {
            case DeviceType.UVC:
                if (status.state === "Off") {
                    this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xe0, 0x0a, 0x00]);
                } else {
                    this.connection.write([0x12, 0x07, 0x12, 0x05, 0x1a, 0x03, 0xe0, 0x0a, 0x01]);
                }

                break;
        }
    }
}
