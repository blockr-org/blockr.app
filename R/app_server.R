#' The application server-side
#'
#' @param input,output,session Internal parameters for {shiny}.
#'     DO NOT REMOVE.
#' @import shiny
#' @noRd
app_server <- function(input, output, session) {
  set_tab_id("nav")

  added <- create_server("create")

  locked <- reactiveVal(FALSE)
  observeEvent(input$addTab, {
    insert_block_tab(input$addTab, input, output, session, locked)
    updateTabsetPanel(
      inputId = "nav",
      selected = input$addTab
    )
  })

  output$locker <- renderUI({
    if (locked()) return("")
    query <- parseQueryString(session$clientData$url_search)

    on.exit({
      session$sendCustomMessage("bind-lock", list())
    })

    div(
      class = "input-group",
      tags$input(
        id = "lockName",
        class = "form-control",
        placeholder = "Name of the dashboard",
        value = query$name
      ),
      tags$button(
        id = "lock",
        class = "btn btn-outline-dark",
        "Lock"
      )
    )
  })

  observe({
    query <- parseQueryString(session$clientData$url_search)

    if(is.null(query$locked))
      return()
    
    locked(TRUE)
  })

  observeEvent(input$lock, {
    query <- parseQueryString(session$clientData$url_search)
    query$name <- input$lock$title
    query$locked <- "true"
    # hacky but requires fix on blockr.save-side
    options(query = query)
    query <- paste0(names(query), "=", query, collapse = "&") |>
      utils::URLencode()
    updateQueryString(paste0("?", query))
    locked(TRUE)
  })

  observeEvent(locked(), {
    if(locked()){
      lock()
      return()
    }

    unlock()
  })

  observeEvent(input$removeRow, {
    sapply(input$removeRow$stacks, \(x) {
      blockr::rm_workspace_stack(x)
      blockr.save::rm_tab(x)
    })
  })
}
