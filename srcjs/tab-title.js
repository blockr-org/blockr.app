$(() => {
  $(document).on("shiny:message", (e) => {
    if (!e.message["shiny-insert-tab"]) return;

    setTimeout(() => {
      title();
    }, 1000);
  });
});

const title = () => {
  const $title = $(".tab-title");

  $title.off("click");

  $title.on("click", () => {
    $title.replaceWith(
      `<input type="text" class="tab-title-input form-control form-control-sm mx-1" value="${$title.text()}">`,
    );

    handleStackTitle();
  });
};

const handleStackTitle = () => {
  $(".tab-title-input").off("keydown");

  $(".tab-title-input").on("keydown", (e) => {
    if (e.key !== "Enter") return;

    const newTitle = $(e.target).val();

    $(e.target).replaceWith(
      `<h1 class="tab-title cursor-pointer">${newTitle}</h1>`,
    );

    title();
  });
};
