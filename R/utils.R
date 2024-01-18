string_to_id <- \(str){
  str |>
    gsub(" ", "_", x = _) |>
    gsub("[[:punct:]]", "_", x = _) |>
    tolower()
}

new_row_remove_ui <- \(id){
  tags$button(
    icon("times"),
    `data-tab` = id,
    class = "btn btn-sm btn-dark remove-row text-white position-absolute start-0",
    style = "margin-left:auto;"
  )
}
