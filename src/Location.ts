import * as Logger from "js-logger";
import * as Interfaces from "@mkellsy/hap-device";

import Colors from "colors";

import { Capabilities, Connection, FanAddress, FanState, LightState, SensorState } from "@mkellsy/baf";
import { EventEmitter } from "@mkellsy/event-emitter";

import { Device } from "./Interfaces/Device";
import { DeviceType } from "./Interfaces/DeviceType";
import { Dimmer } from "./Devices/Dimmer";
import { Discovery } from "./Discovery";
import { Fan } from "./Devices/Fan";
import { Humidity } from "./Devices/Humidity";
import { Occupancy } from "./Devices/Occupancy";
import { Switch } from "./Devices/Switch";
import { Temperature } from "./Devices/Temperature";

const log = Logger.get("Location");

/**
 * Creates an object that represents a single location, with a single network.
 */
export class Location extends EventEmitter<{
    Available: (devices: Interfaces.Device[]) => void;
    Message: (response: Response) => void;
    Update: (device: Interfaces.Device, state: Interfaces.DeviceState) => void;
}> {
    private discovery: Discovery;

    private devices: Map<string, Interfaces.Device> = new Map();
    private connections: Map<string, Connection> = new Map();

    /**
     * Creates a location object and starts mDNS discovery.
     *
     * ```js
     * const location = new Location();
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
    private onDiscovered = (host: FanAddress): void => {
        if (this.connections.has(host.id)) {
            this.connections.get(host.id)?.disconnect();
            this.connections.delete(host.id);
        }

        const ip = host.addresses.find((address) => address.family === Interfaces.HostAddressFamily.IPv4) || host.addresses[0];
        const connection = new Connection(ip.address, host.id, host.name, host.model);

        connection.connect().then(() => {
            connection.on("Response", this.onResponse);
            connection.on("Error", this.onError);

            this.connections.set(connection.id, connection);

            connection.write([0x12, 0x04, 0x1a, 0x02, 0x08, 0x03]); // software
            connection.write([0x12, 0x04, 0x1a, 0x02, 0x08, 0x06]); // capabilities
            connection.write([0x12, 0x02, 0x1a, 0x00]);
        });
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
                Device.generateId(capabilities.id, DeviceType.Fan),
                (new Fan(connection, capabilities)).on("Update", this.onDeviceUpdate)
            );
        }

        if (capabilities.downlight) {
            this.devices.set(
                Device.generateId(capabilities.id, DeviceType.Downlight),
                (new Dimmer(connection, capabilities, DeviceType.Downlight)).on("Update", this.onDeviceUpdate)
            );
        }

        if (capabilities.uplight) {
            this.devices.set(
                Device.generateId(capabilities.id, DeviceType.Uplight),
                (new Dimmer(connection, capabilities, DeviceType.Uplight)).on("Update", this.onDeviceUpdate)
            );
        }

        if (capabilities.uvc) {
            this.devices.set(
                Device.generateId(capabilities.id, DeviceType.UVC),
                (new Switch(connection, capabilities, DeviceType.UVC)).on("Update", this.onDeviceUpdate)
            );
        }

        if (capabilities.occupancy) {
            this.devices.set(
                Device.generateId(capabilities.id, DeviceType.Occupancy),
                (new Occupancy(connection, capabilities)).on("Update", this.onDeviceUpdate)
            );
        }

        if (capabilities.temperature) {
            this.devices.set(
                Device.generateId(capabilities.id, DeviceType.Temperature),
                (new Temperature(connection, capabilities)).on("Update", this.onDeviceUpdate)
            );
        }

        if (capabilities.humidity) {
            this.devices.set(
                Device.generateId(capabilities.id, DeviceType.Humidity),
                (new Humidity(connection, capabilities)).on("Update", this.onDeviceUpdate)
            );
        }

        this.emit("Available", [...this.devices.values()]);
    };

    /*
     * When the connection responds with a fan state, this will update the fan
     * device.
     */
    private onFanState = (state: FanState): void => {
        const fan = this.devices.get(Device.generateId(state.id, DeviceType.Fan));
        const occupancy = this.devices.get(Device.generateId(state.id, DeviceType.Occupancy));

        if (fan != null) {
            fan.update({
                href: state.id,
                SwitchedLevel: state.on ? "On" : "Off",
                FanSpeed: state.speed as Interfaces.FanSpeed,
                Zone: { href: state.id },
                AssociatedArea: { href: state.id },
                AutoLevel: state.auto ? "On" : "Off",
                EcoLevel: state.eco ? "On" : "Off",
                WhooshLevel: state.whoosh ? "On" : "Off",
            } as Interfaces.ZoneStatus);
        }

        if (occupancy != null) {
            occupancy.update({
                href: state.id,
                OccupancyStatus: state.occupancy ? "Occupied" : "Unoccupied",
            } as Interfaces.AreaStatus);
        }
    };

    /*
     * When the connection responds with a downlight state, this will update
     * the light device.
     */
    private onDownlightState = (state: LightState): void => {
        const downlight = this.devices.get(Device.generateId(state.id, DeviceType.Downlight));

        if (downlight != null) {
            downlight.update({
                href: state.id,
                SwitchedLevel: state.on ? "On" : "Off",
                Level: state.level,
                Zone: { href: state.id },
                AssociatedArea: { href: state.id },
            } as Interfaces.ZoneStatus);
        }
    };

    /*
     * When the connection responds with a uplight state, this will update the
     * light device.
     */
    private onUplightState = (state: LightState): void => {
        const uplight = this.devices.get(Device.generateId(state.id, DeviceType.Uplight));

        if (uplight != null) {
            uplight.update({
                href: state.id,
                SwitchedLevel: state.on ? "On" : "Off",
                Level: state.level,
                Zone: { href: state.id },
                AssociatedArea: { href: state.id },
            } as Interfaces.ZoneStatus);
        }
    };

    /*
     * When the connection responds with a uvc light state, this will update
     * the light device.
     */
    private onUvcState = (state: LightState): void => {
        const uvc = this.devices.get(Device.generateId(state.id, DeviceType.UVC));

        if (uvc != null) {
            uvc.update({
                href: state.id,
                SwitchedLevel: state.on ? "On" : "Off",
                Zone: { href: state.id },
                AssociatedArea: { href: state.id },
            } as Interfaces.ZoneStatus);
        }
    };

    /*
     * When the connection responds with a sensor state, this will update the
     * sensor device.
     */
    private onSensorState = (state: SensorState): void => {
        const temperature = this.devices.get(Device.generateId(state.id, DeviceType.Temperature));
        const humidity = this.devices.get(Device.generateId(state.id, DeviceType.Humidity));

        if (temperature != null) {
            temperature.update({
                href: state.id,
                Temperature: state.temperature,
            } as Interfaces.AreaStatus);
        }

        if (humidity != null) {
            humidity.update({
                href: state.id,
                Humidity: state.humidity,
            } as Interfaces.AreaStatus);
        }
    };

    /*
     * When a device updates, this will emit an update event.
     */
    private onDeviceUpdate = (device: Interfaces.Device, state: Interfaces.DeviceState): void => {
        this.emit("Update", device, state);
    };
}
