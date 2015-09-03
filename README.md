[![Build Status](https://travis-ci.org/the-software-factory/jquery-sticky-header.svg?branch=master)](https://travis-ci.org/the-software-factory/jquery-sticky-header)

# jQuery Sticky Header
The header is positioned at the top of the page and it analyzes the page to know which elements have to be displayed
within it. As you scroll down, the elements marked with [data-sticky-header-item] attribute become invisible (because they go out of the viewport). When it happens, the jQUery Sticky Header plugin inserts the item that was just hidden in the header. The plugin performs the deep object cloning so when its clone is inserted into header it still has all the event listeners attached. If the hidden item has a custom html element specified in its options then that custom element is inserted into header instead of the item itself.
The header is devided in 3 sections, called 'slots'. You can specify the target slot where your item must go once it becomes invisible. In no slot specified, the item will be added to the first (left) one.
As you scroll up, some items that were hidden become visible again; at that point the jQuery Sticky Header plugin removes their clones o relative custom html elements from the header.
The Sticky Header is visible only when it has at least one element in it.

## Installation
You'll need [bower](http://bower.io/) to install jQuery Sticky Header plugin and its dependencies.
Install the plugin and save it as a dependency in your project:
```sh
$ bower --save install jquery-sticky-header
```

## Usage
To use the jQuery Sticky Header plugin you first need to include jQuery, jQuery Sticky Header code and stylesheet from the /dist folder to you project.
Then you can initialize the jQuery Sticky Header plugin in two ways:

* On an empty DOM element, like `<header></header>`. NOTE: if such an element has some other elements in it not marked with the `data-sticky-header-container` attribute, they all will be eliminated in the plugin's initialization phase.
```js
$('header').stickyHeader();
```

* On an element with container inside marked with the `data-sticky-header-container` attribute, like:
```html
<header>
  <div data-sticky-header-container></div>
</header>
```
Using the extra container will give you more styling flexibility. You still need to initialize the plugin on the root `<header></header>` element.
```js
$('header').stickyHeader();
```

During the plugin initialization phase the `data-sticky-header` attribute is added to the root header containe and 3 slots (child divs) are injected into container.
In the first case it becomes
```html
<header data-sticky-header>
  <div></div>
  <div></div>
  <div></div>
</header>
```

### Requirements
Each element in the page that should be displayed in the sticky header has to have the `data-sticky-header-item` attribute defined with item options in the JSON format:
```html
data-sticky-header-item="{
  "position": "L",
  "html": "<a href="#test">This is a test</a>"
}"
```

- `position` could be one of the following values: 'L' for left, 'C' for center and 'R' for right. It tells the plugin in which slot to place the element. If no position is specified then the default 'L' value will be used.
- `html` is the representation of the related DOM element in the sticky header. If it's not defined, then the origin DOM element will be totally reproduced in the sticky header.

If you want to use the default Left slot and don't want to provide custom HMTL, you must still supply an empty JSON configuration object:
```html
data-sticky-header-item="{}"
```
otherwise the JSON parsing error will be triggered.

### Options
You can customize the data attributes that jQuery Sticky Header uses to track items in the page and in the header by passing it a configuration object, like this:
```js
$('header').stickyHeader(config);
```
The available options are:

* headerAttribute
    + Type: `String`
    + Default: `data-sticky-header`
    + Description: This attribute will be assigned to the element on which the plugin was initialized

* headerContainerAttribute
    + Type: `String`
    + Default: `data-sticky-header-container`
    + Description: If you want to add an extra container to the root header container, mark it with this attribute

* itemAttribute
    + Type: `String`
    + Default: `data-sticky-header-item`
    + Description: Every item on you page that you want to place into the Sticky Header must be marked with this attribute

* itemRemovedAttribute
    + Type: `String`
    + Default: `data-sticky-header-item-removed`
    + Description: Items removed from the DOM are marked with this attribute

* itemIdAttribute
    + Type: `String`
    + Default: `data-sticky-header-item-id`
    + Description: Every item marked with [itemAttribute] and its eventual in-header counterpart will be assigned an incremental ID through this attribute

#### Example usage with custom options:
```js
$('header').stickyHeader({
  headerAttribute: "data-dynamic-header",
  itemIdAttribute: "data-dynamic-header-item-id"
});
```

## Development
The project has the following structure:
```
dist/
    *.min.js // The uglified version of the component.
    *.min.css // The minified version of the component's stylesheet
src/
    *.js  // The source files
    *.css // Stylesheets
test/
    src/*.test.js // Tests
    ...           // Test runner configuration file and test dependencies
...
```

### Installation
This project requires [node](https://nodejs.org/).

Please run following commands to install all project's dependencies so you can build it and test it:
```sh
$ npm install
$ ./node_modules/bower/bin/bower install
$ cd test && npm install
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
