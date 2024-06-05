import { Location } from "./Location";

import { Common } from "./Devices/Common";
import { Dimmer } from "./Devices/Dimmer";
import { Fan } from "./Devices/Fan";
import { Humidity } from "./Devices/Humidity";
import { Occupancy } from "./Devices/Occupancy";
import { Switch } from "./Devices/Switch";
import { Temperature } from "./Devices/Temperature";

export namespace Devices {
    Common;
    Dimmer;
    Fan;
    Humidity;
    Occupancy;
    Switch;
    Temperature;
}

/**
 * Creates a connection and starts mDNS discovery.
 *
 * @returns A location object.
 */
export function connect(): Location {
    return new Location();
}
