import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Fan } from "../../src/Devices/Fan";

chai.use(sinonChai);

describe("Fan", () => {
    let fan: Fan;
    let capabilities: any;
    let connection: any;

    beforeEach(() => {
        connection = { write: sinon.stub() };

        capabilities = {
            id: "ID",
            name: "NAME",
            model: "MODEL",
            fan: true,
            eco: true,
        };

        fan = new Fan(connection, capabilities);
    });

    it("should define common properties", () => {
        expect(fan.manufacturer).to.equal("Delta T, LLC");
        expect(fan.id).to.equal("BAF-ID-FAN");
        expect(fan.name).to.equal("NAME Fan");
        expect(fan.room).to.equal("Default");
        expect(fan.address.href).to.equal("ID");
        expect(fan.suffix).to.equal("Fan");
        expect(fan.type).to.equal("Fan");
        expect(fan.status.state).to.equal("Unknown");
    });

    it("should define a logger for the device", () => {
        expect(fan.log).to.not.be.undefined;
        expect(fan.log.info).to.not.be.undefined;
        expect(fan.log.warn).to.not.be.undefined;
        expect(fan.log.error).to.not.be.undefined;
    });

    it("should define a compliant area property", () => {
        expect(fan.area.href).to.equal("ID");
        expect(fan.area.ControlType).to.equal("Fan");
        expect(fan.area.Parent.href).to.equal("ID");
        expect(fan.area.IsLeaf).to.equal(true);
        expect(fan.area.AssociatedZones.length).to.equal(0);
        expect(fan.area.AssociatedControlStations.length).to.equal(0);
        expect(fan.area.AssociatedOccupancyGroups.length).to.equal(0);
    });

    it("should contain state, speed, whoosh, auto and eco in the capabilities", () => {
        expect(fan.capabilities.state.type).to.equal("String");
        expect(fan.capabilities.state.values).to.contain("On");
        expect(fan.capabilities.state.values).to.contain("Off");
        expect(fan.capabilities.speed.type).to.equal("Integer");
        expect(fan.capabilities.speed.min).to.equal(0);
        expect(fan.capabilities.speed.max).to.equal(7);
        expect(fan.capabilities.whoosh.type).to.equal("String");
        expect(fan.capabilities.whoosh.values).to.contain("On");
        expect(fan.capabilities.whoosh.values).to.contain("Off");
        expect(fan.capabilities.auto.type).to.equal("String");
        expect(fan.capabilities.auto.values).to.contain("On");
        expect(fan.capabilities.auto.values).to.contain("Off");
        expect(fan.capabilities.eco.type).to.equal("String");
        expect(fan.capabilities.eco.values).to.contain("On");
        expect(fan.capabilities.eco.values).to.contain("Off");
    });

    it("should not define eco capibility if not supported", () => {
        capabilities = {
            id: "ID",
            name: "NAME",
            model: "MODEL",
            fan: true,
        };

        fan = new Fan(connection, capabilities);

        expect(fan.capabilities.eco).to.be.undefined;
    });

    it("should update the state to on", () => {
        fan.on("Update", (_device, status) => {
            expect(status.state).to.equal("On");
            expect(status.whoosh).to.equal("On");
            expect(status.auto).to.equal("Off");
            expect(status.eco).to.equal("Unknown");
            expect(status.speed).to.equal(7);
        });

        fan.update({} as any);
        fan.update({
            SwitchedLevel: "On",
            WhooshLevel: "On",
            AutoLevel: "Off",
            FanSpeed: 7,
        } as any);
        fan.update({
            SwitchedLevel: "On",
            WhooshLevel: "On",
            AutoLevel: "Off",
            FanSpeed: 7,
        } as any);
    });

    it("should not define eco is not available", () => {
        capabilities = {
            id: "ID",
            name: "NAME",
            model: "MODEL",
            fan: true,
        };

        fan = new Fan(connection, capabilities);

        fan.on("Update", (_device, status) => {
            expect(status.eco).to.be.undefined;
        });

        fan.update({
            SwitchedLevel: "On",
            WhooshLevel: "On",
            AutoLevel: "Off",
            FanSpeed: 7,
        } as any);
    });

    it("should call write when setting the state to off", (done) => {
        connection.write.resolves();

        fan.set({ state: "Off", whoosh: "Off", eco: "Off" })
            .then(() => {
                expect(connection.write).to.be.called;
            })
            .finally(() => {
                done();
            });
    });

    it("should call write when setting the state to on and set the speed", (done) => {
        connection.write.resolves();

        fan.set({ state: "On", whoosh: "On", eco: "On", speed: 7 })
            .then(() => {
                expect(connection.write).to.be.called;
            })
            .finally(() => {
                done();
            });
    });

    it("should call write when setting the state to on and set", (done) => {
        connection.write.resolves();

        fan.set({ state: "On", whoosh: "On", auto: "On" })
            .then(() => {
                expect(connection.write).to.be.called;
            })
            .finally(() => {
                done();
            });
    });

    it("should reject with the error from the connection", (done) => {
        connection.write.rejects("ERROR TEST");

        fan.set({ state: "Off" })
            .catch((error) => {
                expect(error).to.equal("ERROR TEST");
            })
            .finally(() => {
                done();
            });
    });
});
