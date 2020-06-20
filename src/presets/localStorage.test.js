/* eslint-env node */
import fiftyFiftyVariant from "fx:fiftyFifty.js";
import { FIRST_MESSAGE, SECOND_MESSAGE } from "fx:messages.js";

import { PRESETS } from "../const";
import useABtest from "../hook/useABtest";

class LocalStorage {
    constructor(jest) {
        Object.defineProperty(this, "getItem", {
            value: jest.fn(),
        });

        Object.defineProperty(this, "setItem", {
            value: jest.fn(),
        });
    }
}

describe("localStorage preset", () => {
    beforeEach(() => {
        Object.defineProperty(window, "localStorage", {
            value: new LocalStorage(jest),
        });

        jest.clearAllMocks();
    });

    it("calls get and set in localStorage", () => {
        const experimentId = "localStorage-test-1";
        const { result } = global.renderWithContext(
            () => useABtest(experimentId, fiftyFiftyVariant),
            { preset: PRESETS.LOCAL_STORAGE }
        );

        const initialResult = result.current;
        const initialResultIndex = fiftyFiftyVariant.findIndex(
            (v) => v.value === initialResult
        );

        expect(localStorage.getItem).toBeCalledWith(`__ab_${experimentId}`);

        expect(localStorage.setItem).toBeCalledWith(
            `__ab_${experimentId}`,
            `${initialResultIndex}`
        );
    });

    it("returns the variant value at the index returned from localStorage", () => {
        const firstExpId = "localStorage-test-2";
        localStorage.getItem.mockReturnValueOnce("0");

        const { result: firstResult } = global.renderWithContext(
            () => useABtest(firstExpId, fiftyFiftyVariant),
            { preset: PRESETS.LOCAL_STORAGE }
        );

        expect(firstResult.current).toBe(FIRST_MESSAGE);

        const secondExpId = "localStorage-test-3";
        localStorage.getItem.mockReturnValueOnce("1");

        const { result: secondResult } = global.renderWithContext(
            () => useABtest(secondExpId, fiftyFiftyVariant),
            { preset: PRESETS.LOCAL_STORAGE }
        );

        expect(secondResult.current).toBe(SECOND_MESSAGE);
    });
});
