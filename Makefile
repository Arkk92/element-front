## Local Commands
# Build and run commands for vue development

build-dev:
	npm install -g @vue/cli
	npm update -g @vue/cli
	npm install

run-dev:
	cd element-front && npm run serve
