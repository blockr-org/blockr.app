insert_block_tab <- \(title, input, output, session, locked){
  id <- string_to_id(title)
  grid_id <- sprintf("%sGrid", id)
  add_id <- sprintf("%sAdd", id)

  on.exit({
    masonry::mason(sprintf("#%s", grid_id), delay = 1 * 1000)
  })

  tab <- bslib::layout_sidebar(
    div(
      class = "d-flex",
      div(
        class = "flex-grow-1",
        h1(title)
      ),
      div(
        class = "flex-shrink-1",
        blockr.ui::addStackUI(
          sprintf("%sAdd", id), 
          ".masonry-row"
        ),
        actionButton(
          add_id,
          "Add row"
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
      h2("Blocks"),
      blockr.ui::blockListUI(sprintf("%sList", id))
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

  observeEvent(input[[add_id]], {
    on.exit({
      session$sendCustomMessage(
        "blockr-app-bind-remove",
        list()
      )
    })
    masonry::masonry_add_row(
      sprintf("#%s", grid_id),
      new_row_remove_ui(id),
      class = "border position-relative"
    )
  })

  add_stack <- blockr.ui::add_stack_server(
    sprintf("%sAdd", id),
    delay = 2 * 1000
  )

  observeEvent(add_stack$dropped(), { 
    sel <- blockr.ui::block_list_server(
      sprintf("%sList", id),
      delay = 1 * 1000
    )

    new_block <- eventReactive(sel$dropped(), {
      list(
        position = NULL,
        block = available_blocks()[sel$dropped()$index][[1]]
      )
    })

    stack <- new_stack()

    masonry::masonry_add_item(
      sprintf("#%s", grid_id),
      row_id = sprintf("#%s", add_stack$dropped()$target),
      item = generate_ui(stack)
    )

    stack_server <- generate_server(stack, new_block = new_block)

    observeEvent(input[[sprintf("%s_config", grid_id)]], {
      set_masonry(
        id,
        input[[sprintf("%s_config", grid_id)]]
      )
    })

    observeEvent(stack_server$stack, {
      set_ws(stack_server$stack, attr(stack, "name"))
    })
  })
}
