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

    /**
     * Sticky Header
     *
     * @param {Object} selector
     */
    var Header = function(selector) {

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

        $(slot).append(item.getHtml());
        $(slot).children().last().attr('data-sticky-header-item-id', item.getID());
        $(selector).slideDown(200);
      };

      /**
       * Remove an item from the header.
       *
       * @param {Object} item An instance of Item
       */
      this.remove = function(item) {
        $(selector).find('[data-sticky-header-item-id="' + item.getID() + '"]').remove();
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
        return $(selector).find('[data-sticky-header-item-id="' + item.getID() + '"]').length > 0;
      };

      /**
       * Returns the slot of the header by index.
       *
       * @param {number} index
       * @returns {Object}
       */
      this.getSlot = function(index) {
        return $(selector).children().get(index);
      };

      /**
       * Init the sticky header creating all sections and setting its css rules.
       */
      this.init = function() {
        // TODO Create three sections instead of being already created in the html.
      };
    };

    /**
     * A Header item.
     *
     * @param {Object} selector
     */
    var Item = function(selector) {

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
      this.setID = function(id) {
        $(selector).attr('data-sticky-header-item-id', id);
      };

      /**
       * Get the header item ID
       *
       * @returns {number}
       */
      this.getID = function() {
        return $(selector).attr('data-sticky-header-item-id');
      };

      /**
       * Returns the position of the item than the header.
       *
       * @returns {string}
       */
      this.getPosition = function() {
        return JSON.parse($(selector).attr("data-sticky-header")).position;
      };

      /**
       * Returns the HTML representation of the item.
       *
       * @returns {String|Object}
       */
      this.getHtml = function() {
        var options = JSON.parse($(selector).attr("data-sticky-header"));
        return typeof options.html === "string" ? options.html : $(selector).clone().get();
      };
    };

    return this.each(function() {
      var header = new Header(this);
      header.init();

      $(window).scroll(function() {
        $("[data-sticky-header]").each(function() {
          var item = new Item(this);

          if (!item.getID()) {
            item.setID(++_stickyHeaderItemID);
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
}(jQuery));
