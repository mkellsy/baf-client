import { Capabilities } from "../Response/Capabilities";
import { FanState } from "../Response/FanState";
import { LightState } from "../Response/LightState";
import { SensorState } from "../Response/SensorState";

/**
 * Defines the different types of messages that can be recieved.
 * @private
 */
export interface Messages {
    /**
     * The device capibilities.
     */
    Capabilities: Capabilities;

    /**
     * The current fan state.
     */
    FanState: FanState;

    /**
     * The current light state.
     */
    LightState: LightState;

    /**
     * The current sensor state.
     */
    SensorState: SensorState;
}
