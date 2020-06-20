export default (variants) =>
    variants.reduce((acc, variant) => acc + variant.percentage, 0) === 100
        ? true
        : (() => {
              throw new Error(
                  "Variant percentages should always add up to 100%"
              );
          })();
