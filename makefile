check: document
	Rscript -e "devtools::check()"

document: bundle
	Rscript -e "devtools::document()"

sass: 
	Rscript -e "output <- sass::sass(sass::sass_file('scss/main.scss'),cache = NULL,options = sass::sass_options(output_style='compressed'),output = 'inst/app/www/style.min.css')"

bundle: sass
	Rscript -e "packer::bundle_prod()"

bundle_dev: sass
	Rscript -e "packer::bundle_dev()"

install: check
	Rscript -e "devtools::install()"

test:
	Rscript -e "devtools::test()"

dev: bundle_dev 
	Rscript app.R

