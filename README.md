# idm

This is the identity management service.

## Getting Started

Be sure you've read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.
2. Set your `NODE_ENV` environment variable:

        $ export NODE_ENV=development

3. [Install RethinkDB][install-rethinkdb].

4. Obtain your GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (see below) by register a new [GitHub OAuth application][github-register-application] for _your_ development environment:
    - Application name: Learners Guild IDM (dev)
    - Homepage URL: http://localhost:8081
    - Authorization callback URL: http://localhost:8081/auth/github/callback

5. Generate a key-pair for JWT token signing / verifying:

        $ openssl genrsa -out /tmp/private-key.pem 2048
        $ openssl rsa -in heroku-jwt-private-key.pem -outform PEM -pubout -out /tmp/public-key.pem

6. Create your `.env` file for your environment. Example:

        PORT=8081   # must match port number in Homepage URL and Authorization callback URL on GitHub
        APP_BASEURL=http://localhost:8081   # must match Homepage URL and Authorization callback URL on GitHub
        GITHUB_CLIENT_ID=<from above>
        GITHUB_CLIENT_SECRET=<from above>
        RETHINKDB_URL=rethinkdb://localhost:28015/idm_development
        JWT_PRIVATE_KEY="<quoted string data from /tmp/private-key.pem with \n for newlines>"
        JWT_PUBLIC_KEY="<quoted string date from /tmp/public-key.pem with \n for newlines>"

7. Run the setup tasks:

        $ npm install
        $ npm run db:create
        $ npm run db:migrate -- up

8. Run the server:

        $ npm start

9. Visit the server in your browser:

        $ open http://localhost:8081


## License

See the [LICENSE](./LICENSE) file.


[github-register-application]: https://github.com/settings/applications/new
[install-rethinkdb]: https://www.rethinkdb.com/docs/install/
