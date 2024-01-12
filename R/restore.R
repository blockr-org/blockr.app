restore_custom <- \(conf, input, output, session){
  purrr::walk(conf$tabs$tabs, \(tab) {
    grid_id <- sprintf("#%sGrid", tab$id)

    on.exit({
      masonry::mason(grid_id, delay = 1 * 1000)
    })

    add_stack <- blockr.ui::add_stack_server(
      sprintf("%sAdd", tab$id),
      delay = 2 * 1000
    )

    observeEvent(add_stack$dropped(), {
      sel <- blockr.ui::block_list_server(
        sprintf("%sList", tab$id),
        delay = 2 * 1000
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

      stack_server <- generate_server(stack)

      observeEvent(input[[sprintf("%s_config", grid_id)]], {
        print(input[[sprintf("%s_config", grid_id)]])
        set_masonry(
          tab$id, 
          setNames(input[[sprintf("%s_config", grid_id)]], grid_id)
        )
      })
    })
  })
}
