restore_custom <- \(conf, input, output, session){
  purrr::walk(conf$tabs$tabs, \(tab) {
    id <- tab$id
    grid_id <- sprintf("#%sGrid", id)
    add_id <- sprintf("%sAdd", id)
    list_id <- sprintf("%sList", id)

    on.exit({
      cat("Restoring masonry\n")
      masonry::mason(grid_id, delay = 1 * 1000)
      masonry::masonry_restore_config(
        sprintf("%sGrid", tab$id), 
        tab$masonry
      )
      restore_tab_stacks(conf, tab$id)
    })

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
      sprintf("%sAdd", tab$id),
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
  })
}

restore_tab_stacks <- function(conf, tab_id){
  stacks <- conf$tabs$tabs[[tab_id]]$masonry$grid |> 
    sapply(\(grid){
      grid$items |>
        lapply(\(item) {
          item$childId
        }) |> 
        unlist()
    })

  # restore rows
  conf$tabs$tabs[[tab_id]]$masonry$grid |> 
    lapply(\(x) {
      masonry::masonry_add_row(
        sprintf("#%sGrid", tab_id), 
        classes = "border", 
        position = "bottom",
        id = x$id
      )
    })

  # restore stacks
  ws <- conf$workspace
  ws$title <- NULL
  ws$settings <- NULL

  s <- ws |>
    purrr::map2(names(ws), \(stack, name) {
      if(name %in% stacks){
        return(stack)
      }

      return(NULL)
    }) |>
    purrr::keep(\(stack) {
      !is.null(stack)
    }) |>
    lapply(\(stack) {
      masonry::masonry_add_item(
        sprintf("#%sGrid", tab_id), 
        1L,
        item = generate_ui(stack)
      )

      server <- generate_server(stack)
    })
}
