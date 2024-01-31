createUI <- function(id){ # nolint
  ns <- NS(id)

  tagList(
    blockr.ui::createBlockUI(ns(id))
  )
}

create_server <- function(id) {
  moduleServer(
    id,
    function(input, output, session) {
      added <- create_block_server(id)
      return(added)
    }
  )
}
