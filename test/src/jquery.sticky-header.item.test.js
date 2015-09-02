describe("jQuery Sticky Header item tests", function() {

  var fixtureHtml = "<span>test</span>";
  var fixture = '<button data-sticky-header-item=\'{"position": "L", "html": "' + fixtureHtml + '"}\'>Button 1</button>';

  beforeEach(function() {
    $("header").remove();
    $(".container").remove();

    $("body").append("<header><div data-sticky-header-container></div></header>");
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
    var item = new $.fn.stickyHeader.Item($("[data-sticky-header-item]"));
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
    var item = new $.fn.stickyHeader.Item($("[data-sticky-header-item]"));
    item.setId("testId");

    expect($("[data-sticky-header-item]").first().attr("data-sticky-header-item-id")).toBeDefined();
  });

  it("getId method.", function() {
    $("[data-sticky-header-item]").first().attr("data-sticky-header-item-id", "123");
    var item = new $.fn.stickyHeader.Item($("[data-sticky-header-item]"));

    expect(item.getId()).toBe("123");
  });

  it("getPosition method.", function() {
    var item = new $.fn.stickyHeader.Item($("[data-sticky-header-item]"));

    expect(item.getPosition()).toBe("L");
  });

  it("getHtml method.", function() {
    var item = new $.fn.stickyHeader.Item($("[data-sticky-header-item]"));

    expect(item.getHtml()).toBe("<span>test</span>");
  });
});
