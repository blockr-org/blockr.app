$(() => {
  setTimeout(() => {
    $("#add-tab-form").prepend(
      `<div class="form-check form-switch w-50">
        <input id="autosave" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
        <label class="form-check-label" for="flexSwitchCheckDefault">Auto save</label>
      </div>`,
    );

    $("#autosave").on("change", (e) => {
      const state = $(e.target).prop("checked");
      window.Shiny.setInputValue("autosave", state);
    });
  }, 1500);
});
