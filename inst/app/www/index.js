(()=>{var t={793:()=>{window.Shiny.addCustomMessageHandler("blockr-app-bind-remove",(t=>{$(".remove-row").off("click"),$(".remove-row").on("click",(t=>{const e=[];$(t.target).closest(".masonry-row").find(".stack").each(((t,o)=>{e.push($(o).attr("id"))}));const o=$(t.target).data("id");window.Shiny.setInputValue("removeRow",{tab:o,stacks:e}),$(t.target).closest(".masonry-row").remove()}))}))},566:()=>{$((()=>{window.Shiny.addCustomMessageHandler("restored-tab",(t=>{console.log(t),setTimeout((()=>{$(`#${t.id}`).find(".stack").find("button.action-button.btn-success").trigger("click")}),1250)}))}))},501:()=>{window.Shiny.addCustomMessageHandler("remove-tab",(function(t){setTimeout((()=>{$(".remove-tab").off("click"),$(".remove-tab").on("click",(t=>{let e=[];$(t.target).closest(".tab-pane").find(".stack").each(((t,o)=>{e.push($(o).attr("id"))}));const o=$(t.currentTarget).attr("id");window.Shiny.setInputValue(o,e)}))}),500)}))},539:()=>{$((()=>{$(document).on("shiny:message",(e=>{e.message["shiny-insert-tab"]&&setTimeout((()=>{t()}),1e3)}))}));const t=()=>{const t=$(".tab-title");t.off("click"),t.on("click",(()=>{t.replaceWith(`<input type="text" class="tab-title-input form-control form-control-sm mx-1" value="${t.text()}">`),e(t.text())}))},e=t=>{$(".tab-title-input").off("keydown"),$(".tab-title-input").on("keydown",(e=>{if("Enter"!==e.key)return;const o=$(e.target).val();$(e.target).replaceWith(`<h1 class="tab-title cursor-pointer">${o}</h1>`),$(document).find(`[data-value='${t}']`).attr("data-value",o),t()}))}}},e={};function o(i){var n=e[i];if(void 0!==n)return n.exports;var a=e[i]={exports:{}};return t[i](a,a.exports,o),a.exports}(()=>{"use strict";let t=!1;const e=()=>{if(!t)return void $("body").removeClass("blockr-locked");$("body").addClass("blockr-locked"),$(".remove-tab").hide();const e=$(".bslib-sidebar-layout");$(".tab-title").off("click"),e.find(".sidebar").hide(),e.find(".collapse-toggle").trigger("click"),e.find(".collapse-toggle").hide(),$(".add-stack-wrapper").hide(),$(".bslib-sidebar-layout > .main").css("grid-column","1/3"),$(".masonry-item").css("resize","none")},i=t=>{t.message["shiny-insert-tab"]&&setTimeout((()=>{e()}),250)};$((()=>{$(document).on("shiny:message",i),$(document).on("blockr:lock",(o=>{t=o.detail.locked,e()})),(t=>{t||setTimeout((()=>{$(".navbar-collapse").append('<form class="d-flex" id="add-tab-form">\n        <input id="addTitle" class="form-control me-2" type="text" placeholder="Tab title">\n        <button id="addSubmit" class="btn btn-outline-dark" type="submit">Add</button>\n      </form>'),$("#addSubmit").on("click",(()=>{const t=$("#addTitle"),e=t.val();e?(t.removeClass("is-invalid"),t.val(""),window.Shiny.setInputValue("addTab",e)):t.addClass("is-invalid")}))}),1e3)})(t),window.Shiny.addCustomMessageHandler("bind-lock",(t=>{setTimeout((()=>{$("#lockName").on("keyup",(t=>{"Enter"==t.key&&$("#lock").click()})),$("#lock").on("click",(()=>{const t=$("#lockName").val();""!==t?t.includes(" ")?window.Shiny.notifications.show({html:"Title cannot include spaces",type:"error"}):window.Shiny.setInputValue("lock",{title:t}):window.Shiny.notifications.show({html:"Missing title",type:"error"})}))}),250)}))})),o(793),o(539),o(501),o(566)})()})();