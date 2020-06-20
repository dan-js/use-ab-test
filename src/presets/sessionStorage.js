import createPreset from "./createPreset";

export default createPreset({
    set: (key, val) => sessionStorage.setItem(key, val),
    get: (key) => sessionStorage.getItem(key),
});
