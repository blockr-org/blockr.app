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
  $(".tab-title").off();

  $layouts.find(".sidebar").hide();
  $layouts.find(".collapse-toggle").trigger("click");
  $layouts.find(".collapse-toggle").hide();
  $(".add-stack-wrapper").hide();
  $(".bslib-sidebar-layout > .main").css("grid-column", "1/3");
  $(".masonry-item").css("resize", "none");
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
      $("#lockName").on("keyup", (e) => {
        if (e.key != "Enter") {
          return;
        }

        $("#lock").click();
      });

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

/***/ "./srcjs/restore.js":
/*!**************************!*\
  !*** ./srcjs/restore.js ***!
  \**************************/
/***/ (() => {

$(() => {
  window.Shiny.addCustomMessageHandler("restored-tab", (msg) => {
    setTimeout(() => {
      $(`#${msg.id}`)
        .find(".stack")
        .find("button.action-button.btn-success")
        .trigger("click");
    }, 1250);
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
      title_();
    }, 1000);
  });
});

const title_ = () => {
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

    title_();
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
/* harmony import */ var _restore_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./restore.js */ "./srcjs/restore.js");
/* harmony import */ var _restore_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_restore_js__WEBPACK_IMPORTED_MODULE_4__);






})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7OztBQzlCbUM7O0FBRW5DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILEVBQUUsZ0RBQU07O0FBRVI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQSw2Q0FBNkMsY0FBYztBQUMzRCxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7OztBQ3pFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7QUNyQkQ7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7QUNURDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7OztBQ2xCRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSw2RkFBNkYsY0FBYztBQUMzRzs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSw4Q0FBOEMsU0FBUztBQUN2RDs7QUFFQSxrREFBa0QsTUFBTTtBQUN4RDs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7Ozs7OztVQ3pDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTm1CO0FBQ007QUFDRDtBQUNDO0FBQ0giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ibG9ja3IuYXBwLy4vc3JjanMvYWRkLXRhYi5qcyIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwLy4vc3JjanMvbG9jay5qcyIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwLy4vc3JjanMvcmVtb3ZlLXJvdy5qcyIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwLy4vc3JjanMvcmVzdG9yZS5qcyIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwLy4vc3JjanMvdGFiLXJlbW92ZS5qcyIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwLy4vc3JjanMvdGFiLXRpdGxlLmpzIiwid2VicGFjazovL2Jsb2Nrci5hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Jsb2Nrci5hcHAvLi9zcmNqcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0aGlzIGlzIHRoZSB3ZWlyZGVzdCB0aGluZywgcGVyaGFwcyBub3Qgc3VycHJpc2luZyBmcm9tIFNoaW55XG4vLyBhZGRpbmcgdGhpcyB3aWh0b3V0IGEgbWFzc2l2ZSB0aW1lb3V0IGJyZWFrcy4uLiB0aGUgd2Vic29ja2V0XG4vLyBhbmQgU2hpbnkuc2V0SW5wdXRWYWx1ZSBvciBhbnkgb3RoZXIgc2hpbnkgZnVuY3Rpb24gc3RvcCB3b3JraW5nXG4vLyBvciBhcmUgc3RhZ2dlcmVkLlxuZXhwb3J0IGNvbnN0IGFkZFRhYiA9IChsb2NrZWQpID0+IHtcbiAgaWYgKGxvY2tlZCkgcmV0dXJuO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICQoXCIubmF2YmFyLWNvbGxhcHNlXCIpLmFwcGVuZChcbiAgICAgIGA8Zm9ybSBjbGFzcz1cImQtZmxleFwiIGlkPVwiYWRkLXRhYi1mb3JtXCI+XG4gICAgICAgIDxpbnB1dCBpZD1cImFkZFRpdGxlXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgbWUtMlwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJUYWIgdGl0bGVcIj5cbiAgICAgICAgPGJ1dHRvbiBpZD1cImFkZFN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1vdXRsaW5lLWRhcmtcIiB0eXBlPVwic3VibWl0XCI+QWRkPC9idXR0b24+XG4gICAgICA8L2Zvcm0+YCxcbiAgICApO1xuXG4gICAgJChcIiNhZGRTdWJtaXRcIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCAkZWwgPSAkKFwiI2FkZFRpdGxlXCIpO1xuICAgICAgY29uc3QgdGl0bGUgPSAkZWwudmFsKCk7XG5cbiAgICAgIGlmICghdGl0bGUpIHtcbiAgICAgICAgJGVsLmFkZENsYXNzKFwiaXMtaW52YWxpZFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkZWwucmVtb3ZlQ2xhc3MoXCJpcy1pbnZhbGlkXCIpO1xuICAgICAgJGVsLnZhbChcIlwiKTtcblxuICAgICAgd2luZG93LlNoaW55LnNldElucHV0VmFsdWUoXCJhZGRUYWJcIiwgdGl0bGUpO1xuICAgIH0pO1xuICB9LCAxMDAwKTtcbn07XG4iLCJpbXBvcnQgeyBhZGRUYWIgfSBmcm9tIFwiLi9hZGQtdGFiXCI7XG5cbmxldCBsb2NrZWQgPSBmYWxzZTtcblxuY29uc3QgbG9ja0Rhc2ggPSAoKSA9PiB7XG4gIGlmICghbG9ja2VkKSB7XG4gICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJibG9ja3ItbG9ja2VkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gICQoXCJib2R5XCIpLmFkZENsYXNzKFwiYmxvY2tyLWxvY2tlZFwiKTtcbiAgJChcIi5yZW1vdmUtdGFiXCIpLmhpZGUoKTtcblxuICBjb25zdCAkbGF5b3V0cyA9ICQoXCIuYnNsaWItc2lkZWJhci1sYXlvdXRcIik7XG4gICQoXCIudGFiLXRpdGxlXCIpLm9mZigpO1xuXG4gICRsYXlvdXRzLmZpbmQoXCIuc2lkZWJhclwiKS5oaWRlKCk7XG4gICRsYXlvdXRzLmZpbmQoXCIuY29sbGFwc2UtdG9nZ2xlXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcbiAgJGxheW91dHMuZmluZChcIi5jb2xsYXBzZS10b2dnbGVcIikuaGlkZSgpO1xuICAkKFwiLmFkZC1zdGFjay13cmFwcGVyXCIpLmhpZGUoKTtcbiAgJChcIi5ic2xpYi1zaWRlYmFyLWxheW91dCA+IC5tYWluXCIpLmNzcyhcImdyaWQtY29sdW1uXCIsIFwiMS8zXCIpO1xuICAkKFwiLm1hc29ucnktaXRlbVwiKS5jc3MoXCJyZXNpemVcIiwgXCJub25lXCIpO1xufTtcblxuY29uc3Qgb25UYWJSZW5kZXJlZCA9IChlKSA9PiB7XG4gIGlmICghZS5tZXNzYWdlW1wic2hpbnktaW5zZXJ0LXRhYlwiXSkgcmV0dXJuO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBsb2NrRGFzaCgpO1xuICB9LCAyNTApO1xufTtcblxuJCgoKSA9PiB7XG4gICQoZG9jdW1lbnQpLm9uKFwic2hpbnk6bWVzc2FnZVwiLCBvblRhYlJlbmRlcmVkKTtcbiAgJChkb2N1bWVudCkub24oXCJibG9ja3I6bG9ja1wiLCAoZSkgPT4ge1xuICAgIGxvY2tlZCA9IGUuZGV0YWlsLmxvY2tlZDtcbiAgICBsb2NrRGFzaCgpO1xuICB9KTtcblxuICBhZGRUYWIobG9ja2VkKTtcblxuICB3aW5kb3cuU2hpbnkuYWRkQ3VzdG9tTWVzc2FnZUhhbmRsZXIoXCJiaW5kLWxvY2tcIiwgKF9tZXNzYWdlKSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAkKFwiI2xvY2tOYW1lXCIpLm9uKFwia2V5dXBcIiwgKGUpID0+IHtcbiAgICAgICAgaWYgKGUua2V5ICE9IFwiRW50ZXJcIikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoXCIjbG9ja1wiKS5jbGljaygpO1xuICAgICAgfSk7XG5cbiAgICAgICQoXCIjbG9ja1wiKS5vbihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSAkKFwiI2xvY2tOYW1lXCIpLnZhbCgpO1xuXG4gICAgICAgIGlmICh0aXRsZSA9PT0gXCJcIikge1xuICAgICAgICAgIHdpbmRvdy5TaGlueS5ub3RpZmljYXRpb25zLnNob3coe1xuICAgICAgICAgICAgaHRtbDogXCJNaXNzaW5nIHRpdGxlXCIsXG4gICAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpdGxlLmluY2x1ZGVzKFwiIFwiKSkge1xuICAgICAgICAgIHdpbmRvdy5TaGlueS5ub3RpZmljYXRpb25zLnNob3coe1xuICAgICAgICAgICAgaHRtbDogXCJUaXRsZSBjYW5ub3QgaW5jbHVkZSBzcGFjZXNcIixcbiAgICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShcImxvY2tcIiwgeyB0aXRsZTogdGl0bGUgfSk7XG4gICAgICB9KTtcbiAgICB9LCAyNTApO1xuICB9KTtcbn0pO1xuIiwid2luZG93LlNoaW55LmFkZEN1c3RvbU1lc3NhZ2VIYW5kbGVyKFwiYmxvY2tyLWFwcC1iaW5kLXJlbW92ZVwiLCAobXNnKSA9PiB7XG4gICQoXCIucmVtb3ZlLXJvd1wiKS5vZmYoXCJjbGlja1wiKTtcblxuICAkKFwiLnJlbW92ZS1yb3dcIikub24oXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAvLyBjYXB0dXJlIHN0YWNrcyBjb250YWluZWQgaW4gdGhlIHJvd1xuICAgIGNvbnN0IHN0YWNrcyA9IFtdO1xuICAgICQoZXZlbnQudGFyZ2V0KVxuICAgICAgLmNsb3Nlc3QoXCIubWFzb25yeS1yb3dcIilcbiAgICAgIC5maW5kKFwiLnN0YWNrXCIpXG4gICAgICAuZWFjaCgoXywgZWwpID0+IHtcbiAgICAgICAgc3RhY2tzLnB1c2goJChlbCkuYXR0cihcImlkXCIpKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gcmVtb3ZlIHJvdyBmcm9tIERPTVxuICAgIGNvbnN0IGlucHV0ID0gJChldmVudC50YXJnZXQpLmRhdGEoXCJpZFwiKTtcbiAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShcInJlbW92ZVJvd1wiLCB7XG4gICAgICB0YWI6IGlucHV0LFxuICAgICAgc3RhY2tzOiBzdGFja3MsXG4gICAgfSk7XG4gICAgJChldmVudC50YXJnZXQpLmNsb3Nlc3QoXCIubWFzb25yeS1yb3dcIikucmVtb3ZlKCk7XG4gIH0pO1xufSk7XG4iLCIkKCgpID0+IHtcbiAgd2luZG93LlNoaW55LmFkZEN1c3RvbU1lc3NhZ2VIYW5kbGVyKFwicmVzdG9yZWQtdGFiXCIsIChtc2cpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQoYCMke21zZy5pZH1gKVxuICAgICAgICAuZmluZChcIi5zdGFja1wiKVxuICAgICAgICAuZmluZChcImJ1dHRvbi5hY3Rpb24tYnV0dG9uLmJ0bi1zdWNjZXNzXCIpXG4gICAgICAgIC50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgfSwgMTI1MCk7XG4gIH0pO1xufSk7XG4iLCJ3aW5kb3cuU2hpbnkuYWRkQ3VzdG9tTWVzc2FnZUhhbmRsZXIoXCJyZW1vdmUtdGFiXCIsIGZ1bmN0aW9uIChtc2cpIHtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgJChcIi5yZW1vdmUtdGFiXCIpLm9mZihcImNsaWNrXCIpO1xuXG4gICAgJChcIi5yZW1vdmUtdGFiXCIpLm9uKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgIGxldCBpZHMgPSBbXTtcbiAgICAgICQoZS50YXJnZXQpXG4gICAgICAgIC5jbG9zZXN0KFwiLnRhYi1wYW5lXCIpXG4gICAgICAgIC5maW5kKFwiLnN0YWNrXCIpXG4gICAgICAgIC5lYWNoKChfaW5kZXgsIGVsKSA9PiB7XG4gICAgICAgICAgaWRzLnB1c2goJChlbCkuYXR0cihcImlkXCIpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGlkID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoXCJpZFwiKTtcblxuICAgICAgd2luZG93LlNoaW55LnNldElucHV0VmFsdWUoaWQsIGlkcyk7XG4gICAgfSk7XG4gIH0sIDUwMCk7XG59KTtcbiIsIiQoKCkgPT4ge1xuICAkKGRvY3VtZW50KS5vbihcInNoaW55Om1lc3NhZ2VcIiwgKGUpID0+IHtcbiAgICBpZiAoIWUubWVzc2FnZVtcInNoaW55LWluc2VydC10YWJcIl0pIHJldHVybjtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGl0bGVfKCk7XG4gICAgfSwgMTAwMCk7XG4gIH0pO1xufSk7XG5cbmNvbnN0IHRpdGxlXyA9ICgpID0+IHtcbiAgY29uc3QgJHRpdGxlID0gJChcIi50YWItdGl0bGVcIik7XG5cbiAgJHRpdGxlLm9mZihcImNsaWNrXCIpO1xuXG4gICR0aXRsZS5vbihcImNsaWNrXCIsICgpID0+IHtcbiAgICAkdGl0bGUucmVwbGFjZVdpdGgoXG4gICAgICBgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJ0YWItdGl0bGUtaW5wdXQgZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1zbSBteC0xXCIgdmFsdWU9XCIkeyR0aXRsZS50ZXh0KCl9XCI+YCxcbiAgICApO1xuXG4gICAgaGFuZGxlU3RhY2tUaXRsZSgkdGl0bGUudGV4dCgpKTtcbiAgfSk7XG59O1xuXG5jb25zdCBoYW5kbGVTdGFja1RpdGxlID0gKHRpdGxlKSA9PiB7XG4gICQoXCIudGFiLXRpdGxlLWlucHV0XCIpLm9mZihcImtleWRvd25cIik7XG5cbiAgJChcIi50YWItdGl0bGUtaW5wdXRcIikub24oXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgaWYgKGUua2V5ICE9PSBcIkVudGVyXCIpIHJldHVybjtcblxuICAgIGNvbnN0IG5ld1RpdGxlID0gJChlLnRhcmdldCkudmFsKCk7XG5cbiAgICAkKGUudGFyZ2V0KS5yZXBsYWNlV2l0aChcbiAgICAgIGA8aDEgY2xhc3M9XCJ0YWItdGl0bGUgY3Vyc29yLXBvaW50ZXJcIj4ke25ld1RpdGxlfTwvaDE+YCxcbiAgICApO1xuXG4gICAgY29uc3QgJG5hdiA9ICQoZG9jdW1lbnQpLmZpbmQoYFtkYXRhLXZhbHVlPScke3RpdGxlfSddYCk7XG4gICAgJG5hdi5hdHRyKFwiZGF0YS12YWx1ZVwiLCBuZXdUaXRsZSk7XG5cbiAgICB0aXRsZV8oKTtcbiAgfSk7XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vbG9jay5qc1wiO1xuaW1wb3J0IFwiLi9yZW1vdmUtcm93LmpzXCI7XG5pbXBvcnQgXCIuL3RhYi10aXRsZS5qc1wiO1xuaW1wb3J0IFwiLi90YWItcmVtb3ZlLmpzXCI7XG5pbXBvcnQgXCIuL3Jlc3RvcmUuanNcIjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==