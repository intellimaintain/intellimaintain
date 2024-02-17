# Overview

This is about the tenth time I have cut and pasted the same thing.

It's time to make a module that can do this for me!

# Config file

Most CLIs have some config. Not all but some. This might be
* Stored in '~/.xxx.json'
* Stored in the current directory
* Stored in a parent directory
* Stored in a directory xx hanging off a parent directory
* etc...
So many options so we abstract it

## Observations
* We need the config before we build the cli because often we use it in the construction of the cli.
* Often the config needs validating and errors reporting.
* We will probably need commands to look at the config and validate it for every CLI we build.
* We need to build the config... we might add things that aren't serializable to it: this is our dependency injection too

# Building the CLI

* We always need --version. It's hard to do that here so pass it in...
* We need the config before we build the cli
* We need to be able to add config commands to the cli (but not do it automatically)

# finding your version

In your main file. Because of the use of require it's hard to do this in a library.
```typescript
export function findVersion () {
  let packageJsonFileName = "../package.json";
  try {
    return require ( packageJsonFileName ).version
  } catch ( e ) {
    return "version not known"
  }
}

```


