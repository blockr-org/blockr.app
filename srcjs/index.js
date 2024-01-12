const lockDash = () => {
  const $layouts = $(".bslib-sidebar-layout");

  $layouts.find(".sidebar").hide();
  $layouts.find(".collapse-toggle").trigger("click");
  $layouts.find(".collapse-toggle").hide();
  $(".add-stack-wrapper").hide();
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
    if (!e.detail.locked) return;
    lockDash();
  });

  // this is the weirdest thing, perhaps not surprising from Shiny
  // adding this wihtout a massive timeout breaks... the websocket
  // and Shiny.setInputValue or any other shiny function stop working
  // or are staggered.
  setTimeout(() => {
    $(".navbar-collapse").append(
      `<form class="d-flex">
        <input id="addTitle" class="form-control me-2" type="text" placeholder="Tab title">
        <button id="addSubmit" class="btn btn-outline-dark" type="submit">Add</button>
      </form>`,
    );

    $("#addSubmit").on("click", () => {
      const $el = $("#addTitle");
      const title = $el.val();

      if (!title) {
        $el.addClass("is-invalid");
        return;
      }

      $el.removeClass("is-invalid");
      $el.val("");

      window.Shiny.setInputValue("addTab", title);
    });
  }, 1000);
});
