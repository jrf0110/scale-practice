javascript:
	browserify -e js/app.js > dist/app.js

build:
	make javascript
	grunt build
	zip -r scale-practice.nw index.html package.json dist/ css/