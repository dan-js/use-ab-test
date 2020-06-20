import mapping from "./mapping";
import { PRESETS } from "../const";

describe("mapping", () => {
    it.each(Object.values(PRESETS))(
        "has handlers for every preset",
        (preset) => {
            expect(mapping[preset]).toHaveProperty(
                "saveVariant",
                expect.any(Function)
            );

            expect(mapping[preset]).toHaveProperty(
                "beforeVariantSelect",
                expect.any(Function)
            );
        }
    );
});
