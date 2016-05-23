# idm

This is the identity management service.

## Getting Started

Be sure you've read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.

2. Setup and run [mehserve][mehserve]. Then figure out which port you intend to use and create the mehserve config file:

        $ echo 9001 > ~/.mehserve/idm.learnersguild

3. Set your `NODE_ENV` environment variable:

        $ export NODE_ENV=development

4. [Install RethinkDB][install-rethinkdb].

        # With Homebrew on a mac:

        $ brew install rethinkdb

5. Install [Redis][redis].

        $ brew install redis

6. Obtain your GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (see below) by register a new [GitHub OAuth application][github-register-application] for _your_ development environment:
    - Application name: Learners Guild IDM (dev)
    - Homepage URL: http://idm.learnersguild.dev
    - Authorization callback URL: http://idm.learnersguild.dev/auth/github/callback

7. Generate a key-pair for JWT token signing / verifying:

        $ openssl genrsa -out /tmp/private-key.pem 2048
        $ openssl rsa -in /tmp/private-key.pem -outform PEM -pubout -out /tmp/public-key.pem

8. Create your `.env` file for your environment. Example:

        PORT=9001
        APP_BASEURL=http://idm.learnersguild.dev
        IDM_BASE_URL=http://idm.learnersguild.dev
        GITHUB_CLIENT_ID=<from above>
        GITHUB_CLIENT_SECRET=<from above>
        RETHINKDB_URL=rethinkdb://localhost:28015/idm_development
        REDIS_URL=redis://localhost:6379
        JWT_PRIVATE_KEY="<quoted string data from /tmp/private-key.pem with \n for newlines>"
        JWT_PUBLIC_KEY="<quoted string data from /tmp/public-key.pem with \n for newlines>"

9. Setup npm auth

10. Create an [npmjs.org](https://www.npmjs.com/) account if you don't have one.

11. Login from the command line

        $ npm login


12. Get your npm auth token from your `~/.npmrc`

        $ cat ~/.npmrc
        //registry.npmjs.org/:_authToken=<YOUR NPM AUTH TOKEN>

13.  Set `NPM_AUTH_TOKEN` in your shell.

        # in ~/.bashrc (or ~/.zshrc, etc)
        export NPM_AUTH_TOKEN=<YOUR NPM AUTH TOKEN>

14. Run the setup tasks:

        $ npm install
        $ npm run db:create
        $ npm run db:migrate -- up

15. (OPTIONAL) Generate some test data. Most likely needed for co-developing the [game][game] service:

        $ npm run dev:testdata

16. Run the server:

        $ npm start

17. Visit the server in your browser:

        $ open http://idm.learnersguild.dev

## License

See the [LICENSE](./LICENSE) file.

[game]: https://github.com/LearnersGuild/game
[github-register-application]: https://github.com/settings/applications/new
[install-rethinkdb]: https://www.rethinkdb.com/docs/install/
[redis]: http://redis.io/
[mehserve]: https://github.com/timecounts/mehserve
