#' The application server-side
#'
#' @param input,output,session Internal parameters for {shiny}.
#'     DO NOT REMOVE.
#' @import shiny
#' @noRd
app_server <- function(input, output, session) {
  set_tab_id("nav")

  locked <- reactiveVal(FALSE)
  observeEvent(input$addTab, {
    insert_block_tab(input$addTab, input, output, session, locked)
    updateTabsetPanel(
      inputId = "nav",
      selected = input$addTab
    )
  })

  output$lockButton <- renderUI({
    if (locked()) return("")
    actionButton("lock", "Lock dashboard", class = "btn-sm")
  })

  observe({
    query <- parseQueryString(session$clientData$url_search)

    if(is.null(query$locked))
      return()
    
    locked(TRUE)
  })

  observeEvent(input$lock, {
    query <- parseQueryString(session$clientData$url_search)
    query$locked <- "true"
    query <- paste0(names(query), "=", query, collapse = "&")
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
    print(input$removeRow)
  })
}
