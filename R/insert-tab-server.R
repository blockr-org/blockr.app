insert_tab_server <- function(id, input, output, session){
  remove_id <- sprintf("%sRemove", id)

  observeEvent(input[[remove_id]], {
    removeTab("nav", id)
  })
}

insert_tab_servers <- function(conf, input, output, session){
  lapply(conf$tabs$tabs, \(tab) {
    insert_tab_server(tab$id, input, output, session)
  })
}
