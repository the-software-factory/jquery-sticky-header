describe("jQuery Sticky Header item tests", function() {

  var fixtureHtml = "<span>test</span>";
  var fixture = '<button data-sticky-header-item=\'{"position": "L", "html": "' + fixtureHtml + '"}\'>Button 1</button>';

  beforeEach(function() {
    $("header").remove();
    $(".container").remove();

    $("body").append("<header><div " + options.headerContainerAttribute + "></div></header>");
    $("body").append("<div class='container'></div>");

    $(".container").append(fixture);

    $("header").stickyHeader();
  });

  it("item object.", function() {
    expect(jQuery.fn.stickyHeader.Item).toBeDefined();
  });

// TODO: Find a way to scroll down in PhantomJS; the classic windows.scrollTo() doesn't work
/*
  it("isHidden", function() {
    // Visible item
    var header = new $.fn.stickyHeader.Container($("header"));
    var item = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]"));
    $(window).scroll();
    header.add(item);

    expect(item.isHidden(window, header)).toBe(false);

    // Hidden item
    for (var i = 0; i < 100; i++) {
      $(".container").append("<div>test</div>");
    }

    window.scrollTo(1000, 1000);

    expect(item.isHidden(window, header)).toBe(true);
  });
*/

  it("setId method.", function() {
    var item = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]"), options);
    item.setId("testId");

    expect($("[" + options.itemAttribute + "]").first().attr(options.itemIdAttribute)).toBeDefined();
  });

  it("getId method.", function() {
    $("[" + options.itemAttribute + "]").first().attr(options.itemIdAttribute, "123");
    var item = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]"), options);

    expect(item.getId()).toBe("123");
  });

  it("getPosition method.", function() {
    var item = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]"), options);

    expect(item.getPosition()).toBe("L");
  });

  it("getHtml method.", function() {
    // Custom HTML was specified
    var item = new $.fn.stickyHeader.Item($("[" + options.itemAttribute + "]"), options);

    expect(item.getHtml()).toBe("<span>test</span>");

    // Custom HTML was not specified
    $(".container").append('<button ' + options.itemAttribute + '="{}" nohtml>button</button>');
    var anotherItem = new $.fn.stickyHeader.Item($("[nohtml]"), options);

    expect($("[nohtml]").wrap("<div />").parent().html()).toBe(anotherItem.getHtml().wrap("<div />").parent().html());
  });

  it("isRemoved method.", function() {
    var item = new $.fn.stickyHeader.Item($("<div></div>"), options);

    expect(item.isRemoved()).toBe(false);

    var anotherItem = new $.fn.stickyHeader.Item($("<div></div>").attr(options.itemRemovedAttribute, "1"), options);

    expect(anotherItem.isRemoved()).toBe(true);
  });

  it("setAsRemoved method.", function() {
    var element = $("<div></div>");
    var item = new $.fn.stickyHeader.Item(element, options);

    item.setAsRemoved();

    expect(element.attr(options.itemRemovedAttribute)).toBe("1");
  });
});
