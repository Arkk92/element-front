FROM node:latest
WORKDIR "/app"
COPY ./package.json ./
RUN npm install -g @vue/cli
RUN	npm update -g @vue/cli
RUN npm install
COPY ./element-front .
CMD ["npm", "run", "serve"]