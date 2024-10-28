import { Capabilities } from "./Capabilities";
import { FanStateResponse } from "./FanStateResponse";
import { LightStateResponse } from "./LightStateResponse";
import { SensorStateResponse } from "./SensorStateResponse";

/**
 * Defines the different types of responses that can be recieved.
 * @public
 */
export interface ResponseTypes {
    /**
     * The device capibilities.
     */
    Capabilities: Capabilities;

    /**
     * The current fan state.
     */
    FanState: FanStateResponse;

    /**
     * The current light state.
     */
    LightState: LightStateResponse;

    /**
     * The current sensor state.
     */
    SensorState: SensorStateResponse;
}
