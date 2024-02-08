insert_tab_server <- function(id, input, output, session){
  remove_id <- sprintf("%sRemove", id)

  observe({
    session$sendCustomMessage("remove-tab", list())
  })

  observeEvent(input[[remove_id]], {
    sapply(input[[remove_id]], \(x) {
      blockr::rm_workspace_stack(x)
    })
    removeTab("nav", id)
    blockr.save::rm_tab(id)
  })
}

insert_tab_servers <- function(conf, input, output, session){
  lapply(conf$tabs$tabs, \(tab) {
    insert_tab_server(tab$id, input, output, session)
  })
}
