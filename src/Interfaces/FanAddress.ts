import { HostAddress } from "@mkellsy/hap-device";

/**
 * Stores information about the ip address of the device.
 */
export interface FanAddress {
    /**
     * The id of the device, tipically a mac address.
     */
    id: string;

    /**
     * The ip addresses list for the device.
     */
    addresses: HostAddress[];

    /**
     * The name of the device from mdns.
     */
    name: string;

    /**
     * The model of the device from mdns.
     */
    model: string;
}
