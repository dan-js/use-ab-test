import random, { LOWEST_RANDOM_NUMBER, HIGHEST_RANDOM_NUMBER } from "../random";

export default () => ({
    onVariantSelect: () => {},
    beforeVariantSelect: () => {},
    saveVariant: () => {},
    preset: null,
    random: {
        handler: random,
        lowest: LOWEST_RANDOM_NUMBER,
        highest: HIGHEST_RANDOM_NUMBER,
    },
});
