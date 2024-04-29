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

/***/ "./srcjs/save.js":
/*!***********************!*\
  !*** ./srcjs/save.js ***!
  \***********************/
/***/ (() => {

$(() => {
  setTimeout(() => {
    $("#add-tab-form").prepend(
      `<div class="auto-save form-check form-switch w-50">
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
/* harmony import */ var _save_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./save.js */ "./srcjs/save.js");
/* harmony import */ var _save_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_save_js__WEBPACK_IMPORTED_MODULE_5__);







})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7OztBQzlCbUM7O0FBRW5DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILEVBQUUsZ0RBQU07O0FBRVI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQSw2Q0FBNkMsY0FBYztBQUMzRCxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7OztBQ3pFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7QUNyQkQ7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7QUNURDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7QUNkRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7OztBQ2xCRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSw2RkFBNkYsY0FBYztBQUMzRzs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSw4Q0FBOEMsU0FBUztBQUN2RDs7QUFFQSxrREFBa0QsTUFBTTtBQUN4RDs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7Ozs7OztVQ3pDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNObUI7QUFDTTtBQUNEO0FBQ0M7QUFDSDtBQUNIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL2FkZC10YWIuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL2xvY2suanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL3JlbW92ZS1yb3cuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL3Jlc3RvcmUuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL3NhdmUuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL3RhYi1yZW1vdmUuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL3RhYi10aXRsZS5qcyIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Jsb2Nrci5hcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Jsb2Nrci5hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwLy4vc3JjanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gdGhpcyBpcyB0aGUgd2VpcmRlc3QgdGhpbmcsIHBlcmhhcHMgbm90IHN1cnByaXNpbmcgZnJvbSBTaGlueVxuLy8gYWRkaW5nIHRoaXMgd2lodG91dCBhIG1hc3NpdmUgdGltZW91dCBicmVha3MuLi4gdGhlIHdlYnNvY2tldFxuLy8gYW5kIFNoaW55LnNldElucHV0VmFsdWUgb3IgYW55IG90aGVyIHNoaW55IGZ1bmN0aW9uIHN0b3Agd29ya2luZ1xuLy8gb3IgYXJlIHN0YWdnZXJlZC5cbmV4cG9ydCBjb25zdCBhZGRUYWIgPSAobG9ja2VkKSA9PiB7XG4gIGlmIChsb2NrZWQpIHJldHVybjtcblxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAkKFwiLm5hdmJhci1jb2xsYXBzZVwiKS5hcHBlbmQoXG4gICAgICBgPGZvcm0gY2xhc3M9XCJkLWZsZXhcIiBpZD1cImFkZC10YWItZm9ybVwiPlxuICAgICAgICA8aW5wdXQgaWQ9XCJhZGRUaXRsZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sIG1lLTJcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGFiIHRpdGxlXCI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJhZGRTdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tb3V0bGluZS1kYXJrXCIgdHlwZT1cInN1Ym1pdFwiPkFkZDwvYnV0dG9uPlxuICAgICAgPC9mb3JtPmAsXG4gICAgKTtcblxuICAgICQoXCIjYWRkU3VibWl0XCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgJGVsID0gJChcIiNhZGRUaXRsZVwiKTtcbiAgICAgIGNvbnN0IHRpdGxlID0gJGVsLnZhbCgpO1xuXG4gICAgICBpZiAoIXRpdGxlKSB7XG4gICAgICAgICRlbC5hZGRDbGFzcyhcImlzLWludmFsaWRcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJGVsLnJlbW92ZUNsYXNzKFwiaXMtaW52YWxpZFwiKTtcbiAgICAgICRlbC52YWwoXCJcIik7XG5cbiAgICAgIHdpbmRvdy5TaGlueS5zZXRJbnB1dFZhbHVlKFwiYWRkVGFiXCIsIHRpdGxlKTtcbiAgICB9KTtcbiAgfSwgMTAwMCk7XG59O1xuIiwiaW1wb3J0IHsgYWRkVGFiIH0gZnJvbSBcIi4vYWRkLXRhYlwiO1xuXG5sZXQgbG9ja2VkID0gZmFsc2U7XG5cbmNvbnN0IGxvY2tEYXNoID0gKCkgPT4ge1xuICBpZiAoIWxvY2tlZCkge1xuICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiYmxvY2tyLWxvY2tlZFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcImJsb2Nrci1sb2NrZWRcIik7XG4gICQoXCIucmVtb3ZlLXRhYlwiKS5oaWRlKCk7XG5cbiAgY29uc3QgJGxheW91dHMgPSAkKFwiLmJzbGliLXNpZGViYXItbGF5b3V0XCIpO1xuICAkKFwiLnRhYi10aXRsZVwiKS5vZmYoKTtcblxuICAkbGF5b3V0cy5maW5kKFwiLnNpZGViYXJcIikuaGlkZSgpO1xuICAkbGF5b3V0cy5maW5kKFwiLmNvbGxhcHNlLXRvZ2dsZVwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICRsYXlvdXRzLmZpbmQoXCIuY29sbGFwc2UtdG9nZ2xlXCIpLmhpZGUoKTtcbiAgJChcIi5hZGQtc3RhY2std3JhcHBlclwiKS5oaWRlKCk7XG4gICQoXCIuYnNsaWItc2lkZWJhci1sYXlvdXQgPiAubWFpblwiKS5jc3MoXCJncmlkLWNvbHVtblwiLCBcIjEvM1wiKTtcbiAgJChcIi5tYXNvbnJ5LWl0ZW1cIikuY3NzKFwicmVzaXplXCIsIFwibm9uZVwiKTtcbn07XG5cbmNvbnN0IG9uVGFiUmVuZGVyZWQgPSAoZSkgPT4ge1xuICBpZiAoIWUubWVzc2FnZVtcInNoaW55LWluc2VydC10YWJcIl0pIHJldHVybjtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgbG9ja0Rhc2goKTtcbiAgfSwgMjUwKTtcbn07XG5cbiQoKCkgPT4ge1xuICAkKGRvY3VtZW50KS5vbihcInNoaW55Om1lc3NhZ2VcIiwgb25UYWJSZW5kZXJlZCk7XG4gICQoZG9jdW1lbnQpLm9uKFwiYmxvY2tyOmxvY2tcIiwgKGUpID0+IHtcbiAgICBsb2NrZWQgPSBlLmRldGFpbC5sb2NrZWQ7XG4gICAgbG9ja0Rhc2goKTtcbiAgfSk7XG5cbiAgYWRkVGFiKGxvY2tlZCk7XG5cbiAgd2luZG93LlNoaW55LmFkZEN1c3RvbU1lc3NhZ2VIYW5kbGVyKFwiYmluZC1sb2NrXCIsIChfbWVzc2FnZSkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJChcIiNsb2NrTmFtZVwiKS5vbihcImtleXVwXCIsIChlKSA9PiB7XG4gICAgICAgIGlmIChlLmtleSAhPSBcIkVudGVyXCIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkKFwiI2xvY2tcIikuY2xpY2soKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKFwiI2xvY2tcIikub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gJChcIiNsb2NrTmFtZVwiKS52YWwoKTtcblxuICAgICAgICBpZiAodGl0bGUgPT09IFwiXCIpIHtcbiAgICAgICAgICB3aW5kb3cuU2hpbnkubm90aWZpY2F0aW9ucy5zaG93KHtcbiAgICAgICAgICAgIGh0bWw6IFwiTWlzc2luZyB0aXRsZVwiLFxuICAgICAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aXRsZS5pbmNsdWRlcyhcIiBcIikpIHtcbiAgICAgICAgICB3aW5kb3cuU2hpbnkubm90aWZpY2F0aW9ucy5zaG93KHtcbiAgICAgICAgICAgIGh0bWw6IFwiVGl0bGUgY2Fubm90IGluY2x1ZGUgc3BhY2VzXCIsXG4gICAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LlNoaW55LnNldElucHV0VmFsdWUoXCJsb2NrXCIsIHsgdGl0bGU6IHRpdGxlIH0pO1xuICAgICAgfSk7XG4gICAgfSwgMjUwKTtcbiAgfSk7XG59KTtcbiIsIndpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcImJsb2Nrci1hcHAtYmluZC1yZW1vdmVcIiwgKG1zZykgPT4ge1xuICAkKFwiLnJlbW92ZS1yb3dcIikub2ZmKFwiY2xpY2tcIik7XG5cbiAgJChcIi5yZW1vdmUtcm93XCIpLm9uKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgLy8gY2FwdHVyZSBzdGFja3MgY29udGFpbmVkIGluIHRoZSByb3dcbiAgICBjb25zdCBzdGFja3MgPSBbXTtcbiAgICAkKGV2ZW50LnRhcmdldClcbiAgICAgIC5jbG9zZXN0KFwiLm1hc29ucnktcm93XCIpXG4gICAgICAuZmluZChcIi5zdGFja1wiKVxuICAgICAgLmVhY2goKF8sIGVsKSA9PiB7XG4gICAgICAgIHN0YWNrcy5wdXNoKCQoZWwpLmF0dHIoXCJpZFwiKSk7XG4gICAgICB9KTtcblxuICAgIC8vIHJlbW92ZSByb3cgZnJvbSBET01cbiAgICBjb25zdCBpbnB1dCA9ICQoZXZlbnQudGFyZ2V0KS5kYXRhKFwiaWRcIik7XG4gICAgd2luZG93LlNoaW55LnNldElucHV0VmFsdWUoXCJyZW1vdmVSb3dcIiwge1xuICAgICAgdGFiOiBpbnB1dCxcbiAgICAgIHN0YWNrczogc3RhY2tzLFxuICAgIH0pO1xuICAgICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KFwiLm1hc29ucnktcm93XCIpLnJlbW92ZSgpO1xuICB9KTtcbn0pO1xuIiwiJCgoKSA9PiB7XG4gIHdpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcInJlc3RvcmVkLXRhYlwiLCAobXNnKSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAkKGAjJHttc2cuaWR9YClcbiAgICAgICAgLmZpbmQoXCIuc3RhY2tcIilcbiAgICAgICAgLmZpbmQoXCJidXR0b24uYWN0aW9uLWJ1dHRvbi5idG4tc3VjY2Vzc1wiKVxuICAgICAgICAudHJpZ2dlcihcImNsaWNrXCIpO1xuICAgIH0sIDEyNTApO1xuICB9KTtcbn0pO1xuIiwiJCgoKSA9PiB7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICQoXCIjYWRkLXRhYi1mb3JtXCIpLnByZXBlbmQoXG4gICAgICBgPGRpdiBjbGFzcz1cImF1dG8tc2F2ZSBmb3JtLWNoZWNrIGZvcm0tc3dpdGNoIHctNTBcIj5cbiAgICAgICAgPGlucHV0IGlkPVwiYXV0b3NhdmVcIiBjbGFzcz1cImZvcm0tY2hlY2staW5wdXRcIiB0eXBlPVwiY2hlY2tib3hcIiByb2xlPVwic3dpdGNoXCIgaWQ9XCJmbGV4U3dpdGNoQ2hlY2tEZWZhdWx0XCI+XG4gICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tY2hlY2stbGFiZWxcIiBmb3I9XCJmbGV4U3dpdGNoQ2hlY2tEZWZhdWx0XCI+QXV0byBzYXZlPC9sYWJlbD5cbiAgICAgIDwvZGl2PmAsXG4gICAgKTtcblxuICAgICQoXCIjYXV0b3NhdmVcIikub24oXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgIGNvbnN0IHN0YXRlID0gJChlLnRhcmdldCkucHJvcChcImNoZWNrZWRcIik7XG4gICAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShcImF1dG9zYXZlXCIsIHN0YXRlKTtcbiAgICB9KTtcbiAgfSwgMTUwMCk7XG59KTtcbiIsIndpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcInJlbW92ZS10YWJcIiwgZnVuY3Rpb24gKG1zZykge1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAkKFwiLnJlbW92ZS10YWJcIikub2ZmKFwiY2xpY2tcIik7XG5cbiAgICAkKFwiLnJlbW92ZS10YWJcIikub24oXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgbGV0IGlkcyA9IFtdO1xuICAgICAgJChlLnRhcmdldClcbiAgICAgICAgLmNsb3Nlc3QoXCIudGFiLXBhbmVcIilcbiAgICAgICAgLmZpbmQoXCIuc3RhY2tcIilcbiAgICAgICAgLmVhY2goKF9pbmRleCwgZWwpID0+IHtcbiAgICAgICAgICBpZHMucHVzaCgkKGVsKS5hdHRyKFwiaWRcIikpO1xuICAgICAgICB9KTtcblxuICAgICAgY29uc3QgaWQgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cihcImlkXCIpO1xuXG4gICAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShpZCwgaWRzKTtcbiAgICB9KTtcbiAgfSwgNTAwKTtcbn0pO1xuIiwiJCgoKSA9PiB7XG4gICQoZG9jdW1lbnQpLm9uKFwic2hpbnk6bWVzc2FnZVwiLCAoZSkgPT4ge1xuICAgIGlmICghZS5tZXNzYWdlW1wic2hpbnktaW5zZXJ0LXRhYlwiXSkgcmV0dXJuO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aXRsZV8oKTtcbiAgICB9LCAxMDAwKTtcbiAgfSk7XG59KTtcblxuY29uc3QgdGl0bGVfID0gKCkgPT4ge1xuICBjb25zdCAkdGl0bGUgPSAkKFwiLnRhYi10aXRsZVwiKTtcblxuICAkdGl0bGUub2ZmKFwiY2xpY2tcIik7XG5cbiAgJHRpdGxlLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICR0aXRsZS5yZXBsYWNlV2l0aChcbiAgICAgIGA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInRhYi10aXRsZS1pbnB1dCBmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLXNtIG14LTFcIiB2YWx1ZT1cIiR7JHRpdGxlLnRleHQoKX1cIj5gLFxuICAgICk7XG5cbiAgICBoYW5kbGVTdGFja1RpdGxlKCR0aXRsZS50ZXh0KCkpO1xuICB9KTtcbn07XG5cbmNvbnN0IGhhbmRsZVN0YWNrVGl0bGUgPSAodGl0bGUpID0+IHtcbiAgJChcIi50YWItdGl0bGUtaW5wdXRcIikub2ZmKFwia2V5ZG93blwiKTtcblxuICAkKFwiLnRhYi10aXRsZS1pbnB1dFwiKS5vbihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICBpZiAoZS5rZXkgIT09IFwiRW50ZXJcIikgcmV0dXJuO1xuXG4gICAgY29uc3QgbmV3VGl0bGUgPSAkKGUudGFyZ2V0KS52YWwoKTtcblxuICAgICQoZS50YXJnZXQpLnJlcGxhY2VXaXRoKFxuICAgICAgYDxoMSBjbGFzcz1cInRhYi10aXRsZSBjdXJzb3ItcG9pbnRlclwiPiR7bmV3VGl0bGV9PC9oMT5gLFxuICAgICk7XG5cbiAgICBjb25zdCAkbmF2ID0gJChkb2N1bWVudCkuZmluZChgW2RhdGEtdmFsdWU9JyR7dGl0bGV9J11gKTtcbiAgICAkbmF2LmF0dHIoXCJkYXRhLXZhbHVlXCIsIG5ld1RpdGxlKTtcblxuICAgIHRpdGxlXygpO1xuICB9KTtcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9sb2NrLmpzXCI7XG5pbXBvcnQgXCIuL3JlbW92ZS1yb3cuanNcIjtcbmltcG9ydCBcIi4vdGFiLXRpdGxlLmpzXCI7XG5pbXBvcnQgXCIuL3RhYi1yZW1vdmUuanNcIjtcbmltcG9ydCBcIi4vcmVzdG9yZS5qc1wiO1xuaW1wb3J0IFwiLi9zYXZlLmpzXCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=