import { useMemo } from "react";

import useExperimentContext from "./useExperimentContext";
import random, { LOWEST_RANDOM_NUMBER } from "../random";
import validateVariants from "../validateVariants";

export default (experimentId, variants) => {
    const {
        onVariantSelect,
        beforeVariantSelect,
        saveVariant,
    } = useExperimentContext();

    return useMemo(() => {
        validateVariants(variants);

        const overrideVariant = beforeVariantSelect({ experimentId, variants });

        if (
            typeof overrideVariant !== "undefined" &&
            overrideVariant !== null
        ) {
            return overrideVariant;
        }

        const variantsWithRanges = variants.reduce((acc, curr, idx) => {
            const previous = acc[idx - 1];

            const fullPercentage =
                curr.percentage + (previous?.fullPercentage ?? 0);

            const startRange =
                (previous?.fullPercentage ?? 1) * LOWEST_RANDOM_NUMBER;
            const endRange = fullPercentage * LOWEST_RANDOM_NUMBER;

            return acc.concat({
                ...curr,
                startRange,
                endRange,
                fullPercentage,
            });
        }, []);

        const rand = random();

        const variantIndex = variantsWithRanges.findIndex(
            ({ startRange, endRange }, idx) =>
                (startRange < rand && endRange > rand) ||
                startRange === rand ||
                (idx === variantsWithRanges.length - 1 && endRange === rand)
        );

        const { value } = variantsWithRanges[variantIndex];

        saveVariant &&
            saveVariant({ value, variantIndex, experimentId, variants });

        onVariantSelect &&
            onVariantSelect({ value, variantIndex, experimentId, variants });

        return value ?? null;
    }, [experimentId, variants]);
};
