all:
	make update
	make clean
	make build

update:
	-git remote update
	-git rebase

clean:
	-rm -rf build
	-rm -rf node_modules
	-rm -rf app/css
	-rm -rf app/template
	-find . -name '.DS_Store' | xargs rm
	-rm -rf ../plugins/Loupe/tmpl/loupe.tmpl
	-rm -rf ../mt-static/plugins/Loupe/*

dev:
	-npm install
	-grunt dev

build:
	-make dev
	-grunt build

l10n:
	-grunt makeL10N:concat

build_sass_sourcemaps:
	-make clean_sass_sourcemaps
	-compass compile --config compass_sourcemaps_config.rb

clean_sass_sourcemaps:
	-find app/css/cards -name '*.css' | xargs rm
	-find app/css/sass -name '*.css' | xargs rm
	-find . -name '*.css.map' | xargs rm
