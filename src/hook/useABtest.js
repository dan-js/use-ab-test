import { useMemo } from "react";

import useExperimentContext from "./useExperimentContext";
import validateVariants from "../validateVariants";

export default (experimentId, variants) => {
    const {
        onVariantSelect,
        beforeVariantSelect,
        saveVariant,
        random,
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

            const startRange = previous?.fullPercentage ?? 0;
            const endRange = fullPercentage;

            return acc.concat({
                ...curr,
                startRange,
                endRange,
                fullPercentage,
            });
        }, []);

        // Get a random number with our handler and normalise so it's in a 0-100 range
        const rand =
            ((random.handler() - random.lowest) / random.highest -
                random.lowest) *
            100;

        const variantIndex = variantsWithRanges.findIndex(
            ({ startRange, endRange }, idx) =>
                (startRange < rand && endRange > rand) ||
                startRange === rand ||
                (idx === variantsWithRanges.length - 1 && endRange === rand)
        );

        let { value } = variantsWithRanges[variantIndex] ?? {};

        if (!value) {
            console.error(
                `[use-ab-test]: An error occurred selecting a random variant, please check your ExperimentProvider configuration.\nFalling back to first variant`
            );
            value = variantsWithRanges[0].value;
        }

        saveVariant &&
            saveVariant({ value, variantIndex, experimentId, variants });

        onVariantSelect &&
            onVariantSelect({ value, variantIndex, experimentId, variants });

        return value ?? null;
    }, [experimentId, variants]);
};
