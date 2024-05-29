import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Occupancy } from "../../src/Devices/Occupancy";

chai.use(sinonChai);

describe("Occupancy", () => {
    let occupancy: Occupancy;
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

        occupancy = new Occupancy(connection, capabilities);
    });

    it("should define common properties", () => {
        expect(occupancy.manufacturer).to.equal("Delta T, LLC");
        expect(occupancy.id).to.equal("BAF-ID-OCCUPANCY");
        expect(occupancy.name).to.equal("NAME Occupancy");
        expect(occupancy.room).to.equal("Default");
        expect(occupancy.address.href).to.equal("ID");
        expect(occupancy.suffix).to.equal("Occupancy");
        expect(occupancy.type).to.equal("Occupancy");
        expect(occupancy.status.state).to.equal("Unknown");
    });

    it("should define a logger for the device", () => {
        occupancy.set({});

        expect(occupancy.log).to.not.be.undefined;
        expect(occupancy.log.info).to.not.be.undefined;
        expect(occupancy.log.warn).to.not.be.undefined;
        expect(occupancy.log.error).to.not.be.undefined;
    });

    it("should define a compliant area property", () => {
        expect(occupancy.area.href).to.equal("ID");
        expect(occupancy.area.ControlType).to.equal("Occupancy");
        expect(occupancy.area.Parent.href).to.equal("ID");
        expect(occupancy.area.IsLeaf).to.equal(true);
        expect(occupancy.area.AssociatedZones.length).to.equal(0);
        expect(occupancy.area.AssociatedControlStations.length).to.equal(0);
        expect(occupancy.area.AssociatedOccupancyGroups.length).to.equal(0);
    });

    it("should update the state to occupied", () => {
        occupancy.on("Update", (_device, status) => {
            expect(status.state).to.equal("Occupied");
        });

        occupancy.update({ } as any);
        occupancy.update({ OccupancyStatus: "Occupied" } as any);
        occupancy.update({ OccupancyStatus: "Occupied" } as any);
    });

    it("should update the state to unoccupied", () => {
        occupancy.on("Update", (_device, status) => {
            expect(status.state).to.equal("Occupied");
        });

        occupancy.update({ } as any);
        occupancy.update({ OccupancyStatus: "Unoccupied" } as any);
        occupancy.update({ OccupancyStatus: "Unoccupied" } as any);
    });
});
