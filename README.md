[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

| Current version | Status                   |
| --------------- | ------------------------ |
| Beta            | Works with known bugs 🪲 |

# Element Online

Frontend service for Element Online


Backend project can be found [here](https://github.com/Ojka91/element-core)

If you want to play with your friends visit [here](https://element-online.netlify.app/)

> 💡 _Note:_ 
> Element Online is based on [element/element silver edition](https://ratherdashinggames.com/games/element-silver.html) board game. We have no relationship with the owners of the game nor do we intend to profit from it.

## Setup Instructions

### Prerequisites

- [NodeJS version 22 or later](https://nodejs.org/en/download/) - or use [nvm](https://github.com/nvm-sh/nvm)
- [VueJS version 3](https://vuejs.org/guide/quick-start.html)
- [Vitejs](https://vitejs.dev/)
- [Docker](https://docs.docker.com/install)

> ⚠️ **Important:** 
> The game does not work properly unless the [Backend](https://github.com/Ojka91/element-core) is running.

### Running the project with Docker

Build the container image only when running it for the first time:

```
make build
```

Once the container is built the client server can be started by:

```
make run
```

It deploys a Nginx web server which serves the static files.
Exposed url is [http://localhost:4000](http://localhost:4000) and will provide the static single page of the game.

Alternatively, it can be deployed with a single command with:

```
make deploy
```

### Running locally

In order to get all dependencies for the project to build you can use:

```
make build-dev
```

It will install all the required dependecies to allow working locally.

Once all depencies are installed, you can use the following command to compile and wake up the development server:

```
make dev
```

For production build, a preview of the build can be served with the following command:
```
make deploy-local
```

> ⚠️ **Important:** 
> Keep in mind the game doesn't work unless the [Backend](https://github.com/Ojka91/element-core) is running.
