/* eslint-env node */
import { renderHook } from "@testing-library/react-hooks";

import fiftyFiftyVariants from "fx:fiftyFifty.js";
import twentiesVariants from "fx:twenties.js";
import canaryVariant from "fx:canary.js";
import {
    FIRST_MESSAGE,
    SECOND_MESSAGE,
    THIRD_MESSAGE,
    FOURTH_MESSAGE,
    FIFTH_MESSAGE,
} from "fx:messages.js";

import useABtest from "./useABtest";
import * as rnd from "../random";

jest.mock("../random");

describe("useABtest()", () => {
    beforeEach(() => jest.clearAllMocks());

    it.each`
        randomValue | fiftyFifty        | twenties          | canary
        ${1e39}     | ${FIRST_MESSAGE}  | ${FIRST_MESSAGE}  | ${FIRST_MESSAGE}
        ${16e38}    | ${FIRST_MESSAGE}  | ${FIRST_MESSAGE}  | ${FIRST_MESSAGE}
        ${38e38}    | ${FIRST_MESSAGE}  | ${SECOND_MESSAGE} | ${FIRST_MESSAGE}
        ${49e38}    | ${FIRST_MESSAGE}  | ${THIRD_MESSAGE}  | ${FIRST_MESSAGE}
        ${5e39}     | ${SECOND_MESSAGE} | ${THIRD_MESSAGE}  | ${FIRST_MESSAGE}
        ${59e38}    | ${SECOND_MESSAGE} | ${THIRD_MESSAGE}  | ${FIRST_MESSAGE}
        ${78e38}    | ${SECOND_MESSAGE} | ${FOURTH_MESSAGE} | ${FIRST_MESSAGE}
        ${98e38}    | ${SECOND_MESSAGE} | ${FIFTH_MESSAGE}  | ${SECOND_MESSAGE}
        ${1e40}     | ${SECOND_MESSAGE} | ${FIFTH_MESSAGE}  | ${SECOND_MESSAGE}
    `(
        "gives the variant $variant for the random value $randomValue",
        ({ randomValue, fiftyFifty, twenties, canary }) => {
            rnd.default.mockReturnValue(randomValue);

            const { current: fiftyFiftyValue } = renderHook(() =>
                useABtest("variant-test-1", fiftyFiftyVariants)
            ).result;

            expect(fiftyFiftyValue).toBe(fiftyFifty);

            const { current: twentiesValue } = renderHook(() =>
                useABtest("variant-test-2", twentiesVariants)
            ).result;

            expect(twentiesValue).toBe(twenties);

            const { current: canaryValue } = renderHook(() =>
                useABtest("variant-test-3", canaryVariant)
            ).result;

            expect(canaryValue).toBe(canary);
        }
    );

    it("calls the onVariantSelect function if context is provided", () => {
        const experimentId = "callback-test-1";
        const onVariantSelect = jest.fn();

        const { rerender } = global.renderWithContext(
            () => useABtest(experimentId, fiftyFiftyVariants),
            { onVariantSelect }
        );

        expect(onVariantSelect).toBeCalledTimes(1);
        expect(onVariantSelect).toBeCalledWith({
            value: expect.any(String),
            variantIndex: expect.any(Number),
            variants: fiftyFiftyVariants,
            experimentId,
        });

        rerender();

        expect(onVariantSelect).toBeCalledTimes(1);

        // Even updating the context shouldn't recalculate the test
        const secondOnVariantSelect = jest.fn();

        rerender({ onVariantSelect: secondOnVariantSelect });

        expect(onVariantSelect).toBeCalledTimes(1);
        expect(secondOnVariantSelect).not.toBeCalled();
        expect(rnd.default).toBeCalledTimes(1);
    });

    it("tries to use the value from the context beforeVariantSelect function", () => {
        const experimentId = "before-test-1";
        const overrideVariant = "panda";
        const beforeVariantSelect = jest.fn(() => overrideVariant);

        const {
            result: { current },
        } = global.renderWithContext(
            () => useABtest(experimentId, fiftyFiftyVariants),
            { beforeVariantSelect }
        );

        expect(beforeVariantSelect).toBeCalledTimes(1);
        expect(rnd.default).not.toBeCalled();
        expect(current).toBe(overrideVariant);
    });
});
