# ddd-asserter

DDD Asserter definition for dragee-cli project.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

To run tests:

```bash
bun test
```

To generate documentation

```bash
bun typedoc
```

# Known issues

## Setting up the project

In case you're running in an issue were `ddd-asserter` cannot resolve `@dragee-io/type` module, you would do the following:

**Start at the root of the project**

You'll need to clone `dragee-model` [repository](https://github.com/dragee-io/dragee-model)

```tree
dragee/ # Root of the project might be named differently
|-- ddd-asserter/
|-- dragee-model/
```


```bash
# Move into the `dragee-model` directory
cd dragee-model

# Create a link of the project
bun link

# Navigate to the `ddd-asserter` directory
cd ../ddd-asserter

# Link `dragee-model` to `ddd-asserter`
bun link @dragee-io/type
```