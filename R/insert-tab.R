insert_block_tab <- \(title, input, output, session, locked){
  id <- string_to_id(title)
  remove_id <- sprintf("%sRemove", id)
  grid_id <- sprintf("%sGrid", id)
  add_id <- sprintf("%sAdd", id)
  list_id <- sprintf("%sList", id)

  on.exit({
    masonry::mason(sprintf("#%s", grid_id), delay = 1 * 1000)
  })

  tab <- bslib::layout_sidebar(
    div(
      class = "d-flex",
      div(
        class = "flex-grow-1",
        h1(
          title,
          class = "tab-title"
        )
      ),
      div(
        class = "flex-shrink-1",
        tags$a(
          id = remove_id,
          class = "remove-tab btn btn-sm locker btn-outline-danger",
          icon("trash")
        )
      )
    ),
    masonry::masonryGrid(
      id = grid_id,
      send_on_change = TRUE,
      styles = list(
        rows = list(
          `min-height` = "5rem"
        ),
        items = list(
          margin = ".5rem"
        )
      )
    ),
    sidebar = bslib::sidebar(
      div(
        class = "d-flex",
        div(
          class = "flex-grow-1",
          actionButton(
            add_id,
            "row",
            icon = icon("plus"),
            class = "btn-sm add-row"
          )
        ),
        div(
          class = "flex-shrink-1 p-1",
          blockr.ui::addStackUI(
            add_id, 
            content = span(
              class = "rounded border border-secondary px-2 py-1 text-muted",
              icon("grip"), 
              "Stack"
            ),
            target = ".masonry-row"
          )
        )
      ),
      h2("Blocks"),
      blockr.ui::blockListUI(list_id, max_height = "35rem")
    )
  )

  set_tab(
    title, 
    id = id,
    content = tab
  )

  insertTab(
    "nav",
    tabPanel(
      title,
      id = id,
      tab
    )
  )

  insert_tab_server(id, input, output, session)
  handle_add_stack(id, input, session)
}
