# idm

This is the identity management service.

## Getting Started

Be sure you've read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.

2. Setup [pow][pow]. Then figure out which port you intend to use and create the pow config file:

        $ echo 9001 > ~/.pow/idm.learnersguild

3. Set your `NODE_ENV` environment variable:

        $ export NODE_ENV=development

4. [Install RethinkDB][install-rethinkdb].

5. Obtain your GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (see below) by register a new [GitHub OAuth application][github-register-application] for _your_ development environment:
    - Application name: Learners Guild IDM (dev)
    - Homepage URL: http://idm.learnersguild.dev
    - Authorization callback URL: http://idm.learnersguild.dev/auth/github/callback

6. Generate a key-pair for JWT token signing / verifying:

        $ openssl genrsa -out /tmp/private-key.pem 2048
        $ openssl rsa -in /tmp/private-key.pem -outform PEM -pubout -out /tmp/public-key.pem

7. Create your `.env` file for your environment. Example:

        PORT=9001
        APP_BASEURL=http://idm.learnersguild.dev   # must match Homepage URL and Authorization callback URL on GitHub
        GITHUB_CLIENT_ID=<from above>
        GITHUB_CLIENT_SECRET=<from above>
        RETHINKDB_URL=rethinkdb://localhost:28015/idm_development
        JWT_PRIVATE_KEY="<quoted string data from /tmp/private-key.pem with \n for newlines>"
        JWT_PUBLIC_KEY="<quoted string date from /tmp/public-key.pem with \n for newlines>"

8. Run the setup tasks:

        $ npm install
        $ npm run db:create
        $ npm run db:migrate -- up

9. Run the server:

        $ npm start

10. Visit the server in your browser:

        $ open http://idm.learnersguild.dev


## License

See the [LICENSE](./LICENSE) file.


[github-register-application]: https://github.com/settings/applications/new
[install-rethinkdb]: https://www.rethinkdb.com/docs/install/
[pow]: http://pow.cx
