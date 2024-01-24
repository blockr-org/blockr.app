insert_block_tab <- \(title, input, output, session, locked){
  id <- string_to_id(title)
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
        blockr.ui::addStackUI(
          sprintf("%sAdd", id), 
          target = ".masonry-row"
        ),
      ),
      div(
        class = "flex-shrink-1",
        actionButton(
          add_id,
          "row",
          icon = icon("plus"),
          class = "btn-sm add-row"
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

  observeEvent(input[[add_id]], {
    on.exit({
      session$sendCustomMessage(
        "blockr-app-bind-remove",
        list()
      )
      blockr.ui::add_stack_bind(
        add_id,
        delay = 50
      )
    })
    masonry::masonry_add_row(
      sprintf("#%s", grid_id),
      new_row_remove_ui(id),
      classes = "border position-relative rounded my-2"
    )
  })

  add_stack <- blockr.ui::add_stack_server(
    add_id,
    delay = 2 * 1000
  )

  sel <- blockr.ui::block_list_server(
    list_id,
    delay = 1 * 1000
  )

  new_blocks <- reactiveVal()
  observeEvent(sel$dropped(), {
    new_blocks(
      list(
        position = NULL,
        block = available_blocks()[sel$dropped()$index][[1]],
        target = sel$dropped()$target
      )
    )
  })

  observeEvent(add_stack$dropped(), {
    new_blocks(NULL)
  })

  observeEvent(add_stack$dropped(), { 
    stack <- new_stack()

    new_block <- eventReactive(new_blocks(), {
      if(attr(stack, "name") != new_blocks()$target)
        return()

      new_blocks()
    }, ignoreInit = TRUE)

    masonry::masonry_add_item(
      sprintf("#%s", grid_id),
      row_id = sprintf("#%s", add_stack$dropped()$target),
      item = generate_ui(stack)
    )

    blockr.ui::block_list_bind(delay = 500)

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
