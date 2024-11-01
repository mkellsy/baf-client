import net from "net";

import { Capabilities } from "../Response/Capabilities";
import { EventEmitter } from "@mkellsy/event-emitter";
import { FanState } from "../Response/FanState";
import { LightState } from "../Response/LightState";
import { Messages } from "./Messages";
import { Parser } from "../Response/Parser";
import { SensorState } from "../Response/SensorState";

const SOCKET_PORT = 31415;
const REACHABLE_TIMEOUT = 1_000;

/**
 * Connects to a device with the provided ip address, id, name and model.
 * @private
 */
export class Connection extends EventEmitter<{
    Connect: (connection: Connection) => void;
    Disconnect: () => void;
    Response: <K extends keyof Messages>(type: K, response: Messages[K]) => void;
    Error: (error: Error) => void;
}> {
    private socket?: net.Socket;
    private teardown: boolean = false;

    private uuid: string;
    private name: string;
    private model: string;
    private host: string;

    private device?: Partial<Capabilities>;
    private current?: Partial<Capabilities>;
    private state: {
        fan?: FanState;
        sensor?: SensorState;
        downlight?: LightState;
        uplight?: LightState;
    } = {};

    /**
     * Creates a new connection to a device.
     *
     * ```js
     * const connection = new Connection(
     *     "192.168.1.1",
     *     "12:34:65:78",
     *     "My Device",
     *     "Haiku"
     * );
     * ```
     *
     * @param host - The ip address of the device.
     * @param id - The id of the device.
     * @param name - The name of the device.
     * @param model - The model of the device.
     */
    constructor(host: string, id: string, name: string, model: string) {
        super();

        this.uuid = id;
        this.name = name;
        this.model = model;

        this.host = host;
    }

    /**
     * Detects if a host is reachable.
     *
     * @param host - Address of the device.
     *
     * @returns True if the device is rechable, false if not.
     */
    public static reachable(host: string): Promise<boolean> {
        return new Promise((resolve) => {
            const socket = new net.Socket();

            const response = (success: boolean) => {
                socket.destroy();

                resolve(success);
            };

            socket.setTimeout(REACHABLE_TIMEOUT);

            socket.once("error", () => response(false));
            socket.once("timeout", () => response(false));

            socket.connect(
                {
                    host,
                    port: SOCKET_PORT,
                    family: 4,
                },
                () => response(true),
            );
        });
    }

    /**
     * The id of the device.
     *
     * @returns The id of the device.
     */
    public get id(): string {
        return this.uuid;
    }

    /**
     * Asyncronously connects to a device.
     *
     * ```js
     * await connection.connect();
     * ```
     */
    public connect(): Promise<void> {
        this.teardown = false;

        return new Promise((resolve) => {
            this.socket = new net.Socket();

            this.socket.setKeepAlive(true, 5_000);
            this.socket.setTimeout(10_000);

            this.socket.on("data", this.onSocketData);
            this.socket.on("error", this.onSocketError);
            this.socket.on("end", this.onSocketDisconnect);
            this.socket.on("timeout", this.onSocketTimeout);

            this.socket.connect(
                {
                    host: this.host,
                    port: SOCKET_PORT,
                    keepAlive: true,
                    family: 4,
                },
                () => {
                    this.emit("Connect", this);

                    resolve();
                },
            );
        });
    }

    /**
     * Disconnects from a device.
     *
     * ```js
     * connection.disconnect();
     * ```
     */
    public disconnect(): void {
        this.teardown = true;
        this.socket?.destroy();
    }

    /**
     * Writes a command to a device.
     *
     * ```js
     * connection.write([0x01, 0x02, 0x03]);
     * ```
     *
     * @param buffer - The command as a hex number array.
     */
    public write(buffer: number[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const stuffed = Parser.stuff(buffer);
            const marked = Buffer.from([0xc0].concat(stuffed).concat([0xc0]));

            if (this.socket == null) {
                return reject(new Error("connection not established"));
            }

            this.socket.write(marked, (error) => {
                if (error != null) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    /*
     * Parses data messages from the socket.
     */
    private onSocketData = (data: Buffer): void => {
        let results: Record<string, unknown> = {};

        const fragment = Parser.chunkify(data);

        for (let i = 0; i < fragment.count; i++) {
            if (fragment.chunks[i][0] !== 0xc0 || fragment.chunks[i][fragment.chunks[i].length - 1] !== 0xc0) {
                continue;
            } else {
                fragment.chunks[i] = fragment.chunks[i].subarray(1, fragment.chunks[i].length - 1);
            }

            results = { ...results, ...Parser.parse(Parser.unstuff(fragment.chunks[i])) };
        }

        this.updateDevice(results);
        this.updateFanState(results);
        this.updateLightState("downlight", results);
        this.updateLightState("uplight", results);
        this.updateSensorState(results);
    };

    /*
     * Attempts to reconnect after a timeout
     */
    private onSocketTimeout = (): void => {
        this.onSocketDisconnect();
    };

    /*
     * Reconnects to the device if the connection is lost.
     */
    private onSocketDisconnect = (): void => {
        this.socket?.destroy();
        this.socket = undefined;

        if (!this.teardown) {
            this.connect();
        } else {
            this.emit("Disconnect");
        }
    };

    /*
     * Emits an error event when the socket errors.
     */
    private onSocketError = (error: Error): void => {
        if (!this.teardown) {
            this.connect();
        }

        this.emit("Error", error);
    };

    /*
     * Compares two objects to see if they are equal.
     */
    private equals(left: unknown, right: unknown): boolean {
        return JSON.stringify(left) === JSON.stringify(right);
    }

    /*
     * Checks if a device supports a feature.
     */
    private supported(target: keyof Capabilities): boolean {
        if (this.device == null || this.device[target] === false) {
            return false;
        }

        return true;
    }

    /*
     * Updates the device state.
     */
    private updateDevice(results: Record<string, unknown>): void {
        if (results.firmware) {
            this.current = { ...this.current, firmware: (results as Record<string, string>).firmware };
        }

        if (results.capabilities) {
            this.current = { ...this.current, ...results.capabilities };
        }

        if (results.mac) {
            this.current = { ...this.current, mac: (results as Record<string, string>).mac };
        }

        if (
            this.current == null ||
            this.current.firmware == null ||
            this.current.mac == null ||
            this.current.fan == null
        ) {
            return;
        }

        if (!this.equals(this.device, this.current)) {
            this.device = this.current;

            this.emit("Response", "Capabilities", {
                id: this.uuid,
                name: this.name,
                model: this.model,
                ...this.device,
            } as Capabilities);
        }
    }

    /*
     * Updates the fan state.
     */
    private updateFanState(results: Record<string, unknown>): void {
        if (!this.supported("fan")) {
            return;
        }

        if ((results.fan as Record<string, FanState | undefined>)?.state == null) {
            return;
        }

        this.state.fan = (results.fan as Record<string, FanState | undefined>).state;

        this.emit("Response", "FanState", {
            id: this.uuid,
            ...this.state.fan,
        } as FanState);
    }

    /*
     * Updates the light state.
     */
    private updateLightState(target: "downlight" | "uplight", results: Record<string, unknown>): void {
        if (!this.supported(target)) {
            return;
        }

        if (
            (results.light as Record<string, string>)?.target !== target ||
            (results.light as Record<string, LightState | undefined>).state == null
        ) {
            return;
        }

        this.state[target] = (results.light as Record<string, LightState | undefined>).state;

        this.emit("Response", "LightState", {
            id: this.uuid,
            target,
            ...this.state[target],
        } as LightState);
    }

    /*
     * Updates the sensor state.
     */
    private updateSensorState(results: Record<string, unknown>): void {
        if (!this.supported("temperature") && !this.supported("humidity")) {
            return;
        }

        if (results.sensor == null) {
            return;
        }

        this.state.sensor = (results.sensor as Record<string, SensorState | undefined>).state;

        this.emit("Response", "SensorState", {
            id: this.uuid,
            ...this.state.sensor,
        } as SensorState);
    }
}
