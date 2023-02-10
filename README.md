[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

| Current version | Status       |
| ------- | ------------------ |
| Beta  | Works with known bugs 🪲 |


# Element - frontend
This is not an official game and we have no relation with the owners of the board game [element/element silver edition](https://ratherdashinggames.com/games/element-silver.html)

Frontend service for non official element board game online 

Backend project can be found [here](https://github.com/Ojka91/element-core)

If you want to play with your friends visit [here](https://element-online.netlify.app/)

## Setup Instructions

### Prerequisites

* [NodeJS version 16 or later](https://nodejs.org/en/download/) - or use [nvm](https://github.com/nvm-sh/nvm)
* [VueJS version 3](https://vuejs.org/guide/quick-start.html)
* [Docker](https://docs.docker.com/install)

IMPORTANT: The game does not work properly unless the [Backend](https://github.com/Ojka91/element-core) is running.

### Running the project with Docker

Build the container image only when running it for the first time:

```
make build
```

Once the container is built the client server can be started by:
```
make run
```
Accessing [http://localhost:8080](http://localhost:8080) will provide the static single page of the game.

### Running locally

In order to get all dependencies for the project to build you can use:
```
make build-dev
```
It will install all the required dependecies to allow working locally.


Once built, you can use the following command to compile and wake up the client server:
```
make run-dev
```

Keep in mind the game doesn't work unless the [Backend](https://github.com/Ojka91/element-core) is running.
