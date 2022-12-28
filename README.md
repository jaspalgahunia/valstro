How to run the application:

`npm start`

This command will first fire the `npm prestart` command which will spin up the docker test server via docker compose.  An arbitrary sleep delay allows for the docker container to spin up before starting the node application.

Once ready, the user will be able to search for Star Wars characters via a simple command prompt.

How to stop the application:

Exiting the node application via the command line either via the `control` command or by typing `exit` in the prompt.

Once the Node application is exited, type `npm stop` to stop the docker container.

How to test the application: