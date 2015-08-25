$(function() {
    // Init
    $(".sticky-header").hide();

    var header = $(".sticky-header");

    $(window).scroll(function() {

      if(header.find(".header-item").length === 0) {
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
        var position = options.position;
        var html = options.html || $(item).clone().html();
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
console.log($(item).attr("id"));
        slot.append(html).children().last().addClass("header-item").attr("data-id", $(item).attr("id")).attr("asd", "foobar");
        //slot.append("<div data-id='" + $(item).attr("id") + "' class='header-item'>" + title + "</div>");
      }

      $(".sticky").each(function() {
        if (!isHidden(this) && inHeader(this)) {console.log("removing");
          removeFromHeader(this);
        }
        else if(isHidden(this) && !inHeader(this)) {console.log("adding");
          addToHeader(this);
        }
      });
    });

});
