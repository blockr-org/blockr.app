/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./srcjs/lock.js":
/*!***********************!*\
  !*** ./srcjs/lock.js ***!
  \***********************/
/***/ (() => {

let locked = false;

const lockDash = () => {
  if (!locked) return;

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


/***/ }),

/***/ "./srcjs/remove-row.js":
/*!*****************************!*\
  !*** ./srcjs/remove-row.js ***!
  \*****************************/
/***/ (() => {

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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./srcjs/index.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lock_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lock.js */ "./srcjs/lock.js");
/* harmony import */ var _lock_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lock_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _remove_row_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./remove-row.js */ "./srcjs/remove-row.js");
/* harmony import */ var _remove_row_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_remove_row_js__WEBPACK_IMPORTED_MODULE_1__);



})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7O0FDdEREO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7O1VDckJEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7O0FDTm1CO0FBQ00iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ibG9ja3IuYXBwLy4vc3JjanMvbG9jay5qcyIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwLy4vc3JjanMvcmVtb3ZlLXJvdy5qcyIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Jsb2Nrci5hcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Jsb2Nrci5hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwLy4vc3JjanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGxvY2tlZCA9IGZhbHNlO1xuXG5jb25zdCBsb2NrRGFzaCA9ICgpID0+IHtcbiAgaWYgKCFsb2NrZWQpIHJldHVybjtcblxuICBjb25zdCAkbGF5b3V0cyA9ICQoXCIuYnNsaWItc2lkZWJhci1sYXlvdXRcIik7XG5cbiAgJGxheW91dHMuZmluZChcIi5zaWRlYmFyXCIpLmhpZGUoKTtcbiAgJGxheW91dHMuZmluZChcIi5jb2xsYXBzZS10b2dnbGVcIikudHJpZ2dlcihcImNsaWNrXCIpO1xuICAkbGF5b3V0cy5maW5kKFwiLmNvbGxhcHNlLXRvZ2dsZVwiKS5oaWRlKCk7XG4gICQoXCIuYWRkLXN0YWNrLXdyYXBwZXJcIikuaGlkZSgpO1xufTtcblxuY29uc3Qgb25UYWJSZW5kZXJlZCA9IChlKSA9PiB7XG4gIGlmICghZS5tZXNzYWdlW1wic2hpbnktaW5zZXJ0LXRhYlwiXSkgcmV0dXJuO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBsb2NrRGFzaCgpO1xuICB9LCAyNTApO1xufTtcblxuJCgoKSA9PiB7XG4gICQoZG9jdW1lbnQpLm9uKFwic2hpbnk6bWVzc2FnZVwiLCBvblRhYlJlbmRlcmVkKTtcbiAgJChkb2N1bWVudCkub24oXCJibG9ja3I6bG9ja1wiLCAoZSkgPT4ge1xuICAgIGxvY2tlZCA9IGUuZGV0YWlsLmxvY2tlZDtcbiAgICBsb2NrRGFzaCgpO1xuICB9KTtcblxuICAvLyB0aGlzIGlzIHRoZSB3ZWlyZGVzdCB0aGluZywgcGVyaGFwcyBub3Qgc3VycHJpc2luZyBmcm9tIFNoaW55XG4gIC8vIGFkZGluZyB0aGlzIHdpaHRvdXQgYSBtYXNzaXZlIHRpbWVvdXQgYnJlYWtzLi4uIHRoZSB3ZWJzb2NrZXRcbiAgLy8gYW5kIFNoaW55LnNldElucHV0VmFsdWUgb3IgYW55IG90aGVyIHNoaW55IGZ1bmN0aW9uIHN0b3Agd29ya2luZ1xuICAvLyBvciBhcmUgc3RhZ2dlcmVkLlxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAkKFwiLm5hdmJhci1jb2xsYXBzZVwiKS5hcHBlbmQoXG4gICAgICBgPGZvcm0gY2xhc3M9XCJkLWZsZXhcIj5cbiAgICAgICAgPGlucHV0IGlkPVwiYWRkVGl0bGVcIiBjbGFzcz1cImZvcm0tY29udHJvbCBtZS0yXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlRhYiB0aXRsZVwiPlxuICAgICAgICA8YnV0dG9uIGlkPVwiYWRkU3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLW91dGxpbmUtZGFya1wiIHR5cGU9XCJzdWJtaXRcIj5BZGQ8L2J1dHRvbj5cbiAgICAgIDwvZm9ybT5gLFxuICAgICk7XG5cbiAgICAkKFwiI2FkZFN1Ym1pdFwiKS5vbihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGNvbnN0ICRlbCA9ICQoXCIjYWRkVGl0bGVcIik7XG4gICAgICBjb25zdCB0aXRsZSA9ICRlbC52YWwoKTtcblxuICAgICAgaWYgKCF0aXRsZSkge1xuICAgICAgICAkZWwuYWRkQ2xhc3MoXCJpcy1pbnZhbGlkXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICRlbC5yZW1vdmVDbGFzcyhcImlzLWludmFsaWRcIik7XG4gICAgICAkZWwudmFsKFwiXCIpO1xuXG4gICAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShcImFkZFRhYlwiLCB0aXRsZSk7XG4gICAgfSk7XG4gIH0sIDEwMDApO1xufSk7XG4iLCJ3aW5kb3cuU2hpbnkuYWRkQ3VzdG9tTWVzc2FnZUhhbmRsZXIoXCJibG9ja3ItYXBwLWJpbmQtcmVtb3ZlXCIsIChtc2cpID0+IHtcbiAgJChcIi5yZW1vdmUtcm93XCIpLm9mZihcImNsaWNrXCIpO1xuXG4gICQoXCIucmVtb3ZlLXJvd1wiKS5vbihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgIC8vIGNhcHR1cmUgc3RhY2tzIGNvbnRhaW5lZCBpbiB0aGUgcm93XG4gICAgY29uc3Qgc3RhY2tzID0gW107XG4gICAgJChldmVudC50YXJnZXQpXG4gICAgICAuY2xvc2VzdChcIi5tYXNvbnJ5LXJvd1wiKVxuICAgICAgLmZpbmQoXCIuc3RhY2tcIilcbiAgICAgIC5lYWNoKChfLCBlbCkgPT4ge1xuICAgICAgICBzdGFja3MucHVzaCgkKGVsKS5hdHRyKFwiaWRcIikpO1xuICAgICAgfSk7XG5cbiAgICAvLyByZW1vdmUgcm93IGZyb20gRE9NXG4gICAgY29uc3QgaW5wdXQgPSAkKGV2ZW50LnRhcmdldCkuZGF0YShcImlkXCIpO1xuICAgIHdpbmRvdy5TaGlueS5zZXRJbnB1dFZhbHVlKFwicmVtb3ZlUm93XCIsIHtcbiAgICAgIHRhYjogaW5wdXQsXG4gICAgICBzdGFja3M6IHN0YWNrcyxcbiAgICB9KTtcbiAgICAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdChcIi5tYXNvbnJ5LXJvd1wiKS5yZW1vdmUoKTtcbiAgfSk7XG59KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2xvY2suanNcIjtcbmltcG9ydCBcIi4vcmVtb3ZlLXJvdy5qc1wiO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9