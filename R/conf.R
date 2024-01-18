save_conf <- \(env, session, query){
  user <- query$user

  file <- ".blockr"
  if(length(user))
    file <- sprintf(".%s", user)

  jsonlite::write_json(
    env, 
    file, 
    dataframe = "rows", 
    auto_unbox = TRUE, 
    pretty = TRUE
  )
}

get_conf <- \(session, query){
  file <- ".blockr"
  if(length(query$user))
    file <- sprintf(".%s", query$user)

  jsonlite::read_json(file)
}
