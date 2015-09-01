describe("jQuery Sticky Header container tests", function() {
  var fixtureHtml = "<span>test</span>";
  var fixture = '<button data-sticky-header-item=\'{"position": "L", "html": "' + fixtureHtml + '"}\'>Button 1</button>';

  var header;

  beforeEach(function() {
    $("header").remove();
    $(".container").remove();

    $("body").append("<header></header>");
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
    $("header").append("<span>test</span>");
    $("header").show();

    expect(header.getHeight()).toBe($("header").height());
  });

  it("init method.", function() {
    header.init();

    // Has data-sticky-header attribute
    expect($("header").attr("data-sticky-header")).toBeDefined();

    // Has 3 children divs
    expect($("header > div").length).toBe(3);
  });

  it("getSlot method.", function() {
    // Valid indexes
    $("header > div:first").append("<span>test L</span>");
    $("header > div:nth-child(2)").append("<span>test C</span>");
    $("header > div:last").append("<span>test C</span>");

    expect($(header.getSlot(0)).html()).toBe($("header > div:first").html());
    expect($(header.getSlot(1)).html()).toBe($("header > div:nth-child(2)").html());
    expect($(header.getSlot(2)).html()).toBe($("header > div:last").html());

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
    expect($("header > div:first > div").length).toBe(1);
    // Its HTML is the same as fixture's
    expect($("header > div:first > div").first().html()).toBe(fixtureHtml);
    // It has the data-sticky-header-item-id attribute set
    expect($("header > div:first > div").first().attr("data-sticky-header-item-id")).toBeDefined();
    // The header is visible after the header item addition
    expect($("header").is(":visible")).toBe(true);

    // Add to the central slot
    var centralSlotHtml = ($("[data-sticky-header-item]").first().clone().wrap("<div />").parent().html()).replace("L", "C");
    $(".container").append(centralSlotHtml);

    var itemC = new $.fn.stickyHeader.Item($("[data-sticky-header-item]").eq(1));
    $(window).scroll();
    header.add(itemC);

    expect($("header > div:nth-child(2) > div").length).toBe(1);
    expect($("header > div:nth-child(2) > div").first().html()).toBe(fixtureHtml);
    expect($("header > div:nth-child(2) > div").first().attr("data-sticky-header-item-id")).toBeDefined();
    expect($("header").is(":visible")).toBe(true);

    // Add to the right slot
    var rightSlotHtml = ($("[data-sticky-header-item]").first().clone().wrap("<div />").parent().html()).replace("L", "R");
    $(".container").append(rightSlotHtml);

    var itemR = new $.fn.stickyHeader.Item($("[data-sticky-header-item]").eq(2));
    $(window).scroll();
    header.add(itemR);

    expect($("header > div:nth-child(3) > div").length).toBe(1);
    expect($("header > div:nth-child(3) > div").first().html()).toBe(fixtureHtml);
    expect($("header > div:nth-child(3) > div").first().attr("data-sticky-header-item-id")).toBeDefined();
    expect($("header").is(":visible")).toBe(true);
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
