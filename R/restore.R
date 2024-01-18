restore_custom <- \(conf, input, output, session){
  purrr::walk(conf$tabs$tabs, \(tab) {
    grid_id <- sprintf("#%sGrid", tab$id)

    on.exit({
      cat("Restoring masonry\n")
      masonry::mason(grid_id, delay = 1 * 1000)
      masonry::masonry_restore_config(
        sprintf("%sGrid", tab$id), 
        tab$masonry
      )
      restore_tab_stacks(conf, tab$id)
    })

    add_stack <- blockr.ui::add_stack_server(
      sprintf("%sAdd", tab$id),
      delay = 2 * 1000
    )

    observeEvent(add_stack$dropped(), {
      sel <- blockr.ui::block_list_server(
        sprintf("%sList", tab$id),
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
        grid_id,
        row_id = sprintf("#%s", add_stack$dropped()$target),
        item = generate_ui(stack)
      )

      stack_server <- generate_server(stack, new_block = new_block)

      observeEvent(input[[sprintf("%s_config", grid_id)]], {
        print(input[[sprintf("%s_config", grid_id)]])
        set_masonry(
          tab$id, 
          input[[sprintf("%s_config", grid_id)]]
        )
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
