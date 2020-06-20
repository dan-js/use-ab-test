import createPreset from "./createPreset";

export default createPreset({
    set: (key, val) => localStorage.setItem(key, val),
    get: (key) => localStorage.getItem(key),
});
