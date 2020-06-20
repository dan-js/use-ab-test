import localStoragePreset from "./localStorage";
import sessionStoragePreset from "./sessionStorage";

import { PRESETS } from "../const";

export default {
    [PRESETS.LOCAL_STORAGE]: localStoragePreset,
    [PRESETS.SESSION]: sessionStoragePreset,
};
