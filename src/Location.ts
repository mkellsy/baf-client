import * as Logger from "js-logger";
import * as Interfaces from "@mkellsy/hap-device";

import Colors from "colors";

import { Capabilities, Connection, FanAddress, FanState, LightState, SensorState } from "@mkellsy/baf";
import { EventEmitter } from "@mkellsy/event-emitter";

import { Device } from "./Interfaces/Device";
import { Dimmer } from "./Devices/Dimmer";
import { Discovery } from "./Discovery";
import { Fan } from "./Devices/Fan";
import { Humidity } from "./Devices/Humidity";
import { LightPosition } from "./Interfaces/LightPosition";
import { Occupancy } from "./Devices/Occupancy";
import { Temperature } from "./Devices/Temperature";

const log = Logger.get("Location");

export class Location extends EventEmitter<{
    Available: (devices: Interfaces.Device[]) => void;
    Message: (response: Response) => void;
    Update: (device: Interfaces.Device, state: Interfaces.DeviceState) => void;
}> {
    private discovery: Discovery;

    private devices: Map<string, Interfaces.Device> = new Map();
    private connections: Map<string, Connection> = new Map();

    constructor() {
        super(Infinity);

        this.discovery = new Discovery();

        this.discovery.on("Discovered", this.onDiscovered).search();
    }

    public close(): void {
        this.discovery.stop();

        for (const connection of this.connections.values()) {
            connection.disconnect();
        }

        this.connections.clear();
    }

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

    private onResponse = (type: string, response: unknown): void => {
        switch (type) {
            case "Capabilities":
                this.onAvailable(response as Capabilities);
                break;

            case "FanState":
                this.onFanState(response as FanState);
                break;

            case "LightState":
                if ((response as LightState).target === "downlight") {
                    this.onDownlightState(response as LightState);
                } else {
                    this.onUplightState(response as LightState);
                }

                break;

            case "SensorState":
                this.onSensorState(response as SensorState);
        }
    };

    private onError = (error: Error): void => {
        log.error(Colors.red(error.message));
    };

    private onAvailable = (capabilities: Capabilities): void => {
        const connection = this.connections.get(capabilities.id);

        if (connection == null) {
            return;
        }

        if (capabilities.fan) {
            this.devices.set(
                Device.generateId(capabilities.id, "Fan"),
                (new Fan(connection, capabilities)).on("Update", this.onDeviceUpdate)
            );
        }

        if (capabilities.downlight) {
            this.devices.set(
                Device.generateId(capabilities.id, LightPosition.Downlight),
                (new Dimmer(connection, capabilities, LightPosition.Downlight)).on("Update", this.onDeviceUpdate)
            );
        }

        if (capabilities.uplight) {
            this.devices.set(
                Device.generateId(capabilities.id, LightPosition.Uplight),
                (new Dimmer(connection, capabilities, LightPosition.Uplight)).on("Update", this.onDeviceUpdate)
            );
        }

        if (capabilities.occupancy) {
            this.devices.set(
                Device.generateId(capabilities.id, "Occupancy"),
                (new Occupancy(connection, capabilities)).on("Update", this.onDeviceUpdate)
            );
        }

        if (capabilities.temperature) {
            this.devices.set(
                Device.generateId(capabilities.id, "Temperature"),
                (new Temperature(connection, capabilities)).on("Update", this.onDeviceUpdate)
            );
        }

        if (capabilities.humidity) {
            this.devices.set(
                Device.generateId(capabilities.id, "Humidity"),
                (new Humidity(connection, capabilities)).on("Update", this.onDeviceUpdate)
            );
        }

        this.emit("Available", [...this.devices.values()]);
    };

    private onFanState = (state: FanState): void => {
        const fan = this.devices.get(Device.generateId(state.id, "Fan"));
        const occupancy = this.devices.get(Device.generateId(state.id, "Occupancy"));

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

    private onDownlightState = (state: LightState): void => {
        const downlight = this.devices.get(Device.generateId(state.id, LightPosition.Downlight));

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

    private onUplightState = (state: LightState): void => {
        const uplight = this.devices.get(Device.generateId(state.id, LightPosition.Uplight));

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

    private onSensorState = (state: SensorState): void => {
        const temperature = this.devices.get(Device.generateId(state.id, "Temperature"));
        const humidity = this.devices.get(Device.generateId(state.id, "Humidity"));

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

    private onDeviceUpdate = (device: Interfaces.Device, state: Interfaces.DeviceState): void => {
        this.emit("Update", device, state);
    };
}
