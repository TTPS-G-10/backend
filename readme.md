# Application server part

Where Nodejs is used together with Express framework, to create the server. And MySQL for data persistence.

## The structure for this part of the project is

### index.js

- We import the server and we indicate the port where our application is listening

### server.js

- We write the configuration of our API.
- We declare the routes that we are going to use (we just call them, the routes are in another folder).
- We set the port.

### /controllers

- moduleName.controllers.js
- Here we have the logic of our application. For example a middleware or any type of manipulation on the data.

### /database

- database.js
- We make the connection with the database.
- moduleName.query.js
- Queries to the DB by application module. (i'm not sure, if this goes here or in controllers)

### /routes

- moduleName.routes.js
- we have a path for our application module.

## RUN
- npm install
- npm run dev

## test
- npm run test

don't forget to start DB service!
