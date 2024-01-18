/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************!*\
  !*** ./srcjs/index.js ***!
  \************************/
let locked = false;
const lockDash = () => {
  if(!locked) return;

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
    locked = e.detail.locked;
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBsb2NrZWQgPSBmYWxzZTtcbmNvbnN0IGxvY2tEYXNoID0gKCkgPT4ge1xuICBpZighbG9ja2VkKSByZXR1cm47XG5cbiAgY29uc3QgJGxheW91dHMgPSAkKFwiLmJzbGliLXNpZGViYXItbGF5b3V0XCIpO1xuXG4gICRsYXlvdXRzLmZpbmQoXCIuc2lkZWJhclwiKS5oaWRlKCk7XG4gICRsYXlvdXRzLmZpbmQoXCIuY29sbGFwc2UtdG9nZ2xlXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgJGxheW91dHMuZmluZChcIi5jb2xsYXBzZS10b2dnbGVcIikuaGlkZSgpO1xuICAkKFwiLmFkZC1zdGFjay13cmFwcGVyXCIpLmhpZGUoKTtcbn07XG5cbmNvbnN0IG9uVGFiUmVuZGVyZWQgPSAoZSkgPT4ge1xuICBpZiAoIWUubWVzc2FnZVtcInNoaW55LWluc2VydC10YWJcIl0pIHJldHVybjtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgbG9ja0Rhc2goKTtcbiAgfSwgMjUwKTtcbn07XG5cbiQoKCkgPT4ge1xuICAkKGRvY3VtZW50KS5vbihcInNoaW55Om1lc3NhZ2VcIiwgb25UYWJSZW5kZXJlZCk7XG4gICQoZG9jdW1lbnQpLm9uKFwiYmxvY2tyOmxvY2tcIiwgKGUpID0+IHtcbiAgICBsb2NrZWQgPSBlLmRldGFpbC5sb2NrZWQ7XG4gICAgbG9ja0Rhc2goKTtcbiAgfSk7XG5cbiAgLy8gdGhpcyBpcyB0aGUgd2VpcmRlc3QgdGhpbmcsIHBlcmhhcHMgbm90IHN1cnByaXNpbmcgZnJvbSBTaGlueVxuICAvLyBhZGRpbmcgdGhpcyB3aWh0b3V0IGEgbWFzc2l2ZSB0aW1lb3V0IGJyZWFrcy4uLiB0aGUgd2Vic29ja2V0XG4gIC8vIGFuZCBTaGlueS5zZXRJbnB1dFZhbHVlIG9yIGFueSBvdGhlciBzaGlueSBmdW5jdGlvbiBzdG9wIHdvcmtpbmdcbiAgLy8gb3IgYXJlIHN0YWdnZXJlZC5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgJChcIi5uYXZiYXItY29sbGFwc2VcIikuYXBwZW5kKFxuICAgICAgYDxmb3JtIGNsYXNzPVwiZC1mbGV4XCI+XG4gICAgICAgIDxpbnB1dCBpZD1cImFkZFRpdGxlXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgbWUtMlwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJUYWIgdGl0bGVcIj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImFkZFN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1vdXRsaW5lLWRhcmtcIiB0eXBlPVwic3VibWl0XCI+QWRkPC9idXR0b24+XG4gICAgICA8L2Zvcm0+YCxcbiAgICApO1xuXG4gICAgJChcIiNhZGRTdWJtaXRcIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCAkZWwgPSAkKFwiI2FkZFRpdGxlXCIpO1xuICAgICAgY29uc3QgdGl0bGUgPSAkZWwudmFsKCk7XG5cbiAgICAgIGlmICghdGl0bGUpIHtcbiAgICAgICAgJGVsLmFkZENsYXNzKFwiaXMtaW52YWxpZFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkZWwucmVtb3ZlQ2xhc3MoXCJpcy1pbnZhbGlkXCIpO1xuICAgICAgJGVsLnZhbChcIlwiKTtcblxuICAgICAgd2luZG93LlNoaW55LnNldElucHV0VmFsdWUoXCJhZGRUYWJcIiwgdGl0bGUpO1xuICAgIH0pO1xuICB9LCAxMDAwKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9