import { Location } from "./Location";

import { Common } from "./Devices/Common";
import { Dimmer } from "./Devices/Dimmer";
import { Fan } from "./Devices/Fan";
import { Humidity } from "./Devices/Humidity";
import { Occupancy } from "./Devices/Occupancy";
import { Temperature } from "./Devices/Temperature";

export const Devices = {
    Common,
    Dimmer,
    Fan,
    Humidity,
    Occupancy,
    Temperature,
}

export function connect(): Location {
    return new Location();
}
