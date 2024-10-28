import * as Logger from "js-logger";
import * as Interfaces from "@mkellsy/hap-device";

import Colors from "colors";

import { EventEmitter } from "@mkellsy/event-emitter";

import { Connection } from "../Connection";
import { DeviceAddress } from "../Interfaces/DeviceAddress";

/**
 * Defines common functionallity for a device.
 */
export abstract class Common<STATE extends Interfaces.DeviceState> extends EventEmitter<{
    Action: (device: Interfaces.Device, button: Interfaces.Button, action: Interfaces.Action) => void;
    Update: (device: Interfaces.Device, state: STATE) => void;
}> {
    protected connection: Connection;
    protected state: STATE;
    protected initialized: boolean = false;
    protected fields: Map<string, Interfaces.Capability> = new Map();

    private logger: Logger.ILogger;

    private deviceName: string;
    private deviceId: string;
    private deviceType: Interfaces.DeviceType;
    private deviceSuffix: string;

    /**
     * Creates a base device object.
     *
     * ```
     * class Fan extends Common {
     *     constructor(id: string, connection: Connection, name: string) {
     *         super(DeviceType.Fan, connection, { id, name, "Fan" });
     *
     *         // Device specific code
     *     }
     * }
     * ```
     *
     * @param type The device type.
     * @param connection The main connection.
     * @param definition The definition object containing id, name and suffix.
     * @param definition.id The connection id.
     * @param definition.name The connection name.
     * @param definition.suffix The device suffix.
     */
    constructor(
        type: Interfaces.DeviceType,
        connection: Connection,
        definition: { id: string; name: string; suffix: string },
        state: STATE,
    ) {
        super();

        this.connection = connection;
        this.deviceId = definition.id;
        this.deviceName = definition.name;
        this.deviceSuffix = definition.suffix;
        this.deviceType = type;

        this.logger = Logger.get(`Device ${Colors.dim(this.id)}`);
        this.state = state;
    }

    /**
     * The device's manufacturer.
     *
     * @returns The manufacturer.
     */
    public get manufacturer(): string {
        return "Delta T, LLC";
    }

    /**
     * The device's unique identifier.
     *
     * @returns The device id.
     */
    public get id(): string {
        return DeviceAddress.generateId(this.deviceId, this.deviceSuffix);
    }

    /**
     * The device's configured name.
     *
     * @returns The device's configured name.
     */
    public get name(): string {
        return this.deviceName;
    }

    /**
     * The device's configured room (not supported).
     *
     * @returns The device's configured room.
     */
    public get room(): string {
        return "Default";
    }

    /**
     * The devices capibilities. This is a map of the fields that can be set
     * or read.
     *
     * @returns The device's capabilities.
     */
    public get capabilities(): { [key: string]: Interfaces.Capability } {
        return Object.fromEntries(this.fields);
    }

    /**
     * A logger for the device. This will automatically print the devices name,
     * room and id.
     *
     * @returns A reference to the logger assigned to this device.
     */
    public get log(): Logger.ILogger {
        return this.logger;
    }

    /**
     * The href address of the device (not used).
     *
     * @returns The device's href address.
     */
    public get address(): Interfaces.Address {
        return { href: this.deviceId };
    }

    /**
     * The device's suffix.
     *
     * @returns The device's suffix.
     */
    public get suffix(): string {
        return this.deviceSuffix;
    }

    /**
     * The device type.
     *
     * @returns The device type.
     */
    public get type(): Interfaces.DeviceType {
        return this.deviceType;
    }

    /**
     * The area the device is in (not used).
     *
     * @returns The device's area.
     */
    public get area(): Interfaces.Area {
        return {
            href: this.address.href,
            Name: this.name,
            ControlType: this.type,
            Parent: this.address,
            IsLeaf: true,
            AssociatedZones: [],
            AssociatedControlStations: [],
            AssociatedOccupancyGroups: [],
        };
    }

    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    public get status(): STATE {
        return this.state;
    }
}
