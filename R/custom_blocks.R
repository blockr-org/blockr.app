demo_data_block <- function(...) {
  initialize_block(
    new_data_block(
      ...,
      selected = "iris"
    )
  )
}
 
num_cols <- function(data) {
  colnames(dplyr::select_if(data, is.numeric))
}

char_cols <- function(data) {
  colnames(dplyr::select_if(data, \(x) is.character(x) | is.factor(x)))
}
 
ggscatterstats_block <- function(data, ...) {
  types <- c(
    "parametric",
    "nonparametric",
    "robust",
    "bayes"
  )
 
  new_block(
    expr = quote(
      ggscatterstats(
        x = .(x),
        y = .(y),
        type = .(type),
        conf.level = .(conf.level)
      )
    ),
    fields = list(
      x = new_select_field(num_cols(data)[1], num_cols(data)),
      y = new_select_field(num_cols(data)[2], num_cols(data)),
      type = new_select_field(types[1], types),
      conf.level = new_numeric_field(0.95, min = 0, max = 1)
    ),
    class = c("ggscatterstats_block", "plot_block")
  )
}
 
new_label_block <- function(data, ...) {
  new_block(
    fields = list(
      xlab = new_string_field(num_cols(data$data)[1]),
      ylab = new_string_field(num_cols(data$data)[2]),
      title = new_string_field("")
    ),
    expr = quote(
      ggplot2::labs(x = .(xlab), y = .(ylab), title = .(title))
    ),
    class = c("plot_layer_block", "plot_block")
  )
}
 
label_block <- function(data, ...) {
  initialize_block(new_label_block(data, ...), data)
}
  
extract_stats_block <- function(data, ...) {
  fields <- list(
    attribute = new_select_field("subtitle_data", choices = c(
      "subtitle_data", "caption_data", "pairwise_comparisons_data", "descriptive_data", "one_sample_data",
      "tidy_data", "glance_data"
    ))
  )
 
  new_block(
    fields = fields,
    expr = quote({
      stats <- ggstatsplot::extract_stats(data)
      as.data.frame(stats[.(attribute)])
    }),
    ...,
    class = c("extract_stats_block", "transform_block")
  )
}
 
ggbetweenstats_block <- function(data, ...) {
  types <- c(
    "parametric",
    "nonparametric",
    "robust",
    "bayes"
  )
 
  blockr::new_block(
    expr = quote({
      ggstatsplot::ggbetweenstats(
        data = data,
        x = .(x),
        y = .(y),
        type = .(type),
        conf.level = .(conf.level)
      )
    }),
    fields = list(
      x = blockr::new_select_field(char_cols(data)[1], char_cols(data)),
      y = blockr::new_select_field(num_cols(data)[1], num_cols(data)),
      type = blockr::new_select_field(types[1], types),
      conf.level = blockr::new_numeric_field(0.95, min = 0, max = 1)
    ),
    class = c("ggbetweenstats_block", "plot_block")
  )
}

corrplot_block <- function(data, ...) {
  fields <- list(
    method = new_select_field("circle", choices= c("circle", "square", "ellipse", "number", "shade", "color", "pie")),
    type = new_select_field("full", choices= c("full", "lower", "upper")),
    order = new_select_field("original",choices= c("original", "AOE", "FPC", "hclust", "alphabet")),
    title = new_string_field()
  )
  new_block(
    fields = fields,
    expr = quote({
      corr_matrix <- data |> 
        dplyr::select_if(is.numeric) |> 
        purrr::discard(~ all(is.na(.))) |>  # removed those column which have all NA Values
        na.omit() |>  # removed the rows containing na values
        stats::cor()

      corrplot::corrplot(corr_matrix, method = .(method), type = .(type),
                         order = .(order), addrect = 2, tl.col = "black", tl.srt = 45,
                         diag = FALSE,
                         title = .(title)
      ) #
    }),
    ...,
    class = c("corrplot_block", "plot_block")
  )
}
 
register_custom_blocks <- function(){
  blockr::register_block(
    constructor = ggbetweenstats_block,
    name = "between stats plot",
    description = "scatter with stats",
    classes = c("ggbetweenstats_block", "plot_block"),
    input = "data.frame",
    output = "data.plot"
  )

  blockr::register_block(
    constructor = corrplot_block,
    name = "correration plot",
    description = "correration plot",
    classes = c("corrplot_block", "plot_block"),
    input = "data.frame",
    output = "plot"
  )

  blockr::register_block(
    constructor = demo_data_block,
    name = "demo data block",
    description = "data blcok",
    classes = c("demo_data_block", "data_block"),
    input = "data.frame",
    output = "data.frame"
  )

  blockr::register_block(
    constructor = extract_stats_block,
    name = "extract stats",
    description = "extract statistics from plot",
    classes = c("extract_stats_block", "transform_block"),
    input = "plot",
    output = "data.frame"
  )

  blockr::register_block(
    constructor = label_block,
    name = "label plot",
    description = "label plots",
    classes = c("label_block", "plot_block", "plot_layer_block"),
    input = "data.plot",
    output = "data.plot"
  )
   
  blockr::register_block(
    constructor = ggscatterstats_block,
    name = "scatter plot",
    description = "scatter with stats",
    classes = c("ggscatterstats_block", "plot_block"),
    input = "data.frame",
    output = "data.plot"
  )
}
