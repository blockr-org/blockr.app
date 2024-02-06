save_conf <- \(env, session, query){
  on.exit({
    cat("Resetting config\n")
    blockr.save::reset_conf()
  })

  board <- getOption("blockr.app.board")

  name <- query$name
  if(!length(name))
    name <- "blockr"

  if(!is.null(board)){
    cat("Saving dashboard to pin:", name, "\n")
    file <- tempfile()
    on.exit(unlink(file))
    ...write(env, file)
    pins::pin_upload(board, file, name = name)
    return()
  }

  file <- ".blockr"
  if(length(name))
    file <- sprintf(".%s", name)

  cat("Saving dashboard to file:", file, "\n")
  ...write(env, file, pretty = TRUE)
}

get_conf <- \(session, query){
  board <- getOption("blockr.app.board")

  name <- query$name
  if(!length(name))
    name <- "blockr"

  if(!is.null(board)){
    cat("Restoring dashboard from pin:", name, "\n")
    data <- pins::pin_download(board, name) |>
      ...read()

    return(data)
  }

  file <- ".blockr"
  if(length(query$name))
    file <- sprintf(".%s", query$name)

  cat("Restoring dashboard from file:", name, "\n")
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
