import { DeviceState } from "@mkellsy/hap-device";

/**
 * Defines a dimmer's current status response.
 */
export interface SwitchState extends DeviceState {
    /**
     * Is the dimmer on or off.
     */
    state: "On" | "Off";
}
