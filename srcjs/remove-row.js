window.Shiny.addCustomMessageHandler("blockr-app-bind-remove", (msg) => {
  $(".remove-row").off("click");

  $(".remove-row").on("click", (event) => {
    // capture stacks contained in the row
    const stacks = [];
    $(event.target)
      .closest(".masonry-row")
      .find(".stack")
      .each((_, el) => {
        stacks.push($(el).attr("id"));
      });

    // remove row from DOM
    const input = $(event.target).data("id");
    window.Shiny.setInputValue("removeRow", {
      tab: input,
      stacks: stacks,
    });
    $(event.target).closest(".masonry-row").remove();
  });
});
