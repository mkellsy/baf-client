/**
 * Stores information about the current state of a light device.
 */
export interface LightState {
    /**
     * The id of the light device.
     */
    id: string;

    /**
     * Which light is this state for.
     */
    target: "uplight" | "downlight" | "uvc";

    /**
     * The current brightness level.
     */
    level: number;

    /**
     * The current color temprature.
     */
    luminance: number;

    /**
     * Is the light on.
     */
    on: boolean;

    /**
     * Is the light in auto mode.
     */
    auto: boolean;

    /**
     * Is the light in warm mode.
     */
    warm: number;
}
