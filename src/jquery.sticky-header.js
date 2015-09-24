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
      // Marks the header with headerAttribute attribute and hides it
      $(this).attr(_opts.headerAttribute, '').hide();

      // If the header doesn't have a child marked with headerContainerAttribute
      // then the header itself becomes a container
      if ($(this).find('[' + _opts.headerContainerAttribute + ']').length === 0) {
        $(this).attr(_opts.headerContainerAttribute, '');
      }

      // Initializes the header container
      $('[' + _opts.headerContainerAttribute + ']').empty();
      var headerContainer = new $.fn.stickyHeader.Container(
        $('[' + _opts.headerContainerAttribute + ']'), _opts
      );

      $(window).scroll(function() {
        $('[' + _opts.itemAttribute + ']').each(function() {
          var item = new $.fn.stickyHeader.Item(this, _opts);

          if (!item.getId()) {
            item.setId(++_stickyHeaderItemID);

            // Watches for DOM changes, in particular for node addition and removal
            var observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                // Iterate only through the removed nodes
                for (var i = 0; i < mutation.removedNodes.length; i++) {
                  // Create an item representing the removed node
                  var item = new $.fn.stickyHeader.Item(mutation.removedNodes[i], _opts);

                  // Do nothing if the item has already been set as removed
                  if (item.isRemoved()) {
                    return;
                  }

                  // Remove an eventual header element that corresponds to the one removed from DOM and set the item as removed
                  if (headerContainer.has(item)) {
                    item.setAsRemoved();
                    headerContainer.remove(item);
                  }
                }
              });
            });

            // Start watching for the sticky items addition or removal on their parents
            observer.observe(
              $('[' + _opts.itemAttribute + ']').parent().toArray()[0],
              {
                // Watch for sticky items removal or addition
                childList: true,
                // Do it recursively
                subtree: true
              }
            );
          }

          // If the item is visible in the viewport then it shouldn't be in the header.
          if (!item.isHidden(window, headerContainer) &&
              headerContainer.has(item)) {
            headerContainer.remove(item);
          }
          // If the item is NOT visible in the viewport, then add it in the header.
          else if (item.isHidden(window, headerContainer) &&
              !headerContainer.has(item)) {
            headerContainer.add(item);
          }
        });
      });

      // When AngularJS changes the partial view, the hash changes too.
      // Removes elements relative to the previous view from the header
      // and triggers scroll event so the header is repopulated with the elements
      // from the next view (is any of them are hidden)
      window.onhashchange = function() {
        // Gets all the header slots
        var slots = headerContainer.getSlots().toArray();

        for (var slotId in slots) {
          // Gets all the items inserted into slot
          var items = $(slots[slotId]).children().toArray();

          for (var itemId in items) {
            // Removes the item from the slot
            headerContainer.remove(new $.fn.stickyHeader.Item(items[itemId], _opts));
          }
        }

        // Triggers the scroll eventi so the header is repopulated for the new partial
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
      var position = (typeof item.getPosition() === 'undefined') ? 'L' : item.getPosition();

      // If the slot has not been created yet, do it now
      if (this.getSlot(position).length === 0) {
        this.addSlot(position);
      }

      var element = $(item.getHtml()).removeAttr(opts.itemAttribute);

      if (element.attr(opts.itemIdAttribute) === undefined) {
        element.attr(opts.itemIdAttribute, item.getId());
      }

      // If the target slot is the right one then prepend the item to it
      if (item.getPosition() === 'R') {
        $(this.getSlot(position)).prepend(element);
      }
      // Otherwise (left or center slots case) append the item to the target slot
      else {
        $(this.getSlot(position)).append(element);
      }

      $(selector).parents().find('[' + opts.headerAttribute + ']').show();
    };

    /**
     * Remove an item from the header.
     *
     * @param {Object} item An instance of Item
     */
    this.remove = function(item) {
      $(selector).find('[' + opts.itemIdAttribute + '="' + item.getId() + '"]').remove();
      if ($(selector).find('[' + opts.itemIdAttribute + ']').length === 0) {
        $(selector).parents().find('[' + opts.headerAttribute + ']').hide();
      }
    };

    /**
     * Gets the sum of top paddings of all the element berweend header and header container included
     *
     * @return {Number} Total top padding
     */
    this.getTopPaddings = function() {
      // If no slot was created yet then we need a dummy one as a child of the sticky header container
      if ($(selector).children().length === 0) {
        $(selector).append($('<div></div>').attr('id', 'dummy-slot'));
      }

      // Considers the header container element too
      var elements = $(selector).children().first().parents();

      // Remove the eventually inserted dummy slot since we've got all the necessary element to calculate top paddings
      $(selector).find('[id=dummy-slot]').remove();

      var topPaddings = 0;

      // Iterates through parents untill it reaches the header
      for (var i = 0; i < elements.length; i++) {
        topPaddings +=  parseInt(
          $(elements[i]).css('padding-top').replace('px', '')
        );

        // Stops if the header was reached
        if (typeof $(elements[i]).attr(opts.headerAttribute) !== "undefined") {
          break;
        }
      }

      return topPaddings;
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
     * Adds a new slot to the header container in the desired position
     *
     * @param  {number} position Slot position, may be 'L', 'C' or 'R'
     */

    this.addSlot = function(position) {
      // The left slot will be always prepended before all the others
      if (position === 'L') {
        $(selector).prepend('<div ' + opts.headerSlotPositionAttribute + '="L"></div>');
      }
      // The right slot will be always appended after all the others
      else if (position === 'R') {
        $(selector).append('<div ' + opts.headerSlotPositionAttribute + '="R"></div>');
      }
      else {
        // Builds the central slot element
        var centralDiv = $('<div ' + opts.headerSlotPositionAttribute + '="C"></div>');

        // If there is already a left slot, append the central one right after it and then create the right slot
        if (this.getSlot('L').length === 1) {
          centralDiv.insertAfter($(selector).find('[' + opts.headerSlotPositionAttribute + '="L"]'));
          if(this.getSlot('R').length === 0) {
            this.addSlot('R');
          }
        }
        // If there is already a right slot, prepend the central one right before it and then create the left slot
        else if (this.getSlot('R').length === 1) {
          centralDiv.insertBefore($(selector).find('[' + opts.headerSlotPositionAttribute + '="R"]'));
          if(this.getSlot('L').length === 0) {
            this.addSlot('L');
          }
        }
        // If there are no slots yet, just add the right one to the container
        else {
          $(selector).append(centralDiv);
        }
      }
    };

    /**
     * Returns the slot of the header by index.
     *
     * @param {number} index
     * @returns {Object}
     */
    this.getSlot = function(position) {
      return $(selector).find('[' + opts.headerSlotPositionAttribute + '=' +  position + ']');
    };

    /**
     * Returns all the header slots
     *
     * @return {Object}
     */
    this.getSlots = function() {
      return $(selector).children();
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
    this.isHidden = function(window, headerContainer) {
      return $(window).scrollTop() > $(selector).offset().top - headerContainer.getTopPaddings();
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
      return typeof options.html === "string" ? options.html : $(selector).clone(true);
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
     * @default 'data-sticky-header-slot-id'
     */
    headerSlotPositionAttribute: 'data-sticky-header-slot-position',

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
