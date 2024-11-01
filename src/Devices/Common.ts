import Colors from "colors";

import { get as getLogger, ILogger } from "js-logger";
import { Action, Address, Area, Button, Capability, Device, DeviceState, DeviceType } from "@mkellsy/hap-device";
import { EventEmitter } from "@mkellsy/event-emitter";

import { Connection } from "../Connection/Connection";

/**
 * Defines common functionallity for a device.
 * @private
 */
export abstract class Common<STATE extends DeviceState> extends EventEmitter<{
    Action: (device: Device, button: Button, action: Action) => void;
    Update: (device: Device, state: STATE) => void;
}> {
    /**
     * Stores the current connection of this device.
     */
    protected connection: Connection;

    /**
     * Stores the current device state.
     */
    protected state: STATE;

    /**
     * Stores if this device has been descovered and fully srtup.
     */
    protected initialized: boolean = false;

    /**
     * Contains a map of fields and the type of each field.
     */
    protected fields: Map<string, Capability> = new Map();

    private logger: ILogger;

    private deviceName: string;
    private deviceId: string;
    private deviceType: DeviceType;
    private deviceSuffix: string;

    /**
     * Creates a base device object.
     *
     * ```js
     * class Fan extends Common {
     *     constructor(id: string, connection: Connection, name: string) {
     *         super(DeviceType.Fan, connection, { id, name, "Fan" });
     *
     *         // Device specific code
     *     }
     * }
     * ```
     *
     * @param type - The device type.
     * @param connection - The main connection.
     * @param definition - The definition object containing id, name and suffix.
     */
    constructor(
        type: DeviceType,
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

        this.logger = getLogger(`Device ${Colors.dim(this.id)}`);
        this.state = state;
    }

    /**
     * Generates a standard device id.
     *
     * ```js
     * const id = Device.generateId("12:34:56:78:90", "Fan");
     * ```
     *
     * @param id - The current connection id, typically a mac address.
     * @param suffix - The suffix for the id, typically fan, uplight, downlight...
     *
     * @returns A standard formatted id string.
     */
    public static generateId(id: string, suffix: string): string {
        return `BAF-${id}-${suffix.toUpperCase()}`;
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
        return Common.generateId(this.deviceId, this.deviceSuffix);
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
    public get capabilities(): { [key: string]: Capability } {
        return Object.fromEntries(this.fields);
    }

    /**
     * A logger for the device. This will automatically print the devices name,
     * room and id.
     *
     * @returns A reference to the logger assigned to this device.
     */
    public get log(): ILogger {
        return this.logger;
    }

    /**
     * The href address of the device (not used).
     *
     * @returns The device's href address.
     */
    public get address(): Address {
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
    public get type(): DeviceType {
        return this.deviceType;
    }

    /**
     * The area the device is in (not used).
     *
     * @returns The device's area.
     */
    public get area(): Area {
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
