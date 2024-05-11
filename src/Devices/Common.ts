import * as Logger from "js-logger";
import * as Interfaces from "@mkellsy/hap-device";

import Colors from "colors";

import { Connection } from "@mkellsy/baf";
import { EventEmitter } from "@mkellsy/event-emitter";

import { Device } from "../Interfaces/Device";

export abstract class Common extends EventEmitter<{
    Action: (device: Interfaces.Device, button: Interfaces.Button, action: Interfaces.Action) => void;
    Update: (device: Interfaces.Device, state: Interfaces.DeviceState) => void;
}> {
    protected connection: Connection;
    protected state: Interfaces.DeviceState;
    protected fields: Map<string, Interfaces.Capability> = new Map();

    private logger: Logger.ILogger;

    private deviceName: string;
    private deviceId: string;
    private deviceType: Interfaces.DeviceType;
    private deviceSuffix: string;

    constructor(
        type: Interfaces.DeviceType,
        connection: Connection,
        definition: { id: string; name: string, suffix: string }
    ) {
        super();

        this.connection = connection;
        this.deviceId = definition.id;
        this.deviceName = definition.name;
        this.deviceSuffix = definition.suffix;
        this.deviceType = type;

        this.logger = Logger.get(`Device ${Colors.dim(this.id)}`);
        this.state = { state: "Unknown" };
    }

    public get manufacturer(): string {
        return "Delta T, LLC";
    }

    public get id(): string {
        return Device.generateId(this.deviceId, this.deviceSuffix);
    }

    public get name(): string {
        return this.deviceName;
    }

    public get room(): string {
        return "Default";
    }

    public get capabilities(): { [key: string]: Interfaces.Capability } {
        return Object.fromEntries(this.fields);
    }

    public get log(): Logger.ILogger {
        return this.logger;
    }

    public get address(): Interfaces.Address {
        return { href: this.deviceId };
    }

    public get suffix(): string {
        return this.deviceSuffix;
    }

    public get type(): Interfaces.DeviceType {
        return this.deviceType;
    }

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

    public get status(): Interfaces.DeviceState {
        return this.state;
    }
}
