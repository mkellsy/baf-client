import proxyquire from "proxyquire";

import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Discovery } from "../../src/Connection/Discovery";

chai.use(sinonChai);

describe("Discovery", () => {
    let onAvailableStub: any;
    let reachableStub: any;
    let destroyStub: any;
    let cacheStub: any;
    let emitStub: any;

    let discovery: Discovery;
    let discoveryType: typeof Discovery;

    before(() => {
        discoveryType = proxyquire("../../src/Connection/Discovery", {
            "flat-cache": {
                load: () => cacheStub,
            },
            "tinkerhub-mdns": {
                MDNSServiceDiscovery: class {
                    onAvailable(callback: Function) {
                        onAvailableStub = callback;
                    }

                    destroy() {
                        destroyStub();
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
            "./Connection": {
                Connection: {
                    reachable() {
                        return new Promise((resolve) => {
                            resolve(reachableStub);
                        });
                    },
                },
            },
        }).Discovery;
    });

    beforeEach(() => {
        cacheStub = {
            getKey: sinon.stub(),
            setKey: sinon.stub(),
            save: sinon.stub(),
        };

        emitStub = sinon.stub();
        destroyStub = sinon.stub();
        reachableStub = true;

        discovery = new discoveryType();
    });

    describe("search()", () => {
        it("should emit discovered events for cached hosts", (done) => {
            cacheStub.getKey.returns([
                { id: "ID_1", addresses: ["0.0.0.0"], name: "NAME_1", model: "MODEL_1" },
                { id: "ID_2", addresses: ["1.1.1.1"], name: "NAME_2", model: "MODEL_2" },
            ]);

            discovery = new discoveryType();
            discovery.search();

            setTimeout(() => {
                expect(emitStub).to.be.calledWith("Discovered", {
                    id: "ID_1",
                    addresses: ["0.0.0.0"],
                    name: "NAME_1",
                    model: "MODEL_1",
                });

                expect(emitStub).to.be.calledWith("Discovered", {
                    id: "ID_2",
                    addresses: ["1.1.1.1"],
                    name: "NAME_2",
                    model: "MODEL_2",
                });

                done();
            }, 1);
        });

        it("should not emit discovered events for cached hosts that are not reachable", (done) => {
            reachableStub = false;

            cacheStub.getKey.returns([
                { id: "ID_1", addresses: ["0.0.0.0"], name: "NAME_1", model: "MODEL_1" },
                { id: "ID_2", addresses: ["1.1.1.1"], name: "NAME_2", model: "MODEL_2" },
            ]);

            discovery = new discoveryType();
            discovery.search();

            setTimeout(() => {
                expect(emitStub).to.not.be.calledWith("Discovered", {
                    id: "ID_1",
                    addresses: ["0.0.0.0"],
                    name: "NAME_1",
                    model: "MODEL_1",
                });

                expect(emitStub).to.not.be.calledWith("Discovered", {
                    id: "ID_2",
                    addresses: ["1.1.1.1"],
                    name: "NAME_2",
                    model: "MODEL_2",
                });

                done();
            }, 1);
        });

        it("should not emit any discovered events if there are no cached hosts", () => {
            discovery.search();

            expect(emitStub).to.not.be.calledWith("Discovered", sinon.match.any);
        });
    });

    describe("stop()", () => {
        it("should call destroy on the mdns subscriber", () => {
            discovery = new discoveryType();
            discovery.search();
            discovery.stop();

            expect(destroyStub).to.be.called;
        });
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

            expect(emitStub).to.be.calledWith("Discovered", {
                id: "UUID",
                addresses: [
                    {
                        address: "127.0.0.1",
                        family: 4,
                    },
                    {
                        address: "0:0:0:0:0:0:0:1",
                        family: 6,
                    },
                ],
                name: "NAME",
                model: "MODEL",
            });
        });

        it("should not emit a discovered event when a service is found but already cached", (done) => {
            const data = new Map<string, boolean | string | undefined>();

            data.set("uuid", "UUID");
            data.set("name", "NAME");
            data.set("model", "MODEL");

            cacheStub.getKey.returns([
                {
                    id: "UUID",
                    addresses: [
                        {
                            address: "127.0.0.1",
                            family: 4,
                        },
                        {
                            address: "0:0:0:0:0:0:0:1",
                            family: 6,
                        },
                    ],
                    name: "NAME",
                    model: "MODEL",
                },
            ]);

            discovery = new discoveryType();
            discovery.search();

            setTimeout(() => {
                onAvailableStub({
                    data,
                    addresses: [{ host: "127.0.0.1" }, { host: "0:0:0:0:0:0:0:1" }],
                });

                expect(emitStub).to.be.calledOnceWith("Discovered", {
                    id: "UUID",
                    addresses: [
                        {
                            address: "127.0.0.1",
                            family: 4,
                        },
                        {
                            address: "0:0:0:0:0:0:0:1",
                            family: 6,
                        },
                    ],
                    name: "NAME",
                    model: "MODEL",
                });

                done();
            }, 1);
        });

        it("should emit a discovered event when a cached service reports a different address", () => {
            const data = new Map<string, boolean | string | undefined>();

            data.set("uuid", "UUID");
            data.set("name", "NAME");
            data.set("model", "MODEL");

            cacheStub.getKey.returns([
                {
                    id: "UUID",
                    addresses: [
                        {
                            address: "127.0.0.1",
                            family: 4,
                        },
                        {
                            address: "0:0:0:0:0:0:0:1",
                            family: 6,
                        },
                    ],
                    name: "NAME",
                    model: "MODEL",
                },
            ]);

            discovery = new discoveryType();
            discovery.search();

            onAvailableStub({
                data,
                addresses: [{ host: "127.0.0.2" }, { host: "0:0:0:0:0:0:0:2" }],
            });

            expect(emitStub).to.be.calledWith("Discovered", {
                id: "UUID",
                addresses: [
                    {
                        address: "127.0.0.2",
                        family: 4,
                    },
                    {
                        address: "0:0:0:0:0:0:0:2",
                        family: 6,
                    },
                ],
                name: "NAME",
                model: "MODEL",
            });
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
