new_sdtm_block <- function(...) {
  initialize_block(
    new_data_block(
      ...,
      dat = as.environment("package:pharmaversesdtm")
    )
  )
}

sdtm_block <- function(...) {
  initialize_block(new_sdtm_block(...))
}

new_adam_block <- function(...) {
  initialize_block(
    new_data_block(
      ...,
      dat = as.environment("package:pharmaverseadam")
    )
  )
}

adam_block <- function(...) {
  initialize_block(new_adam_block(...))
}
 
num_cols <- function(data) {
  colnames(dplyr::select_if(data, is.numeric))
}

char_cols <- function(data) {
  colnames(dplyr::select_if(data, \(x) is.character(x) | is.factor(x)))
}
 
new_ggscatterstats_block <- function(data, ...) {
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
      conf.level = new_numeric_field(0.95, min=0, max=1)
    ),
    class = c("ggscatterstats_block", "plot_block")
  )
}

ggscatterstats_block <- function(data, ...) {
  initialize_block(new_ggscatterstats_block(data, ...), data)
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
    class = c("label_block", "plot_layer_block", "plot_block")
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
#' Create a labeled variable
#'
#' This function creates a labeled variable by attaching a label attribute to a given value.
#' @param var The variable to assign the label to
#' @param label The label to assign to the variable.
#'
#' @return A labeled variable with the specified label.
#'
#' @examples
#' lbl(iris$Species, "Flower Species")
#'
#' @export
lbl <- function(var, label) structure(var, label = label)

#' Add change from baseline values:
#'  Value, Change, Percent Change from baseline
#'
#' @param data
#' @param df_name prefix of domain variables - name of SDTM
#'
#' @return dataframe
#' @importFrom dplyr arrange group_by mutate ungroup
#' @export
#'
#' @examples
add_change_from_baseline <- function(data, df_name = "LB") {
  if(nrow(data) == 0) return(data)
  # checkmate::assert_data_frame(data, min.rows = 1)
  checkmate::assert_string(df_name, null.ok = TRUE)
  
  make_name <- function(x) paste0(df_name, x)
  seq_var <- make_name("SEQ")
  resn_var <- make_name("STRESN")
  test_var <- make_name("TEST")
  cat_var <- make_name("CAT")
  # start day
  # stdy_var <- make_name("DY")
  
  # flags
  blfl_var <- make_name("BLFL")
  
  grouped_data <- data |>
    dplyr::group_by(across(any_of(c("USUBJID", cat_var, test_var))))
  
  baselines <- grouped_data |>
    # only consider non-missing baseline records
    dplyr::filter(!!dplyr::sym(blfl_var) == "Y", if (resn_var %in% names(grouped_data)) !is.null(!!dplyr::sym(resn_var)) else TRUE) |>
    dplyr::select(any_of(c("USUBJID", cat_var, test_var, "VISITNUM", "VISIT", resn_var))) |>
    # In the event of duplicate baseline candidates, take the last record
    dplyr::filter(dplyr::row_number() == dplyr::n()) |>
    dplyr::rename(
      BASE = resn_var,
      BASEVISIT = VISIT,
      BASEVISITNUM = VISITNUM
    )
  
  data <- grouped_data |>
    dplyr::left_join(baselines) |>
    dplyr::ungroup() |>
    dplyr::mutate(
      BASE = lbl(BASE, "Baseline Value"),
      AVAL = (!!dplyr::sym(resn_var)) |> lbl("Analysis Value"),
      # record is postbaseline if the start day is after the baseline day and we have both values
      PBLFL = ifelse((VISITNUM > BASEVISITNUM) & !is.na(BASEVISITNUM), "Y", NA) |> lbl("Post Baseline Flag"),
      CHG = ifelse(PBLFL == "Y" & !is.na(!!dplyr::sym(resn_var)) & !is.na(BASE), round(!!dplyr::sym(resn_var) - BASE, 2), NA) |> lbl("Change from Baseline"),
      PCHG = ifelse(PBLFL == "Y" & BASE > 0 & !is.na(CHG), round(CHG / BASE * 100, 2), NA) |> lbl("Percent Change from Baseline")
    )
  data
}


custom_block <- function(data, ...) {
  initialize_block(
    
    new_block(
      fields = list(),
      expr = quote({
        dplyr::select_if(.tbl = data, .predicate = is.numeric) %>% # dropping non -numeric column
          purrr::discard(~ all(is.na(.)))
      }),
      class = c("custom_block", "transform_block"),
      ...
    ), data)
}

change_from_baseline_block <- function(data, ...) {
  initialize_block(
    new_block(
      fields <- list(),
      expr = quote({
        add_change_from_baseline(data = data)
      }),
      class = c("change_from_baseline_block", "transform_block"),
      ...
    ), data)
}

new_ggplot_block <- function(data, ...){
  
  col_names <- function(data) colnames(data)
  x_default <- function(data) col_names(data)[1]
  y_default <- function(data) col_names(data)[2]
  fields <- list(
    x = new_select_field(x_default, col_names, type = "name"),
    y = new_select_field(y_default, col_names, type = "name")
  )
  expr <- quote(
    ggplot2::ggplot(mapping = aes(x = .(x), y = .(y)))
  )
  classes <- c("ggplot_block", "plot_block", "submit_block")
  new_block(fields = fields,
            expr = expr,
            class = classes, ...)
}

ggplot_block <- function(data, ...) {
  initialize_block(new_ggplot_block(data, ...), data)
}

new_geompoint_block <- function(data, ...) {
  
  new_block(
    fields = list(    ),
    expr = quote(
      geom_point()
    ),
    class = c("geompoint_block", "plot_layer_block", "plot_block"),
    ...
  )
}

geompoint_block <- function(data, ...) {
  initialize_block(new_geompoint_block(data, ...), data)
}

new_geomline_block <- function(data, ...) {
  
  new_block(
    fields = list(),
    expr = quote(
      ggplot2::geom_line()
    ),
    class = c("geomline_block", "plot_layer_block", "plot_block"),
    ...
  )
}

geomline_block <- function(data, ...) {
  initialize_block(new_geomline_block(data, ...), data)
}

new_geomsmooth_block <- function(data, ...) {
  
  new_block(
    fields = list(
      color = new_select_field("blue", c("blue", "green", "red")),
      method = new_select_field("glm", choices =  c("lm", "glm", "gam", "loess")),
      se = new_switch_field(value = FALSE)
    ),
    expr = quote(
      geom_smooth(color = .(color), method = .(method), se = .(se))
    ),
    class = c("plot_layer_block", "plot_block"),
    ...
  )
}

geomsmooth_block <- function(data, ...) {
  initialize_block(new_geomsmooth_block(data, ...), data)
}
calculate_n <- function(data) {
  nrow(data$data) 
}
calculate_p_value <- function(data) 
{
  x = data$mapping$x |> rlang::eval_tidy(data = data$data)
  y = data$mapping$y |> rlang::eval_tidy(data = data$data)
  stats::cor.test(x = x, y = y)$p.value
}

calculate_R <- function(data) 
{
  x = data$mapping$x |> rlang::eval_tidy(data = data$data)
  y = data$mapping$y |> rlang::eval_tidy(data = data$data)
  stats::cor.test(x = x, y = y)$p.value
}



new_annotate_block <- function(data, ...) {
  
  new_block(
    fields = list(
      x_position = new_numeric_field(value = 1, min = 0, max = 100),
      y_position = new_numeric_field(value = 5, min = 0, max = 100),
      hjust = new_numeric_field(value = 1, min = 0, max = 1),
      vjust = new_numeric_field(value = 1, min = 0, max = 1),
      size = new_numeric_field(value = 5, min = 1, max = 20),
      color = new_select_field("red", c("blue", "green", "red"))
    ),
    expr = quote(
      annotate("text", x = .(x_position), y = .(y_position), 
               label = sprintf("R = %.2f, p = %.2e\nn = %d", calculate_R(data), calculate_p_value(data), calculate_n(data)),
               # sprintf("Hello !"),
               hjust = .(hjust), vjust = .(vjust), size = .(size), color = .(color))
    ),
    class = c("annotate_block", "plot_layer_block", "plot_block"),
    ...
  )
}

annotate_block <- function(data, ...) {
  initialize_block(new_annotate_block(data, ...), data)
}

new_label_block <- function(data, ...) {
  new_block(
    fields = list(
      xlab = new_string_field(colnames(data$data)[1]),
      ylab = new_string_field(colnames(data$data)[2]),
      title = new_string_field("")
    ),
    expr = quote(
      ggplot2::labs(x = .(xlab), y = .(ylab), title = .(title))
    ),
    class = c("label_block", "plot_layer_block", "plot_block")
  )
  
}

label_block <- function(data, ...) {
  initialize_block(new_label_block(data, ...), data)
}

new_theme_block <- function(data, ...) {
  new_block(
    fields = list(
      theme = new_select_field(
        "theme_minimal", 
        grep("^theme_.*$", ls("package:ggplot2"), perl = TRUE, value = TRUE),
        type = "name"
      )
    ),
    expr = quote(
      do.call(.(theme), list())
    ),
    class = c("theme_block", "plot_layer_block", "plot_block"),
    ...
  )
}

theme_block <- function(data, ...) {
  initialize_block(new_theme_block(data, ...), data)
}

new_geomhline_block <- function(data, ...) {
  
  new_block(
    fields = list(
      yintercept = new_numeric_field(value = 10, min = 0, max = 1000),
      linetype = new_select_field(value = "blank",choices = c("blank", "solid", "dashed", "dotted", "dotdash", "longdash", "twodash"))
    ),
    expr = quote(
      geom_hline(yintercept = .(yintercept), linetype = .(linetype))
    ),
    class = c("geomhline_block", "plot_layer_block", "plot_block"),
    ...
  )
}
geomhline_block <- function(data, ...) {
  initialize_block(new_geomhline_block(data, ...), data)
}

new_geomvline_block <- function(data, ...) {
  
  new_block(
    fields = list(
      xintercept = new_numeric_field(value = c(10,20), min = 0, max = 1000),
      linetype = new_select_field(value = "blank",choices = c("blank", "solid", "dashed", "dotted", "dotdash", "longdash", "twodash"))
    ),
    expr = quote(
      geom_vline(xintercept = .(xintercept), linetype = .(linetype))
    ),
    class = c("geomvline_block", "plot_layer_block", "plot_block"),
    ...
  )
}
geomvline_block <- function(data, ...) {
  initialize_block(new_geomvline_block(data, ...), data)
}




register_custom_blocks <- function(){
  blockr::register_block(
    constructor = ggplot_block,
    name = "ggplot_block",
    description = "ggplot_block",
    classes = c("ggplot_block", "plot_block"),
    input = "data.frame",
    output = "data.plot"
  )
  blockr::register_block(
    constructor = geompoint_block,
    name = "geompoint_block",
    description = "geompoint_block",
    classes = c("geompoint_block", "plot_block", "plot_layer_block"),
    input = "data.plot",
    output = "data.plot"
  )

  blockr::register_block(
    constructor = geomline_block,
    name = "geomline_block",
    description = "geompoint_block",
    classes = c("geomline_block", "plot_block", "plot_layer_block"),
    input = "data.frame",
    output = "data.plot"
  )

  blockr::register_block(
    constructor = annotate_block,
    name = "annotate_block",
    description = "annotate_block",
    classes = c("annotate_block", "plot_block", "plot_layer_block"),
    input = "data.plot",
    output = "data.plot"
  )

  blockr::register_block(
    constructor = geomsmooth_block,
    name = "geomsmooth_block",
    description = "geomsmooth_block",
    classes = c("geomsmooth_block", "plot_block", "plot_layer_block"),
    input = "data.plot",
    output = "data.plot"
  )

  blockr::register_block(
    constructor = geomvline_block,
    name = "geomvline_block",
    description = "geomvline_block",
    classes = c("geomvline_block", "plot_block", "plot_layer_block"),
    input = "data.plot",
    output = "data.plot"
  )

  blockr::register_block(
    constructor = geomhline_block,
    name = "geomhline_block",
    description = "geomhline_block",
    classes = c("geomhline_block", "plot_block", "plot_layer_block"),
    input = "data.plot",
    output = "data.plot"
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
    constructor = theme_block,
    name = "theme_block",
    description = "scatter with stats",
    classes = c("theme_block", "plot_block", "plot_layer_block"),
    input = "data.plot",
    output = "data.plot"
  )
  
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
    constructor = change_from_baseline_block,
    name = "change_from_baseline_block",
    description = "change_from_baseline_block",
    classes = c("change_from_baseline_block", "transform_block"),
    input = "data.frame",
    output = "data.frame"
  )
  
  blockr::register_block(
    constructor = sdtm_block,
    name = "SDTM data block",
    description = "SDTM datasets",
    classes = c("sdtm_block", "data_block"),
    input = NA_character_,
    output = "data.frame"
  )
  
  blockr::register_block(
    constructor = adam_block,
    name = "ADAM data block",
    description = "ADAM datasets",
    classes = c("adam_block", "data_block"),
    input = NA_character_,
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
    constructor = ggscatterstats_block,
    name = "scatter plot",
    description = "scatter with stats",
    classes = c("ggscatterstats_block", "plot_block"),
    input = "data.frame",
    output = "data.plot"
  )
}
