.S3method("evaluate_block", "corrplot_block", function(x, data, ...) {
  structure(generate_code(x), data = data)
})

.S3method("server_output", "corrplot_block", function(x, result, output) {
  shiny::renderPlot({
    res <- result()
    eval(
      substitute(data %>% expr, list(expr = res)),
      list(data = attr(res, "data"))
    )
  })
})
