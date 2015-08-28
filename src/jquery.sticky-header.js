$(function() {
    $(".sticky-header").hide();

    var header = $(".sticky-header");

    $(window).scroll(function() {
      function isHidden(item) {
        var headerHeight = header.is(":visible") ? header.height() : 0;

        return ($(window).scrollTop()  + headerHeight) >= ($(item).offset().top + $(item).height())
      }

      function inHeader(item) {
        return header.find("[data-id=" + $(item).attr("id") + "]").length !== 0;
      }

      function removeFromHeader(item) {
        header.find("[data-id=" + $(item).attr("id") + "]").remove();

        if (header.find(".header-item").length === 0) {
          header.slideUp(200);
        }
      }

      function addToHeader(item) {
        var options = JSON.parse($(item).attr("options"));
        var position = options.position;
        var html;

        if (typeof options.html === "string") {
          html = options.html;
        }
        else {
          html = $(item).clone().addClass("header-item").wrap('<div>').parent().html()
        }

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
        slot.append(html).children().last().addClass("header-item").attr("data-id", $(item).attr("id")).attr("asd", "foobar");

        header.slideDown(200);
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
