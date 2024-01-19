import { addTab } from "./add-tab";

let locked = false;

const lockDash = () => {
  if (!locked) return;

  const $layouts = $(".bslib-sidebar-layout");

  $layouts.find(".sidebar").hide();
  $layouts.find(".collapse-toggle").trigger("click");
  $layouts.find(".collapse-toggle").hide();
  $("#add-tab-form").remove();
  $(".add-row").remove();
  $(".remove-row").remove();
  $(".add-stack-wrapper").hide();

  setTimeout(() => {
    $("#add-tab-form")?.remove();
  }, 1000);
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
});
