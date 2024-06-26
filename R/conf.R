save_conf <- \(env, session, query){
  board <- getOption("blockr.app.board")

  if(!is.null(query$autosave) && query$autosave == "false"){
    cat("Autosave disabled, not saving\n")
    return()
  }

  name <- query$name
  if(!length(name)){
    cat("No name given, not saving\n")
    return()
  }

  if(length(query$locked)){
    cat("Dashboard locked, not saving\n")
    return()
  }

  if(!length(env$workspace)){
    cat("No stacks on workspace probably an error, not saving\n")
    return()
  }

  if(!is.null(board)){
    cat("Saving dashboard to pin:", name, "\n")
    file <- tempfile()
    on.exit(unlink(file))
    ...write(env, file = file)
    pins::pin_upload(board, file, name = name)
    return()
  }

  path <- make_path(name)
  cat("Saving dashboard to file:", path, "\n")
  ...write(env, path)
  system2("chmod", c("777", path))
}

get_conf <- \(session, query){
  blockr.save::reset_conf()
  blockr:::clear_workspace()
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

  path <- make_path(name)
  cat("Restoring dashboard from file:", path, "\n")
  ...read(path)
}

...read <- function(file){ # nolint
  data <- get(load(file))
  cat("Reading", length(data$workspace), "stacks\n")
  return(data)
}

...write <- function(data, file, ...){ # nolint
  cat("Saving", length(data$workspace), "stacks\n")
  save(data, file = file)
}

make_path <- function(file){
  file.path(
    getOption("blockr.app.dir", getwd()),
    file
  )
}
