![badge-branches.svg](./badges/badge-branches.svg)
![badge-functions.svg](./badges/badge-functions.svg)
![badge-lines.svg](./badges/badge-lines.svg)
![badge-statements.svg](./badges/badge-statements.svg)

# 🧪 `use-ab-test` - Unopinionated, framework-agnostic A/B and Canary testing with React Hooks

[A/B testing](https://en.wikipedia.org/wiki/A/B_testing) and [Canary releases](https://en.wikipedia.org/wiki/Feature_toggle#Canary_release) are quickly becoming more and more popular. This package attempts to simplify these processes in React by providing suitably random variant selection, simple presets for memorising selected variants for users, and easy customisation for integrating with whatever analytics software you choose to use.

The implementation is very lightweight coming in at just **2.17kb** gzipped with no dependencies, and performance is strong enough to run many experiments on a single page if desired.

## Installation

```
yarn add use-ab-test
```

## Example Usage

Variants are configured as an array of objects with `percentage` properties adding up to `100`.

`value` properties are returned from the hook, and they don't need to be serialised so you can use a **component**, **callback** or anything else you can imagine 💫

```jsx
import useABtest, { ExperimentProvider, PRESETS } from 'use-ab-test';

const variants = [
    {
        value: 'Normal Message',
        percentage: 50
    },
    {
        value: 'New Awesome Message!',
        percentage: 50
    }
];

const Message = () => {
    // Message text has a 50/50 chance of being either
    // 'Normal Message' or 'New Awesome Message!'
    const messageText = useABtest('message-test', variants);

    return <div>{messageText}</div>
};

const App = () => {
    const onVariantSelect = ({ value, variantIndex, experimentId, variants }) => 
        console.log(`Selected ${value} at index ${variantIndex} for ${experimentId}`);

    return (
        // Using the `LOCAL_STORAGE` preset means this user's message variant
        // will be saved indefinitely and won't change on reload / rerender
        <ExperimentProvider preset={PRESETS.LOCAL_STORAGE} onVariantSelect={onVariantSelect}>
            <Message />
        </ExperimentProvider>
    );
};
```

### Saving selected segments

In this example, we use a selector to get the `user.id` from Redux, and reference it when saving the selected value so we can analyse how this user reacted to their selected variant. This can most easily be achieved by creating a wrapper for `ExperimentProvider` so it can consume the value from the Redux context.

```jsx
import { useSelector } from 'react-redux';
import useABtest, { ExperimentProvider, PRESETS } from 'use-ab-test';

const LoggingExperimentProvider = ({ children }) => {
    const userId = useSelector(state => state.user.id);

    const onVariantSelect = ({ value, variantIndex, experimentId }) => {
        post(`/api/${userId}/log`, {
            value, 
            variantIndex, 
            experimentId
        }).then(() => console.log('Finished saving!'));
    };

    return (
        <ExperimentProvider preset={PRESETS.LOCAL_STORAGE} onVariantSelect={onVariantSelect}>
            {children}
        </ExperimentProvider>
    );
}

const App = () => (
    <LoggingExperimentProvider>
        <Message />
    </LoggingExperimentProvider>
);
```

### Presets

| Preset Name     | Description                                                                                                                                                                        |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `LOCAL_STORAGE` | Store selected segments in `window.localStorage`. This won't expire until explicitly cleared.                                                                                      |
| `SESSION`       | Store selected segments in `window.sessionStorage`. This will expire at the end of the session (behaviour varies by browser so you should **almost always** prefer `LOCAL_STORAGE`, or a [Custom Preset](#Custom-Presets)). |

## Testing

You may come across errors when testing due to `window.crypto` being undefined. The package provides a set of `/test-utils` exports to help with this.

```jsx
import { setupWindowCrypto, teardownWindowCrypto } from 'use-ab-test/test-utils';

describe('some component', () => {
    beforeEach(() => setupWindowCrypto());

    afterEach(() => teardownWindowCrypto());
});
```


## Advanced Usage

### Custom Presets

`use-ab-test` exports a `createPreset` method for easily plugging in your preferred method of storage. The keys and values you need to store are provided to the supplied callbacks.

Here's an example with [universal-cookie](https://github.com/reactivestack/cookies/tree/master/packages/universal-cookie) 

```jsx
import { ExperimentProvider, createPreset } from "use-ab-test";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const cookieStorage = createPreset({
    set: (key, val) => cookies.set(key, val, { path: '/' }),
    get: (key) => cookies.get(key),
});

const App = ({ children }) => (
    <ExperimentProvider preset={cookieStorage}>
        {children}
    </ExperimentProvider>
);
```

### Custom random implementation

The default random implementation uses `window.crypto.getRandomValues()` and is random enough for all standard usage, but providing a new implementation for random is simple! Here's an example using `Math.random()` instead.

```jsx
const App = ({ children }) => (
    <ExperimentProvider 
        preset={PRESETS.LOCAL_STORAGE}
        random={{
            // Function to call to get random value
            handler: Math.random,
            // Lowest possible number returned from the function
            lowest: 0,
            // Highest possible number returned from the function
            highest: 1,
        }}
    >
        {children}
    </ExperimentProvider>
);
```

### Custom keys / values

By default when using any preset, the keys and values placed in storage are handled by the package. If you want to override this behaviour, you can create a preset object manually instead of using the `createPreset` helper function.

```jsx
const customPreset = {
    // Save the selected variant
    saveVariant: ({ value, variantIndex, experimentId, variants }) => {
        saveVariantSomehow(experimentId, variantIndex);
    },
    // Return selected variant, or `null` to make the selection again
    beforeVariantSelect: ({ value, variantIndex, experimentId, variants }) => {
        const selectedVariant = checkForSavedVariant(experimentId);

        return selectedVariant ?? null;
    },
};

const Wrapper = ({ children }) => (
    <ExperimentProvider preset={customPreset}>
        {children}
    </ExperimentProvider>
)
```
