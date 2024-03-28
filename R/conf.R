save_conf <- \(env, session, query){
  on.exit({
    cat("Resetting config\n")
    blockr.save::reset_conf()
    blockr:::clear_workspace()
  })

  board <- getOption("blockr.app.board")

  name <- query$name
  if(!length(name)){
    cat("No name given, not saving\n")
    return()
  }

  if(!is.null(board)){
    cat("Saving dashboard to pin:", name, "\n")
    file <- tempfile()
    on.exit(unlink(file))
    ...write(env, file = file)
    # name <- sprintf("%s/%s", getOption("blockr.app.prefix"), name)
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
  blockr.save::reset_conf()
  board <- getOption("blockr.app.board")

  name <- query$name
  if(!length(name)){
    cat("No name given, not restoring\n")
    return()
  }

  waiter::waiter_show(
    html = div(
      waiter::spin_1(),
      h1("Restoring workspace", class = "text-dark")
    ),
    color = "#fff"
  )

  if(!is.null(board)){
    name <- sprintf("%s/%s", getOption("blockr.app.prefix"), name)
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

...read <- function(file){ # nolint
  get(load(file))
}

...write <- function(data, file, ...){ # nolint
  save(data, file = file)
}
