install:
	@yarn install
	@cd assets && yarn install

release: front
	@echo "env: ${env}"
	@mkdir -p out/release
	@if [ -d assets/.package ]; then\
		rsync -av . out/release --exclude .git --exclude node_modules --exclude out --exclude test --exclude assets;\
		mv assets/.package out/release/assets;\
	else\
		rsync -av . out/release --exclude .git --exclude node_modules --exclude out --exclude test;\
	fi
	@cd out/release && NODE_ENV=${env} yarn install
	@if [ -f out/release/config/config_${env}.js ]; then\
		cp out/release/config/config_${env}.js out/release/config/config.js;\
	fi

front:
	@echo "building assets..."
	#@yarn add honeypack -D
	@if [ -f config/config_${env}.js ]; then\
		cp config/config_${env}.js config/config.js;\
	fi
	@cd assets && NODE_ENV=development yarn install
	@cd assets && node build.js
	@cd assets && ../node_modules/.bin/honeypack build
	@if [ -d assets/build ]; then\
		cp -r assets/build/. assets/.package/;\
	fi
	@if [ -f config/config.js ]; then\
		rm -rf config/config.js;\
	fi
	@echo "assets build done\n"

test:
	@node_modules/.bin/mocha --require intelli-espower-loader $(shell find test -name *.test.js)

cover:
	@node_modules/.bin/istanbul cover node_modules/.bin/_mocha -- $(shell find test -name *.test.js)

clean:
	@rm -rf node_modules assets/node_modules

.PHONY: install release front test cover cleanm