# Launch the ShinyApp (Do not remove this comment)
library(ggplot2)
library(sortable)
library(blockr.extra)
library(pharmaversesdtm)
library(pharmaverseadam)
library(ggstatsplot)
library(dplyr)
pkgload::load_all(
  export_all = TRUE,
  helpers = FALSE,
  attach_testthat = FALSE
)

options(
  "golem.app.prod" = TRUE,
  "blockr.app.board" = pins::board_connect(auth = "envvar")
)

run_app()
