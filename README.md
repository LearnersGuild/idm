# idm

[![Code Climate GPA](https://codeclimate.com/repos/579a58e53f93500064001746/badges/e60dd0bcd126c656cd24/gpa.svg)](https://codeclimate.com/repos/579a58e53f93500064001746/feed)
[![Code Climate Issue Count](https://codeclimate.com/repos/579a58e53f93500064001746/badges/e60dd0bcd126c656cd24/issue_count.svg)](https://codeclimate.com/repos/579a58e53f93500064001746/feed)
[![Test Coverage](https://codeclimate.com/repos/579a58e53f93500064001746/badges/e60dd0bcd126c656cd24/coverage.svg)](https://codeclimate.com/repos/579a58e53f93500064001746/coverage)

This is the identity management service.

## Getting Started

Be sure you've read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.

2. Setup and run [mehserve][mehserve]. Then figure out which port you intend to use and create the mehserve config file:

    ```bash
    echo 9001 > ~/.mehserve/idm.learnersguild
    mehserve run
    ```

3. Set your `NODE_ENV` environment variable:

    ```bash
    export NODE_ENV=development
    ```

4. [Install RethinkDB][install-rethinkdb].

    ```bash
    # With Homebrew on a mac:
    brew install rethinkdb
    ```

5. Install [Redis][redis].

    ```bash
    brew install redis
    ```

6. Obtain your GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (see below) by registering a new [GitHub OAuth application][github-register-application] for _your_ development environment:
    - Application name: Learners Guild IDM (dev)
    - Homepage URL: http://idm.learnersguild.dev
    - Authorization callback URL: http://idm.learnersguild.dev/auth/github/callback

7. Generate a key-pair for JWT token signing / verifying:

    ```bash
    openssl genrsa -out /tmp/private-key.pem 2048
    openssl rsa -in /tmp/private-key.pem -outform PEM -pubout -out /tmp/public-key.pem
    ```

8. Create your `.env.development` file for your environment. Example:

    ```bash
    PORT=9001
    REDIS_URL=redis://localhost:6379
    RETHINKDB_URL=rethinkdb://localhost:28015/idm_development
    GITHUB_CLIENT_ID=<from above>
    GITHUB_CLIENT_SECRET=<from above>
    APP_BASE_URL=http://idm.learnersguild.dev  # both of these
    IDM_BASE_URL=http://idm.learnersguild.dev  # are needed
    JWT_PRIVATE_KEY="<quoted string data from /tmp/private-key.pem with \n for newlines>"
    JWT_PUBLIC_KEY="<quoted string data from /tmp/public-key.pem with \n for newlines>"
    ```

9. Setup npm auth

10. Create an [npmjs.org](https://www.npmjs.com/) account if you don't have one.

11. Login from the command line

    ```bash
    npm login
    ```

12. Get your npm auth token from your `~/.npmrc`

    ```bash
    cat ~/.npmrc
    # //registry.npmjs.org/:_authToken=<YOUR NPM AUTH TOKEN>
    ```

13.  Set `NPM_AUTH_TOKEN` in your shell.

    ```bash
    # in ~/.bashrc (or ~/.zshrc, etc)
    export NPM_AUTH_TOKEN=<YOUR NPM AUTH TOKEN>
    # OR
    export NPM_AUTH_TOKEN=$(cat $HOME/.npmrc | grep _authToken | cut -d '=' -f2)
    ```

14. Run the setup tasks:

    ```bash
    npm install
    npm run db:create
    npm run db:migrate -- up
    ```

15. Run the server:

    ```bash
    npm start
    ```

16. Visit the server in your browser:

    ```bash
    open http://idm.learnersguild.dev
    ```

17. Create an Account

    Go to `localhost:8080` and use the `Data Explorer` to run the following command to issue yourself an invitation code.

    ```ReQl
    r.db('idm_development').table('inviteCodes').insert({
      id: "58abd2aa-3826-4604-bf7c-f8f2cf7eaad9",
      code: "hand_crafted_artisanal_invite_code",
      description: "hand crafted artisanal invite code",
      roles: ["player", "backoffice", "moderator"],
      createdAt: r.now(),
      updatedAt: r.now(),
    })
    ```

18. Sign In

    Use the invitation code `hand_crafted_artisanal_invite_code` to create an account.

19. (OPTIONAL) Add some test users:

    ```bash
    npm run data:users -- --verbose --role=player some-dummy-invite-code
    ```

## Gotchas

### Node version

In the event that you see Javascript and C compilation errors when running `npm start`,
ensure that your installed node version matches the node version in package.json:

```
➜ cat package.json | grep node\"
    "node": "5.6.x",
➜ node -v
v5.6.0
```

To run multiple versions of node on your machine, install `nvm` and then use `5.6`

### TypeErrors

If you see errors that look like this:

```
TypeError:
          method: GET /
          params: {}
          TypeError: An internal server error occurred
    at Strategy.OAuth2Strategy (/Users/jrob/workspace/learners-guild/idm/node_modules/passport-oauth2/lib/strategy.js:82:34)
    at new Strategy (/Users/jrob/workspace/learners-guild/idm/node_modules/passport-github/lib/strategy.js:62:18)
```
or
```
TypeError: OAuth2Strategy requires a clientID option
```

Ensure that your `NODE_ENV` is set:

`export NODE_ENV=development`

### NPM_AUTH_TOKEN Error Message

When attempting to `npm login`, was seeing `Error: Failed to replace env in config: ${NPM_AUTH_TOKEN}`.

`export NPM_AUTH_TOKEN=""`

## License

See the [LICENSE](./LICENSE) file.

[game]: https://github.com/LearnersGuild/game
[github-register-application]: https://github.com/settings/applications/new
[install-rethinkdb]: https://www.rethinkdb.com/docs/install/
[redis]: http://redis.io/
[mehserve]: https://github.com/timecounts/mehserve
