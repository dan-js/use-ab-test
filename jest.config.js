/* eslint-env node */
const { react } = require("@nuuji/config");

module.exports = {
    ...react.jest(),
    collectCoverageFrom: ["<rootDir>/src/**/*.js"],
    moduleNameMapper: {
        "fx:(.*)$": "<rootDir>/fixtures/$1",
    },
};
