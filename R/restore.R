restore_custom <- \(conf, input, output, session = shiny::getDefaultReactiveDomain(), query){
  session$onFlushed(\(){
    i <- 0L
    all_done <- lapply(conf$tabs$tabs, \(tab) {
      i <<- i + 1L
      id <- tab$id
      grid_id <- sprintf("%sGrid", id)
      add_id <- sprintf("%sAdd", id)
      list_id <- sprintf("%sList", id)

      last <- if(i == length(conf$tabs$tabs)) TRUE else FALSE

      insert_tab_servers(conf, input, output, session)
      handle_add_stack(id, input, session)
      restore_tab_stacks(conf, tab, id, list_id, session, last)
    })

    observe({
      ad <- all_done |>
        sapply(\(r) r())

      if(!all(ad))
        return()
      
      cat("All done restorning stacks UIs\n")
      restore_stacks_server(conf)
      waiter::waiter_hide()
    })
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

    grid_id <- sprintf("%sGrid", tab_id)
    masonry::mason(sprintf("#%s", grid_id), delay = 1 * 1000)
    masonry::masonry_restore_config(grid_id, tab$masonry, delay = 1.5 * 1000)
    masonry::masonry_get_config(grid_id, delay = 1.5 * 1000)
    session$sendCustomMessage("restored-tab", list(id = grid_id))
  })

  done <- eventReactive(count_items(), {
    count_items() == n_stacks
  })

  return(done)
}

get_stack_row_index <- function(stacks, stack_name){
  stacks |>
    purrr::keep(\(stack) {
      isTRUE(stack$stack == stack_name)
    }) |>
    purrr::map("row") |>
    unlist()
}

restore_stacks_server <- function(conf){
  ws <- conf$workspace
  ws$title <- NULL
  ws$settings <- NULL

  # we should reorder stacks to have them
  # in the order they should be called
  ws <- reorder_stacks(ws)
  restore_stack_server_recurse(ws, 1)
}

restore_stack_server_recurse <- function(stacks, index){
  if(index > length(stacks))
    return()

  cat("Restoring stack server", attr(stacks[[index]], "name"), "\n")
  server <- generate_server(stacks[[index]])

  observeEvent(server$stack, {
    if(is.null(attr(server$stack, "result")))
      return()
    restore_stack_server_recurse(stacks, index + 1)
  })
}

reorder_stacks <- function(ws){
  tree <- ws |>
    lapply(\(stack) {
      depends <- stack |>
        sapply(\(block) {
          if(inherits(block, "result_block"))
            return(attr(block$stack$value, "name"))

          if(inherits(block, "join_block"))
            return(attr(block$y$value, "name"))

          return()
        })

      depends[which(!sapply(depends, is.null))] |>
        unlist() |>
        unique()
    })

  sorted <- tryCatch(
    sort_with_dependencies(tree),
    error = \(e) e
  )

  if(inherits(sorted, "error")){
    cat("Error sorting stacks with dependencies\n")
    return(ws)
  }

  cat("Restoring stacks in following order:\n")

  sorted |>
    names() |>
    lapply(\(name) {
      ws[[name]]
    })
}

topological_sort <- function(graph) {
  visited <- vector("logical", length(graph))
  visited[] <- FALSE
  
  order_stack <- vector("list")
  
  dfs <- function(node) {
    visited[node] <<- TRUE
    
    for (neighbor in graph[[node]]) {
      if (!visited[neighbor]) {
        dfs(neighbor)
      }
    }
    order_stack <<- c(order_stack, list(node))
  }
  
  for (node in 1:length(graph)) {
    if (!visited[node]) {
      dfs(node)
    }
  }
  
  return(rev(order_stack))
}

sort_with_dependencies <- function(x) {
  dependencies <- lapply(x, function(val) if (!is.null(val)) val else character(0))
  
  graph <- lapply(dependencies, function(dep) {
    match(dep, names(x))
  })
  
  sorted_order <- unlist(topological_sort(graph))
  
  sorted_x <- x[sorted_order]
  
  rev(sorted_x)
}
