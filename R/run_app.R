#' Run the Shiny Application
#'
#' @param ... arguments to pass to golem_opts.
#' See `?golem::get_golem_options` for more details.
#' @inheritParams shiny::shinyApp
#'
#' @export
#' @importFrom shiny shinyApp
#' @importFrom golem with_golem_options
#' @import blockr
#' @import blockr.ui
#' @import blockr.save
run_app <- function(
  onStart = NULL, # nolint
  options = list(),
  enableBookmarking = NULL, # nolint
  uiPattern = "/", # nolint
  ...
) {
  with_golem_options(
    app = blockr_app(
      app_ui, 
      app_server,
      save_config = save_conf,
      get_config = get_conf,
      custom = restore_custom,
      onStart = onStart,
      options = options,
      enableBookmarking = enableBookmarking,
      uiPattern = uiPattern
    ),
    golem_opts = list(...)
  )
}
