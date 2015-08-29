# jQuery Sticky Header
The footer is positioned at the top of the page and it analyzes the page to know which elements have to be displayed
within it.

## Options
Please run the following script to initialize a sticky header with the default options:
```js
$('.header').stickyHeader();
```

### Requirements
Each element in the page that should be displayed in the sticky header has to have the following attribute:
```html
data-sticky-header="{
  position: 'L',
  html: '<a href="#test">This is a test</a>'
}"
```

- `position` could be one of the following values: 'L' for left, 'C' for center and 'R' for right.
- `html` is the representation of the related DOM element in the sticky header. If it's not defined, then the origin DOM
element will be totally reproduced in the sticky header.


## Installation
This project requires [node](https://nodejs.org/).

Please run following commands to install all dependencies:
```sh
$ npm install
$ ./node_modules/bower/bin/bower install
```

## Development
The project has the following structure:
```
dist/
	*.min.js // The minified and uglified version of the component.
src/
    *.js // The source file
tests/
    ... // Contains all tests and all needed file to set up a tests environment.
    *.test.js // All tests need to have the "test" suffix before the extension.
...
```

### Grunt Tasks
Here is a list of grunt `tasks` => `actions` mappings, see below for a deeper explanation of the actions.

|   *Grunt task*    | *jshint* | *uglify* | *cssmin* | *usebanner* | *devserver* | *watch* | *emptyTheChangelog* | *conventionalChangelog* | *changelogCommit* |
|-------------------|:--------:|:--------:|:--------:|:-----------:|:-----------:|:-------:|:-------------------:|:-----------------------:|:-----------------:|
|      grunt        |    *     |    *     |    *     |      *      |             |         |                     |                         |                   |
| grunt development |    *     |    *     |    *     |      *      |      *      |    *    |                     |                         |                   |
| grunt changelog   |          |          |          |             |             |         |          *          |           *             |         *         |

* *jshint*: Validate files with JSHint
* *uglify*: Create the final \*.min.js
* *cssmin*: Creates the final \*.min.css
* *usebanner*: Prepends a banner to the minified file
* *devserver*: Spawns a web server so you can rapidly test your app in action
* *watch*: Run default task when src or test files are added, changed or deleted
* *emptyTheChangelog*: Truncates the CHANGELOG.md file as conventionalChangelog task will append fully regenerated changelog
* *conventionalChangelog*: Appends Markdown-formatted changelog history to CHANGELOG.md
* *changelogCommit*: Prepares a new commit with updated CHANGELOG.md and commit message "CHANGELOG.md Updated"

## Tests
Take a look at [`test/README.md`](test/README.md) for more details.

## Contributing
Take a look at [`CONTRIBUTING.md`](CONTRIBUTING.md) for more details.

