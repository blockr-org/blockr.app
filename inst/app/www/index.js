(()=>{let e=!1;const t=()=>{if(!e)return;const t=$(".bslib-sidebar-layout");t.find(".sidebar").hide(),t.find(".collapse-toggle").trigger("click"),t.find(".collapse-toggle").hide(),$(".add-stack-wrapper").hide()},d=e=>{e.message["shiny-insert-tab"]&&setTimeout((()=>{t()}),250)};$((()=>{$(document).on("shiny:message",d),$(document).on("blockr:lock",(d=>{e=d.detail.locked,t()})),setTimeout((()=>{$(".navbar-collapse").append('<form class="d-flex">\n        <input id="addTitle" class="form-control me-2" type="text" placeholder="Tab title">\n        <button id="addSubmit" class="btn btn-outline-dark" type="submit">Add</button>\n      </form>'),$("#addSubmit").on("click",(()=>{const e=$("#addTitle"),t=e.val();t?(e.removeClass("is-invalid"),e.val(""),window.Shiny.setInputValue("addTab",t)):e.addClass("is-invalid")}))}),1e3)}))})();