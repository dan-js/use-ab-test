import React from "react";
import pt from "prop-types";

import ExperimentContext from "./ExperimentContext";
import { PRESETS } from "../const";
import initialProps from "./initialProps";
import PRESET_MAPPING from "../presets/mapping";

const ExperimentProvider = ({
    children,
    onVariantSelect,
    beforeVariantSelect,
    saveVariant,
    preset,
    random,
}) => {
    if (PRESET_MAPPING[preset]) {
        return (
            <ExperimentContext.Provider
                value={{ ...PRESET_MAPPING[preset], onVariantSelect, random }}
            >
                {children}
            </ExperimentContext.Provider>
        );
    }

    return (
        <ExperimentContext.Provider
            value={{
                onVariantSelect,
                beforeVariantSelect,
                saveVariant,
                random,
                ...(preset && { ...preset }),
            }}
        >
            {children}
        </ExperimentContext.Provider>
    );
};

ExperimentProvider.propTypes = {
    children: pt.node.isRequired,
    onVariantSelect: pt.func,
    beforeVariantSelect: pt.func,
    saveVariant: pt.func,
    preset: pt.oneOfType([
        pt.oneOf(Object.values(PRESETS)),
        pt.shape({
            saveVariant: pt.func.isRequired,
            beforeVariantSelect: pt.func.isRequired,
        }),
    ]),
    random: pt.shape({
        handler: pt.func.isRequired,
        lowest: pt.number.isRequired,
        highest: pt.number.isRequired,
    }).isRequired,
};

ExperimentProvider.defaultProps = initialProps();

export default ExperimentProvider;
