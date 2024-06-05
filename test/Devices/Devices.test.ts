import chai, { expect } from "chai";
import sinonChai from "sinon-chai";

import * as Devices from "../../src/Devices/Devices";

chai.use(sinonChai);

describe("index", () => {
    it("should define a Devices function", () => {
        expect(Devices.Dimmer).to.not.be.null;
        expect(Devices.Fan).to.not.be.null;
        expect(Devices.Humidity).to.not.be.null;
        expect(Devices.Occupancy).to.not.be.null;
        expect(Devices.Switch).to.not.be.null;
        expect(Devices.Temperature).to.not.be.null;
    });
});
