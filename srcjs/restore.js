$(() => {
  window.Shiny.addCustomMessageHandler("restored-tab", (msg) => {
    console.log(msg);
    setTimeout(() => {
      $(`#${msg.id}`)
        .find(".stack")
        .find("button.action-button.btn-success")
        .trigger("click");
    }, 1250);
  });
});
