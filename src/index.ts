import { program } from "commander";
import { Location } from "./Location";
import { Logger } from "./Logger";

program.option("-d, --debug", "enable debug logging");

program.command("start").action(() => {
    Logger.configure(program);

    const location = new Location();

    location.on("Available", (devices) => Logger.log.info(Logger.inspect(devices.map((device) => device.name))));
    location.on("Update", (device, state) => device.log.info(Logger.inspect(state)));
});

export = function main(args?: string[] | undefined): void {
    program.parse(args || process.argv);
};
