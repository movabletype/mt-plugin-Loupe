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
	-rm -rf app/components
	-rm -rf app/css
	-rm -rf app/template
	-find . -name '.DS_Store' | xargs rm

build:
	-npm install
	-bower install
	-grunt dev
	-grunt build
