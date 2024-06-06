import { Location } from "./Location";

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
 */
export function connect(): Location {
    return new Location();
}
