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
  $(".remove-tab").hide();

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

  window.Shiny.addCustomMessageHandler("bind-lock", (_message) => {
    setTimeout(() => {
      $("#lock").on("click", () => {
        const title = $("#lockName").val();

        if (title === "") {
          window.Shiny.notifications.show({
            html: "Missing title",
            type: "error",
          });
          return;
        }

        if (title.includes(" ")) {
          window.Shiny.notifications.show({
            html: "Title cannot include spaces",
            type: "error",
          });
          return;
        }

        window.Shiny.setInputValue("lock", { title: title });
      });
    }, 250);
  });
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

/***/ "./srcjs/tab-remove.js":
/*!*****************************!*\
  !*** ./srcjs/tab-remove.js ***!
  \*****************************/
/***/ (() => {

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
/* harmony import */ var _tab_remove_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tab-remove.js */ "./srcjs/tab-remove.js");
/* harmony import */ var _tab_remove_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_tab_remove_js__WEBPACK_IMPORTED_MODULE_3__);





})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7OztBQzlCbUM7O0FBRW5DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUgsRUFBRSxnREFBTTs7QUFFUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUEsNkNBQTZDLGNBQWM7QUFDM0QsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7QUMvREQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7O0FDckJEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7O0FDbEJEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDZGQUE2RixjQUFjO0FBQzNHOztBQUVBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDhDQUE4QyxTQUFTO0FBQ3ZEOztBQUVBLGtEQUFrRCxNQUFNO0FBQ3hEOztBQUVBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7O1VDekNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTm1CO0FBQ007QUFDRDtBQUNDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL2FkZC10YWIuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL2xvY2suanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL3JlbW92ZS1yb3cuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL3RhYi1yZW1vdmUuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL3RhYi10aXRsZS5qcyIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Jsb2Nrci5hcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Jsb2Nrci5hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwLy4vc3JjanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gdGhpcyBpcyB0aGUgd2VpcmRlc3QgdGhpbmcsIHBlcmhhcHMgbm90IHN1cnByaXNpbmcgZnJvbSBTaGlueVxuLy8gYWRkaW5nIHRoaXMgd2lodG91dCBhIG1hc3NpdmUgdGltZW91dCBicmVha3MuLi4gdGhlIHdlYnNvY2tldFxuLy8gYW5kIFNoaW55LnNldElucHV0VmFsdWUgb3IgYW55IG90aGVyIHNoaW55IGZ1bmN0aW9uIHN0b3Agd29ya2luZ1xuLy8gb3IgYXJlIHN0YWdnZXJlZC5cbmV4cG9ydCBjb25zdCBhZGRUYWIgPSAobG9ja2VkKSA9PiB7XG4gIGlmIChsb2NrZWQpIHJldHVybjtcblxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAkKFwiLm5hdmJhci1jb2xsYXBzZVwiKS5hcHBlbmQoXG4gICAgICBgPGZvcm0gY2xhc3M9XCJkLWZsZXhcIiBpZD1cImFkZC10YWItZm9ybVwiPlxuICAgICAgICA8aW5wdXQgaWQ9XCJhZGRUaXRsZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sIG1lLTJcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGFiIHRpdGxlXCI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJhZGRTdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tb3V0bGluZS1kYXJrXCIgdHlwZT1cInN1Ym1pdFwiPkFkZDwvYnV0dG9uPlxuICAgICAgPC9mb3JtPmAsXG4gICAgKTtcblxuICAgICQoXCIjYWRkU3VibWl0XCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgJGVsID0gJChcIiNhZGRUaXRsZVwiKTtcbiAgICAgIGNvbnN0IHRpdGxlID0gJGVsLnZhbCgpO1xuXG4gICAgICBpZiAoIXRpdGxlKSB7XG4gICAgICAgICRlbC5hZGRDbGFzcyhcImlzLWludmFsaWRcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJGVsLnJlbW92ZUNsYXNzKFwiaXMtaW52YWxpZFwiKTtcbiAgICAgICRlbC52YWwoXCJcIik7XG5cbiAgICAgIHdpbmRvdy5TaGlueS5zZXRJbnB1dFZhbHVlKFwiYWRkVGFiXCIsIHRpdGxlKTtcbiAgICB9KTtcbiAgfSwgMTAwMCk7XG59O1xuIiwiaW1wb3J0IHsgYWRkVGFiIH0gZnJvbSBcIi4vYWRkLXRhYlwiO1xuXG5sZXQgbG9ja2VkID0gZmFsc2U7XG5cbmNvbnN0IGxvY2tEYXNoID0gKCkgPT4ge1xuICBpZiAoIWxvY2tlZCkge1xuICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiYmxvY2tyLWxvY2tlZFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcImJsb2Nrci1sb2NrZWRcIik7XG4gICQoXCIucmVtb3ZlLXRhYlwiKS5oaWRlKCk7XG5cbiAgY29uc3QgJGxheW91dHMgPSAkKFwiLmJzbGliLXNpZGViYXItbGF5b3V0XCIpO1xuICAkKFwiLnRhYi10aXRsZVwiKS5vZmYoXCJjbGlja1wiKTtcblxuICAkbGF5b3V0cy5maW5kKFwiLnNpZGViYXJcIikuaGlkZSgpO1xuICAkbGF5b3V0cy5maW5kKFwiLmNvbGxhcHNlLXRvZ2dsZVwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICRsYXlvdXRzLmZpbmQoXCIuY29sbGFwc2UtdG9nZ2xlXCIpLmhpZGUoKTtcbiAgJChcIi5hZGQtc3RhY2std3JhcHBlclwiKS5oaWRlKCk7XG59O1xuXG5jb25zdCBvblRhYlJlbmRlcmVkID0gKGUpID0+IHtcbiAgaWYgKCFlLm1lc3NhZ2VbXCJzaGlueS1pbnNlcnQtdGFiXCJdKSByZXR1cm47XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGxvY2tEYXNoKCk7XG4gIH0sIDI1MCk7XG59O1xuXG4kKCgpID0+IHtcbiAgJChkb2N1bWVudCkub24oXCJzaGlueTptZXNzYWdlXCIsIG9uVGFiUmVuZGVyZWQpO1xuICAkKGRvY3VtZW50KS5vbihcImJsb2Nrcjpsb2NrXCIsIChlKSA9PiB7XG4gICAgbG9ja2VkID0gZS5kZXRhaWwubG9ja2VkO1xuICAgIGxvY2tEYXNoKCk7XG4gIH0pO1xuXG4gIGFkZFRhYihsb2NrZWQpO1xuXG4gIHdpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcImJpbmQtbG9ja1wiLCAoX21lc3NhZ2UpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQoXCIjbG9ja1wiKS5vbihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSAkKFwiI2xvY2tOYW1lXCIpLnZhbCgpO1xuXG4gICAgICAgIGlmICh0aXRsZSA9PT0gXCJcIikge1xuICAgICAgICAgIHdpbmRvdy5TaGlueS5ub3RpZmljYXRpb25zLnNob3coe1xuICAgICAgICAgICAgaHRtbDogXCJNaXNzaW5nIHRpdGxlXCIsXG4gICAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpdGxlLmluY2x1ZGVzKFwiIFwiKSkge1xuICAgICAgICAgIHdpbmRvdy5TaGlueS5ub3RpZmljYXRpb25zLnNob3coe1xuICAgICAgICAgICAgaHRtbDogXCJUaXRsZSBjYW5ub3QgaW5jbHVkZSBzcGFjZXNcIixcbiAgICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShcImxvY2tcIiwgeyB0aXRsZTogdGl0bGUgfSk7XG4gICAgICB9KTtcbiAgICB9LCAyNTApO1xuICB9KTtcbn0pO1xuIiwid2luZG93LlNoaW55LmFkZEN1c3RvbU1lc3NhZ2VIYW5kbGVyKFwiYmxvY2tyLWFwcC1iaW5kLXJlbW92ZVwiLCAobXNnKSA9PiB7XG4gICQoXCIucmVtb3ZlLXJvd1wiKS5vZmYoXCJjbGlja1wiKTtcblxuICAkKFwiLnJlbW92ZS1yb3dcIikub24oXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAvLyBjYXB0dXJlIHN0YWNrcyBjb250YWluZWQgaW4gdGhlIHJvd1xuICAgIGNvbnN0IHN0YWNrcyA9IFtdO1xuICAgICQoZXZlbnQudGFyZ2V0KVxuICAgICAgLmNsb3Nlc3QoXCIubWFzb25yeS1yb3dcIilcbiAgICAgIC5maW5kKFwiLnN0YWNrXCIpXG4gICAgICAuZWFjaCgoXywgZWwpID0+IHtcbiAgICAgICAgc3RhY2tzLnB1c2goJChlbCkuYXR0cihcImlkXCIpKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gcmVtb3ZlIHJvdyBmcm9tIERPTVxuICAgIGNvbnN0IGlucHV0ID0gJChldmVudC50YXJnZXQpLmRhdGEoXCJpZFwiKTtcbiAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShcInJlbW92ZVJvd1wiLCB7XG4gICAgICB0YWI6IGlucHV0LFxuICAgICAgc3RhY2tzOiBzdGFja3MsXG4gICAgfSk7XG4gICAgJChldmVudC50YXJnZXQpLmNsb3Nlc3QoXCIubWFzb25yeS1yb3dcIikucmVtb3ZlKCk7XG4gIH0pO1xufSk7XG4iLCJ3aW5kb3cuU2hpbnkuYWRkQ3VzdG9tTWVzc2FnZUhhbmRsZXIoXCJyZW1vdmUtdGFiXCIsIGZ1bmN0aW9uIChtc2cpIHtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgJChcIi5yZW1vdmUtdGFiXCIpLm9mZihcImNsaWNrXCIpO1xuXG4gICAgJChcIi5yZW1vdmUtdGFiXCIpLm9uKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgIGxldCBpZHMgPSBbXTtcbiAgICAgICQoZS50YXJnZXQpXG4gICAgICAgIC5jbG9zZXN0KFwiLnRhYi1wYW5lXCIpXG4gICAgICAgIC5maW5kKFwiLnN0YWNrXCIpXG4gICAgICAgIC5lYWNoKChfaW5kZXgsIGVsKSA9PiB7XG4gICAgICAgICAgaWRzLnB1c2goJChlbCkuYXR0cihcImlkXCIpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGlkID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoXCJpZFwiKTtcblxuICAgICAgd2luZG93LlNoaW55LnNldElucHV0VmFsdWUoaWQsIGlkcyk7XG4gICAgfSk7XG4gIH0sIDUwMCk7XG59KTtcbiIsIiQoKCkgPT4ge1xuICAkKGRvY3VtZW50KS5vbihcInNoaW55Om1lc3NhZ2VcIiwgKGUpID0+IHtcbiAgICBpZiAoIWUubWVzc2FnZVtcInNoaW55LWluc2VydC10YWJcIl0pIHJldHVybjtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGl0bGUoKTtcbiAgICB9LCAxMDAwKTtcbiAgfSk7XG59KTtcblxuY29uc3QgdGl0bGUgPSAoKSA9PiB7XG4gIGNvbnN0ICR0aXRsZSA9ICQoXCIudGFiLXRpdGxlXCIpO1xuXG4gICR0aXRsZS5vZmYoXCJjbGlja1wiKTtcblxuICAkdGl0bGUub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgJHRpdGxlLnJlcGxhY2VXaXRoKFxuICAgICAgYDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwidGFiLXRpdGxlLWlucHV0IGZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtc20gbXgtMVwiIHZhbHVlPVwiJHskdGl0bGUudGV4dCgpfVwiPmAsXG4gICAgKTtcblxuICAgIGhhbmRsZVN0YWNrVGl0bGUoJHRpdGxlLnRleHQoKSk7XG4gIH0pO1xufTtcblxuY29uc3QgaGFuZGxlU3RhY2tUaXRsZSA9ICh0aXRsZSkgPT4ge1xuICAkKFwiLnRhYi10aXRsZS1pbnB1dFwiKS5vZmYoXCJrZXlkb3duXCIpO1xuXG4gICQoXCIudGFiLXRpdGxlLWlucHV0XCIpLm9uKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleSAhPT0gXCJFbnRlclwiKSByZXR1cm47XG5cbiAgICBjb25zdCBuZXdUaXRsZSA9ICQoZS50YXJnZXQpLnZhbCgpO1xuXG4gICAgJChlLnRhcmdldCkucmVwbGFjZVdpdGgoXG4gICAgICBgPGgxIGNsYXNzPVwidGFiLXRpdGxlIGN1cnNvci1wb2ludGVyXCI+JHtuZXdUaXRsZX08L2gxPmAsXG4gICAgKTtcblxuICAgIGNvbnN0ICRuYXYgPSAkKGRvY3VtZW50KS5maW5kKGBbZGF0YS12YWx1ZT0nJHt0aXRsZX0nXWApO1xuICAgICRuYXYuYXR0cihcImRhdGEtdmFsdWVcIiwgbmV3VGl0bGUpO1xuXG4gICAgdGl0bGUoKTtcbiAgfSk7XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vbG9jay5qc1wiO1xuaW1wb3J0IFwiLi9yZW1vdmUtcm93LmpzXCI7XG5pbXBvcnQgXCIuL3RhYi10aXRsZS5qc1wiO1xuaW1wb3J0IFwiLi90YWItcmVtb3ZlLmpzXCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=