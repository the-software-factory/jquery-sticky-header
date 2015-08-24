$(function() {
    // Init
    $(".sticky-header").hide();

    var header = $(".sticky-header");

    $(window).scroll(function() {

      if(header.find("> .left > div").length === 0) {
        header.hide();
      }
      else {
        header.show();
      }

      function isHidden(item) {
        var headerHeight = header.is(":visible") ? header.height() : 0;

        return ($(window).scrollTop()  + headerHeight) >= ($(item).offset().top + $(item).height())
      }

      function inHeader(item) {
        return header.find("[data-id=" + $(item).attr("id") + "]").length !== 0;
      }

      function removeFromHeader(item) {
        header.find("[data-id=" + $(item).attr("id") + "]").remove();
      }

      function addToHeader(item) {
        var options = JSON.parse($(item).attr("options"));
        var slot = header.find(".left");

        if (options.position === "L") {
          slot = header.find(".left");
        }
        else if(options.position === "C") {
          slot = header.find(".center");
        }
        else if(options.position === "R") {
          slot = header.find(".right");
        }

        slot.append("<div data-id='" + $(item).attr("id") + "'>" + options.title + "</div>");
      }

      $(".sticky").each(function() {
        if (!isHidden(this) && inHeader(this)) {
          removeFromHeader(this);
        }
        else if(isHidden(this) && !inHeader(this)) {
          addToHeader(this);
        }
      });
    });

});
