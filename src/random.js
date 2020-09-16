export const LOWEST_RANDOM_NUMBER = 0;
export const HIGHEST_RANDOM_NUMBER = 1;

const randomBuffer = new Uint32Array(1);

// Get a cryptographically random number
const cryptoRandom = () => {
    window.crypto.getRandomValues(randomBuffer);
    return randomBuffer[0] / (0xffffffff + 1);
};

let randomFunc = cryptoRandom;

if (!randomFunc && typeof process === "undefined") {
    console.log(
        `[use-ab-test]: falling back to Math.random as window.crypto is unavailable
        
        to remove this message, change the default random implementation to Math.random:
        https://github.com/dan-js/use-ab-test#custom-random-implementation
        `
    );

    randomFunc = Math.random;
}

export default randomFunc;
