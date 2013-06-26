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
