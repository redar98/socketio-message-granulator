## Socket.io - Message Granulator

Purpose: An application with client-server code for sending a message (paragraph) from a client to the server. All messages from different clients are combined inside the server and each character from this bunch is broadcasted to all clients one by one.

Client obtains a websocket connection with the server using socket.io library. Server emit rate is 30 messages per second. This value is usually used for *.io* games on the web.

**Aside from that** -- an exaggerated web application that uses webpack to minify (uglify) and combine all dependent source files into a single file for decreasing network bandwidth and increasing delivery speed. *(Something I was desperate to try out)*

## Development

Server will provide clients with the home page and all necessary resources. Thus, correct server IP address should be declared in [client.js](src/client/client.js) *serverUrl* variable. It can be replaced to point to another url.

Ensure your machine knows what Node and NPM is. Then run this on your local machine:

```bash
$ npm install
$ npm run develop
```

This installs all necessary dependencies in relative *node_modules* folder and starts the application that listens for connections. Proceed to [localhost:3000](localhost:3000) to open your client. All your changes on client files will automatically be updated once you refresh the page. (This is done thanks to *webpack-dev-middleware* library)

Ensure tests are **passing** after introducing breaking changes as this will **prevent** building application in a production environment later on. To run tests, execute: ```npm run test```

## Production

The application can be built for a production environment only if all the tests are green. This step is automatically executed together with the build script. To run this application on a production setting, use:

```bash
$ npm install
$ npm run build
$ npm start
```

This will create minified version of files in a ./dist folder and start the server on port 3000.

### Bundle Analyzer

This project already uses webpack which adds bundle analyzer support. If there is a suspicion that bundle is too big because of a recently added dependency, feature or refactoring, start by generating a *stats.json* file using command ```npm run report```. Ensure total bundle size (unminified) does not exceed **250kb**.
