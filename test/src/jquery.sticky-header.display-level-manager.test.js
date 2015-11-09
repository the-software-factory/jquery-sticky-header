describe("jQuery Sticky Header display level manager", function() {

  var fixtureHtml = "<span>test</span>";
  var fixture = '<button data-sticky-header-item=\'{"position": "L", "html": "' + fixtureHtml + '"}\'>Button 1</button>';
  var newDisplayLevelFixture = '<button data-sticky-header-item=\'{"position": "L", "newDisplayLevel": "true", "html": "' + fixtureHtml + '"}\'>Button 1</button>';

  var headerContainer;
  var displayLevelManager;

  beforeEach(function() {
    $("header").remove();
    $(".container").remove();

    $("body").append("<header><div " + options.headerContainerAttribute + "></div></header>");
    $("body").append("<div class='container'></div>");

    // The items must have the same target slot in order to test the display level manager properly
    $(".container").append(fixture);
    $(".container").append(fixture);

    $("header").stickyHeader();

    displayLevelManager = new $.fn.stickyHeader.displayLevelManager($("[" + options.headerContainerAttribute + "]"), options);
    headerContainer = new $.fn.stickyHeader.Container($("[" + options.headerContainerAttribute + "]"), options, displayLevelManager);
  });

  afterEach(function() {

  });

  it("goToNextDisplayLevel method", function() {
    var item1 = new $.fn.stickyHeader.Item($('[' + options.itemAttribute + ']').first(), options);
    item1.setId(1);
    var item2 = new $.fn.stickyHeader.Item($('[' + options.itemAttribute + ']').eq(1), options);
    item2.setId(2);

    headerContainer.add(item1);
    headerContainer.add(item2);

    displayLevelManager.goToNextDisplayLevel(item1.getPosition());
    expect($('[' + options.headerSlotPositionAttribute + '=' + item1.getPosition() + ']').find('[' + options.itemIdAttribute + ']').length).toBe(0);
  });

/* TODO: PhantomJS doesn't support Mutation Observers, find a way to test this method
  it("goToPrevDisplayLevel method", function() {

  });
*/

  it("isInLowerDisplayLevels method", function() {
    var item1 = new $.fn.stickyHeader.Item($('[' + options.itemAttribute + ']').first(), options);
    item1.setId(1);
    var item2 = new $.fn.stickyHeader.Item($(newDisplayLevelFixture), options);
    item2.setId(2);

    // The item wasn't added to the header yet
    expect(displayLevelManager.isInLowerDisplayLevels(item1)).toBe(false);
    headerContainer.add(item1);
    // The item was added without creating a new display level
    expect(displayLevelManager.isInLowerDisplayLevels(item1)).toBe(false);

    // The addition of the second item will cause a creation of the new display level as it has a newDisplayLevel option set to `true`
    headerContainer.add(item2);
    // The first item is in the 0 display level
    expect(displayLevelManager.isInLowerDisplayLevels(item1)).toBe(true);
    // The second item is the 1 (current) display level
    expect(displayLevelManager.isInLowerDisplayLevels(item2)).toBe(false);
  });

  it("canCreateDisplayLevel method", function() {
    var item = new $.fn.stickyHeader.Item($('[' + options.itemAttribute + ']').first(), options);
    item.setId(1);

    // The item1 wasn't added into the header yet
    expect(displayLevelManager.canCreateDisplayLevel(item)).toBe(true);
    headerContainer.add(item);
    // The item is inserted into the header but there wasn't a return from the higher level
    expect(displayLevelManager.canCreateDisplayLevel(item)).toBe(true);
  });
});
