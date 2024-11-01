/**
 * Stores information about the current state of a fan device.
 * @private
 */
export interface FanState {
    /**
     * The id of the fan device.
     */
    id: string;

    /**
     * If the fan is on.
     */
    on: boolean;

    /**
     * If the fan is in auto mode.
     */
    auto: boolean;

    /**
     * If the fan is in reverse mode.
     */
    reverse: boolean;

    /**
     * The current speed of the fan.
     */
    speed: number;

    /**
     * If the fan's whoosh mode is on.
     */
    whoosh: boolean;

    /**
     * Is the fan in eco mode.
     */
    eco: boolean;

    /**
     * Is occupancy detected.
     */
    occupancy: boolean;
}
