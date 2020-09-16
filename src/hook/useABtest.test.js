/* eslint-env node */
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

const context = {
    // Easiest way to mock out the random module
    random: {
        handler: jest.fn(),
        lowest: 0,
        highest: 1,
    },
};

describe("useABtest()", () => {
    beforeEach(() => jest.clearAllMocks());

    it.each`
        randomValue | fiftyFifty        | twenties          | canary
        ${0}        | ${FIRST_MESSAGE}  | ${FIRST_MESSAGE}  | ${FIRST_MESSAGE}
        ${0.16}     | ${FIRST_MESSAGE}  | ${FIRST_MESSAGE}  | ${FIRST_MESSAGE}
        ${0.38}     | ${FIRST_MESSAGE}  | ${SECOND_MESSAGE} | ${FIRST_MESSAGE}
        ${0.49}     | ${FIRST_MESSAGE}  | ${THIRD_MESSAGE}  | ${FIRST_MESSAGE}
        ${0.5}      | ${SECOND_MESSAGE} | ${THIRD_MESSAGE}  | ${FIRST_MESSAGE}
        ${0.59}     | ${SECOND_MESSAGE} | ${THIRD_MESSAGE}  | ${FIRST_MESSAGE}
        ${0.78}     | ${SECOND_MESSAGE} | ${FOURTH_MESSAGE} | ${FIRST_MESSAGE}
        ${0.98}     | ${SECOND_MESSAGE} | ${FIFTH_MESSAGE}  | ${SECOND_MESSAGE}
        ${1}        | ${SECOND_MESSAGE} | ${FIFTH_MESSAGE}  | ${SECOND_MESSAGE}
    `(
        "gives $fiftyFifty, $twenties and $canary for the random value $randomValue",
        ({ randomValue, fiftyFifty, twenties, canary }) => {
            context.random.handler.mockReturnValue(randomValue);

            const { current: fiftyFiftyValue } = global.renderWithContext(
                () => useABtest("variant-test-1", fiftyFiftyVariants),
                context
            ).result;

            expect(fiftyFiftyValue).toBe(fiftyFifty);

            const { current: twentiesValue } = global.renderWithContext(
                () => useABtest("variant-test-2", twentiesVariants),
                context
            ).result;

            expect(twentiesValue).toBe(twenties);

            const { current: canaryValue } = global.renderWithContext(
                () => useABtest("variant-test-3", canaryVariant),
                context
            ).result;

            expect(canaryValue).toBe(canary);
        }
    );

    it("calls the onVariantSelect function if context is provided", () => {
        const experimentId = "callback-test-1";
        const onVariantSelect = jest.fn();

        const { rerender } = global.renderWithContext(
            () => useABtest(experimentId, fiftyFiftyVariants),
            { onVariantSelect, ...context }
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
        expect(context.random.handler).toBeCalledTimes(1);
    });

    it("tries to use the value from the context beforeVariantSelect function", () => {
        const experimentId = "before-test-1";
        const overrideVariant = "panda";
        const beforeVariantSelect = jest.fn(() => overrideVariant);

        const {
            result: { current },
        } = global.renderWithContext(
            () => useABtest(experimentId, fiftyFiftyVariants),
            { beforeVariantSelect, ...context }
        );

        expect(beforeVariantSelect).toBeCalledTimes(1);
        expect(context.random.handler).not.toBeCalled();
        expect(current).toBe(overrideVariant);
    });
});
