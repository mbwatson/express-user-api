# Starter Express App

## What does this accomplish?

Not much--just provides a fresh starting place for a Node application served from a Node container.

As is, this will serve on port 3030 with Nodemon listening for file changes.

# How to Begin

## Running Containerlessly

You can ditch the Docker-related stuff and run this thing containerlessly by executing

```bash
$ npm install
```

and

```bash
$ npm start
```

## Running with Docker Compose

Why bother with Docker Compose if you're only spinning up the one service? It's a nice foundation for extending to add, say, a database and a frontend service.

### Build the image.

```bash
$ docker-compose build
```

### Run the container.

```bash
$ docker-compose up
```

Also, using Docker Compose makes it easy to orchestrate mounting volumes and other configurations that begin to get lost in command line arguments after it becomes much longer than this:

```bash
$ docker run -v /app -p 3030:3030 -d starter-express-app`.
```

## Additional Resources

- Docker: [https://docs.docker.com](https://docs.docker.com)
- Docker Compose: [https://docs.docker.com/compose/](https://docs.docker.com/compose/)
- Express: [Express](https://expressjs.com/)
- Node.js: [Node.js](https://nodejs.org/)
