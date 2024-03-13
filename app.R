# Launch the ShinyApp (Do not remove this comment)
library(sortable)
library(ggplot2)
library(blockr.extra)
library(blockr.ggplot2)
library(blockr.pharmaverseadam)
library(blockr.pharmaversesdtm)
library(blockr.ggstatsplot)
library(blockr.echarts4r)
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
