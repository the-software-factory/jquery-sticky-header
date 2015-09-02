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
  $.fn.stickyHeader = function() {

    /**
     * Keeps track of the last header item ID. Each header item ID is an incremental number.
     * @type {Number}
     * @private
     */
    var _stickyHeaderItemID = 0;

    return this.each(function() {
      var header = new $.fn.stickyHeader.Container(this);
      header.init();

      $(window).scroll(function() {
        $("[data-sticky-header-item]").each(function() {
          var item = new $.fn.stickyHeader.Item(this);

          if (!item.getId()) {
            item.setId(++_stickyHeaderItemID);

            $(document).on('DOMNodeRemoved', this, function(event) {
              var item = new $.fn.stickyHeader.Item(event.data);
              if (item.isRemoved()) {
                return;
              }
              if (header.has(item)) {
                item.setAsRemoved();
                header.remove(item);
              }
            });
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
    });
  };

  /**
   * The Sticky Header container.
   *
   * @param {Object} selector
   */
  $.fn.stickyHeader.Container = function(selector) {

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

      var element = $('<div />').append(
        item.getHtml()
      );

      if (item.getPosition() === 'R') {
        $(slot).prepend(element);
      }
      else {
        $(slot).append(element);
      }

      element.attr('data-sticky-header-item-id', item.getId());

      $(selector).show();
    };

    /**
     * Remove an item from the header.
     *
     * @param {Object} item An instance of Item
     */
    this.remove = function(item) {
      $(selector).find('[data-sticky-header-item-id="' + item.getId() + '"]').remove();
      if ($(selector).find('[data-sticky-header-item-id]').length === 0) {
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
      return $(selector).find('[data-sticky-header-item-id="' + item.getId() + '"]').length > 0;
    };

    /**
     * Returns the slot of the header by index.
     *
     * @param {number} index
     * @returns {Object}
     */
    this.getSlot = function(index) {
      return $(selector).find('[data-sticky-header-container]').children().get(index);
    };

    /**
     * Init the sticky header creating all sections and setting its css rules.
     */
    this.init = function() {
      if ($(selector).find('[data-sticky-header-container]').length === 0) {
        $(selector).empty();
      }
      $(selector).attr('data-sticky-header', '').hide();

      for (var i = 0; i < 3; i++) {
        if ($(selector).find('[data-sticky-header-container]').length) {
          $(selector).find('[data-sticky-header-container]').append("<div></div>");
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
  $.fn.stickyHeader.Item = function(selector) {

    /**
     * Determines if the item is visible in the viewport or not.
     *
     * @param {Object} window
     * @param {Object} header
     * @returns {boolean}
     */
    this.isHidden = function(window, header) {
      return ($(window).scrollTop() + header.getHeight()) >= ($(selector).offset().top + $(selector).height());
    };

    /**
     * Set the header item ID
     *
     * @param {number} id
     */
    this.setId = function(id) {
      $(selector).attr('data-sticky-header-item-id', id);
    };

    /**
     * Get the header item ID
     *
     * @returns {number}
     */
    this.getId = function() {
      return $(selector).attr('data-sticky-header-item-id');
    };

    /**
     * Returns the position of the item than the header.
     *
     * @returns {string}
     */
    this.getPosition = function() {
      return JSON.parse($(selector).attr("data-sticky-header-item")).position;
    };

    /**
     * Returns the HTML representation of the item.
     *
     * @returns {String|Object}
     */
    this.getHtml = function() {
      var options = JSON.parse($(selector).attr("data-sticky-header-item"));
      return typeof options.html === "string" ? options.html : $(selector).clone(true).get();
    };

    /**
     * Determines if the item has been removed.
     *
     * @returns {boolean}
     */
    this.isRemoved = function() {
      return $(selector).attr("data-sticky-header-item-removed") === "1";
    };

    /**
     * Set the item as removed.
     */
    this.setAsRemoved = function() {
      $(selector).attr("data-sticky-header-item-removed", "1");
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
     * @default 'data-sticky-header-item'
     */
    itemAttribute: 'data-sticky-header-item'
  };
}(jQuery));
