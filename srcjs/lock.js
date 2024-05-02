import { addTab } from "./add-tab";

let locked = false;

const lockDash = () => {
  if (!locked) {
    $("body").removeClass("blockr-locked");
    return;
  }

  $("body").addClass("blockr-locked");
  $(".remove-tab").hide();

  const $layouts = $(".bslib-sidebar-layout");
  $(".tab-title").off();

  $layouts.find(".sidebar").hide();
  $layouts.find(".collapse-toggle").trigger("click");
  $layouts.find(".collapse-toggle").hide();
  $(".add-stack-wrapper").hide();
  $(".bslib-sidebar-layout > .main").css("grid-column", "1/3");
  $(".masonry-item").css("resize", "none");
};

const onTabRendered = (e) => {
  if (!e.message["shiny-insert-tab"]) return;
  setTimeout(() => {
    lockDash();
  }, 250);
};

$(() => {
  $(document).on("shiny:message", onTabRendered);
  $(document).on("blockr:lock", (e) => {
    locked = e.detail.locked;
    lockDash();
  });

  addTab(locked);

  $(document).on("shiny:connected", () => {
    const location = window.location.origin + window.location.pathname;
    window.Shiny.setInputValue("href", location, {
      priority: "event",
    });
  });

  window.Shiny.addCustomMessageHandler("saved", (message) => {
    $("#link-wrapper").show();
  });

  $("body").on("keyup", "#lockName", (e) => {
    if (e.key != "Enter") {
      return;
    }

    $("#save").click();
  });

  $("body").on("click", "#save", () => {
    const title = $("#lockName").val();

    if (title === "") {
      window.Shiny.notifications.show({
        html: "Missing title",
        type: "error",
      });
      return;
    }

    if (title.includes(" ")) {
      window.Shiny.notifications.show({
        html: "Title cannot include spaces",
        type: "error",
      });
      return;
    }

    window.Shiny.setInputValue(
      "savethis",
      {
        title: title,
      },
      { priority: "event" },
    );
  });
});
