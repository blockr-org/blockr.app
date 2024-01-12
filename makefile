check: document
	Rscript -e "devtools::check()"

document: bundle
	Rscript -e "devtools::document()"

bundle:
	Rscript -e "packer::bundle_prod()"

bundle_dev: 
	Rscript -e "packer::bundle_dev()"

install: check
	Rscript -e "devtools::install()"

test:
	Rscript -e "devtools::test()"

dev: bundle_dev 
	Rscript app.R

