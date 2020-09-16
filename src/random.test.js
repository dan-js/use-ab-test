// import random from "./random";

describe("random()", () => {
    it("cannot be tested here due to node / browser inconsistencies 💔", () => {});

    /* 
    Randomness test (copy paste this into random.js and 'yarn link' 
    the package to run this in browser)
        
    let errCounter = 0;
    let _0 = 0;
    let _1 = 0;
    let _2 = 0;
    let _3 = 0;
    let _4 = 0;
    let _5 = 0;
    let _6 = 0;
    let _7 = 0;
    let _8 = 0;
    let _9 = 0;
    for (let i = 0; i < 10000000; i++) {
        const r = random();
        if (r < LOWEST_RANDOM_NUMBER || r > HIGHEST_RANDOM_NUMBER) {
            console.log("NOOOOOO", { r, errCounter: errCounter++ });
        }

        if (r > 0.0) {
            _0++;
        }
        if (r > 0.1) {
            _1++;
        }
        if (r > 0.2) {
            _2++;
        }
        if (r > 0.3) {
            _3++;
        }
        if (r > 0.4) {
            _4++;
        }
        if (r > 0.5) {
            _5++;
        }
        if (r > 0.6) {
            _6++;
        }
        if (r > 0.7) {
            _7++;
        }
        if (r > 0.8) {
            _8++;
        }
        if (r > 0.9) {
            _9++;
        }
    }

    // These should have an even distribution

    // Expect a distribution something like this

    /* 
        {
            "_0": 10000000,
            "_1": 9001225,
            "_2": 8001257,
            "_3": 7001243,
            "_4": 6000991,
            "_5": 5000245,
            "_6": 3999662,
            "_7": 2999049,
            "_8": 1999089,
            "_9": 999548
        }
    *\/

    console.log({
        _0,
        _1,
        _2,
        _3,
        _4,
        _5,
        _6,
        _7,
        _8,
        _9,
    });
*/
});
