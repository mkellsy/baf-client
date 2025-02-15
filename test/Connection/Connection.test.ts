import proxyquire from "proxyquire";

import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Connection } from "../../src/Connection/Connection";

chai.use(sinonChai);

describe("Connection", () => {
    let optionsStub: any;
    let socketStub: any;
    let chunkifyStub: any;
    let stuffStub: any;
    let unstuffStub: any;
    let emitStub: any;
    let parseStub: any;
    let writeStub: any;

    let connection: Connection;
    let connectionType: typeof Connection;

    before(() => {
        connectionType = proxyquire("../../src/Connection/Connection", {
            net: {
                connect: (...args: any[]) => socketStub.connect(...args),
                Socket: class {
                    destroy = (...args: any[]) => socketStub.destroy(...args);
                    setKeepAlive = (...args: any[]) => socketStub.setKeepAlive(...args);
                    connect = (...args: any[]) => socketStub.connect(...args);
                    write = (...args: any[]) => socketStub.write(...args);
                    setTimeout = (...args: any[]) => socketStub.setTimeout(...args);
                    on = (...args: any[]) => socketStub.on(...args);
                    once = (...args: any[]) => socketStub.once(...args);
                },
            },
            "@mkellsy/event-emitter": {
                EventEmitter: class {
                    emit(event: string, ...payload: any[]) {
                        emitStub(event, ...payload);
                    }
                },
            },
            "../Response/Parser": {
                Parser: class {
                    static stuff() {
                        return stuffStub;
                    }

                    static unstuff() {
                        return unstuffStub;
                    }

                    static chunkify() {
                        return chunkifyStub;
                    }

                    static parse() {
                        return parseStub;
                    }
                },
            },
        }).Connection;
    });

    beforeEach(() => {
        stuffStub = Buffer.from([0, 1, 2, 3, 4]);
        unstuffStub = Buffer.from([0, 1, 2, 3, 4]);

        writeStub = { buffer: undefined, callback: undefined };

        socketStub = {
            callbacks: {},
            timeout: 0,

            port: 0,
            host: undefined,

            on: sinon.stub().callsFake((event: string, callback: Function): void => {
                socketStub.callbacks[event] = callback;
            }),

            once: sinon.stub().callsFake((event: string, callback: Function): void => {
                socketStub.callbacks[event] = callback;
            }),

            destroy: sinon.stub(),

            setTimeout: sinon.stub((timeout: number): void => {
                socketStub.timeout = timeout;
            }),

            setKeepAlive: sinon.stub(),

            connect: (options: any, callback: Function) => {
                socketStub.port = options.port;
                socketStub.host = options.host;
                socketStub.callbacks.connect = callback;
                optionsStub = options;

                setTimeout(() => callback(), 0);

                return socketStub;
            },

            write(buffer: any, callback: Function) {
                writeStub.buffer = buffer;
                writeStub.callback = callback;
            },
        };

        chunkifyStub = {
            chunks: [
                Buffer.from([0xc0, 0x01, 0x02, 0x03, 0x04, 0x05, 0xc0]),
                Buffer.from([0xc0, 0xc0, 0x01, 0x02, 0x03, 0x04, 0x05, 0xc0]),
            ],
            count: 2,
        };

        emitStub = sinon.stub();
        connection = new connectionType("host", "id", "name", "model");
    });

    it("should store the connection id", () => {
        expect(connection.id).to.equal("id");
    });

    describe("reachable()", () => {
        it("should return true if a host can be connected to", (done) => {
            connectionType.reachable("HOST").then((reachable) => {
                expect(reachable).to.be.true;

                expect(socketStub.timeout).to.equal(1000);
                expect(socketStub.port).to.equal(31415);
                expect(socketStub.host).to.equal("HOST");

                expect(socketStub.destroy).to.be.called;

                done();
            });

            socketStub.callbacks.connect();
        });

        it("should return false if a host connection attempt timesout", (done) => {
            connectionType.reachable("HOST").then((reachable) => {
                expect(reachable).to.be.false;

                expect(socketStub.timeout).to.equal(1000);
                expect(socketStub.port).to.equal(31415);
                expect(socketStub.host).to.equal("HOST");

                expect(socketStub.destroy).to.be.called;

                done();
            });

            socketStub.callbacks.timeout();
        });

        it("should return false if a host connection emits an error", (done) => {
            connectionType.reachable("HOST").then((reachable) => {
                expect(reachable).to.be.false;

                expect(socketStub.timeout).to.equal(1000);
                expect(socketStub.port).to.equal(31415);
                expect(socketStub.host).to.equal("HOST");

                expect(socketStub.destroy).to.be.called;

                done();
            });

            socketStub.callbacks.error();
        });
    });

    describe("connect()", () => {
        it("should define listeners, keep alive, and emit a Connect event", async () => {
            await connection.connect();

            expect(optionsStub.host).to.equal("host");
            expect(optionsStub.port).to.equal(31415);

            expect(socketStub.on).to.be.calledWith("data", sinon.match.any);
            expect(socketStub.on).to.be.calledWith("error", sinon.match.any);
            expect(socketStub.on).to.be.calledWith("end", sinon.match.any);

            expect(socketStub.setKeepAlive).to.be.calledWith(true, 5_000);

            expect(emitStub).to.be.calledWith("Connect", sinon.match.any);
        });
    });

    describe("disconnect()", () => {
        it("should not call destroy if connection is not established", () => {
            connection.disconnect();

            expect(socketStub.destroy).to.not.be.called;
        });

        it("should call destroy if connection is established", async () => {
            await connection.connect();

            connection.disconnect();

            expect(socketStub.destroy).to.be.called;
        });
    });

    describe("write()", () => {
        it("should not write to the socket if connection is not established", () => {
            connection.write([0, 1, 2, 3, 4]).catch((error) => {
                expect(error.message).to.equal("connection not established");
                expect(writeStub.buffer).to.be.undefined;
            });
        });

        it("should write a stuffed and marked buffer to the socket", (done) => {
            connection.connect().then(() => {
                connection.write([0, 1, 2, 3, 4]).then(() => {
                    expect(writeStub.buffer).to.deep.equal(Buffer.from([0xc0, 0x00, 0xc0]));
                    done();
                });

                writeStub.callback();
            });
        });

        it("should reject the write promise when the connection returns an error", (done) => {
            connection.connect().then(() => {
                connection.write([0, 1, 2, 3, 4]).catch((error) => {
                    expect(error).to.equal("TEST ERROR");
                    done();
                });

                writeStub.callback("TEST ERROR");
            });
        });
    });

    describe("onSocketTimeout()", () => {
        const callbacks: Record<string, Function> = {};

        beforeEach(async () => {
            socketStub.on = (event: string, callback: Function) => {
                callbacks[event] = callback;
            };
        });

        it("should attempt to reconnect if not tearing down", async () => {
            await connection.connect();

            callbacks.timeout();

            expect(emitStub).to.not.be.calledWith("Disconnect");
        });

        it("should emit a disconnect event when the socket timesout", async () => {
            await connection.connect();

            connection.disconnect();

            callbacks.timeout();
            callbacks.timeout();

            expect(emitStub).to.be.calledWith("Disconnect");
        });
    });

    describe("onSocketDisconnect()", () => {
        const callbacks: Record<string, Function> = {};

        beforeEach(async () => {
            socketStub.on = (event: string, callback: Function) => {
                callbacks[event] = callback;
            };
        });

        it("should attempt to reconnect if not tearing down", async () => {
            await connection.connect();

            callbacks.end();
            callbacks.end();

            expect(emitStub).to.not.be.calledWith("Disconnect");
        });

        it("should emit a disconnect event when the socket ends", async () => {
            await connection.connect();

            connection.disconnect();

            callbacks.end();
            callbacks.end();

            expect(emitStub).to.be.calledWith("Disconnect");
        });
    });

    describe("onSocketError()", () => {
        const callbacks: Record<string, Function> = {};

        beforeEach(async () => {
            socketStub.on = (event: string, callback: Function) => {
                callbacks[event] = callback;
            };
        });

        it("should emit an error event and attempt a reconnect when the socket has an error", async () => {
            await connection.connect();

            emitStub.resetHistory();
            callbacks.error("test error");

            expect(emitStub).to.be.calledWith("Error", "test error");

            setTimeout(() => {
                expect(emitStub).to.be.calledWith("Connect", sinon.match.any);
            }, 250);
        });

        it("should emit an error event even after disconnecting", async () => {
            await connection.connect();

            connection.disconnect();
            callbacks.error("test error");

            expect(emitStub).to.be.calledWith("Error", "test error");
        });
    });

    describe("onSocketData()", () => {
        const callbacks: Record<string, Function> = {};

        beforeEach(async () => {
            socketStub.on = (event: string, callback: Function) => {
                callbacks[event] = callback;
            };
        });

        it("should not emit when garbage data is recieved", async () => {
            chunkifyStub = {
                chunks: [Buffer.from([2, 3, 4, 0xc0])],
                count: 1,
            };

            await connection.connect();

            callbacks.data(Buffer.from([2, 3, 4, 0xc0]));

            expect(emitStub).to.not.be.calledWith("Response", sinon.match.any);
        });

        it("should emit device capibilities on initial connect", async () => {
            parseStub = {
                software: "3.2.5",
                firmware: "3.2.3",
                mac: "20:63:83:12:DE:F0",
                capabilities: {
                    fan: true,
                    downlight: true,
                    uplight: false,
                    temperature: true,
                    humidity: true,
                    occupancy: true,
                    luminance: false,
                    speaker: true,
                    uvc: false,
                    eco: true,
                },
            };

            await connection.connect();

            callbacks.data(Buffer.from([0xc0, 0xc0, 0x01, 0x02, 0x03]));
            callbacks.data(Buffer.from([0x04, 0x05, 0xc0]));
            callbacks.data(Buffer.from([0xc0, 0x01, 0x02, 0x03, 0xc0]));
            callbacks.data(Buffer.from([0xc0, 0x01, 0x02, 0x03, 0xc0]));

            expect(emitStub).to.be.calledWith("Response", "Capabilities", {
                id: "id",
                name: "name",
                model: "model",
                firmware: "3.2.3",
                mac: "20:63:83:12:DE:F0",
                fan: true,
                downlight: true,
                uplight: false,
                temperature: true,
                humidity: true,
                occupancy: true,
                luminance: false,
                speaker: true,
                uvc: false,
                eco: true,
            });
        });

        it("should emit a sensor state event", async () => {
            parseStub = {
                software: "3.2.5",
                firmware: "3.2.3",
                mac: "20:63:83:12:DE:F0",
                capabilities: {
                    fan: true,
                    downlight: true,
                    uplight: false,
                    temperature: true,
                    humidity: true,
                    occupancy: true,
                    luminance: false,
                    speaker: true,
                    uvc: false,
                    eco: true,
                },
                sensor: {
                    state: {
                        temperature: 19.62,
                        humidity: 40.41,
                    },
                },
            };

            await connection.connect();

            callbacks.data(Buffer.from([0xc0, 0xc0, 0x01, 0x02, 0x03]));
            callbacks.data(Buffer.from([0x04, 0x05, 0xc0]));
            callbacks.data(Buffer.from([0xc0, 0x01, 0x02, 0x03, 0xc0]));

            expect(emitStub).to.be.calledWith("Response", "SensorState", {
                id: "id",
                temperature: 19.62,
                humidity: 40.41,
            });
        });

        it("should emit a fan state event", async () => {
            parseStub = {
                software: "3.2.5",
                firmware: "3.2.3",
                mac: "20:63:83:12:DE:F0",
                capabilities: {
                    fan: true,
                    downlight: true,
                    uplight: false,
                    temperature: true,
                    humidity: true,
                    occupancy: false,
                    luminance: false,
                    speaker: true,
                    uvc: false,
                    eco: true,
                },
                fan: {
                    state: {
                        on: false,
                        auto: false,
                        reverse: false,
                        speed: 0,
                        whoosh: true,
                        eco: true,
                        occupancy: true,
                    },
                },
            };

            await connection.connect();

            callbacks.data(Buffer.from([0xc0, 0xc0, 0x01, 0x02, 0x03]));
            callbacks.data(Buffer.from([0x04, 0x05, 0xc0]));
            callbacks.data(Buffer.from([0xc0, 0x01, 0x02, 0x03, 0xc0]));

            expect(emitStub).to.be.calledWith("Response", "FanState", {
                id: "id",
                on: false,
                auto: false,
                reverse: false,
                speed: 0,
                whoosh: true,
                eco: true,
                occupancy: true,
            });
        });

        it("should emit a downlight state event", async () => {
            parseStub = {
                software: "3.2.5",
                firmware: "3.2.3",
                mac: "20:63:83:12:DE:F0",
                capabilities: {
                    fan: true,
                    downlight: true,
                    uplight: false,
                    temperature: true,
                    humidity: true,
                    occupancy: true,
                    luminance: false,
                    speaker: true,
                    uvc: false,
                    eco: true,
                },
                light: {
                    state: {
                        level: 0,
                        luminance: 4000,
                        on: false,
                        auto: false,
                        warm: 0,
                    },
                    target: "downlight",
                },
            };

            await connection.connect();

            callbacks.data(Buffer.from([0xc0, 0xc0, 0x01, 0x02, 0x03]));
            callbacks.data(Buffer.from([0x04, 0x05, 0xc0]));
            callbacks.data(Buffer.from([0xc0, 0x01, 0x02, 0x03, 0xc0]));

            expect(emitStub).to.be.calledWith("Response", "LightState", {
                id: "id",
                target: "downlight",
                level: 0,
                luminance: 4000,
                on: false,
                auto: false,
                warm: 0,
            });
        });

        it("should emit a uplight state event", async () => {
            parseStub = {
                software: "3.2.5",
                firmware: "3.2.3",
                mac: "20:63:83:12:DE:F0",
                capabilities: {
                    fan: true,
                    downlight: true,
                    uplight: true,
                    temperature: true,
                    humidity: true,
                    occupancy: true,
                    luminance: false,
                    speaker: true,
                    uvc: false,
                    eco: true,
                },
                light: {
                    state: {
                        level: 0,
                        luminance: 4000,
                        on: false,
                        auto: false,
                        warm: 0,
                    },
                    target: "uplight",
                },
            };

            await connection.connect();

            callbacks.data(Buffer.from([0xc0, 0xc0, 0x01, 0x02, 0x03]));
            callbacks.data(Buffer.from([0x04, 0x05, 0xc0]));
            callbacks.data(Buffer.from([0xc0, 0x01, 0x02, 0x03, 0xc0]));

            expect(emitStub).to.be.calledWith("Response", "LightState", {
                id: "id",
                target: "uplight",
                level: 0,
                luminance: 4000,
                on: false,
                auto: false,
                warm: 0,
            });
        });

        it("should not emit a downlight state event if state is undefined", async () => {
            parseStub = {
                software: "3.2.5",
                firmware: "3.2.3",
                mac: "20:63:83:12:DE:F0",
                capabilities: {
                    fan: true,
                    downlight: true,
                    uplight: false,
                    temperature: true,
                    humidity: true,
                    occupancy: true,
                    luminance: false,
                    standby: false,
                    uvc: false,
                    eco: true,
                },
                light: {
                    target: "downlight",
                },
            };

            await connection.connect();

            callbacks.data(Buffer.from([0xc0, 0xc0, 0x01, 0x02, 0x03]));
            callbacks.data(Buffer.from([0x04, 0x05, 0xc0]));
            callbacks.data(Buffer.from([0xc0, 0x01, 0x02, 0x03, 0xc0]));

            expect(emitStub).to.not.be.calledWith("Response", "LightState", sinon.match.any);
        });
    });
});
