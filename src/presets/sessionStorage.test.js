/* eslint-env node */
import fiftyFiftyVariant from "fx:fiftyFifty.js";
import { FIRST_MESSAGE, SECOND_MESSAGE } from "fx:messages.js";

import { PRESETS } from "../const";
import useABtest from "../hook/useABtest";

class SessionStorage {
    constructor(jest) {
        Object.defineProperty(this, "getItem", {
            value: jest.fn(),
        });

        Object.defineProperty(this, "setItem", {
            value: jest.fn(),
        });
    }
}

describe("sessionStorage preset", () => {
    beforeEach(() => {
        Object.defineProperty(window, "sessionStorage", {
            value: new SessionStorage(jest),
        });

        jest.clearAllMocks();
    });

    it("calls get and set in sessionStorage", () => {
        const experimentId = "sessionStorage-test-1";
        const { result } = global.renderWithContext(
            () => useABtest(experimentId, fiftyFiftyVariant),
            { preset: PRESETS.SESSION }
        );

        const initialResult = result.current;
        const initialResultIndex = fiftyFiftyVariant.findIndex(
            (v) => v.value === initialResult
        );

        expect(sessionStorage.getItem).toBeCalledWith(`__ab_${experimentId}`);

        expect(sessionStorage.setItem).toBeCalledWith(
            `__ab_${experimentId}`,
            `${initialResultIndex}`
        );
    });

    it("returns the variant value at the index returned from sessionStorage", () => {
        const firstExpId = "sessionStorage-test-2";
        sessionStorage.getItem.mockReturnValueOnce("0");

        const { result: firstResult } = global.renderWithContext(
            () => useABtest(firstExpId, fiftyFiftyVariant),
            { preset: PRESETS.SESSION }
        );

        expect(firstResult.current).toBe(FIRST_MESSAGE);

        const secondExpId = "sessionStorage-test-3";
        sessionStorage.getItem.mockReturnValueOnce("1");

        const { result: secondResult } = global.renderWithContext(
            () => useABtest(secondExpId, fiftyFiftyVariant),
            { preset: PRESETS.SESSION }
        );

        expect(secondResult.current).toBe(SECOND_MESSAGE);
    });
});
