import { proxy, registerNode } from "proxyrequire";

import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Discovery } from "../src/Discovery";

chai.use(sinonChai);
registerNode();

describe("Discovery", () => {
    let onAvailableStub: any;
    let emitStub: any;

    let discovery: Discovery;
    let discoveryType: typeof Discovery;

    before(() => {
        discoveryType = proxy(() => require("../src/Discovery").Discovery, {
            "tinkerhub-mdns": {
                MDNSServiceDiscovery: class {
                    onAvailable(callback: Function) {
                        onAvailableStub = callback;
                    }
                },
                Protocol: {
                    TCP: "tcp",
                    UDP: "udp",
                },
            },
            "@mkellsy/event-emitter": {
                EventEmitter: class {
                    emit(event: string, ...payload: any[]) {
                        emitStub(event, ...payload);
                    }
                },
            },
        });
    });

    beforeEach(() => {
        emitStub = sinon.stub();
        discovery = new discoveryType();
    });

    describe("onAvailable()", () => {
        beforeEach(() => {
            discovery.search();
        });

        it("should set the onAvailable function", () => {
            expect(onAvailableStub).to.not.be.undefined;
        });

        it("should emit a discovered event when a service is found", () => {
            const data = new Map<string, boolean | string | undefined>();

            data.set("uuid", "UUID");
            data.set("name", "NAME");
            data.set("model", "MODEL");

            onAvailableStub({
                data,
                addresses: [{ host: "127.0.0.1" }, { host: "0:0:0:0:0:0:0:1" }],
            });

            expect(emitStub).to.be.calledWith("Discovered", sinon.match.any);
        });

        it("should emit a discovered event when a service is found", () => {
            const data = new Map<string, boolean | string | undefined>();

            data.set("uuid", false);
            data.set("name", false);
            data.set("model", false);

            onAvailableStub({
                data,
                addresses: [{ host: "127.0.0.1" }, { host: "0:0:0:0:0:0:0:1" }],
            });

            expect(emitStub).to.not.be.calledWith("Discovered", sinon.match.any);
        });
    });
});
