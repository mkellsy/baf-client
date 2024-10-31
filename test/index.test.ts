import { proxy } from "proxyrequire";

import chai, { expect } from "chai";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

describe("index", () => {
    let Baf: any;

    before(() => {
        Baf = proxy(() => require("../src"), {
            "./Client": {
                Client: class {},
            },
        });
    });

    it("should define a connect function", () => {
        expect(Baf.connect).to.not.be.null;
        expect(typeof Baf.connect).to.equal("function");
    });

    it("should export the API", () => {
        expect(Baf.Client).to.not.be.null;
        expect(Baf.Common).to.not.be.null;
        expect(Baf.Connection).to.not.be.null;
        expect(Baf.DeviceType).to.not.be.null;
        expect(Baf.Dimmer).to.not.be.null;
        expect(Baf.Fan).to.not.be.null;
        expect(Baf.Humidity).to.not.be.null;
        expect(Baf.Occupancy).to.not.be.null;
        expect(Baf.Switch).to.not.be.null;
        expect(Baf.Temperature).to.not.be.null;
    });

    it("should return a client object when connect is called", () => {
        const client = Baf.connect();

        expect(client).to.not.be.null;
    });
});
