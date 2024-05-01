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
    admins <- blockr.save::get_admins()

    if(length(get_user()))
      admins <- c(get_user(), admins)

    on.exit({
      session$sendCustomMessage("bind-lock", list())
    })

    div(
      h4("Save"),
      div(
        class = "d-flex",
        div(
          class = "flex-grow-1",
          textInput(
            "lockName",
            "Dashboard name",
            placeholder = "Name of the dashboard",
            value = query$name,
            width = "100%"
          )
        ),
        div(
          class = "flex-shrink-1 mx-1",
          selectizeInput(
            "admins",
            "Admins",
            selected = admins,
            choices = admins,
            multiple = TRUE,
            options = list(
              create = TRUE,
              placeholder = "Admins"
            )
          )
        ),
        div(
          class = "flex-shrink-1",
          br(),
          tags$button(
            id = "save",
            class = "btn btn-outline-secondary",
            "Save"
          )
        )
      ),
      div(
        id = "link-wrapper",
        style = "display:none;",
        p("Your dashboard can be shared with:"),
        verbatimTextOutput("link")
      )
    )
  })

  observe({
    user <- get_user()

    if(is.null(user))
      return()

    if(!length(blockr.save::get_admins()))
      return()

    if(user %in% blockr.save::get_admins())
      return()
    
    cat("locking dashboard for", user, "\n")
    locked(TRUE)
  })

  observeEvent(input$savethis, {
    shiny::showNotification(
      "Saving dashboard...",
      duration = 3,
      type = "message"
    )
    query <- parseQueryString(session$clientData$url_search)
    query$name <- input$savethis$title

    # hacky but requires fix on blockr.save-side
    # plus difficulties with shiny
    options(query = query)

    query <- paste0(names(query), "=", query, collapse = "&") |>
      utils::URLencode()
    updateQueryString(paste0("?", query))
    blockr.save::set_blockr()
    blockr.save::set_author(get_user())
    ts <- as.integer(Sys.time())
    blockr.save::set_timestamp(ts)
    save_conf(
      blockr.save::get_env(),
      session,
      list(
        name = input$savethis$title,
        timestamp = ts,
        user = get_user(),
        admin = is_admin()
      )
    )
    shiny::showNotification(
      "Dashboard saved",
      duration = 5,
      type = "message"
    )
    session$sendCustomMessage("saved", list())
  })

  output$link <- renderText({
    sprintf("%s?name=%s", input$href, input$lockName)
  })

  observeEvent(input$admins, {
    admins <- input$admins

    if(length(get_user()))
      admins <- c(get_user(), admins)

    cat(
      "Setting admins to",
      paste0(input$admins, collapse = ", "),
      "\n"
    )
    blockr.save::set_admins(admins)
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
