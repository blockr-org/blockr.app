handle_add_stack <- function(id, input, session = shiny::getDefaultReactiveDomain()) {
  grid_id <- sprintf("%sGrid", id)
  add_id <- sprintf("%sAdd", id)
  list_id <- sprintf("%sList", id)

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
    sprintf("%sAdd", id),
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
        position = sel$dropped()$position,
        block = available_blocks()[[sel$dropped()$index]],
        target = sel$dropped()$target
      )
    )
  })

  # reset the reactive when we add a stack
  observeEvent(add_stack$dropped(), {
    new_blocks(NULL)
  })

  observeEvent(add_stack$dropped(), { 
    stack <- new_stack()

    new_block <- eventReactive(new_blocks(), {
      if(is.null(new_blocks()))
        return()

      # check that it's the correct stack
      if(attr(stack, "name") != new_blocks()$target)
        return()

      # first block must be of type data
      if(!length(stack_server$stack) && !is.na(attr(new_blocks()$block, "input"))){
        # TODO change these default notifications from Shiny: ugly
        showNotification(
          "Stacks must start with a block of type data",
          type = "error"
        )
        return()
      }

      # stack has data block
      if(length(stack_server$stack) && is.na(attr(new_blocks()$block, "input"))){
        # TODO change these default notifications from Shiny: ugly
        showNotification(
          "Stack already has a data block",
          type = "error"
        )
        return()
      }

      new_blocks()
    }, ignoreInit = TRUE)

    masonry::masonry_add_item(
      sprintf("#%s", grid_id),
      row_id = sprintf("#%s", add_stack$dropped()$target),
      item = generate_ui(stack)
    )

    blockr.ui::block_list_bind(delay = 500, session = session)

    stack_server <- generate_server(stack, new_block = new_block)

    observeEvent(input[[sprintf("%s_config", grid_id)]], {
      set_masonry(
        id,
        input[[sprintf("%s_config", grid_id)]]
      )
    })

    observeEvent(stack_server$stack, {
      set_ws(stack_server$stack, attr(stack, "name"))
      new_blocks(NULL)
    })
  })
}
