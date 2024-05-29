import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Temperature } from "../../src/Devices/Temperature";

chai.use(sinonChai);

describe("Temperature", () => {
    let temperature: Temperature;
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

        temperature = new Temperature(connection, capabilities);
    });

    it("should define common properties", () => {
        expect(temperature.manufacturer).to.equal("Delta T, LLC");
        expect(temperature.id).to.equal("BAF-ID-TEMPERATURE");
        expect(temperature.name).to.equal("NAME Temperature");
        expect(temperature.room).to.equal("Default");
        expect(temperature.address.href).to.equal("ID");
        expect(temperature.suffix).to.equal("Temperature");
        expect(temperature.type).to.equal("Temperature");
        expect(temperature.status.state).to.equal("Auto");
    });

    it("should define a logger for the device", () => {
        temperature.set();

        expect(temperature.log).to.not.be.undefined;
        expect(temperature.log.info).to.not.be.undefined;
        expect(temperature.log.warn).to.not.be.undefined;
        expect(temperature.log.error).to.not.be.undefined;
    });

    it("should define a compliant area property", () => {
        expect(temperature.area.href).to.equal("ID");
        expect(temperature.area.ControlType).to.equal("Temperature");
        expect(temperature.area.Parent.href).to.equal("ID");
        expect(temperature.area.IsLeaf).to.equal(true);
        expect(temperature.area.AssociatedZones.length).to.equal(0);
        expect(temperature.area.AssociatedControlStations.length).to.equal(0);
        expect(temperature.area.AssociatedOccupancyGroups.length).to.equal(0);
    });

    it("should update the state", () => {
        temperature.on("Update", (_device, status) => {
            expect(status.temprature).to.equal(20);
        });

        temperature.update({} as any);
        temperature.update({ Temperature: 20 } as any);
        temperature.update({ Temperature: 20 } as any);
    });
});
