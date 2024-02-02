window.Shiny.addCustomMessageHandler("remove-tab", function (msg) {
  setTimeout(() => {
    $(".remove-tab").off("click");

    $(".remove-tab").on("click", (e) => {
      let ids = [];
      $(e.target)
        .closest(".tab-pane")
        .find(".stack")
        .each((_index, el) => {
          ids.push($(el).attr("id"));
        });

      const id = $(e.currentTarget).attr("id");

      window.Shiny.setInputValue(id, ids);
    });
  }, 500);
});
