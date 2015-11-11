# jQuery Sticky Header Tests
Defines how to set up an environment to test the project.

## Tests Suite Structure
The directories structure within the `tests` folder reflects what is inside the `src` folder:

    src
    \---->[folder-name]
    \-------->[file-name].js
    test
    \---->src/
    \-------->[folder-name]
    \------------>[file-name].test.js

## Installation
The environment requires `npm`, install it from here if needed ([Guide for Installing Node](https://nodejs.org/)).

### Install all dependencies
To install all modules you just need to follow these steps:
- Run `npm install` in the project's root folder

For example:
```sh
$ npm install
```

## Running tests
Follow these steps to run the tests suite:
- Run `grunt test`

For example:
```sh
$ cd test
$ ./node_modules/grunt-cli/bin/grunt test
```
