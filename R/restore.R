restore_custom <- \(conf, input, output, session = shiny::getDefaultReactiveDomain(), query){
  i <- 0L
  purrr::walk(conf$tabs$tabs, \(tab) {
    i <<- i + 1L
    id <- tab$id
    grid_id <- sprintf("%sGrid", id)
    add_id <- sprintf("%sAdd", id)
    list_id <- sprintf("%sList", id)

    last <- if(i == length(conf$tabs$tabs)) TRUE else FALSE
    on.exit({
      restore_tab_stacks(conf, tab, id, list_id, session, last)
    })

    insert_tab_servers(conf, input, output, session)
    handle_add_stack(id, input, session)
  })
}

restore_tab_stacks <- function(conf, tab, tab_id, list_id, session, last){
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

  cat("Restoring", length(grid), "stacks on tab", tab_id, "\n")

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
  n_rows <- length(grid)
  count_rows <- reactiveVal(0L)
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
        count_rows(count_rows() + 1L)
      })
    })

  # we have to render content and dependencies with
  # processDeps (in R) and renderAsync (in JS) in shiny
  # asynchronous render means we cannot be sure that,
  # at the time we want to add items, that the rows
  # have been added to the DOM. We have to wait for
  # the count to be equal to the number of rows
  # before we can add items.
  n_stacks <- length(stacks)
  count_items <- reactiveVal(0L)
  observeEvent(count_rows(), {
    if(count_rows() != n_rows)
      return()

    ws |>
      purrr::map2(names(ws), \(stack, name) {
        row <- get_stack_row_index(stacks, name)

        # this means the stack is not on this tab, we skip
        if(is.null(row))
          return()

        cat("Restoring stack UI", name, "on tab", tab_id, "on row", row, "\n")
        ev_id <- sprintf("%sItemRendered", name)
        masonry::masonry_add_item(
          sprintf("#%sGrid", tab_id), 
          row,
          item = generate_ui(stack),
          position = "end",
          mason = FALSE,
          event_id = ev_id
        )

        observeEvent(session$input[[ev_id]], {
          count_items(count_items() + 1L)
        })
      })
  })

  observeEvent(count_items(), {
    if(count_items() != n_stacks)
      return()

    ws |>
      purrr::map2(names(ws), \(stack, name) {
        row <- get_stack_row_index(stacks, name)

        # this means the stack is not on this tab, we skip
        if(is.null(row))
          return()

        cat("Restoring stack server", name, "on tab", tab_id, "on row", row, "\n")

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

    grid_id <- sprintf("%sGrid", tab_id)
    masonry::mason(sprintf("#%s", grid_id), delay = 1 * 1000)
    masonry::masonry_restore_config(grid_id, tab$masonry, delay = 1.5 * 1000)
    masonry::masonry_get_config(grid_id, delay = 1.5 * 1000)
    session$sendCustomMessage("restored-tab", list(id = grid_id))
    waiter::waiter_hide()
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
