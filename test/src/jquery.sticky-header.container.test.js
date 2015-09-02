describe("jQuery Sticky Header container tests", function() {
  var fixtureHtml = "<span>test</span>";
  var fixture = '<button data-sticky-header-item=\'{"position": "L", "html": "' + fixtureHtml + '"}\'>Button 1</button>';

  var header;

  beforeEach(function() {
    $("header").remove();
    $(".container").remove();

    $("body").append("<header><div data-sticky-header-container></div></header>");
    $("body").append("<div class='container'></div>");

    $(".container").append(fixture);

    $("header").stickyHeader();

    header = new $.fn.stickyHeader.Container($("header"));
  });

  it("container object.", function() {
    expect(jQuery.fn.stickyHeader.Container).toBeDefined();
  });


  it("getHeight method.", function() {
    // The header is hidden
    expect(header.getHeight()).toBe(0);

    // The header is visible
    $("data-sticky-header-container > div:first").append("<span>test</span>");
    $("header").show();

    expect(header.getHeight()).toBe($("header").height());
  });

  it("init method.", function() {
    // Has data-sticky-header attribute
    expect($("header").attr("data-sticky-header")).toBeDefined();

    // Has 3 children divs
    expect($("[data-sticky-header-container] > div").length).toBe(3);
  });

  it("getSlot method.", function() {
    // Valid indexes
    $("[data-sticky-header-container] > div:first").append("<span>test L</span>");
    $("[data-sticky-header-container] > div:nth-child(2)").append("<span>test C</span>");
    $("[data-sticky-header-container] > div:last").append("<span>test C</span>");

    expect($(header.getSlot(0)).html()).toBe($("[data-sticky-header-container] > div:first").html());
    expect($(header.getSlot(1)).html()).toBe($("[data-sticky-header-container] > div:nth-child(2)").html());
    expect($(header.getSlot(2)).html()).toBe($("[data-sticky-header-container] > div:last").html());

    // Invalid index
    expect(typeof header.getSlot(3)).toBe("undefined");
  });

  it("has method.", function() {
    // build new item
    var item = new $.fn.stickyHeader.Item($("[data-sticky-header-item]").first());
    // Simulate the windows scroll to assign the ID the the item
    $(window).scroll();
    // Put the into header
    header.add(item);

    expect(header.has(item)).toBe(true);

    // Item not in the header
    $(".container").append($("[data-sticky-header-item]").first().clone());
    // Simulate the windows scroll to assign the ID the the item
    $(window).scroll();

    var itemNotInHeader = new $.fn.stickyHeader.Item($("[data-sticky-header-item]").last());

    expect(header.has(itemNotInHeader)).toBe(false);
  });

  it("add method.", function() {
    // Add to the left slot
    var itemL = new $.fn.stickyHeader.Item($("[data-sticky-header-item]").first());
    $(window).scroll();
    header.add(itemL);

    // The left slot has exactly one item
    expect($("[data-sticky-header-container] > div:first > div").length).toBe(1);
    // Its HTML is the same as fixture's
    expect($("[data-sticky-header-container] > div:first > div").first().html()).toBe(fixtureHtml);
    // It has the data-sticky-header-item-id attribute set
    expect($("[data-sticky-header-container] > div:first > div").first().attr("data-sticky-header-item-id")).toBeDefined();
    // The header is visible after the header item addition
    expect($("[data-sticky-header-container]").is(":visible")).toBe(true);

    // Add to the central slot
    var centralSlotHtml = ($("[data-sticky-header-item]").first().clone().wrap("<div />").parent().html()).replace("L", "C");
    $(".container").append(centralSlotHtml);

    var itemC = new $.fn.stickyHeader.Item($("[data-sticky-header-item]").eq(1));
    $(window).scroll();
    header.add(itemC);

    expect($("[data-sticky-header-container] > div:nth-child(2) > div").length).toBe(1);
    expect($("[data-sticky-header-container] > div:nth-child(2) > div").first().html()).toBe(fixtureHtml);
    expect($("[data-sticky-header-container] > div:nth-child(2) > div").first().attr("data-sticky-header-item-id")).toBeDefined();
    expect($("header").is(":visible")).toBe(true);

    // Add to the right slot
    var rightSlotHtml = ($("[data-sticky-header-item]").first().clone().wrap("<div />").parent().html()).replace("L", "R");
    $(".container").append(rightSlotHtml);

    var itemR = new $.fn.stickyHeader.Item($("[data-sticky-header-item]").eq(2));
    $(window).scroll();
    header.add(itemR);

    expect($("[data-sticky-header-container] > div:nth-child(3) > div").length).toBe(1);
    expect($("[data-sticky-header-container] > div:nth-child(3) > div").first().html()).toBe(fixtureHtml);
    expect($("[data-sticky-header-container] > div:nth-child(3) > div").first().attr("data-sticky-header-item-id")).toBeDefined();
    expect($("header").is(":visible")).toBe(true);


    // Add an element without custom HTML specified and check if event listeners attached to it are copied too
    $(".container").append($("<button data-sticky-header-item='{}'>FooBar</button>"));
    var elementWitoutCustomHtml = $(".container > [data-sticky-header-item]").last();
    var itemWithoutCustomHtml = new $.fn.stickyHeader.Item(elementWitoutCustomHtml);

    var eventData = {
      counter: 0
    };

    elementWitoutCustomHtml.click(eventData, function(event) {
      event.data.counter++;
    });

    // Forces the data-sticky-header-item-id to be generated
    $(window).scroll();
    // Clones the object's HTML as no custom HTML was provided
    header.add(itemWithoutCustomHtml);
    // Get the just inserted object
    var itemWithClonedHtmlInHeader = $("[data-sticky-header-container] > div:first > div:last > *");
    // Trigger the onclick event on it
    itemWithClonedHtmlInHeader.click();
    // And check if the event listener of the original page object is the same
    expect(eventData.counter).toBe(1);
  });

  it("remove method.", function() {
    // Remove existent item
    var item = new $.fn.stickyHeader.Item($("[data-sticky-header-item]").first());
    $(window).scroll();
    header.add(item);

    header.remove(item);
    expect($("header [data-sticky-header-item-id]").length).toBe(0);

    // As it was the only element the header should be hidden now
    expect($("header").is(":hidden")).toBe(true);

    // Remove one of two items
    $(".container").append($("[data-sticky-header-item]").first().clone());
    var secondItem = new $.fn.stickyHeader.Item($("[data-sticky-header-item]").last());
    secondItem.setId("2");

    $(window).scroll();
    header.add(item);
    header.add(secondItem);

    header.remove(item);
    expect($("header [data-sticky-header-item-id]").length).toBe(1);
    expect($("header").is(":visible")).toBe(true);

    // Remove inexistent item and check if the document didn't change
    $(".container").append($("[data-sticky-header-item]").first().clone());
    var itemNotInHeader = new $.fn.stickyHeader.Item($("[data-sticky-header-item]").last());

    var documentBefore = $("body").html();
    header.remove(itemNotInHeader);
    expect(documentBefore).toBe($("body").html());
  });
});
