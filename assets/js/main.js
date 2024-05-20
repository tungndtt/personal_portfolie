/*
	Astral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
  var $window = $(window),
    $body = $("body"),
    $wrapper = $("#wrapper"),
    $main = $("#main"),
    $panels = $main.children(".panel"),
    $nav = $("#nav"),
    $nav_links = $nav.children("a");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["361px", "736px"],
    xsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Nav.
  $nav_links.on("click", function (event) {
    var href = $(this).attr("href");

    // Not a panel link? Bail.
    if (href.charAt(0) != "#" || $panels.filter(href).length == 0) return;

    // Prevent default.
    event.preventDefault();
    event.stopPropagation();

    // Change panels.
    if (window.location.hash != href) window.location.hash = href;
  });

  // Panels.

  // Initialize.
  (function () {
    var $panel, $link;

    // Get panel, link.
    if (window.location.hash) {
      $panel = $panels.filter(window.location.hash);
      $link = $nav_links.filter('[href="' + window.location.hash + '"]');
    }

    // No panel/link? Default to first.
    if (!$panel || $panel.length == 0) {
      $panel = $panels.first();
      $link = $nav_links.first();
    }

    // Deactivate all panels except this one.
    $panels.not($panel).addClass("inactive").hide();

    // Activate link.
    $link.addClass("active");

    // Reset scroll.
    $window.scrollTop(0);
  })();

  // Hashchange event.
  $window.on("hashchange", function (event) {
    var $panel, $link;

    // Get panel, link.
    if (window.location.hash) {
      $panel = $panels.filter(window.location.hash);
      $link = $nav_links.filter('[href="' + window.location.hash + '"]');

      // No target panel? Bail.
      if ($panel.length == 0) return;
    }

    // No panel/link? Default to first.
    else {
      $panel = $panels.first();
      $link = $nav_links.first();
    }

    // Deactivate all panels.
    $panels.addClass("inactive");

    // Deactivate all links.
    $nav_links.removeClass("active");

    // Activate target link.
    $link.addClass("active");

    // Set max/min height.
    $main
      .css("max-height", $main.height() + "px")
      .css("min-height", $main.height() + "px");

    // Delay.
    setTimeout(function () {
      // Hide all panels.
      $panels.hide();

      // Show target panel.
      $panel.show();

      // Set new max/min height.
      $main
        .css("max-height", $panel.outerHeight() + "px")
        .css("min-height", $panel.outerHeight() + "px");

      // Reset scroll.
      $window.scrollTop(0);

      // Delay.
      window.setTimeout(
        function () {
          // Activate target panel.
          $panel.removeClass("inactive");

          // Clear max/min height.
          $main.css("max-height", "").css("min-height", "");

          // IE: Refresh.
          $window.triggerHandler("--refresh");

          // Unlock.
          locked = false;
        },
        breakpoints.active("small") ? 0 : 500
      );
    }, 250);
  });

  // IE: Fixes.
  if (browser.name == "ie") {
    // Fix min-height/flexbox.
    $window.on("--refresh", function () {
      $wrapper.css("height", "auto");

      window.setTimeout(function () {
        var h = $wrapper.height(),
          wh = $window.height();

        if (h < wh) $wrapper.css("height", "100vh");
      }, 0);
    });

    $window.on("resize load", function () {
      $window.triggerHandler("--refresh");
    });

    // Fix intro pic.
    $(".panel.intro").each(function () {
      var $pic = $(this).children(".pic"),
        $img = $pic.children("img");

      $pic
        .css("background-image", "url(" + $img.attr("src") + ")")
        .css("background-size", "cover")
        .css("background-position", "center");

      $img.css("visibility", "hidden");
    });
  }

  var coll = document.getElementsByClassName("collapsible");
  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("collapse-active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }

  var delay = function (elem) {
    var timeout = null;
    elem.onmouseenter = function () {
      timeout = setTimeout(
        () => $(this).find(".description").slideDown(300),
        500
      );
    };

    elem.onmouseleave = function () {
      $(this).find(".description").slideUp(500);
      clearTimeout(timeout);
    };
  };
  var listItems = document.getElementsByClassName("list-item");
  for (var i = 0; i < listItems.length; i++) {
    delay(listItems[i]);
  }
})(jQuery);

function downloadResume() {
  const element = document.createElement("a");
  element.setAttribute("href", "./static/resume.pdf");
  element.setAttribute("download", "resume.pdf");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function toggleItemDetails(event) {
  const item = event.currentTarget.parentNode;
  const expandable = item.querySelector(".expandable");
  const title = item.querySelector(".title");
  const timestamp = item.querySelector(".timestamp");
  const icon = item.querySelector(".icon");
  if (expandable.clientHeight) {
    expandable.style.height = 0;
    title.style.display = "block";
    timestamp.style.display = "none";
    icon.style.transform = "none";
  } else {
    var details = expandable.querySelector(".details");
    expandable.style.height = details.clientHeight + "px";
    title.style.display = "none";
    timestamp.style.display = "block";
    icon.style.transform = "rotate(90deg)";
  }
}

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element + " p").text()).select();
  document.execCommand("copy");
  $temp.remove();
  $(element + " span").removeClass("fa-copy");
  $(element + " span").addClass("fa-check");
  setTimeout(() => {
    $(element + " span").removeClass("fa-check");
    $(element + " span").addClass("fa-copy");
  }, 4000);
}
