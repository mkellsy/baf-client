import { proxy, registerNode } from "proxyrequire";

import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Location } from "../src/Location";

chai.use(sinonChai);
registerNode();

describe("Location", () => {
    const logStub = {
        info: sinon.stub(),
        warn: sinon.stub(),
        error: sinon.stub(),
        debug: sinon.stub(),
    };

    let connectionStub: any;
    let discoveryStub: any;
    let emitStub: any;

    let hostStub: any;

    let dimmerStub: any;
    let fanStub: any;
    let humidityStub: any;
    let occupancyStub: any;
    let switchStub: any;
    let temperatureStub: any;

    let location: Location;
    let locationType: typeof Location;

    const emit = (stub: any, event: string, ...payload: any[]) => {
        for (const callback of stub.callbacks[event] || []) {
            callback(...payload);
        }
    };

    before(() => {
        locationType = proxy(() => require("../src/Location").Location, {
            "js-logger": {
                get() {
                    return logStub;
                },
            },
            "@mkellsy/event-emitter": {
                EventEmitter: class {
                    emit(event: string, ...payload: any[]) {
                        emitStub(event, ...payload);
                    }
                },
            },
            "@mkellsy/baf": {
                Connection: class {
                    constructor(host: string, id: string, name: string) {
                        connectionStub.host = host;
                        connectionStub.id = id;
                        connectionStub.name = name;
                    }

                    get id(): string {
                        return connectionStub.id;
                    }

                    get host(): string {
                        return connectionStub.host;
                    }

                    get name(): string {
                        return connectionStub.name;
                    }

                    on(event: string, callback: Function) {
                        if (connectionStub.callbacks[event] == null) {
                            connectionStub.callbacks[event] = [];
                        }

                        connectionStub.callbacks[event].push(callback);

                        return this;
                    }

                    connect() {
                        return connectionStub.connect;
                    }

                    disconnect() {
                        connectionStub.disconnect();
                    }

                    write(message: any) {
                        connectionStub.write(message);
                    }
                },
            },
            "./Discovery": {
                Discovery: class {
                    on(event: string, callback: Function) {
                        if (discoveryStub.callbacks[event] == null) {
                            discoveryStub.callbacks[event] = [];
                        }

                        discoveryStub.callbacks[event].push(callback);

                        return this;
                    }

                    search() {
                        discoveryStub.search();
                    }

                    stop() {
                        discoveryStub.stop();
                    }
                },
            },
            "./Devices/Dimmer": {
                Dimmer: class {
                    on(event: string, callback: Function) {
                        if (dimmerStub.callbacks[event] == null) {
                            dimmerStub.callbacks[event] = [];
                        }

                        dimmerStub.callbacks[event].push(callback);

                        return this;
                    }

                    update() {
                        dimmerStub.update();
                    }
                },
            },
            "./Devices/Fan": {
                Fan: class {
                    on(event: string, callback: Function) {
                        if (fanStub.callbacks[event] == null) {
                            fanStub.callbacks[event] = [];
                        }

                        fanStub.callbacks[event].push(callback);

                        return this;
                    }

                    update() {
                        fanStub.update();
                    }
                },
            },
            "./Devices/Humidity": {
                Humidity: class {
                    on(event: string, callback: Function) {
                        if (humidityStub.callbacks[event] == null) {
                            humidityStub.callbacks[event] = [];
                        }

                        humidityStub.callbacks[event].push(callback);

                        return this;
                    }

                    update() {
                        humidityStub.update();
                    }
                },
            },
            "./Devices/Occupancy": {
                Occupancy: class {
                    on(event: string, callback: Function) {
                        if (occupancyStub.callbacks[event] == null) {
                            occupancyStub.callbacks[event] = [];
                        }

                        occupancyStub.callbacks[event].push(callback);

                        return this;
                    }

                    update() {
                        occupancyStub.update();
                    }
                },
            },
            "./Devices/Switch": {
                Switch: class {
                    on(event: string, callback: Function) {
                        if (switchStub.callbacks[event] == null) {
                            switchStub.callbacks[event] = [];
                        }

                        switchStub.callbacks[event].push(callback);

                        return this;
                    }

                    update() {
                        switchStub.update();
                    }
                },
            },
            "./Devices/Temperature": {
                Temperature: class {
                    on(event: string, callback: Function) {
                        if (temperatureStub.callbacks[event] == null) {
                            temperatureStub.callbacks[event] = [];
                        }

                        temperatureStub.callbacks[event].push(callback);

                        return this;
                    }

                    update() {
                        temperatureStub.update();
                    }
                },
            },
        });
    });

    beforeEach(() => {
        connectionStub = {
            callbacks: {},
            connect: sinon.promise(),
            disconnect: sinon.stub(),
            write: sinon.stub(),
        };

        discoveryStub = {
            callbacks: {},
            search: sinon.stub(),
            stop: sinon.stub(),
        };

        emitStub = sinon.stub();

        dimmerStub = { callbacks: {}, update: sinon.stub() };
        fanStub = { callbacks: {}, update: sinon.stub() };
        humidityStub = { callbacks: {}, update: sinon.stub() };
        occupancyStub = { callbacks: {}, update: sinon.stub() };
        switchStub = { callbacks: {}, update: sinon.stub() };
        temperatureStub = { callbacks: {}, update: sinon.stub() };

        hostStub = {
            id: "ID",
            name: "NAME",
            model: "MODEL",
            addresses: [{ address: "0.0.0.0", family: 4 }],
        };

        location = new locationType();
    });

    afterEach(() => {
        logStub.info.resetHistory();
        logStub.warn.resetHistory();
        logStub.error.resetHistory();
        logStub.debug.resetHistory();
    });

    it("should call discovery search when created", () => {
        expect(discoveryStub.search).to.be.called;
    });

    describe("close()", () => {
        it("should disconnect any connection on close", () => {
            emit(discoveryStub, "Discovered", hostStub);
            emit(connectionStub, "Connect");

            location.close();

            expect(connectionStub.disconnect).to.be.called;
        });
    });

    describe("onDiscovered()", () => {
        it("should bind listners and call connect when a processor is discovered", (done) => {
            emit(discoveryStub, "Discovered", hostStub);

            expect(connectionStub.callbacks["Connect"].length).to.equal(1);
            expect(connectionStub.callbacks["Response"].length).to.equal(1);
            expect(connectionStub.callbacks["Error"].length).to.equal(1);

            connectionStub.connect.resolve();

            setTimeout(() => {
                expect(connectionStub.connect.status).to.equal("resolved");
                done();
            }, 1);
        });

        it("should disconnect existing connections if they exist", () => {
            emit(discoveryStub, "Discovered", hostStub);
            emit(connectionStub, "Connect");
            emit(discoveryStub, "Discovered", hostStub);

            expect(connectionStub.disconnect).to.be.called;
        });

        it("should log errors if connection fails", (done) => {
            emit(discoveryStub, "Discovered", hostStub);

            connectionStub.connect.reject({ message: "ERROR" });

            setTimeout(() => {
                expect(logStub.error).to.be.calledWith("\u001b[31mERROR\u001b[39m");
                done();
            }, 1);
        });
    });

    describe("onAvailable()", () => {
        beforeEach(() => {
            hostStub = {
                id: "ID",
                name: "NAME",
                model: "MODEL",
                addresses: [{ address: "0.0.0.0", family: 6 }],
            };

            emit(discoveryStub, "Discovered", hostStub);
            emit(connectionStub, "Connect");

            connectionStub.connect.resolve();
        });

        it("should setup devices on capabilities response", () => {
            emit(connectionStub, "Response", "Capabilities", {
                id: "ID",
                name: "NAME",
                model: "MODEL",
                fan: true,
                downlight: true,
                uplight: true,
                uvc: true,
                occupancy: true,
                temperature: true,
                humidity: true,
            });

            expect(emitStub).to.be.calledWith("Available", sinon.match.any);
        });

        it("should not setup devices if the connection is not setup", () => {
            emit(connectionStub, "Response", "Capabilities", {
                id: "ID_2",
                name: "NAME",
                model: "MODEL",
                fan: true,
            });

            expect(emitStub).to.not.be.calledWith("Available", sinon.match.any);
        });

        it("should not setup devices if no capabilities are set", () => {
            emit(connectionStub, "Response", "Capabilities", {
                id: "ID",
                name: "NAME",
                model: "MODEL",
            });

            expect(emitStub).to.be.calledWith("Available", sinon.match.any);
        });
    });

    describe("onFanState()", () => {
        beforeEach(() => {
            emit(discoveryStub, "Discovered", hostStub);
            emit(connectionStub, "Connect");

            connectionStub.connect.resolve();

            emit(connectionStub, "Response", "Capabilities", {
                id: "ID",
                name: "NAME",
                model: "MODEL",
                fan: true,
                occupancy: true,
            });
        });

        it("should update each fans and sensors if defined", () => {
            emit(connectionStub, "Response", "FanState", {
                id: "ID",
                on: true,
                speed: 7,
                auto: false,
                eco: true,
                whoosh: true,
                occupancy: true,
            });

            expect(fanStub.update).to.be.called;
            expect(occupancyStub.update).to.be.called;
        });

        it("should update each fans and sensors with negated values", () => {
            emit(connectionStub, "Response", "FanState", {
                id: "ID",
                on: false,
                speed: 7,
                auto: true,
                eco: false,
                whoosh: false,
                occupancy: false,
            });

            expect(fanStub.update).to.be.called;
            expect(occupancyStub.update).to.be.called;
        });

        it("should not update devices that don't have a connection setup", () => {
            emit(connectionStub, "Response", "FanState", {
                id: "ID_2",
                on: false,
                speed: 7,
                auto: true,
                eco: false,
                whoosh: false,
                occupancy: false,
            });

            expect(fanStub.update).to.not.be.called;
            expect(occupancyStub.update).to.not.be.called;
        });
    });

    describe("onDownlightState()", () => {
        beforeEach(() => {
            emit(discoveryStub, "Discovered", hostStub);
            emit(connectionStub, "Connect");

            connectionStub.connect.resolve();

            emit(connectionStub, "Response", "Capabilities", {
                id: "ID",
                name: "NAME",
                model: "MODEL",
                downlight: true,
            });
        });

        it("should update a downlight if defined", () => {
            emit(connectionStub, "Response", "LightState", {
                id: "ID",
                target: "downlight",
                on: true,
                level: 50,
            });

            expect(dimmerStub.update).to.be.called;
        });

        it("should update a downlight with negated values", () => {
            emit(connectionStub, "Response", "LightState", {
                id: "ID",
                target: "downlight",
                on: false,
                level: 50,
            });

            expect(dimmerStub.update).to.be.called;
        });

        it("should not update devices that don't have a connection setup", () => {
            emit(connectionStub, "Response", "LightState", {
                id: "ID_2",
                target: "downlight",
                on: true,
                level: 50,
            });

            expect(dimmerStub.update).to.not.be.called;
        });
    });

    describe("onUplightState()", () => {
        beforeEach(() => {
            emit(discoveryStub, "Discovered", hostStub);
            emit(connectionStub, "Connect");

            connectionStub.connect.resolve();

            emit(connectionStub, "Response", "Capabilities", {
                id: "ID",
                name: "NAME",
                model: "MODEL",
                uplight: true,
            });
        });

        it("should update a uplight if defined", () => {
            emit(connectionStub, "Response", "LightState", {
                id: "ID",
                target: "uplight",
                on: true,
                level: 50,
            });

            expect(dimmerStub.update).to.be.called;
        });

        it("should update a uplight with negated values", () => {
            emit(connectionStub, "Response", "LightState", {
                id: "ID",
                target: "uplight",
                on: false,
                level: 50,
            });

            expect(dimmerStub.update).to.be.called;
        });

        it("should not update devices that don't have a connection setup", () => {
            emit(connectionStub, "Response", "LightState", {
                id: "ID_2",
                target: "uplight",
                on: true,
                level: 50,
            });

            expect(dimmerStub.update).to.not.be.called;
        });
    });

    describe("onUvcState()", () => {
        beforeEach(() => {
            emit(discoveryStub, "Discovered", hostStub);
            emit(connectionStub, "Connect");

            connectionStub.connect.resolve();

            emit(connectionStub, "Response", "Capabilities", {
                id: "ID",
                name: "NAME",
                model: "MODEL",
                uvc: true,
            });
        });

        it("should update a uvc light if defined", () => {
            emit(connectionStub, "Response", "LightState", {
                id: "ID",
                target: "uvc",
                on: true,
            });

            expect(switchStub.update).to.be.called;
        });

        it("should update a uvc light with negated values", () => {
            emit(connectionStub, "Response", "LightState", {
                id: "ID",
                target: "uvc",
                on: false,
            });

            expect(switchStub.update).to.be.called;
        });

        it("should not update devices that don't have a connection setup", () => {
            emit(connectionStub, "Response", "LightState", {
                id: "ID_2",
                target: "uvc",
                on: true,
            });

            expect(switchStub.update).to.not.be.called;
        });
    });

    describe("onSensorState()", () => {
        beforeEach(() => {
            emit(discoveryStub, "Discovered", hostStub);
            emit(connectionStub, "Connect");

            connectionStub.connect.resolve();

            emit(connectionStub, "Response", "Capabilities", {
                id: "ID",
                name: "NAME",
                model: "MODEL",
                temperature: true,
                humidity: true,
            });
        });

        it("should update sensor devices if defined", () => {
            emit(connectionStub, "Response", "SensorState", {
                id: "ID",
                temperature: 20,
                humidity: 40,
            });

            expect(temperatureStub.update).to.be.called;
            expect(humidityStub.update).to.be.called;
        });

        it("should not update devices that don't have a connection setup", () => {
            emit(connectionStub, "Response", "SensorState", {
                id: "ID_2",
                temperature: 20,
                humidity: 40,
            });

            expect(temperatureStub.update).to.not.be.called;
            expect(humidityStub.update).to.not.be.called;
        });
    });

    describe("onDeviceUpdate()", () => {
        beforeEach(() => {
            emit(discoveryStub, "Discovered", hostStub);
            emit(connectionStub, "Connect");

            connectionStub.connect.resolve();

            emit(connectionStub, "Response", "Capabilities", {
                id: "ID",
                name: "NAME",
                model: "MODEL",
                fan: true,
                occupancy: true,
            });
        });

        it("should emit an update event when a device updates", () => {
            emit(fanStub, "Update", "DEVICE", "STATE");
            expect(emitStub).to.be.calledWith("Update", "DEVICE", "STATE");
        });
    });

    describe("onError()", () => {
        beforeEach(() => {
            emit(discoveryStub, "Discovered", hostStub);
        });

        it("should emit an update event when a device updates", () => {
            emit(connectionStub, "Error", { message: "ERROR" });
            expect(logStub.error).to.be.calledWith("\u001b[31mERROR\u001b[39m");
        });
    });
});
