/**
 * @param {Object} $ The jQuery library
 */
(function($) {

  /**
   * Defines a jQuery object method called stickyHeader to enable the parse of all DOM items to put within it when
   * they are not longer visible.
   *
   * @return {selector}
   */
  $.fn.stickyHeader = function(options) {

    /**
     * Extends default options with those provided.
     *
     * @type {Object}
     * @private
     */
    var _opts = $.extend({}, $.fn.stickyHeader.defaults, options);

    /**
     * Keeps track of the last header item ID. Each header item ID is an incremental number.
     * @type {Number}
     * @private
     */
    var _stickyHeaderItemID = 0;

    return this.each(function() {
      var header = new $.fn.stickyHeader.Container(this, _opts);
      header.init();

      $(window).scroll(function() {
        $('[' + _opts.itemAttribute + ']').each(function() {
          var item = new $.fn.stickyHeader.Item(this, _opts);

          if (!item.getId()) {
            item.setId(++_stickyHeaderItemID);

            var observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                for (var i = 0; i < mutation.removedNodes.length; i++) {
                  var item = new $.fn.stickyHeader.Item(mutation.removedNodes[i], _opts);

                  if (item.isRemoved()) {
                    return;
                  }
                  if (header.has(item)) {
                    item.setAsRemoved();
                    header.remove(item);
                  }
                }
              });
            });

            observer.observe(
              document.querySelector('body'),
              {
                childList: true,
                subtree: true
              }
            );
          }

          // If the item is visible in the viewport then it shouldn't be in the header.
          if (!item.isHidden(window, header) &&
              header.has(item)) {
            header.remove(item);
          }
          // If the item is NOT visible in the viewport, then add it in the header.
          else if (item.isHidden(window, header) &&
              !header.has(item)) {
            header.add(item);
          }
        });
      });

      // When AngularJS changes the partial view, the hash changes too.
      // Removes elements relative to the previous view from the header
      // and triggers scroll event so the header is repopulated with the elements
      // from the next view (is any of them are hidden)
      window.onhashchange = function() {
        function itemRemover() {
          header.remove(new $.fn.stickyHeader.Item($(this), _opts));
        }

        for(var i = 0; i < 3; i++) {
          $(header.getSlot(i)).children().each(itemRemover);
        }

        $(window).scroll();
      };
    });
  };

  /**
   * The Sticky Header container.
   *
   * @param {Object} selector
   */
  $.fn.stickyHeader.Container = function(selector, opts) {
    /**
     * Add a new item to the header.
     *
     * @param {Object} item An instance of Item
     */
    this.add = function(item) {
      var slot;

      switch (item.getPosition()) {
        case 'R':
          slot = this.getSlot(2);
          break;
        case 'C':
          slot = this.getSlot(1);
          break;
        default:
        case 'L':
          slot = this.getSlot(0);
          break;
      }

      var element = $(item.getHtml());

      if (item.getPosition() === 'R') {
        $(slot).prepend(element);
      }
      else {
        $(slot).append(element.removeAttr(opts.itemAttribute));
      }

      if (element.attr(opts.itemIdAttribute) === undefined) {
        element.attr(opts.itemIdAttribute, item.getId());
      }

      $(selector).show();
    };

    /**
     * Remove an item from the header.
     *
     * @param {Object} item An instance of Item
     */
    this.remove = function(item) {
      $(selector).find('[' + opts.itemIdAttribute + '="' + item.getId() + '"]').remove();
      if ($(selector).find('[' + opts.itemIdAttribute + ']').length === 0) {
        $(selector).hide();
      }
    };

    /**
     * Get the header height.
     *
     * @returns {number}
     */
    this.getHeight = function() {
      return $(selector).is(":visible") ? $(selector).height() : 0;
    };

    /**
     * Determines if an item or its representation is in the header.
     *
     * @param {Object} item An instance of Item
     * @returns {boolean}
     */
    this.has = function(item) {
      return $(selector).find('[' + opts.itemIdAttribute + '="' + item.getId() + '"]').length > 0;
    };

    /**
     * Returns the slot of the header by index.
     *
     * @param {number} index
     * @returns {Object}
     */
    this.getSlot = function(index) {
      // The plugin was initialized on the container with [data-sticky-header-container] child
      if ($(selector).find('[' + opts.headerContainerAttribute + ']').length) {
        return $(selector).find('[' + opts.headerContainerAttribute + ']').children().get(index);
      }
      // The plugin was initialized on the container without [data-sticky-header-container] child
      else {
        return $(selector).children().get(index);
      }
    };

    /**
     * Init the sticky header creating all sections and setting its css rules.
     */
    this.init = function() {
      if ($(selector).find('[' + opts.headerContainerAttribute + ']').length === 0) {
        $(selector).empty();
      }
      $(selector).attr(opts.headerAttribute, '').hide();

      for (var i = 0; i < 3; i++) {
        if ($(selector).find('[' + opts.headerContainerAttribute + ']').length) {
          $(selector).find('[' + opts.headerContainerAttribute + ']').append("<div></div>");
        }
        else {
          $(selector).append("<div></div>");
        }
      }
    };
  };

  /**
   * A Header item.
   *
   * @param {Object} selector
   */
  $.fn.stickyHeader.Item = function(selector, opts) {

    /**
     * Determines if the item is visible in the viewport or not.
     *
     * @param {Object} window
     * @param {Object} header
     * @returns {boolean}
     */
    this.isHidden = function(window, header) {
      return $(window).scrollTop() > $(selector).offset().top;
    };

    /**
     * Set the header item ID
     *
     * @param {number} id
     */
    this.setId = function(id) {
      $(selector).attr(opts.itemIdAttribute, id);
    };

    /**
     * Get the header item ID
     *
     * @returns {number}
     */
    this.getId = function() {
      return $(selector).attr(opts.itemIdAttribute);
    };

    /**
     * Returns the position of the item than the header.
     *
     * @returns {string}
     */
    this.getPosition = function() {
      return JSON.parse($(selector).attr(opts.itemAttribute)).position;
    };

    /**
     * Returns the HTML representation of the item.
     *
     * @returns {String|Object}
     */
    this.getHtml = function() {
      var options = JSON.parse($(selector).attr(opts.itemAttribute));
      return typeof options.html === "string" ? options.html : $(selector).clone(true).get();
    };

    /**
     * Determines if the item has been removed.
     *
     * @returns {boolean}
     */
    this.isRemoved = function() {
      return $(selector).attr(opts.itemRemovedAttribute) === "1";
    };

    /**
     * Set the item as removed.
     */
    this.setAsRemoved = function() {
      $(selector).attr(opts.itemRemovedAttribute, "1");
    };
  };

  /**
   * Sticky Header plugin default values.
   *
   * @type {Object}
   */
  $.fn.stickyHeader.defaults = {

    /**
     * @type {string}
     * @default 'data-sticky-header'
     */
    headerAttribute: 'data-sticky-header',

    /**
     * @type {string}
     * @default 'data-sticky-header-container'
     */
    headerContainerAttribute: 'data-sticky-header-container',

    /**
     * @type {string}
     * @default 'data-sticky-header-item'
     */
    itemAttribute: 'data-sticky-header-item',

    /**
     * @type {string}
     * @default 'data-sticky-header-item-removed'
     */
    itemRemovedAttribute: 'data-sticky-header-item-removed',

    /**
     * @type {string}
     * @default 'data-sticky-header-item-id'
     */
    itemIdAttribute: 'data-sticky-header-item-id'
  };
}(jQuery));
