# How to run the application:

`npm start`

This command will first fire the `npm prestart` command which will spin up the docker test server via docker compose.  An arbitrary sleep delay allows for the docker container to spin up before starting the node application.

Once ready, the user will be able to search for Star Wars characters via a simple command prompt.

# How to stop the application:

Exiting the node application via the command line either via the `control` command or by typing `exit` in the prompt.

This will fire the `npm poststop` which will bring down the docker test server.

# How to test the application:

`npm test`

This command will first fire the `npm pretest` command which will spin up the docker test server via docker compose.

The test suite will run and once finished the `npm posttest` will fire to bring down the docker test server.
