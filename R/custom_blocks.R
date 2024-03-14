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

lbl <- function(var, label) structure(var, label = label)

add_change_from_baseline <- function(data, df_name = "LB") {
  if(nrow(data) == 0) return(data)
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

register_custom_blocks <- function(){
  blockr::register_block(
    constructor = corrplot_block,
    name = "correration plot",
    description = "Plot a correlation matrix",
    classes = c("corrplot_block", "plot_block"),
    input = "data.frame",
    output = "plot_block"
  )
  blockr::register_block(
    constructor = change_from_baseline_block,
    name = "change_from_baseline",
    description = "Add change from baseline stats",
    classes = c("change_from_baseline_block", "transform_block"),
    input = "data.frame",
    output = "data.frame"
  )
}
