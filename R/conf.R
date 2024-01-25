save_conf <- \(env, session, query){
  board <- getOption("blockr.app.board")

  user <- query$user

  if(!is.null(board)){
    file <- tempfile()
    on.exit(unlink(file))
    ...write(env, file)
    pins::pin_upload(board, file, name = "pin")
    return()
  }

  file <- ".blockr"
  if(length(user))
    file <- sprintf(".%s", user)

  ...write(env, file, pretty = TRUE)
}

get_conf <- \(session, query){
  board <- getOption("blockr.app.board")

  if(!is.null(board)){
    data <- pins::pin_download(board, "pin") |>
      ...read()

    return(data)
  }

  file <- ".blockr"
  if(length(query$user))
    file <- sprintf(".%s", query$user)

  ...read(file)
}

...parse <- function(data, ...){ # nolint
  jsonlite::parse_json(data, ...)
}

...read <- function(file){ # nolint
  jsonlite::read_json(file)
}

...write <- function(data, file, ...){ # nolint
  jsonlite::write_json(
    data, 
    file, 
    dataframe = "rows", 
    auto_unbox = TRUE
  )
}
