restore_custom <- \(conf, input, output, session = shiny::getDefaultReactiveDomain()){
  purrr::walk(conf$tabs$tabs, \(tab) {
    id <- tab$id
    grid_id <- sprintf("%sGrid", id)
    add_id <- sprintf("%sAdd", id)
    list_id <- sprintf("%sList", id)

    insert_tab_servers(conf, input, output, session)

    on.exit({
      cat("Restoring masonry\n")
      masonry::mason(sprintf("#%s", grid_id), delay = 1 * 1000)
      masonry::masonry_restore_config(
        sprintf("%sGrid", id), 
        tab$masonry
      )
      restore_tab_stacks(conf, id)
    })

    handle_add_stack(id, input, session)
  })
}

restore_tab_stacks <- function(conf, tab_id){
  grid <- conf$tabs$tabs[[tab_id]]$masonry$grid

  stacks <- grid |> 
    sapply(\(grid){
      if(!length(grid$items))
        return()

      grid$items |>
        lapply(\(item) {
          item$childId
        }) |> 
        unlist()
    })

  # restore rows
  grid |> 
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
