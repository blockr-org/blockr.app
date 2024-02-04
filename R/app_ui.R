#' The application User-Interface
#'
#' @param request Internal parameter for `{shiny}`.
#'     DO NOT REMOVE.
#' @import shiny
#' @noRd
app_ui <- function(request) {
  tagList(
    # Leave this function for adding external resources
    golem_add_external_resources(),
    # Your application UI logic
    bslib::page_navbar(
      tabPanel(
        "Home", 
        id = "home",
        div(
          class = "d-flex",
          div(
            class = "flex-grow-1",
            h1("Blockr application"),
            h2("Compose dashboards from blocks"),
          ),
          div(
            class = "flex-shrink-1",
            tags$img(
              src = "www/logo.png",
              width = 250
            )
          )
        ),
        div(
          class = "d-flex",
          div(
            class = "flex-shrink-1 px-2",
            tags$a(
              href = "https://blockr-org.github.io/blockr/",
              target = "_blank",
              "Documentation"
            )
          ),
          div(
            class = "flex-shrink-1",
            uiOutput("locker")
          ),
          div(
            class = "flex-grow-1",
            tags$a(
              `data-bs-toggle` = "collapse",
              href = "#createBlock",
              class = "btn btn-sm btn-outline-dark ms-2",
              "Create a block"
            )
          )
        ),
        div(
          id = "createBlock",
          class = "collapse",
          createUI("create")
        )
      ),
      title = "blockr",
      id = "nav",
      header = list(
        useBlockr(),
        fontawesome::fa_html_dependency(),
        blockr.ui::dependency("stack"),
        blockr.ui::dependency("register"),
        masonry::masonryDependencies()
      )
    ) 
  )
}

#' Add external Resources to the Application
#'
#' This function is internally used to add external
#' resources inside the Shiny application.
#'
#' @import shiny
#' @importFrom golem add_resource_path activate_js favicon bundle_resources
#' @noRd
golem_add_external_resources <- function() {
  add_resource_path(
    "www",
    app_sys("app/www")
  )

  tags$head(
    favicon(),
    bundle_resources(
      path = app_sys("app/www"),
      app_title = "blockr"
    )
    # Add here other external resources
    # for example, you can add shinyalert::useShinyalert()
  )
}
