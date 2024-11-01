import { get as getLogger } from "js-logger";

import { AreaStatus, Device, DeviceState, FanSpeed, HostAddressFamily, ZoneStatus } from "@mkellsy/hap-device";

import Colors from "colors";

import { EventEmitter } from "@mkellsy/event-emitter";

import { Capabilities } from "./Response/Capabilities";
import { Common } from "./Devices/Common";
import { Connection } from "./Connection/Connection";
import { Devices } from "./Devices/Devices";
import { DimmerController } from "./Devices/Dimmer/DimmerController";
import { Discovery } from "./Connection/Discovery";
import { FanController } from "./Devices/Fan/FanController";
import { FanState } from "./Response/FanState";
import { Host } from "./Connection/Host";
import { HumidityController } from "./Devices/Humidity/HumidityController";
import { LightState } from "./Response/LightState";
import { OccupancyController } from "./Devices/Occupancy/OccupancyController";
import { SensorState } from "./Response/SensorState";
import { SwitchController } from "./Devices/Switch/SwitchController";
import { TemperatureController } from "./Devices/Temperature/TemperatureController";

const log = getLogger("Client");

/**
 * Creates an object that represents a single location, with a single network.
 * @public
 */
export class Client extends EventEmitter<{
    Available: (devices: Device[]) => void;
    Message: (response: Response) => void;
    Update: (device: Device, state: DeviceState) => void;
}> {
    private discovery: Discovery;

    private devices: Map<string, Device> = new Map();
    private connections: Map<string, Connection> = new Map();

    /**
     * Creates a location object and starts mDNS discovery.
     *
     * ```js
     * const location = new Client();
     *
     * location.on("Avaliable", (devices: Device[]) => {  });
     * ```
     */
    constructor() {
        super(Infinity);

        this.discovery = new Discovery();

        this.discovery.on("Discovered", this.onDiscovered).search();
    }

    /**
     * Closes all connections for a location and stops searching.
     */
    public close(): void {
        this.discovery.stop();

        for (const connection of this.connections.values()) {
            connection.disconnect();
        }

        this.connections.clear();
    }

    /*
     * Creates a connection when mDNS finds a device.
     */
    private onDiscovered = (host: Host): void => {
        if (this.connections.has(host.id)) {
            this.connections.get(host.id)!.disconnect();
            this.connections.delete(host.id);
        }

        const ip = host.addresses.find((address) => address.family === HostAddressFamily.IPv4);
        const connection = new Connection((ip || host.addresses[0]).address, host.id, host.name, host.model);

        connection
            .on("Connect", () => {
                this.connections.set(connection.id, connection);

                connection.write([0x12, 0x04, 0x1a, 0x02, 0x08, 0x03]); // software
                connection.write([0x12, 0x04, 0x1a, 0x02, 0x08, 0x06]); // capabilities
                connection.write([0x12, 0x02, 0x1a, 0x00]);
            })
            .on("Response", this.onResponse)
            .on("Error", this.onError);

        connection.connect().catch((error) => log.error(Colors.red(error.message)));
    };

    /*
     * Creates individual devices when the connection responds with a
     * capibilities. This also updates the state of the various supported
     * devices.
     */
    private onResponse = (type: string, response: unknown): void => {
        switch (type) {
            case "Capabilities":
                this.onAvailable(response as Capabilities);
                break;

            case "FanState":
                this.onFanState(response as FanState);
                break;

            case "LightState":
                switch ((response as LightState).target) {
                    case "downlight":
                        this.onDownlightState(response as LightState);
                        break;

                    case "uplight":
                        this.onUplightState(response as LightState);
                        break;

                    case "uvc":
                        this.onUvcState(response as LightState);
                        break;
                }

                break;

            case "SensorState":
                this.onSensorState(response as SensorState);
        }
    };

    /*
     * Logs errors when the connection generates an error.
     */
    private onError = (error: Error): void => {
        log.error(Colors.red(error.message));
    };

    /*
     * When the connection responds with capabilities, and creates devices.
     */
    private onAvailable = (capabilities: Capabilities): void => {
        const connection = this.connections.get(capabilities.id);

        if (connection == null) {
            return;
        }

        if (capabilities.fan) {
            this.devices.set(
                Common.generateId(capabilities.id, Devices.Fan),
                new FanController(connection, capabilities).on("Update", this.onDeviceUpdate),
            );
        }

        if (capabilities.downlight) {
            this.devices.set(
                Common.generateId(capabilities.id, Devices.Downlight),
                new DimmerController(connection, capabilities, Devices.Downlight).on("Update", this.onDeviceUpdate),
            );
        }

        if (capabilities.uplight) {
            this.devices.set(
                Common.generateId(capabilities.id, Devices.Uplight),
                new DimmerController(connection, capabilities, Devices.Uplight).on("Update", this.onDeviceUpdate),
            );
        }

        if (capabilities.uvc) {
            this.devices.set(
                Common.generateId(capabilities.id, Devices.UVC),
                new SwitchController(connection, capabilities, Devices.UVC).on("Update", this.onDeviceUpdate),
            );
        }

        if (capabilities.occupancy) {
            this.devices.set(
                Common.generateId(capabilities.id, Devices.Occupancy),
                new OccupancyController(connection, capabilities).on("Update", this.onDeviceUpdate),
            );
        }

        if (capabilities.temperature) {
            this.devices.set(
                Common.generateId(capabilities.id, Devices.Temperature),
                new TemperatureController(connection, capabilities).on("Update", this.onDeviceUpdate),
            );
        }

        if (capabilities.humidity) {
            this.devices.set(
                Common.generateId(capabilities.id, Devices.Humidity),
                new HumidityController(connection, capabilities).on("Update", this.onDeviceUpdate),
            );
        }

        this.emit("Available", [...this.devices.values()]);
    };

    /*
     * When the connection responds with a fan state, this will update the fan
     * device.
     */
    private onFanState = (state: FanState): void => {
        const fan = this.devices.get(Common.generateId(state.id, Devices.Fan));
        const occupancy = this.devices.get(Common.generateId(state.id, Devices.Occupancy));

        if (fan != null) {
            fan.update({
                href: state.id,
                SwitchedLevel: state.on ? "On" : "Off",
                FanSpeed: state.speed as FanSpeed,
                Zone: { href: state.id },
                AssociatedArea: { href: state.id },
                AutoLevel: state.auto ? "On" : "Off",
                EcoLevel: state.eco ? "On" : "Off",
                WhooshLevel: state.whoosh ? "On" : "Off",
            } as ZoneStatus);
        }

        if (occupancy != null) {
            occupancy.update({
                href: state.id,
                OccupancyStatus: state.occupancy ? "Occupied" : "Unoccupied",
            } as AreaStatus);
        }
    };

    /*
     * When the connection responds with a downlight state, this will update
     * the light device.
     */
    private onDownlightState = (state: LightState): void => {
        const downlight = this.devices.get(Common.generateId(state.id, Devices.Downlight));

        if (downlight != null) {
            downlight.update({
                href: state.id,
                SwitchedLevel: state.on ? "On" : "Off",
                Level: state.level,
                Zone: { href: state.id },
                AssociatedArea: { href: state.id },
            } as ZoneStatus);
        }
    };

    /*
     * When the connection responds with a uplight state, this will update the
     * light device.
     */
    private onUplightState = (state: LightState): void => {
        const uplight = this.devices.get(Common.generateId(state.id, Devices.Uplight));

        if (uplight != null) {
            uplight.update({
                href: state.id,
                SwitchedLevel: state.on ? "On" : "Off",
                Level: state.level,
                Zone: { href: state.id },
                AssociatedArea: { href: state.id },
            } as ZoneStatus);
        }
    };

    /*
     * When the connection responds with a uvc light state, this will update
     * the light device.
     */
    private onUvcState = (state: LightState): void => {
        const uvc = this.devices.get(Common.generateId(state.id, Devices.UVC));

        if (uvc != null) {
            uvc.update({
                href: state.id,
                SwitchedLevel: state.on ? "On" : "Off",
                Zone: { href: state.id },
                AssociatedArea: { href: state.id },
            } as ZoneStatus);
        }
    };

    /*
     * When the connection responds with a sensor state, this will update the
     * sensor device.
     */
    private onSensorState = (state: SensorState): void => {
        const temperature = this.devices.get(Common.generateId(state.id, Devices.Temperature));
        const humidity = this.devices.get(Common.generateId(state.id, Devices.Humidity));

        if (temperature != null) {
            temperature.update({
                href: state.id,
                Temperature: state.temperature,
            } as AreaStatus);
        }

        if (humidity != null) {
            humidity.update({
                href: state.id,
                Humidity: state.humidity,
            } as AreaStatus);
        }
    };

    /*
     * When a device updates, this will emit an update event.
     */
    private onDeviceUpdate = (device: Device, state: DeviceState): void => {
        this.emit("Update", device, state);
    };
}
