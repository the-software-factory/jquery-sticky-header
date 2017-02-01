<a name="0.11.0"></a>
# [0.11.0](//compare/0.11.0...v0.11.0) (2017-02-01)




<a name="0.11.0"></a>
# [0.11.0](//compare/0.8.0...0.11.0) (2017-02-01 11:54:12 +0100)


### Bug Fixes

* Test config file renamed, 'stickyHeader.onElementAdd' event test fixed [d43d2d2](https://github.com/the-software-factory/jquery-sticky-header/commit/d43d2d2eb6795765f51197ff1e1a0458e126b3ee) 
* Use attribute name supplied in options instead of the hardcoded one [3513e63](https://github.com/the-software-factory/jquery-sticky-header/commit/3513e63f6f9a3d112c654350c3395565fd57b769) 

### Features

* Added not minified version into the dist folder [c7f8dd6](https://github.com/the-software-factory/jquery-sticky-header/commit/c7f8dd6d36f914abb5363692c6748cf70db82ea8) 
* Display levels management added to the header slots [21cf7fe](https://github.com/the-software-factory/jquery-sticky-header/commit/21cf7fe30defae7521368a614a4621d5d6039739) 
* Emit an event when a new item is added to header + relative test [b803f81](https://github.com/the-software-factory/jquery-sticky-header/commit/b803f818527f4bf48247104e52a8736f9c9903f5) 
* Unit tests added for the Display Level Manager and updated for the Container and Item [57061fb](https://github.com/the-software-factory/jquery-sticky-header/commit/57061fbda2cdab44a596af81f5236d081204a16b) 



<a name="0.8.0"></a>
# [0.8.0](//compare/0.6.0...0.8.0) (2015-09-25 16:16:34 +0200)


### Bug Fixes

* Changelog hashes are now clickable links to respective GitHub pages [ed82099](https://github.com/the-software-factory/jquery-sticky-header/commit/ed82099eaff385f0c955b2e0f193d3a2ac3ce623) 
* Sticky header jump bug fixed, header slots' content alignment fixed [60154de](https://github.com/the-software-factory/jquery-sticky-header/commit/60154de6ef727b5af65044898452dad289329955) 
* Tests updated, Minor code fixes [d42f9ee](https://github.com/the-software-factory/jquery-sticky-header/commit/d42f9eefccefebda210f43e5899f7e6e9023bddb) 
* Vertically centered items [1c42373](https://github.com/the-software-factory/jquery-sticky-header/commit/1c423732b27063f26d9f4f4127e5ed57f3445986) 

### Features

* Container code improved, Elements are considered hidden when they reach their in-header height, Tests updated, Comments added, Gruntfile updated [f96d7d2](https://github.com/the-software-factory/jquery-sticky-header/commit/f96d7d21c8d4978216db4e1193a172354152ab82) 
* Dynamic slot insertion added, Header container is now flex container, CSS rules updated, README updated [cbfdac7](https://github.com/the-software-factory/jquery-sticky-header/commit/cbfdac7b81046446edcda8f02f1dc46071e9ba3c) 
* Released version 0.7.0 [99cd1af](https://github.com/the-software-factory/jquery-sticky-header/commit/99cd1af8edeaac631246fb656cca8994a5e61afe) 
* Tests updated, Code adjustments [0565a68](https://github.com/the-software-factory/jquery-sticky-header/commit/0565a6808f493278210e93e7fae544415ec847f5) 



<a name="0.6.0"></a>
# [0.6.0](//compare/0.4.0...0.6.0) (2015-09-04 10:25:18 +0200)


### Bug Fixes

* itemAttribtue removal before insertion fixed, Observer target selector optimized [8a0c322](https://github.com/the-software-factory/jquery-sticky-header/commit/8a0c32299413e0755da320d8b5830f3d7761383c) 
* Plugin won't work without the [data-sticky-header-container] element inside the root container bug fixed, README updated, bower.json updated [57079ba](https://github.com/the-software-factory/jquery-sticky-header/commit/57079bac0311689d83f42ea97e91c4b6a775e83e) 

### Features

* Custom options implemented, Selectors made parametric, Stylesheet updated, README updated [49f1369](https://github.com/the-software-factory/jquery-sticky-header/commit/49f136982b6df410d9f68aa1849c5337dead7ae8) 
* Element addition to header point changed, Grunt banner options corrected, Remove header elements on hash change added [ea75719](https://github.com/the-software-factory/jquery-sticky-header/commit/ea75719b241f25f36527200d24cb3d5ae9518e98) 
* Released version 0.6.0 [6046f78](https://github.com/the-software-factory/jquery-sticky-header/commit/6046f78ca2bafd0d16ec34b2f9cec0ddbaf3d9fb) 
* Version 0.5.0 released [4e37807](https://github.com/the-software-factory/jquery-sticky-header/commit/4e37807153d28705959f8bd8b3b3c4f70a52115d) 



<a name="0.4.0"></a>
# [0.4.0](//compare/0.3.0...0.4.0) (2015-09-02 10:43:18 +0200)


### Features

* TravisCI badge added [cc507a9](https://github.com/the-software-factory/jquery-sticky-header/commit/cc507a9181a2586c9e61fb16dcd1e81cae3dcf02) 
* TravisCI configuration file added [00d9260](https://github.com/the-software-factory/jquery-sticky-header/commit/00d9260ebdff59c7ea9245b38c95eb5269730d04) 
* Version 0.4.0 released, Tests updated, Deep object cloning added, Headers updated, Example page updated [a602e00](https://github.com/the-software-factory/jquery-sticky-header/commit/a602e006d99605dacc45633a538b601708585b08) 



<a name="0.3.0"></a>
# [0.3.0](//compare/0.2.0...0.3.0) (2015-09-01 17:28:09 +0200)


### Bug Fixes

* When an item is removed from the page then it should be removed also from the sticky header [54436ec](https://github.com/the-software-factory/jquery-sticky-header/commit/54436ec89db49d97dc32b4c293bd305c97830677) 



<a name="0.2.0"></a>
# [0.2.0](//compare/0.1.0...0.2.0) (2015-09-01 14:39:50 +0200)


### Features

* Added data-sticky-header-container attribute to not override sticky-header content. [e14e590](https://github.com/the-software-factory/jquery-sticky-header/commit/e14e590c4c977a5d233825ed1b138cd47747946d) 



<a name="0.1.0"></a>
# 0.1.0 (2015-09-01 10:52:50 +0200)


### Features

* Added todo for the next developer [5f64543](https://github.com/the-software-factory/jquery-sticky-header/commit/5f64543fae4a97966a453442c6034a19a93fca13) 
* Example page updated, clone sticky object if no custom html implemented, header animation introduced [a84caa5](https://github.com/the-software-factory/jquery-sticky-header/commit/a84caa52d0dd06c9cf4e407390a96a8fb527fb82) 
* Migrated js code to a jquery plugin [29eaae3](https://github.com/the-software-factory/jquery-sticky-header/commit/29eaae3bd3ecdfc6d90a1dba684c1f5607a0aa67) 
* Test environment set up. Refactored plugin. [1d4141a](https://github.com/the-software-factory/jquery-sticky-header/commit/1d4141aae80ba95f3ce89a582d2a2e30cab681cd) 
* Tests added, code adjusted, CSS minification added [005c1a4](https://github.com/the-software-factory/jquery-sticky-header/commit/005c1a4475c3f7280b15c080dbbbbf81e65cc92c) 



