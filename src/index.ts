/**
 * Discovers and publishes Big Ass Fan controls.
 *
 * @remarks
 * This client will automatically find and connect to any Big Ass Fan on your
 * network. When devices are found they will be exposed via events.
 *
 * @packageDocumentation
 */

import { Host } from "./Host";

export { Connection } from "./Connection";

export { Capabilities } from "./Interfaces/Capabilities";
export { DeviceType } from "./Interfaces/DeviceType";
export { FanStateResponse } from "./Interfaces/FanStateResponse";
export { LightStateResponse } from "./Interfaces/LightStateResponse";
export { ResponseTypes } from "./Interfaces/ResponseTypes";
export { SensorStateResponse } from "./Interfaces/SensorStateResponse";

export { Common } from "./Devices/Common";
export { Dimmer } from "./Devices/Dimmer";
export { DimmerState } from "./Devices/DimmerState";
export { Fan } from "./Devices/Fan";
export { FanState } from "./Devices/FanState";
export { Humidity } from "./Devices/Humidity";
export { HumidityState } from "./Devices/HumidityState";
export { Occupancy } from "./Devices/Occupancy";
export { OccupancyState } from "./Devices/OccupancyState";
export { Switch } from "./Devices/Switch";
export { SwitchState } from "./Devices/SwitchState";
export { Temperature } from "./Devices/Temperature";
export { TemperatureState } from "./Devices/TemperatureState";

/**
 * Creates a connection and starts mDNS discovery.
 *
 * @returns A location object.
 * @public
 */
export function connect(): Host {
    return new Host();
}

export { Host };
