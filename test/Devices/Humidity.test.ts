import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Humidity } from "../../src/Devices/Humidity";

chai.use(sinonChai);

describe("Humidity", () => {
    let humidity: Humidity;
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

        humidity = new Humidity(connection, capabilities);
    });

    it("should define common properties", () => {
        expect(humidity.manufacturer).to.equal("Delta T, LLC");
        expect(humidity.id).to.equal("BAF-ID-HUMIDITY");
        expect(humidity.name).to.equal("NAME Humidity");
        expect(humidity.room).to.equal("Default");
        expect(humidity.address.href).to.equal("ID");
        expect(humidity.suffix).to.equal("Humidity");
        expect(humidity.type).to.equal("Humidity");
        expect(humidity.status.state).to.equal("Auto");
    });

    it("should define a logger for the device", () => {
        humidity.set({});

        expect(humidity.log).to.not.be.undefined;
        expect(humidity.log.info).to.not.be.undefined;
        expect(humidity.log.warn).to.not.be.undefined;
        expect(humidity.log.error).to.not.be.undefined;
    });

    it("should define a compliant area property", () => {
        expect(humidity.area.href).to.equal("ID");
        expect(humidity.area.ControlType).to.equal("Humidity");
        expect(humidity.area.Parent.href).to.equal("ID");
        expect(humidity.area.IsLeaf).to.equal(true);
        expect(humidity.area.AssociatedZones.length).to.equal(0);
        expect(humidity.area.AssociatedControlStations.length).to.equal(0);
        expect(humidity.area.AssociatedOccupancyGroups.length).to.equal(0);
    });

    it("should update the state", () => {
        humidity.on("Update", (_device, status) => {
            expect(status.humidity).to.equal(40);
        });

        humidity.update({ } as any);
        humidity.update({ Humidity: 40 } as any);
        humidity.update({ Humidity: 40 } as any);
    });
});
