insert_block_tab <- \(title, input, output, session, locked){
  id <- string_to_id(title)
  grid_id <- sprintf("%sGrid", id)
  add_id <- sprintf("%sAdd", id)
  list_id <- sprintf("%sList", id)

  on.exit({
    masonry::mason(sprintf("#%s", grid_id), delay = 1 * 1000)
  })

  tab <- bslib::layout_sidebar(
    h1(
      title,
      class = "tab-title"
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
          class = "flex-shrink-1",
          blockr.ui::addStackUI(
            sprintf("%sAdd", id), 
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
      blockr.ui::blockListUI(list_id)
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

  handle_add_stack(id, input, session)
}
