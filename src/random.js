const VALID_CHARS = "0123456789";
const numberValidChars = VALID_CHARS.length;
let arr = new Uint8Array(40);

export const LOWEST_RANDOM_NUMBER = 1e38;
export const HIGHEST_RANDOM_NUMBER = 1e40;

// Get a cryptographically random number
export default () => {
    arr = window.crypto.getRandomValues(arr);

    return parseInt(
        arr.reduce(
            (prev, curr) => prev + VALID_CHARS[curr % numberValidChars],
            ""
        )
    );
};
