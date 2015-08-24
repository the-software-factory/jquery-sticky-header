$(function() {
    // Init
    $(".sticky-header").hide();

    var header = $(".sticky-header");

    $(window).scroll(function() {
      if(header.find("> .left > div").length === 0) {
        header.hide();
      }

      $(".sticky").each(function() {
        if (header.is(":visible")) {
          // Sticky item was hidden
          if (($(window).scrollTop()  + header.height()) >= ($(this).offset().top + $(this).height())) {
            // If element wasn't appended yet
            if (header.find("[data-id=" + $(this).attr("id") + "]").length === 0) {
              //append it to header
              header.find(".left").append("<div data-id='" + $(this).attr("id") + "'>" + $(this).attr("id") + "</div>");
            }
          } else {
            if (header.find("[data-id=" + $(this).attr("id") + "]").length !== 0) {console.log("hey, there si an item to remove");
              header.find("[data-id=" + $(this).attr("id") + "]").remove();
            }
          }
        }
        // If header is hidden
        else {
          // if element was hidden
          if ($(window).scrollTop() > ($(this).offset().top + $(this).height())) {
            header.show();
            if (header.find("[data-id=" + $(this).attr("id") + "]").length === 0) {
              header.find(".left").append("<div data-id='" + $(this).attr("id") + "'>" + $(this).attr("id") + "</div>");
            }
          }
          }

      });
    });

});
