describe("plugin initialization", function() {
  beforeEach(function() {
    $("body").empty();
  });

  it("sets the header attribtue", function() {
    $("body").append("<header></header>");
    $("header").stickyHeader();

    expect($("header").attr(options.headerAttribute)).toBeDefined();
  });

  it("header becomes container too if there is no one already", function() {
    $("body").append("<header></header>");
    $("header").append("<div dummy></div>");
    $("header").stickyHeader();

    expect($("header").attr(options.headerContainerAttribute)).toBeDefined();
  });

  it("header contaner gets emptied", function() {
    $("body").append("<header></header>");
    $("header").append("<div " + options.headerContainerAttribute + "></div>");
    $("div").append("<div></div><div></div>");
    $("header").stickyHeader();

    expect($("[" + options.headerContainerAttribute + "]").children().length).toBe(0);
  });
});
