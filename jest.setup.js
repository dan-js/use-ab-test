/* eslint-env node */
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "regenerator-runtime";

import { renderHook } from "@testing-library/react-hooks";
import ExperimentProvider from "./src/context/ExperimentProvider";

window.crypto = {
    getRandomValues: () =>
        new Array(40).fill(null).map(() => Math.floor(Math.random() * 255)),
};

global.renderWithContext = (hook, { ...providerProps } = {}) => {
    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => (
        <ExperimentProvider {...providerProps}>{children}</ExperimentProvider>
    );

    return renderHook(hook, { wrapper });
};
