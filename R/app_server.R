#' The application server-side
#'
#' @param input,output,session Internal parameters for {shiny}.
#'     DO NOT REMOVE.
#' @import shiny
#' @noRd
app_server <- function(input, output, session) {
  set_tab_id("nav")

  observeEvent(input$add, {
    if(input$title == ""){
      showNotification("Please enter a title", type = "warning")
      return()
    }
    insert_block_tab(input$title, input, output, session)
    updateTabsetPanel(
      inputId = "nav",
      selected = string_to_id(input$title)
    )
  })
}
