import { EventEmitter } from "@mkellsy/event-emitter";
import { FanAddress } from "@mkellsy/baf";
import { MDNSService, MDNSServiceDiscovery, Protocol } from "tinkerhub-mdns";
import { HostAddress, HostAddressFamily } from "@mkellsy/hap-device";

export class Discovery extends EventEmitter<{
    Discovered: (fan: FanAddress) => void;
    Failed: (error: Error) => void;
}> {
    private discovery?: MDNSServiceDiscovery;

    constructor() {
        super();
    }

    public search(): void {
        this.stop();

        this.discovery = new MDNSServiceDiscovery({
            type: "api",
            protocol: Protocol.TCP,
        });

        this.discovery.onAvailable(this.onAvailable);
    }

    public stop(): void {
        this.discovery?.destroy();
    }

    private onAvailable = (service: MDNSService): void => {
        const id = service.data.get("uuid");
        const name = service.data.get("name");
        const model = service.data.get("model");

        if (
            id == null ||
            typeof id === "boolean" ||
            name == null ||
            typeof name === "boolean" ||
            model == null ||
            typeof model === "boolean"
        ) {
            return;
        }

        const addresses: HostAddress[] = [];

        for (let i = 0; i < service.addresses.length; i++) {
            addresses.push({
                address: service.addresses[i].host,
                family: /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(service.addresses[i].host)
                    ? HostAddressFamily.IPv6
                    : HostAddressFamily.IPv4,
            });
        }

        this.emit("Discovered", { id, addresses, name, model });
    };
}