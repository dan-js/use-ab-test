import React from "react";
import pt from "prop-types";

import ExperimentContext from "./ExperimentContext";
import { PRESETS } from "../const";
import PRESET_MAPPING from "../presets/mapping";

const ExperimentProvider = ({
    children,
    onVariantSelect,
    beforeVariantSelect,
    saveVariant,
    preset,
}) => {
    if (PRESET_MAPPING[preset]) {
        return (
            <ExperimentContext.Provider
                value={{ ...PRESET_MAPPING[preset], onVariantSelect }}
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
};

ExperimentProvider.defaultProps = {
    onVariantSelect: () => {},
    beforeVariantSelect: () => {},
    saveVariant: () => {},
    preset: null,
};

export default ExperimentProvider;
