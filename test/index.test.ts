import chai, { expect } from "chai";
import sinonChai from "sinon-chai";

import { Devices, connect } from "../src";

chai.use(sinonChai);

describe("index", () => {
    it("should define a connect function", () => {
        expect(connect).to.not.be.null;
        expect(typeof connect).to.equal("function");
    });

    it("should define a Devices function", () => {
        expect(Devices.Common).to.not.be.null;
        expect(Devices.Dimmer).to.not.be.null;
        expect(Devices.Fan).to.not.be.null;
        expect(Devices.Humidity).to.not.be.null;
        expect(Devices.Occupancy).to.not.be.null;
        expect(Devices.Switch).to.not.be.null;
        expect(Devices.Temperature).to.not.be.null;
    });

    it("should return a location object when connect is called", () => {
        const location = connect().close();

        expect(location).to.not.be.null;
    });
});
