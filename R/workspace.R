ws <- new.env()

set_ws <- function(stack, id){
  assign(id, stack, envir = ws)
  build_ws()
}

build_ws <- function(){
  nms <- ls(ws)

  stacks <- nms |>
    lapply(get, envir = ws) |>
    lapply(\(stack) {
      class(stack) <- "stack"
      stack
    })

  names(stacks) <- nms

  do.call(blockr::set_workspace, stacks)
}
