import * as Devices from "./Devices/Devices";

import { Location } from "./Location";

export { Devices };

/**
 * Creates a connection and starts mDNS discovery.
 *
 * @returns A location object.
 */
export function connect(): Location {
    return new Location();
}
