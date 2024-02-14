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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7OztBQzlCbUM7O0FBRW5DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILEVBQUUsZ0RBQU07O0FBRVI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBLDZDQUE2QyxjQUFjO0FBQzNELE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7O0FDakVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7OztBQ3JCRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7OztBQ2xCRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSw2RkFBNkYsY0FBYztBQUMzRzs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSw4Q0FBOEMsU0FBUztBQUN2RDs7QUFFQSxrREFBa0QsTUFBTTtBQUN4RDs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7Ozs7OztVQ3pDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05tQjtBQUNNO0FBQ0Q7QUFDQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Jsb2Nrci5hcHAvLi9zcmNqcy9hZGQtdGFiLmpzIiwid2VicGFjazovL2Jsb2Nrci5hcHAvLi9zcmNqcy9sb2NrLmpzIiwid2VicGFjazovL2Jsb2Nrci5hcHAvLi9zcmNqcy9yZW1vdmUtcm93LmpzIiwid2VicGFjazovL2Jsb2Nrci5hcHAvLi9zcmNqcy90YWItcmVtb3ZlLmpzIiwid2VicGFjazovL2Jsb2Nrci5hcHAvLi9zcmNqcy90YWItdGl0bGUuanMiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2Jsb2Nrci5hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Jsb2Nrci5hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ibG9ja3IuYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmxvY2tyLmFwcC8uL3NyY2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHRoaXMgaXMgdGhlIHdlaXJkZXN0IHRoaW5nLCBwZXJoYXBzIG5vdCBzdXJwcmlzaW5nIGZyb20gU2hpbnlcbi8vIGFkZGluZyB0aGlzIHdpaHRvdXQgYSBtYXNzaXZlIHRpbWVvdXQgYnJlYWtzLi4uIHRoZSB3ZWJzb2NrZXRcbi8vIGFuZCBTaGlueS5zZXRJbnB1dFZhbHVlIG9yIGFueSBvdGhlciBzaGlueSBmdW5jdGlvbiBzdG9wIHdvcmtpbmdcbi8vIG9yIGFyZSBzdGFnZ2VyZWQuXG5leHBvcnQgY29uc3QgYWRkVGFiID0gKGxvY2tlZCkgPT4ge1xuICBpZiAobG9ja2VkKSByZXR1cm47XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgJChcIi5uYXZiYXItY29sbGFwc2VcIikuYXBwZW5kKFxuICAgICAgYDxmb3JtIGNsYXNzPVwiZC1mbGV4XCIgaWQ9XCJhZGQtdGFiLWZvcm1cIj5cbiAgICAgICAgPGlucHV0IGlkPVwiYWRkVGl0bGVcIiBjbGFzcz1cImZvcm0tY29udHJvbCBtZS0yXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlRhYiB0aXRsZVwiPlxuICAgICAgICA8YnV0dG9uIGlkPVwiYWRkU3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLW91dGxpbmUtZGFya1wiIHR5cGU9XCJzdWJtaXRcIj5BZGQ8L2J1dHRvbj5cbiAgICAgIDwvZm9ybT5gLFxuICAgICk7XG5cbiAgICAkKFwiI2FkZFN1Ym1pdFwiKS5vbihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGNvbnN0ICRlbCA9ICQoXCIjYWRkVGl0bGVcIik7XG4gICAgICBjb25zdCB0aXRsZSA9ICRlbC52YWwoKTtcblxuICAgICAgaWYgKCF0aXRsZSkge1xuICAgICAgICAkZWwuYWRkQ2xhc3MoXCJpcy1pbnZhbGlkXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICRlbC5yZW1vdmVDbGFzcyhcImlzLWludmFsaWRcIik7XG4gICAgICAkZWwudmFsKFwiXCIpO1xuXG4gICAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShcImFkZFRhYlwiLCB0aXRsZSk7XG4gICAgfSk7XG4gIH0sIDEwMDApO1xufTtcbiIsImltcG9ydCB7IGFkZFRhYiB9IGZyb20gXCIuL2FkZC10YWJcIjtcblxubGV0IGxvY2tlZCA9IGZhbHNlO1xuXG5jb25zdCBsb2NrRGFzaCA9ICgpID0+IHtcbiAgaWYgKCFsb2NrZWQpIHtcbiAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImJsb2Nrci1sb2NrZWRcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJibG9ja3ItbG9ja2VkXCIpO1xuICAkKFwiLnJlbW92ZS10YWJcIikuaGlkZSgpO1xuXG4gIGNvbnN0ICRsYXlvdXRzID0gJChcIi5ic2xpYi1zaWRlYmFyLWxheW91dFwiKTtcbiAgJChcIi50YWItdGl0bGVcIikub2ZmKFwiY2xpY2tcIik7XG5cbiAgJGxheW91dHMuZmluZChcIi5zaWRlYmFyXCIpLmhpZGUoKTtcbiAgJGxheW91dHMuZmluZChcIi5jb2xsYXBzZS10b2dnbGVcIikudHJpZ2dlcihcImNsaWNrXCIpO1xuICAkbGF5b3V0cy5maW5kKFwiLmNvbGxhcHNlLXRvZ2dsZVwiKS5oaWRlKCk7XG4gICQoXCIuYWRkLXN0YWNrLXdyYXBwZXJcIikuaGlkZSgpO1xuICAkKFwiLmJzbGliLXNpZGViYXItbGF5b3V0ID4gLm1haW5cIikuY3NzKFwiZ3JpZC1jb2x1bW5cIiwgXCIxLzNcIik7XG4gICQoXCIubWFzb25yeS1pdGVtXCIpLmNzcyhcInJlc2l6ZVwiLCBcIm5vbmVcIik7XG59O1xuXG5jb25zdCBvblRhYlJlbmRlcmVkID0gKGUpID0+IHtcbiAgaWYgKCFlLm1lc3NhZ2VbXCJzaGlueS1pbnNlcnQtdGFiXCJdKSByZXR1cm47XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGxvY2tEYXNoKCk7XG4gIH0sIDI1MCk7XG59O1xuXG4kKCgpID0+IHtcbiAgJChkb2N1bWVudCkub24oXCJzaGlueTptZXNzYWdlXCIsIG9uVGFiUmVuZGVyZWQpO1xuICAkKGRvY3VtZW50KS5vbihcImJsb2Nrcjpsb2NrXCIsIChlKSA9PiB7XG4gICAgbG9ja2VkID0gZS5kZXRhaWwubG9ja2VkO1xuICAgIGxvY2tEYXNoKCk7XG4gIH0pO1xuXG4gIGFkZFRhYihsb2NrZWQpO1xuXG4gIHdpbmRvdy5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcImJpbmQtbG9ja1wiLCAoX21lc3NhZ2UpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQoXCIjbG9ja1wiKS5vbihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSAkKFwiI2xvY2tOYW1lXCIpLnZhbCgpO1xuXG4gICAgICAgIGlmICh0aXRsZSA9PT0gXCJcIikge1xuICAgICAgICAgIHdpbmRvdy5TaGlueS5ub3RpZmljYXRpb25zLnNob3coe1xuICAgICAgICAgICAgaHRtbDogXCJNaXNzaW5nIHRpdGxlXCIsXG4gICAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpdGxlLmluY2x1ZGVzKFwiIFwiKSkge1xuICAgICAgICAgIHdpbmRvdy5TaGlueS5ub3RpZmljYXRpb25zLnNob3coe1xuICAgICAgICAgICAgaHRtbDogXCJUaXRsZSBjYW5ub3QgaW5jbHVkZSBzcGFjZXNcIixcbiAgICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShcImxvY2tcIiwgeyB0aXRsZTogdGl0bGUgfSk7XG4gICAgICB9KTtcbiAgICB9LCAyNTApO1xuICB9KTtcbn0pO1xuIiwid2luZG93LlNoaW55LmFkZEN1c3RvbU1lc3NhZ2VIYW5kbGVyKFwiYmxvY2tyLWFwcC1iaW5kLXJlbW92ZVwiLCAobXNnKSA9PiB7XG4gICQoXCIucmVtb3ZlLXJvd1wiKS5vZmYoXCJjbGlja1wiKTtcblxuICAkKFwiLnJlbW92ZS1yb3dcIikub24oXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAvLyBjYXB0dXJlIHN0YWNrcyBjb250YWluZWQgaW4gdGhlIHJvd1xuICAgIGNvbnN0IHN0YWNrcyA9IFtdO1xuICAgICQoZXZlbnQudGFyZ2V0KVxuICAgICAgLmNsb3Nlc3QoXCIubWFzb25yeS1yb3dcIilcbiAgICAgIC5maW5kKFwiLnN0YWNrXCIpXG4gICAgICAuZWFjaCgoXywgZWwpID0+IHtcbiAgICAgICAgc3RhY2tzLnB1c2goJChlbCkuYXR0cihcImlkXCIpKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gcmVtb3ZlIHJvdyBmcm9tIERPTVxuICAgIGNvbnN0IGlucHV0ID0gJChldmVudC50YXJnZXQpLmRhdGEoXCJpZFwiKTtcbiAgICB3aW5kb3cuU2hpbnkuc2V0SW5wdXRWYWx1ZShcInJlbW92ZVJvd1wiLCB7XG4gICAgICB0YWI6IGlucHV0LFxuICAgICAgc3RhY2tzOiBzdGFja3MsXG4gICAgfSk7XG4gICAgJChldmVudC50YXJnZXQpLmNsb3Nlc3QoXCIubWFzb25yeS1yb3dcIikucmVtb3ZlKCk7XG4gIH0pO1xufSk7XG4iLCJ3aW5kb3cuU2hpbnkuYWRkQ3VzdG9tTWVzc2FnZUhhbmRsZXIoXCJyZW1vdmUtdGFiXCIsIGZ1bmN0aW9uIChtc2cpIHtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgJChcIi5yZW1vdmUtdGFiXCIpLm9mZihcImNsaWNrXCIpO1xuXG4gICAgJChcIi5yZW1vdmUtdGFiXCIpLm9uKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgIGxldCBpZHMgPSBbXTtcbiAgICAgICQoZS50YXJnZXQpXG4gICAgICAgIC5jbG9zZXN0KFwiLnRhYi1wYW5lXCIpXG4gICAgICAgIC5maW5kKFwiLnN0YWNrXCIpXG4gICAgICAgIC5lYWNoKChfaW5kZXgsIGVsKSA9PiB7XG4gICAgICAgICAgaWRzLnB1c2goJChlbCkuYXR0cihcImlkXCIpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGlkID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoXCJpZFwiKTtcblxuICAgICAgd2luZG93LlNoaW55LnNldElucHV0VmFsdWUoaWQsIGlkcyk7XG4gICAgfSk7XG4gIH0sIDUwMCk7XG59KTtcbiIsIiQoKCkgPT4ge1xuICAkKGRvY3VtZW50KS5vbihcInNoaW55Om1lc3NhZ2VcIiwgKGUpID0+IHtcbiAgICBpZiAoIWUubWVzc2FnZVtcInNoaW55LWluc2VydC10YWJcIl0pIHJldHVybjtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGl0bGUoKTtcbiAgICB9LCAxMDAwKTtcbiAgfSk7XG59KTtcblxuY29uc3QgdGl0bGUgPSAoKSA9PiB7XG4gIGNvbnN0ICR0aXRsZSA9ICQoXCIudGFiLXRpdGxlXCIpO1xuXG4gICR0aXRsZS5vZmYoXCJjbGlja1wiKTtcblxuICAkdGl0bGUub24oXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgJHRpdGxlLnJlcGxhY2VXaXRoKFxuICAgICAgYDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwidGFiLXRpdGxlLWlucHV0IGZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtc20gbXgtMVwiIHZhbHVlPVwiJHskdGl0bGUudGV4dCgpfVwiPmAsXG4gICAgKTtcblxuICAgIGhhbmRsZVN0YWNrVGl0bGUoJHRpdGxlLnRleHQoKSk7XG4gIH0pO1xufTtcblxuY29uc3QgaGFuZGxlU3RhY2tUaXRsZSA9ICh0aXRsZSkgPT4ge1xuICAkKFwiLnRhYi10aXRsZS1pbnB1dFwiKS5vZmYoXCJrZXlkb3duXCIpO1xuXG4gICQoXCIudGFiLXRpdGxlLWlucHV0XCIpLm9uKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleSAhPT0gXCJFbnRlclwiKSByZXR1cm47XG5cbiAgICBjb25zdCBuZXdUaXRsZSA9ICQoZS50YXJnZXQpLnZhbCgpO1xuXG4gICAgJChlLnRhcmdldCkucmVwbGFjZVdpdGgoXG4gICAgICBgPGgxIGNsYXNzPVwidGFiLXRpdGxlIGN1cnNvci1wb2ludGVyXCI+JHtuZXdUaXRsZX08L2gxPmAsXG4gICAgKTtcblxuICAgIGNvbnN0ICRuYXYgPSAkKGRvY3VtZW50KS5maW5kKGBbZGF0YS12YWx1ZT0nJHt0aXRsZX0nXWApO1xuICAgICRuYXYuYXR0cihcImRhdGEtdmFsdWVcIiwgbmV3VGl0bGUpO1xuXG4gICAgdGl0bGUoKTtcbiAgfSk7XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vbG9jay5qc1wiO1xuaW1wb3J0IFwiLi9yZW1vdmUtcm93LmpzXCI7XG5pbXBvcnQgXCIuL3RhYi10aXRsZS5qc1wiO1xuaW1wb3J0IFwiLi90YWItcmVtb3ZlLmpzXCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=