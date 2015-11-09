describe("jQuery Sticky Header container tests", function() {
  var fixtureHtml = "<span>test</span>";
  var fixture = '<button data-sticky-header-item=\'{"position": "L", "html": "' + fixtureHtml + '"}\'>Button 1</button>';
  var headerContainer;

  beforeEach(function() {
    $("header").remove();
    $(".container").remove();

    $("body").append("<header><div " + options.headerContainerAttribute + "></div></header>");
    $("body").append("<div class='container'></div>");

    $(".container").append(fixture);

    $("header").stickyHeader();

    headerContainer = new $.fn.stickyHeader.Container($("[" + options.headerContainerAttribute + "]"), options);
  });

  it("container object.", function() {
    expect(jQuery.fn.stickyHeader.Container).toBeDefined();
  });

  it("getSlot method.", function() {
    // Create slots
    var container = $("[" + options.headerContainerAttribute + "]");
    var slotL = $("<div></div>").attr(options.headerSlotPositionAttribute, "L");
    var slotC = $("<div></div>").attr(options.headerSlotPositionAttribute, "C");
    var slotR = $("<div></div>").attr(options.headerSlotPositionAttribute, "R");

    container.append(slotL);
    container.append(slotC);
    container.append(slotR);

    // Valid indexes
    slotL.append("<span>test L</span>");
    slotC.append("<span>test C</span>");
    slotR.append("<span>test R</span>");

    expect($(headerContainer.getSlot('L')).html()).toBe(slotL.html());
    expect($(headerContainer.getSlot('C')).html()).toBe(slotC.html());
    expect($(headerContainer.getSlot('R')).html()).toBe(slotR.html());

    // Invalid index
    expect(headerContainer.getSlot('invalid').length).toBe(0);
  });

  it("getSlots method.", function() {
    var container = $("[" +  options.headerContainerAttribute +"]");
    var slots = [];
    // Create slots
    var slotL = $("<div>first</div>").attr(options.headerSlotPositionAttribute, "L");
    var slotC = $("<div>second</div>").attr(options.headerSlotPositionAttribute, "C");
    var slotR = $("<div>third</div>").attr(options.headerSlotPositionAttribute, "R");

    container.append(slotL).append(slotC).append(slotR);
    slots.push(slotL, slotC, slotR);

    expect(headerContainer.getSlots().length).toBe(3);

    headerContainer.getSlots().each(function(index) {
      expect($(this).html()).toBe($(slots[index]).html());
    });
  });

  it("has method.", function() {
    // build new item
    var item = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").first(), options);
    item.setId(0);
    // Put the into header
    headerContainer.add(item);

    expect(headerContainer.has(item)).toBe(true);

    // Item not in the header
    $(".container").append($("[" + options.itemAttribute + "]").first().clone());
    var itemNotInHeader = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").last(), options);
    itemNotInHeader.setId(1);

    expect(headerContainer.has(itemNotInHeader)).toBe(false);
  });

  it("add method.", function() {
    // The header is hidden when empty
    expect($("[" + options.headerAttribute + "]").is(":hidden")).toBe(true);

    // No slots are created before they are actually needed
    expect($('[' + options.headerContainer + '] > *').length).toBe(0);

    // Add to the LEFT slot
    var itemL = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").first(), options);
    itemL.setId(1);

    // Setup the handler so we know whether the onElementAdd event was fired
    var eventFired = false;
    $("[data-sticky-header-container]").on('stickyHeader.onElementAdd', function() {
        eventFired = true;
    });

    headerContainer.add(itemL);

    // Only the left slot is now present in the header container and it has the headerSlotPositionAttribute set to 'L'
    expect($('[' + options.headerContainerAttribute + ']').children().length).toBe(1);
    expect($('[' + options.headerContainerAttribute + ']').children().first().attr(options.headerSlotPositionAttribute)).toBe('L');

    // The left slot has exactly one item
    expect($("[" + options.headerContainerAttribute + "]").children().first().children().length).toBe(1);
    // Its HTML is the same as fixture's
    expect($("[" + options.headerContainerAttribute + "]").children().first().children().first().clone().wrap("<div>").parent().html())
      .toBe($(fixtureHtml).attr(options.itemIdAttribute, "1").clone().wrap("<div>").parent().html());
    // It has the data-sticky-header-item-id attribute set
    expect($("[" + options.headerContainerAttribute + "]").children().first().children().first().attr(options.itemIdAttribute)).toBeDefined();
    // The header is visible after the header item addition
    expect($("[" + options.headerAttribute + "]").is(":visible")).toBe(true);
    // The event was fired when the new item was added
    expect(eventFired).toBe(true);

    // Add to the CENTRAL slot
    var centralSlotHtml = ($("[" + options.itemAttribute + "]").first().clone().wrap("<div />").parent().html()).replace("L", "C");
    $(".container").append(centralSlotHtml);

    var itemC = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").eq(1), options);
    itemC.setId(2);
    headerContainer.add(itemC);

    // The header container now containes 3 slots as the right one was created to keep the central one really in center
    expect($('[' + options.headerContainerAttribute + ']').children().length).toBe(3);

    // Check if the L-C-R slots follow the right order
    expect($('[' + options.headerContainerAttribute + ']').children().eq(0).attr(options.headerSlotPositionAttribute)).toBe('L');
    expect($('[' + options.headerContainerAttribute + ']').children().eq(1).attr(options.headerSlotPositionAttribute)).toBe('C');
    expect($('[' + options.headerContainerAttribute + ']').children().eq(2).attr(options.headerSlotPositionAttribute)).toBe('R');

    expect($("[" + options.headerContainerAttribute + "]").children().eq(1).children().length).toBe(1);
    expect($("[" + options.headerContainerAttribute + "]").children().eq(1).children().first().clone().wrap("<div>").parent().html())
      .toBe($(fixtureHtml).attr(options.itemIdAttribute, "2").clone().wrap("<div>").parent().html());
    expect($("[" + options.headerContainerAttribute + "]").children().eq(1).children().first().attr(options.itemIdAttribute)).toBeDefined();
    expect($("[" + options.headerAttribute + "]").is(":visible")).toBe(true);

    // Add to the right slot
    var rightSlotHtml = ($("[" + options.itemAttribute + "]").first().clone().wrap("<div />").parent().html()).replace("L", "R");
    $(".container").append(rightSlotHtml);

    var itemR = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").eq(2), options);
    itemR.setId(3);
    headerContainer.add(itemR);

    // There are still 3 slot in the header container and the last one's headerSlotPositionAttribute is 'R'
    expect($('[' + options.headerContainerAttribute + ']').children().length).toBe(3);
    expect($('[' + options.headerContainerAttribute + ']').children().last().attr(options.headerSlotPositionAttribute)).toBe('R');

    expect($("[" + options.headerContainerAttribute + "]").children().last().children().length).toBe(1);
    expect($("[" + options.headerContainerAttribute + "]").children().last().children().first().clone().wrap("<div>").parent().html())
      .toBe($(fixtureHtml).attr(options.itemIdAttribute, "3").clone().wrap("<div>").parent().html());
    expect($("[" + options.headerContainerAttribute + "]").children().last().children().first().attr(options.itemIdAttribute)).toBeDefined();
    expect($("[" + options.headerAttribute + "]").is(":visible")).toBe(true);

    // Add an element without custom HTML specified and check if event listeners attached to it are copied too
    var element = $('<button ' + options.itemAttribute + '="{}">FooBar</button>');
    $(".container").append(element);
    var itemWithoutCustomHtml = new $.fn.stickyHeader.Item(element, options);

    var eventData = { counter: 0 };

    element.click(eventData, function(event) {
      event.data.counter++;
    });

    itemWithoutCustomHtml.setId(4);
    // Clones the object's HTML as no custom HTML was provided
    headerContainer.add(itemWithoutCustomHtml);
    // Get the just inserted object
    var itemWithClonedHtmlInHeader = $("[" + options.headerContainerAttribute + "]").children().first().children().last();
    // Trigger the onclick event on it
    itemWithClonedHtmlInHeader.click();
    // And check if the event listener of the original page object is the same
    expect(eventData.counter).toBe(1);
  });

  it("remove method.", function() {
    // Remove existent item
    var item = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").first(), options);
    item.setId(1);
    headerContainer.add(item);

    headerContainer.remove(item);
    expect($("[" + options.headerContainerAttribute + "] [" + options.itemIdAttribute + "]").length).toBe(0);

    // As it was the only element the header should be hidden now
    expect($("[" + options.headerAttribute + "]").is(":hidden")).toBe(true);

    // Remove one of two items
    $(".container").append($("[" + options.itemAttribute + "]").first().clone());
    var secondItem = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").last(), options);
    secondItem.setId("2");

    headerContainer.add(item);
    headerContainer.add(secondItem);

    headerContainer.remove(item);
    expect($("[" + options.headerAttribute + "] [" + options.itemIdAttribute + "]").length).toBe(1);
    expect($("[" + options.headerAttribute + "]").is(":visible")).toBe(true);

    // Remove inexistent item and check if the document didn't change
    $(".container").append($("[" + options.itemAttribute + "]").first().clone());
    var itemNotInHeader = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").last(), options);

    var documentBefore = $("body").html();
    headerContainer.remove(itemNotInHeader);
    expect(documentBefore).toBe($("body").html());
  });

  it("getTopPaddings method.", function() {
    // The header is a container too
    $("[" + options.headerAttribute + "]").empty();
    $("header").stickyHeader();
    $("[" + options.headerContainerAttribute + "]").append("<div>test</div>").css("padding-top", "123px");
    headerContainer = new $.fn.stickyHeader.Container($("[" + options.headerContainerAttribute + "]"), options);

    expect(headerContainer.getTopPaddings()).toBe(123);

    // The header has a container inside
    $("header").empty().removeAttr(options.headerContainerAttribute).css("padding-top", "20px");
    $("header").append($("<div></div>").attr(options.headerContainerAttribute, "").css("padding-top", "10px"));
    $("header").stickyHeader();
    $("[" + options.headerContainerAttribute + "]").append("<div>test</div>");
    headerContainer = new $.fn.stickyHeader.Container($("[" + options.headerContainerAttribute + "]"), options);

    expect(headerContainer.getTopPaddings()).toBe(30);

    // There are multiple elements between the header and the container
    $("header").empty().removeAttr(options.headerContainerAttribute).css("padding-top", "75px");
    $("header").append($("<div one></div>").css("padding-top", "10px"));
    $("header > [one]").append($("<div two></div>").css("padding-top", "7px"));
    $("header > [one] > [two]").append($("<div></div>").attr(options.headerContainerAttribute, "").css("padding-top", "8px"));
    $("header").stickyHeader();
    $("[" + options.headerContainerAttribute + "]").append("<div>test</div>");
    headerContainer = new $.fn.stickyHeader.Container($("[" + options.headerContainerAttribute + "]"), options);

    expect(headerContainer.getTopPaddings()).toBe(100);
  });

  it("addSlot method.", function() {
    // Add the LEFT slot in the empty container
    headerContainer.addSlot("L");

    expect($("[" + options.headerContainerAttribute + "]").children().length).toBe(1);
    expect($("[" + options.headerContainerAttribute + "]").children().first().attr(options.headerSlotPositionAttribute)).toBe("L");

    // Add the left slot in the container that already has the right slot
    $("[" + options.headerContainerAttribute + "]").empty();
    headerContainer.addSlot("R");
    headerContainer.addSlot("L");

    expect($("[" + options.headerContainerAttribute + "]").children().length).toBe(2);
    // The the left slot was inserter before the right one
    expect($("[" + options.headerContainerAttribute + "]").children().first().attr(options.headerSlotPositionAttribute)).toBe("L");

    // Add the left slot in the container that already has the central and the right ones
    $("[" + options.headerContainerAttribute + "]").empty();
    headerContainer.addSlot("C");
    headerContainer.addSlot("R");
    headerContainer.addSlot("L");

    expect($("[" + options.headerContainerAttribute + "]").children().length).toBe(3);
    // The order of the slots is L-C-R
    expect($("[" + options.headerContainerAttribute + "]").children().eq(0).attr(options.headerSlotPositionAttribute)).toBe("L");
    expect($("[" + options.headerContainerAttribute + "]").children().eq(1).attr(options.headerSlotPositionAttribute)).toBe("C");
    expect($("[" + options.headerContainerAttribute + "]").children().eq(2).attr(options.headerSlotPositionAttribute)).toBe("R");

    // Add the RIGHT slot in the empty container
    $("[" + options.headerContainerAttribute + "]").empty();
    headerContainer.addSlot("R");

    expect($("[" + options.headerContainerAttribute + "]").children().length).toBe(1);
    expect($("[" + options.headerContainerAttribute + "]").children().first().attr(options.headerSlotPositionAttribute)).toBe("R");

    // Add the right slot in the container that already has central and left ones
    $("[" + options.headerContainerAttribute + "]").empty();
    headerContainer.addSlot("C");
    headerContainer.addSlot("L");
    headerContainer.addSlot("R");

    expect($("[" + options.headerContainerAttribute + "]").children().length).toBe(3);
    // The order of the slots is L-C-R
    expect($("[" + options.headerContainerAttribute + "]").children().eq(0).attr(options.headerSlotPositionAttribute)).toBe("L");
    expect($("[" + options.headerContainerAttribute + "]").children().eq(1).attr(options.headerSlotPositionAttribute)).toBe("C");
    expect($("[" + options.headerContainerAttribute + "]").children().eq(2).attr(options.headerSlotPositionAttribute)).toBe("R");

    // Add the CENTRAL slot to the empty container
    $("[" + options.headerContainerAttribute + "]").empty();
    headerContainer.addSlot("C");

    expect($("[" + options.headerContainerAttribute + "]").children().length).toBe(1);
    expect($("[" + options.headerContainerAttribute + "]").children().first().attr(options.headerSlotPositionAttribute)).toBe("C");

    // Add the central slot to the container that already has the left one
    $("[" + options.headerContainerAttribute + "]").empty();
    headerContainer.addSlot("L");
    headerContainer.addSlot("C");

    // The right slot was automatically created too
    expect($("[" + options.headerContainerAttribute + "]").children().length).toBe(3);
    expect($("[" + options.headerContainerAttribute + "]").children().eq(0).attr(options.headerSlotPositionAttribute)).toBe("L");
    expect($("[" + options.headerContainerAttribute + "]").children().eq(1).attr(options.headerSlotPositionAttribute)).toBe("C");
    expect($("[" + options.headerContainerAttribute + "]").children().eq(2).attr(options.headerSlotPositionAttribute)).toBe("R");

    // Add the central slot to the container that already has the right one
    $("[" + options.headerContainerAttribute + "]").empty();
    headerContainer.addSlot("R");
    headerContainer.addSlot("C");

    // The left slot was automatically created too
    expect($("[" + options.headerContainerAttribute + "]").children().length).toBe(3);
    expect($("[" + options.headerContainerAttribute + "]").children().eq(0).attr(options.headerSlotPositionAttribute)).toBe("L");
    expect($("[" + options.headerContainerAttribute + "]").children().eq(1).attr(options.headerSlotPositionAttribute)).toBe("C");
    expect($("[" + options.headerContainerAttribute + "]").children().eq(2).attr(options.headerSlotPositionAttribute)).toBe("R");

    // Add the central slot to the container that already has the left and the right ones
    $("[" + options.headerContainerAttribute + "]").empty();
    headerContainer.addSlot("L");
    headerContainer.addSlot("R");
    headerContainer.addSlot("C");

    expect($("[" + options.headerContainerAttribute + "]").children().length).toBe(3);
    expect($("[" + options.headerContainerAttribute + "]").children().eq(0).attr(options.headerSlotPositionAttribute)).toBe("L");
    expect($("[" + options.headerContainerAttribute + "]").children().eq(1).attr(options.headerSlotPositionAttribute)).toBe("C");
    expect($("[" + options.headerContainerAttribute + "]").children().eq(2).attr(options.headerSlotPositionAttribute)).toBe("R");
  });
});
