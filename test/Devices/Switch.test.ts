import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { DeviceType } from "../../src/Interfaces/DeviceType";
import { Switch } from "../../src/Devices/Switch";

chai.use(sinonChai);

describe("Switch", () => {
    let binary: Switch;
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

        binary = new Switch(connection, capabilities, DeviceType.UVC);
    });

    it("should define common properties", () => {
        expect(binary.manufacturer).to.equal("Delta T, LLC");
        expect(binary.id).to.equal("BAF-ID-UVC");
        expect(binary.name).to.equal("NAME UVC");
        expect(binary.room).to.equal("Default");
        expect(binary.address.href).to.equal("ID");
        expect(binary.suffix).to.equal("UVC");
        expect(binary.type).to.equal("Switch");
        expect(binary.status.state).to.equal("Off");
    });

    it("should define a logger for the device", () => {
        expect(binary.log).to.not.be.undefined;
        expect(binary.log.info).to.not.be.undefined;
        expect(binary.log.warn).to.not.be.undefined;
        expect(binary.log.error).to.not.be.undefined;
    });

    it("should define a compliant area property", () => {
        expect(binary.area.href).to.equal("ID");
        expect(binary.area.ControlType).to.equal("Switch");
        expect(binary.area.Parent.href).to.equal("ID");
        expect(binary.area.IsLeaf).to.equal(true);
        expect(binary.area.AssociatedZones.length).to.equal(0);
        expect(binary.area.AssociatedControlStations.length).to.equal(0);
        expect(binary.area.AssociatedOccupancyGroups.length).to.equal(0);
    });

    it("should contain state in the capabilities", () => {
        expect(binary.capabilities.state.type).to.equal("String");
        expect(binary.capabilities.state.values).to.contain("On");
        expect(binary.capabilities.state.values).to.contain("Off");
    });

    it("should update the state to on", () => {
        binary.on("Update", (_device, status) => {
            expect(status.state).to.equal("On");
        });

        binary.update({} as any);
        binary.update({ SwitchedLevel: "On" } as any);
        binary.update({ SwitchedLevel: "On" } as any);
    });

    it("should update the state to off", () => {
        binary.on("Update", (_device, status) => {
            expect(status.state).to.equal("Off");
        });

        binary.update({} as any);
        binary.update({ SwitchedLevel: "Off" } as any);
        binary.update({ SwitchedLevel: "Off" } as any);
    });

    it("should call write when setting the state to on", (done) => {
        connection.write.resolves();

        binary
            .set({ state: "On" })
            .then(() => {
                expect(connection.write).to.be.called;
            })
            .finally(() => {
                done();
            });
    });

    it("should call write when setting the state to off", (done) => {
        connection.write.resolves();

        binary
            .set({ state: "Off" })
            .then(() => {
                expect(connection.write).to.be.called;
            })
            .finally(() => {
                done();
            });
    });

    it("should reject with the error from the connection", (done) => {
        connection.write.rejects("ERROR TEST");

        binary
            .set({ state: "Off" })
            .catch((error) => {
                expect(error).to.equal("ERROR TEST");
            })
            .finally(() => {
                done();
            });
    });
});
