## Local Commands
# Build and run commands for vue development
.DEFAULT_GOAL := dev
MAIN_SERVICE_NAME := home-web-app
MAIN_SERVICE_PORT := 4000
NODE_VERSION := 22

.ONESHELL:
.PHONY:
nvm-use:
	. ${HOME}/.nvm/nvm.sh
	nvm install $(NODE_VERSION)
	nvm use $(NODE_VERSION)

build:
	docker build -t element-front .
	
run:
	docker run --env-file='element-front/.env' -p 4000:4000 element-front

.ONESHELL:
deploy:
	$(MAKE) build
	$(MAKE) run

build-dev:
	cd element-front &&	npm install -g @vue/cli &&	npm update -g @vue/cli && npm install

.ONESHELL:
dev:
	$(MAKE) nvm-use
	# uncomment the following line when using linux
	# echo $(fs.inotify.max_user_watches=524288) | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
	cd element-front && npm run dev

deploy-local:
	$(MAKE) nvm-use
	cd element-front && npm run build && npm run preview