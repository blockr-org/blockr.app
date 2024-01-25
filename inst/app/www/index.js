/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./srcjs/add-tab.js":
/*!**************************!*\
  !*** ./srcjs/add-tab.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addTab: () => (/* binding */ addTab)
/* harmony export */ });
// this is the weirdest thing, perhaps not surprising from Shiny
// adding this wihtout a massive timeout breaks... the websocket
// and Shiny.setInputValue or any other shiny function stop working
// or are staggered.
const addTab = (locked) => {
  if (locked) return;

  setTimeout(() => {
    $(".navbar-collapse").append(
      `<form class="d-flex" id="add-tab-form">
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
};


/***/ }),

/***/ "./srcjs/lock.js":
/*!***********************!*\
  !*** ./srcjs/lock.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _add_tab__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./add-tab */ "./srcjs/add-tab.js");


let locked = false;

const lockDash = () => {
  if (!locked) {
    $("body").removeClass("blockr-locked");
    return;
  }

  $("body").addClass("blockr-locked");

  const $layouts = $(".bslib-sidebar-layout");
  $(".tab-title").off("click");

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

  (0,_add_tab__WEBPACK_IMPORTED_MODULE_0__.addTab)(locked);
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


/***/ }),

/***/ "./srcjs/tab-title.js":
/*!****************************!*\
  !*** ./srcjs/tab-title.js ***!
  \****************************/
/***/ (() => {

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

    handleStackTitle($title.text());
  });
};

const handleStackTitle = (title) => {
  $(".tab-title-input").off("keydown");

  $(".tab-title-input").on("keydown", (e) => {
    if (e.key !== "Enter") return;

    const newTitle = $(e.target).val();

    $(e.target).replaceWith(
      `<h1 class="tab-title cursor-pointer">${newTitle}</h1>`,
    );

    const $nav = $(document).find(`[data-value='${title}']`);
    $nav.attr("data-value", newTitle);

    title();
  });
};


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
/* harmony import */ var _remove_row_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./remove-row.js */ "./srcjs/remove-row.js");
/* harmony import */ var _remove_row_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_remove_row_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _tab_title_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tab-title.js */ "./srcjs/tab-title.js");
/* harmony import */ var _tab_title_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_tab_title_js__WEBPACK_IMPORTED_MODULE_2__);




})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7OztBQzlCbUM7O0FBRW5DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILEVBQUUsZ0RBQU07QUFDUixDQUFDOzs7Ozs7Ozs7OztBQ3BDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7QUNyQkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsNkZBQTZGLGNBQWM7QUFDM0c7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsOENBQThDLFNBQVM7QUFDdkQ7O0FBRUEsa0RBQWtELE1BQU07QUFDeEQ7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7VUN6Q0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTm1CO0FBQ007QUFDRCIsInNvdXJjZXMiOlsid2VicGFjazovL2Jsb2Nrci5hcHAvLi9zcmNqcy9hZGQtdGFiLmpzIiwid2VicGFjazovL2Jsb2Nrci5hcHAvLi9zcmNqcy9sb2NrLmpzIiwid2VicGFjazovL2Jsb2Nrci5hcHAvLi9zcmNqcy9yZW1vdmUtcm93LmpzIiwid2VicGFjazovL2Jsb2Nrci5hcHAvLi9zcmNqcy90YWItdGl0bGUuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2Jsb2Nrci5hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Jsb2Nrci5hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHRoaXMgaXMgdGhlIHdlaXJkZXN0IHRoaW5nLCBwZXJoYXBzIG5vdCBzdXJwcmlzaW5nIGZyb20gU2hpbnlcbi8vIGFkZGluZyB0aGlzIHdpaHRvdXQgYSBtYXNzaXZlIHRpbWVvdXQgYnJlYWtzLi4uIHRoZSB3ZWJzb2NrZXRcbi8vIGFuZCBTaGlueS5zZXRJbnB1dFZhbHVlIG9yIGFueSBvdGhlciBzaGlueSBmdW5jdGlvbiBzdG9wIHdvcmtpbmdcbi8vIG9yIGFyZSBzdGFnZ2VyZWQuXG5leHBvcnQgY29uc3QgYWRkVGFiID0gKGxvY2tlZCkgPT4ge1xuICBpZiAobG9ja2VkKSByZXR1cm47XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgJChcIi5uYXZiYXItY29sbGFwc2VcIikuYXBwZW5kKFxuICAgICAgYDxmb3JtIGNsYXNzPVwiZC1mbGV4XCIgaWQ9XCJhZGQtdGFiLWZvcm1cIj5cbiAgICAgICAgPGlucHV0IGlkPVwiYWRkVGl0bGVcIiBjbGFzcz1cImZvcm0tY29udHJvbCBtZS0yXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlRhYiB0aXRsZVwiPlxuICAgICAgICA8YnV0dG9uIGlkPVwiYWRkU3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLW91dGxpbmUtZGFya1wiIHR5cGU9XCJzdWJtaXRcIj5BZGQ8L2J1dHRvbj5cbiAgICAgIDwvZm9ybT5gLFxuICAgICk7XG5cbiAgICAkKFwiI2FkZFN1Ym1pdFwiKS5vbihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGNvbnN0ICRlbCA9ICQoXCIjYWRkVGl0bGVcIik7XG4gICAgICBjb25zdCB0aXRsZSA9ICRlbC52YWwoKTtcblxuICAgICAgaWYgKCF0aXRsZSkge1xuICAgICAgICAkZWwuYWRkQ2xhc3MoXCJpcy1pbnZhbGlkXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICRlbC5yZW1vdmVDbGFzcyhcImlzLWludmFsaWRcIik7XG4gICAgICAkZWwudmFsKFwiXCIpO1xuXG4gICAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShcImFkZFRhYlwiLCB0aXRsZSk7XG4gICAgfSk7XG4gIH0sIDEwMDApO1xufTtcbiIsImltcG9ydCB7IGFkZFRhYiB9IGZyb20gXCIuL2FkZC10YWJcIjtcblxubGV0IGxvY2tlZCA9IGZhbHNlO1xuXG5jb25zdCBsb2NrRGFzaCA9ICgpID0+IHtcbiAgaWYgKCFsb2NrZWQpIHtcbiAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImJsb2Nrci1sb2NrZWRcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJibG9ja3ItbG9ja2VkXCIpO1xuXG4gIGNvbnN0ICRsYXlvdXRzID0gJChcIi5ic2xpYi1zaWRlYmFyLWxheW91dFwiKTtcbiAgJChcIi50YWItdGl0bGVcIikub2ZmKFwiY2xpY2tcIik7XG5cbiAgJGxheW91dHMuZmluZChcIi5zaWRlYmFyXCIpLmhpZGUoKTtcbiAgJGxheW91dHMuZmluZChcIi5jb2xsYXBzZS10b2dnbGVcIikudHJpZ2dlcihcImNsaWNrXCIpO1xuICAkbGF5b3V0cy5maW5kKFwiLmNvbGxhcHNlLXRvZ2dsZVwiKS5oaWRlKCk7XG4gICQoXCIuYWRkLXN0YWNrLXdyYXBwZXJcIikuaGlkZSgpO1xufTtcblxuY29uc3Qgb25UYWJSZW5kZXJlZCA9IChlKSA9PiB7XG4gIGlmICghZS5tZXNzYWdlW1wic2hpbnktaW5zZXJ0LXRhYlwiXSkgcmV0dXJuO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBsb2NrRGFzaCgpO1xuICB9LCAyNTApO1xufTtcblxuJCgoKSA9PiB7XG4gICQoZG9jdW1lbnQpLm9uKFwic2hpbnk6bWVzc2FnZVwiLCBvblRhYlJlbmRlcmVkKTtcbiAgJChkb2N1bWVudCkub24oXCJibG9ja3I6bG9ja1wiLCAoZSkgPT4ge1xuICAgIGxvY2tlZCA9IGUuZGV0YWlsLmxvY2tlZDtcbiAgICBsb2NrRGFzaCgpO1xuICB9KTtcblxuICBhZGRUYWIobG9ja2VkKTtcbn0pO1xuIiwid2luZG93LlNoaW55LmFkZEN1c3RvbU1lc3NhZ2VIYW5kbGVyKFwiYmxvY2tyLWFwcC1iaW5kLXJlbW92ZVwiLCAobXNnKSA9PiB7XG4gICQoXCIucmVtb3ZlLXJvd1wiKS5vZmYoXCJjbGlja1wiKTtcblxuICAkKFwiLnJlbW92ZS1yb3dcIikub24oXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAvLyBjYXB0dXJlIHN0YWNrcyBjb250YWluZWQgaW4gdGhlIHJvd1xuICAgIGNvbnN0IHN0YWNrcyA9IFtdO1xuICAgICQoZXZlbnQudGFyZ2V0KVxuICAgICAgLmNsb3Nlc3QoXCIubWFzb25yeS1yb3dcIilcbiAgICAgIC5maW5kKFwiLnN0YWNrXCIpXG4gICAgICAuZWFjaCgoXywgZWwpID0+IHtcbiAgICAgICAgc3RhY2tzLnB1c2goJChlbCkuYXR0cihcImlkXCIpKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gcmVtb3ZlIHJvdyBmcm9tIERPTVxuICAgIGNvbnN0IGlucHV0ID0gJChldmVudC50YXJnZXQpLmRhdGEoXCJpZFwiKTtcbiAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShcInJlbW92ZVJvd1wiLCB7XG4gICAgICB0YWI6IGlucHV0LFxuICAgICAgc3RhY2tzOiBzdGFja3MsXG4gICAgfSk7XG4gICAgJChldmVudC50YXJnZXQpLmNsb3Nlc3QoXCIubWFzb25yeS1yb3dcIikucmVtb3ZlKCk7XG4gIH0pO1xufSk7XG4iLCIkKCgpID0+IHtcbiAgJChkb2N1bWVudCkub24oXCJzaGlueTptZXNzYWdlXCIsIChlKSA9PiB7XG4gICAgaWYgKCFlLm1lc3NhZ2VbXCJzaGlueS1pbnNlcnQtdGFiXCJdKSByZXR1cm47XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRpdGxlKCk7XG4gICAgfSwgMTAwMCk7XG4gIH0pO1xufSk7XG5cbmNvbnN0IHRpdGxlID0gKCkgPT4ge1xuICBjb25zdCAkdGl0bGUgPSAkKFwiLnRhYi10aXRsZVwiKTtcblxuICAkdGl0bGUub2ZmKFwiY2xpY2tcIik7XG5cbiAgJHRpdGxlLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICR0aXRsZS5yZXBsYWNlV2l0aChcbiAgICAgIGA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInRhYi10aXRsZS1pbnB1dCBmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLXNtIG14LTFcIiB2YWx1ZT1cIiR7JHRpdGxlLnRleHQoKX1cIj5gLFxuICAgICk7XG5cbiAgICBoYW5kbGVTdGFja1RpdGxlKCR0aXRsZS50ZXh0KCkpO1xuICB9KTtcbn07XG5cbmNvbnN0IGhhbmRsZVN0YWNrVGl0bGUgPSAodGl0bGUpID0+IHtcbiAgJChcIi50YWItdGl0bGUtaW5wdXRcIikub2ZmKFwia2V5ZG93blwiKTtcblxuICAkKFwiLnRhYi10aXRsZS1pbnB1dFwiKS5vbihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICBpZiAoZS5rZXkgIT09IFwiRW50ZXJcIikgcmV0dXJuO1xuXG4gICAgY29uc3QgbmV3VGl0bGUgPSAkKGUudGFyZ2V0KS52YWwoKTtcblxuICAgICQoZS50YXJnZXQpLnJlcGxhY2VXaXRoKFxuICAgICAgYDxoMSBjbGFzcz1cInRhYi10aXRsZSBjdXJzb3ItcG9pbnRlclwiPiR7bmV3VGl0bGV9PC9oMT5gLFxuICAgICk7XG5cbiAgICBjb25zdCAkbmF2ID0gJChkb2N1bWVudCkuZmluZChgW2RhdGEtdmFsdWU9JyR7dGl0bGV9J11gKTtcbiAgICAkbmF2LmF0dHIoXCJkYXRhLXZhbHVlXCIsIG5ld1RpdGxlKTtcblxuICAgIHRpdGxlKCk7XG4gIH0pO1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2xvY2suanNcIjtcbmltcG9ydCBcIi4vcmVtb3ZlLXJvdy5qc1wiO1xuaW1wb3J0IFwiLi90YWItdGl0bGUuanNcIjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==