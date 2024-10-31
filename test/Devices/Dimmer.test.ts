import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { DeviceType } from "../../src/Devices/DeviceType";
import { Dimmer } from "../../src/Devices/Dimmer/Dimmer";

chai.use(sinonChai);

describe("Dimmer", () => {
    let dimmer: Dimmer;
    let capabilities: any;
    let connection: any;

    beforeEach(() => {
        connection = { write: sinon.stub() };

        capabilities = {
            id: "ID",
            name: "NAME",
            model: "MODEL",
            downlight: true,
            uplight: true,
        };

        dimmer = new Dimmer(connection, capabilities, DeviceType.Downlight);
    });

    it("should define common properties", () => {
        expect(dimmer.manufacturer).to.equal("Delta T, LLC");
        expect(dimmer.id).to.equal("BAF-ID-DOWNLIGHT");
        expect(dimmer.name).to.equal("NAME Downlight");
        expect(dimmer.room).to.equal("Default");
        expect(dimmer.address.href).to.equal("ID");
        expect(dimmer.suffix).to.equal("Downlight");
        expect(dimmer.type).to.equal("Dimmer");
        expect(dimmer.status.state).to.equal("Off");
    });

    it("should define a logger for the device", () => {
        expect(dimmer.log).to.not.be.undefined;
        expect(dimmer.log.info).to.not.be.undefined;
        expect(dimmer.log.warn).to.not.be.undefined;
        expect(dimmer.log.error).to.not.be.undefined;
    });

    it("should define a compliant area property", () => {
        expect(dimmer.area.href).to.equal("ID");
        expect(dimmer.area.ControlType).to.equal("Dimmer");
        expect(dimmer.area.Parent.href).to.equal("ID");
        expect(dimmer.area.IsLeaf).to.equal(true);
        expect(dimmer.area.AssociatedZones.length).to.equal(0);
        expect(dimmer.area.AssociatedControlStations.length).to.equal(0);
        expect(dimmer.area.AssociatedOccupancyGroups.length).to.equal(0);
    });

    it("should contain state and level in the capabilities", () => {
        expect(dimmer.capabilities.state.type).to.equal("String");
        expect(dimmer.capabilities.state.values).to.contain("On");
        expect(dimmer.capabilities.state.values).to.contain("Off");
        expect(dimmer.capabilities.level.type).to.equal("Integer");
        expect(dimmer.capabilities.level.min).to.equal(0);
        expect(dimmer.capabilities.level.max).to.equal(100);
    });

    it("should update the state to on", () => {
        dimmer.on("Update", (_device, status) => {
            expect(status.state).to.equal("On");
            expect(status.level).to.equal(100);
        });

        dimmer.update({} as any);
        dimmer.update({ Level: 1 } as any);
        dimmer.update({ Level: 1 } as any);
    });

    it("should update the state to off", () => {
        dimmer.on("Update", (_device, status) => {
            expect(status.state).to.equal("Off");
            expect(status.level).to.equal(0);
        });

        dimmer.update({} as any);
        dimmer.update({ Level: 0 } as any);
        dimmer.update({ Level: 0 } as any);
    });

    it("should call write when setting the state to off for downlight", (done) => {
        connection.write.resolves();

        dimmer
            .set({ state: "Off", level: 0 })
            .then(() => {
                expect(connection.write).to.be.called;
            })
            .finally(() => {
                done();
            });
    });

    it("should call write when setting the state to on for downlight", (done) => {
        connection.write.resolves();

        dimmer
            .set({ state: "On", level: 100 })
            .then(() => {
                expect(connection.write).to.be.called;
            })
            .finally(() => {
                done();
            });
    });

    it("should call write when setting the state to off for uplight", (done) => {
        connection.write.resolves();

        dimmer = new Dimmer(connection, capabilities, DeviceType.Uplight);

        dimmer
            .set({ state: "Off", level: 0 })
            .then(() => {
                expect(connection.write).to.be.called;
            })
            .finally(() => {
                done();
            });
    });

    it("should call write when setting the state to on for uplight", (done) => {
        connection.write.resolves();

        dimmer = new Dimmer(connection, capabilities, DeviceType.Uplight);

        dimmer
            .set({ state: "On", level: 100 })
            .then(() => {
                expect(connection.write).to.be.called;
            })
            .finally(() => {
                done();
            });
    });

    it("should reject with the error from the connection", (done) => {
        connection.write.rejects("ERROR TEST");

        dimmer
            .set({ state: "Off", level: 0 })
            .catch((error) => {
                expect(error).to.equal("ERROR TEST");
            })
            .finally(() => {
                done();
            });
    });
});
