## Task Board Server
A NodeJS and Express Api to create, retrieve, update and delete tasks and projects. It performers user authentication trought JSON Web Tokens and functionalities to register users and reset passwords.
 
## Tech used
- [Docker](https://docker.com/)
- [Mailtrap](https://mailtrap.io/)
- [Postman](https://www.postman.com/)

## Frameworks used
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Node Mailer](https://nodemailer.com/about/)
- [Swagger](https://swagger.io/)

## Features

1. CRUD operations for Tasks and Projects entities

2. User authentication with JSON Web Tokens. Functionalities:
    - User register
    - User authentication
    - Forgot Password
    - Reset Password

This project provides a complete feature to reset passwords throught `/auth/forgot_password` endponits wich sends an email to the current user containing a token, that will be used later on `/auth/reset_password` endpoint to validate the user action to reset the password. More details can be found at [swagger project documentation]() 

## Up and running
To get a development env running, follow these next steps, and next continue to How to use section to have a complete developement environment running:

1. Clone the repo: `git clone git@github.com:dhfuzari/task-board-server.git`
2. Navigate to root folder: `cd task-board-server`
3. Then, run `npm i` to install all required packages and wait a few minutes to complete the process
4. Then, before to start, you must to create a [mailtrap](https://mailtrap.io) account and replace the current environment `xpto` variables values from `user` and `pass` properties at `src/config/mailtrapServer.json` file, with the new values created at [mailtrap](https://mailtrap.io). `xpto` isn't a valid mailtrap user and isn't even a valid mailtrap password. Now, you're almost ready to go.
5. This project uses MongoDB as a database in a docker container, so if you're runing this project locally in a Microsoft Windows or Mac OS system, you need to start Docker Desktop before performing the next step.
6. Now, to start a server listing the door number 3000, run `npm run dev`
7. That's it, the server is ready and now you can send requests trought [Postman](https://www.postman.com/) to access the 
endpoints described below in the next section "How to use?"

## How to use?

To test the API locally I like to use [Postman](https://www.postman.com/). It offers a sleek user interface with which to make HTML requests, without the hassle of writing a bunch of code just to test an API's functionality.

8. First of all, access our [Postman Task Board Server public documentation](https://documenter.getpostman.com/view/2364800/TVYDdKDv)
9. Now, you can see all availables endpoints
10. Click at `Run in Postman` button, at the top right of the page, and open this collection in your [Postman](https://www.postman.com/).
11. Now, you can send requests to registers users, authenticate, retrieve and reset passwords, and perform CRUD operations in the Tasks and Projects entities
12. If you want to track the data created directly in the database, access the [Mongo Express](http://localhost:8081) and open the `task_board` database for more details
13. Let's go for it.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/).
