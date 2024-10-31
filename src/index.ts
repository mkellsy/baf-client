/**
 * Discovers and publishes Big Ass Fan controls.
 *
 * @remarks
 * This client will automatically find and connect to any Big Ass Fan on your
 * network. When devices are found they will be exposed via events.
 *
 * @packageDocumentation
 */

import { Client } from "./Client";

export { Connection } from "./Connection/Connection";

export { Capabilities } from "./Devices/Capabilities";
export { DeviceType } from "./Devices/DeviceType";
export { FanStateResponse } from "./Response/FanStateResponse";
export { LightStateResponse } from "./Response/LightStateResponse";
export { ResponseTypes } from "./Response/ResponseTypes";
export { SensorStateResponse } from "./Response/SensorStateResponse";

export { Common } from "./Devices/Common";
export { Dimmer } from "./Devices/Dimmer/Dimmer";
export { DimmerState } from "./Devices/Dimmer/DimmerState";
export { Fan } from "./Devices/Fan/Fan";
export { FanState } from "./Devices/Fan/FanState";
export { Humidity } from "./Devices/Humidity/Humidity";
export { HumidityState } from "./Devices/Humidity/HumidityState";
export { Occupancy } from "./Devices/Occupancy/Occupancy";
export { OccupancyState } from "./Devices/Occupancy/OccupancyState";
export { Switch } from "./Devices/Switch/Switch";
export { SwitchState } from "./Devices/Switch/SwitchState";
export { Temperature } from "./Devices/Temperature/Temperature";
export { TemperatureState } from "./Devices/Temperature/TemperatureState";

/**
 * Creates a connection and starts mDNS discovery.
 *
 * @returns A location object.
 * @public
 */
export function connect(): Client {
    return new Client();
}

export { Client };
