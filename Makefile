## Local Commands
# Build and run commands for vue development
build:
	docker build -t element-front .
	
run:
	docker run -p 8080:8080 element-front


build-dev:
	cd element-front &&	npm install -g @vue/cli &&	npm update -g @vue/cli && npm install

run-dev:
	cd element-front && npm run serve

deploy-local:
	cd element-front && npm run build