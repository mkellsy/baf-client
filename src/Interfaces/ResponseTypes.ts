import { Capabilities } from "./Capabilities";
import { FanState } from "./FanState";
import { LightState } from "./LightState";
import { SensorState } from "./SensorState";

/**
 * DEfines the different types of responses that can be recieved.
 */
export interface ResponseTypes {
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
