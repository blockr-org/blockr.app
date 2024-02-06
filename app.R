# Launch the ShinyApp (Do not remove this comment)
library(sortable)

pkgload::load_all(
  export_all = FALSE,
  helpers = FALSE,
  attach_testthat = FALSE
)

options(
  "golem.app.prod" = TRUE
  # "blockr.app.board" = pins::board_temp()
)

run_app(board = pins::board_temp())
