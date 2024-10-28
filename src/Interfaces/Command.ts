import { Connection } from "../Connection";

/**
 * Defines a command sent to the device connection.
 * @public
 */
export class Command {
    private connection: Connection;
    private commands: number[][] = [];

    private prefix: number[] = [0x12, 0x07, 0x12, 0x05, 0x1a, 0x03];

    constructor(connection: Connection) {
        this.connection = connection;
    }

    public push(...command: number[][]) {
        this.commands.push(...command);
    }

    public execute(): Promise<void> {
        return new Promise((resolve, reject) => {
            Promise.all(this.commands.map((command) => this.connection.write([...this.prefix, ...command])))
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    }
}
