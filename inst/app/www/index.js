(()=>{const e=()=>{const e=$(".bslib-sidebar-layout");e.find(".sidebar").hide(),e.find(".collapse-toggle").trigger("click"),e.find(".collapse-toggle").hide(),$(".add-stack-wrapper").hide()},t=t=>{t.message["shiny-insert-tab"]&&setTimeout((()=>{e()}),250)};$((()=>{$(document).on("shiny:message",t),$(document).on("blockr:lock",(t=>{t.detail.locked&&e()})),setTimeout((()=>{$(".navbar-collapse").append('<form class="d-flex">\n        <input id="addTitle" class="form-control me-2" type="text" placeholder="Tab title">\n        <button id="addSubmit" class="btn btn-outline-dark" type="submit">Add</button>\n      </form>'),$("#addSubmit").on("click",(()=>{const e=$("#addTitle"),t=e.val();t?(e.removeClass("is-invalid"),e.val(""),window.Shiny.setInputValue("addTab",t)):e.addClass("is-invalid")}))}),1e3)}))})();