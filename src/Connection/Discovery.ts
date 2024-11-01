import os from "os";
import path from "path";
import equals from "deep-equal";

import Cache from "flat-cache";

import { EventEmitter } from "@mkellsy/event-emitter";
import { MDNSService, MDNSServiceDiscovery, Protocol } from "tinkerhub-mdns";
import { HostAddress, HostAddressFamily } from "@mkellsy/hap-device";

import { Connection } from "./Connection";
import { Host } from "./Host";

/**
 * Creates and searches the network for devices.
 * @private
 */
export class Discovery extends EventEmitter<{
    Discovered: (device: Host) => void;
    Failed: (error: Error) => void;
}> {
    private cache: Cache.Cache;
    private cached: Map<string, Host> = new Map();
    private discovery?: MDNSServiceDiscovery;

    /**
     * Creates a mDNS discovery object used to search the network for devices.
     *
     * ```js
     * const discovery = new Discovery();
     *
     * discovery.on("Discovered", (device: Host) => {  });
     * discovery.search()
     * ```
     */
    constructor() {
        super();

        this.cache = Cache.load("discovery", path.join(os.homedir(), ".baf"));

        for (const host of (this.cache.getKey("/hosts") || []) as Host[]) {
            this.cached.set(host.id, host);
        }
    }

    /**
     * Starts searching the network for devices.
     */
    public search(): void {
        this.stop();

        this.cached.forEach(async (host) => {
            const ip = host.addresses.find((address) => address.family === HostAddressFamily.IPv4);

            if (await Connection.reachable((ip || host.addresses[0]).address)) {
                this.emit("Discovered", host);
            } else {
                this.cached.delete(host.id);
            }
        });

        this.discovery = new MDNSServiceDiscovery({ type: "api", protocol: Protocol.TCP });
        this.discovery.onAvailable(this.onAvailable);
    }

    /**
     * Stops searching the network.
     */
    public stop(): void {
        this.discovery?.destroy();
    }

    /*
     * Parses a service once discovered. If it fits the criteria, this will
     * emit a discovered event.
     */
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

        const host: Host = { id, addresses, name, model };

        if (!equals(this.cached.get(id), host)) {
            this.emit("Discovered", host);
        }

        this.cached.set(id, host);
        this.cache.setKey("/hosts", Array.from(this.cached.values()));
        this.cache.save(true);
    };
}
