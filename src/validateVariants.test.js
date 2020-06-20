import validateVariants from "./validateVariants";

const invalidVariantsUnder = [
    {
        value: "hello",
        percentage: 10,
    },
    {
        value: "bonjour",
        percentage: 50,
    },
];

const invalidVariantsOver = [
    {
        value: "hello",
        percentage: 50,
    },
    {
        value: "bonjour",
        percentage: 55,
    },
];

const validVariants = [
    {
        value: "hello",
        percentage: 50,
    },
    {
        value: "hola",
        percentage: 50,
    },
];

describe("validateVariants()", () => {
    it("throws if variants do not add up to 100%", () => {
        expect(() =>
            validateVariants(invalidVariantsUnder)
        ).toThrowErrorMatchingSnapshot();
        expect(() =>
            validateVariants(invalidVariantsOver)
        ).toThrowErrorMatchingSnapshot();
    });

    it("returns true if variants do add up to 100%", () => {
        expect(validateVariants(validVariants)).toBe(true);
    });
});
