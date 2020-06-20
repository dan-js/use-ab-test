import { STORAGE_KEY_PREFIX } from "../const";

export default ({ set, get }) => ({
    saveVariant: ({ variantIndex, experimentId }) => {
        set(`${STORAGE_KEY_PREFIX}${experimentId}`, `${variantIndex}`);
    },
    beforeVariantSelect: ({ experimentId, variants }) => {
        const variantIndex = get(`${STORAGE_KEY_PREFIX}${experimentId}`);

        if (variantIndex === null) {
            return;
        }

        return variants[parseInt(variantIndex)]?.value;
    },
});
