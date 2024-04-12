restore_custom <- \(conf, input, output, session = shiny::getDefaultReactiveDomain(), query){
  purrr::walk(conf$tabs$tabs, \(tab) {
    id <- tab$id
    grid_id <- sprintf("%sGrid", id)
    add_id <- sprintf("%sAdd", id)
    list_id <- sprintf("%sList", id)

    on.exit({
      cat("Restoring masonry\n")
      masonry::mason(sprintf("#%s", grid_id), delay = 1 * 1000)
      masonry::masonry_restore_config(grid_id, tab$masonry, delay = 1.5 * 1000)
      restore_tab_stacks(conf, id, list_id, session)
      masonry::masonry_get_config(grid_id, delay = 1.5 * 1000)
      session$sendCustomMessage("restored-tab", list(id = grid_id))
    })

    insert_tab_servers(conf, input, output, session)
    handle_add_stack(id, input, session)
  })
  waiter::waiter_hide()
}

restore_tab_stacks <- function(conf, tab_id, list_id, session){
  grid <- conf$tabs$tabs[[tab_id]]$masonry$grid

  stacks <- grid |> 
    purrr::imap(\(grid, index){
      if(!length(grid$items))
        return()

      grid$items |>
        lapply(\(item) {
          list(
            row = index,
            stack = item$childId
          )
        })
    }) |>
    purrr::flatten()

  # restore stacks
  ws <- conf$workspace
  ws$title <- NULL
  ws$settings <- NULL

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

  # restore rows
  n <- length(grid)
  count <- reactiveVal(0L)
  grid |> 
    lapply(\(x) {
      event_id <- sprintf("%sRowAdd", x$id)
      masonry::masonry_add_row(
        sprintf("#%sGrid", tab_id), 
        classes = "border", 
        position = "bottom",
        id = x$id,
        event_id =  event_id 
      )

      observeEvent(session$input[[event_id]], {
        count(count() + 1L)
      })
    })

  # we have to render content and dependencies with
  # processDeps (in R) and renderAsync (in JS) in shiny
  # asynchronous render means we cannot be sure that,
  # at the time we want to add items, that the rows
  # have been added to the DOM. We have to wait for
  # the count to be equal to the number of rows
  # before we can add items.
  observeEvent(count(), {
    if(count() != n)
      return()

    ws |>
      purrr::map2(names(ws), \(stack, name) {
        row <- get_stack_row_index(stacks, name)

        # this means the stack is not on this tab, we skip
        if(is.null(row))
          return()

        masonry::masonry_add_item(
          sprintf("#%sGrid", tab_id), 
          row,
          item = generate_ui(stack),
          position = "end",
          mason = FALSE
        )

        new_block <- eventReactive(new_blocks(), {
          if(is.null(new_blocks()))
            return()

          # check that it's the correct stack
          if(attr(stack, "name") != new_blocks()$target)
            return()

          new_blocks()
        }, ignoreInit = TRUE)

        server <- generate_server(stack, new_block = new_block)
      })
  })

}

get_stack_row_index <- function(stacks, stack_name){
  stacks |>
    purrr::keep(\(stack) {
      isTRUE(stack$stack == stack_name)
    }) |>
    purrr::map("row") |>
    unlist()
}
