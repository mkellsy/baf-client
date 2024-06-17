import { proxy, registerNode } from "proxyrequire";

import chai, { expect } from "chai";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

describe("index", () => {
    let Baf: any;

    before(() => {
        Baf = proxy(() => require("../src"), {
            "./Location": {
                Location: class {},
            },
        });
    });

    it("should define a connect function", () => {
        expect(Baf.connect).to.not.be.null;
        expect(typeof Baf.connect).to.equal("function");
    });

    it("should define a Devices function", () => {
        expect(Baf.Dimmer).to.not.be.null;
        expect(Baf.Fan).to.not.be.null;
        expect(Baf.Humidity).to.not.be.null;
        expect(Baf.Occupancy).to.not.be.null;
        expect(Baf.Switch).to.not.be.null;
        expect(Baf.Temperature).to.not.be.null;
    });

    it("should return a location object when connect is called", () => {
        const location = Baf.connect();

        expect(location).to.not.be.null;
    });
});
