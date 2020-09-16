/* eslint-env node */
let originalCrypto = window.crypto;

const setupWindowCrypto = () => {
    window.crypto = {
        getRandomValues(abv) {
            let l = abv.length;
            while (l) {
                l -= 1;
                // eslint-disable-next-line no-param-reassign
                abv[l] = Math.floor(Math.random() * 256);
            }
            return abv;
        },
    };
};

const teardownWindowCrypto = () => {
    window.crypto = originalCrypto;
};

exports.setupWindowCrypto = setupWindowCrypto;
exports.teardownWindowCrypto = teardownWindowCrypto;
