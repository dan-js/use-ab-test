/* eslint-env node */

const { FIRST_MESSAGE, SECOND_MESSAGE } = require("./messages");

module.exports = [
    {
        value: FIRST_MESSAGE,
        percentage: 90,
    },
    {
        value: SECOND_MESSAGE,
        percentage: 10,
    },
];
