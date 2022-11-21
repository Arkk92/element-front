## Local Commands
# Build and run commands for vue development
build:
	docker build -t element-front .
	
run:
	docker run --env-file='.env' -p 8080:8080 element-front

build-dev:
	npm install -g @vue/cli
	npm update -g @vue/cli
	npm install

run-dev:
	cd element-front && npm run serve
