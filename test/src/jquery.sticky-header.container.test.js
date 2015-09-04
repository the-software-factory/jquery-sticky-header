describe("jQuery Sticky Header container tests", function() {
  var fixtureHtml = "<span>test</span>";
  var fixture = '<button data-sticky-header-item=\'{"position": "L", "html": "' + fixtureHtml + '"}\'>Button 1</button>';

  var header;

  var options = {
    headerAttribute: 'data-sticky-header',
    headerContainerAttribute: 'data-sticky-header-container',
    itemAttribute: 'data-sticky-header-item',
    itemRemovedAttribute: 'data-sticky-header-item-removed',
    itemIdAttribute: 'data-sticky-header-item-id'
  };

  beforeEach(function() {
    $("header").remove();
    $(".container").remove();

    $("body").append("<header><div " + options.headerContainerAttribute + "></div></header>");
    $("body").append("<div class='container'></div>");

    $(".container").append(fixture);

    $("header").stickyHeader();

    header = new $.fn.stickyHeader.Container($("[" + options.headerContainerAttribute + "]"), options);
  });

  it("container object.", function() {
    expect(jQuery.fn.stickyHeader.Container).toBeDefined();
  });

  it("init method.", function() {
    // Has data-sticky-header attribute
    expect($("header").attr(options.headerAttribute)).toBeDefined();

    // Has 3 children divs
    expect($("[" + options.headerContainerAttribute + "] > div").length).toBe(3);
  });

  it("getSlot method.", function() {
    // Valid indexes
    $("[" + options.headerContainerAttribute + "] > div:first").append("<span>test L</span>");
    $("[" + options.headerContainerAttribute + "] > div:nth-child(2)").append("<span>test C</span>");
    $("[" + options.headerContainerAttribute + "] > div:last").append("<span>test C</span>");

    expect($(header.getSlot(0)).html()).toBe($("[" + options.headerContainerAttribute + "] > div:first").html());
    expect($(header.getSlot(1)).html()).toBe($("[" + options.headerContainerAttribute + "] > div:nth-child(2)").html());
    expect($(header.getSlot(2)).html()).toBe($("[" + options.headerContainerAttribute + "] > div:last").html());

    // Invalid index
    expect(typeof header.getSlot(3)).toBe("undefined");
  });

  it("has method.", function() {
    // build new item
    var item = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").first(), options);
    item.setId(0);
    // Put the into header
    header.add(item);

    expect(header.has(item)).toBe(true);

    // Item not in the header
    $(".container").append($("[" + options.itemAttribute + "]").first().clone());
    var itemNotInHeader = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").last(), options);
    itemNotInHeader.setId(1);

    expect(header.has(itemNotInHeader)).toBe(false);
  });

  it("add method.", function() {
    // Add to the left slot
    var itemL = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").first(), options);
    itemL.setId(1);
    header.add(itemL);

    // The left slot has exactly one item
    expect($("[" + options.headerContainerAttribute + "] > div:first > *").length).toBe(1);
    // Its HTML is the same as fixture's
    expect($("[" + options.headerContainerAttribute + "] > div:first > *").first().clone().wrap("<div>").parent().html())
      .toBe($(fixtureHtml).attr(options.itemIdAttribute, "1").clone().wrap("<div>").parent().html());
    // It has the data-sticky-header-item-id attribute set
    expect($("[" + options.headerContainerAttribute + "] > div:first > *").first().attr(options.itemIdAttribute)).toBeDefined();
    // The header is visible after the header item addition
    expect($("[" + options.headerContainerAttribute + "]").is(":visible")).toBe(true);

    // Add to the central slot
    var centralSlotHtml = ($("[" + options.itemAttribute + "]").first().clone().wrap("<div />").parent().html()).replace("L", "C");
    $(".container").append(centralSlotHtml);

    var itemC = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").eq(1), options);
    itemC.setId(2);
    header.add(itemC);

    expect($("[" + options.headerContainerAttribute + "] > div:nth-child(2) > *").length).toBe(1);
    expect($("[" + options.headerContainerAttribute + "] > div:nth-child(2) > *").first().clone().wrap("<div>").parent().html())
      .toBe($(fixtureHtml).attr(options.itemIdAttribute, "2").clone().wrap("<div>").parent().html());
    expect($("[" + options.headerContainerAttribute + "] > div:nth-child(2) > *").first().attr(options.itemIdAttribute)).toBeDefined();
    expect($("header").is(":visible")).toBe(true);

    // Add to the right slot
    var rightSlotHtml = ($("[" + options.itemAttribute + "]").first().clone().wrap("<div />").parent().html()).replace("L", "R");
    $(".container").append(rightSlotHtml);

    var itemR = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").eq(2), options);
    itemR.setId(3);
    header.add(itemR);

    expect($("[" + options.headerContainerAttribute + "] > div:nth-child(3) > *").length).toBe(1);
    expect($("[" + options.headerContainerAttribute + "] > div:nth-child(3) > *").first().clone().wrap("<div>").parent().html())
      .toBe($(fixtureHtml).attr(options.itemIdAttribute, "3").clone().wrap("<div>").parent().html());
    expect($("[" + options.headerContainerAttribute + "] > div:nth-child(3) > *").first().attr(options.itemIdAttribute)).toBeDefined();
    expect($("header").is(":visible")).toBe(true);


    // Add an element without custom HTML specified and check if event listeners attached to it are copied too
    $(".container").append($("<button " + options.itemAttribute + "='{}'>FooBar</button>"));
    var elementWitoutCustomHtml = $(".container > [" + options.itemAttribute + "]").last();
    var itemWithoutCustomHtml = new $.fn.stickyHeader.Item(elementWitoutCustomHtml, options);

    var eventData = {
      counter: 0
    };

    elementWitoutCustomHtml.click(eventData, function(event) {
      event.data.counter++;
    });

    itemWithoutCustomHtml.setId(4);
    // Clones the object's HTML as no custom HTML was provided
    header.add(itemWithoutCustomHtml);
    // Get the just inserted object
    var itemWithClonedHtmlInHeader = $("[" + options.headerContainerAttribute + "] > div:first > *:last");
    // Trigger the onclick event on it
    itemWithClonedHtmlInHeader.click();
    // And check if the event listener of the original page object is the same
    expect(eventData.counter).toBe(1);
  });

  it("remove method.", function() {
    // Remove existent item
    var item = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").first(), options);
    item.setId(1);
    header.add(item);

    header.remove(item);
    expect($("header [" + options.itemIdAttribute + "]").length).toBe(0);

    // As it was the only element the header should be hidden now
    expect($("header").is(":hidden")).toBe(true);

    // Remove one of two items
    $(".container").append($("[" + options.itemAttribute + "]").first().clone());
    var secondItem = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").last(), options);
    secondItem.setId("2");

    header.add(item);
    header.add(secondItem);

    header.remove(item);
    expect($("header [" + options.itemIdAttribute + "]").length).toBe(1);
    expect($("header").is(":visible")).toBe(true);

    // Remove inexistent item and check if the document didn't change
    $(".container").append($("[" + options.itemAttribute + "]").first().clone());
    var itemNotInHeader = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]").last(), options);

    var documentBefore = $("body").html();
    header.remove(itemNotInHeader);
    expect(documentBefore).toBe($("body").html());
  });
});
