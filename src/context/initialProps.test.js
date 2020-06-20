import initialProps from "./initialProps";
import random from "../random";

describe("initialProps()", () => {
    it("returns all the required props", () => {
        const props = initialProps();
        expect(props).toEqual({
            onVariantSelect: expect.any(Function),
            beforeVariantSelect: expect.any(Function),
            saveVariant: expect.any(Function),
            preset: null,
            random: {
                handler: random,
                lowest: 1e38,
                highest: 1e40,
            },
        });
    });
});
