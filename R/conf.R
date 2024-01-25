save_conf <- \(env, session, query){
  board <- getOption("blockr.app.board")

  user <- query$user

  if(!is.null(board)){
    pins::pin_write(board, env, "pin", type = "json")
    return()
  }

  file <- ".blockr"
  if(length(user))
    file <- sprintf(".%s", user)

  jsonlite::write_json(
    env, 
    file, 
    dataframe = "rows", 
    auto_unbox = TRUE, 
    pretty = TRUE
  )
}

get_conf <- \(session, query){
  board <- getOption("blockr.app.board")

  if(!is.null(board))
    return(pins::pin_read(board, "pin"))

  file <- ".blockr"
  if(length(query$user))
    file <- sprintf(".%s", query$user)

  jsonlite::read_json(file)
}
