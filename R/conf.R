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
    make_path(name) |>
      ...write()
    return()
  }

  file <- ".blockr"
  if(length(name))
    file <- sprintf(".%s", name)

  cat("Saving dashboard to file:", file, "\n")
  ...write(env, file, pretty = TRUE)
}

get_conf <- \(session, query){
  blockr:::clear_workspace()
  waiter::waiter_show(
    html = div(
      waiter::spin_1(),
      h1("Loading application", class = "text-dark")
    ),
    color = "#fff"
  )
  blockr.save::reset_conf()
  board <- getOption("blockr.app.board")

  name <- query$name
  if(!length(name)){
    cat("No name given, not restoring\n")
    waiter::waiter_hide()
    return()
  }

  waiter::waiter_update(
    html = div(
      waiter::spin_1(),
      h1("Loading application", class = "text-dark")
    )
  )

  if(!is.null(board)){
    cat("Restoring dashboard from pin:", name, "\n")
    data <- make_path(name) |>
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

make_path <- function(name){
  file.path(
    getOption("blockr.app.dir", getwd()),
    name
  )
}
