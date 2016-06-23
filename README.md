# idm

This is the identity management service.

## Getting Started

Be sure you've read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.

2. Setup and run [mehserve][mehserve]. Then figure out which port you intend to use and create the mehserve config file:

```bash
echo 9001 > ~/.mehserve/idm.learnersguild
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
GITHUB_CLIENT_ID=<from above>
GITHUB_CLIENT_SECRET=<from above>
IDM_BASE_URL=http://idm.learnersguild.dev
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

## Gotchas

### Random C errors

Install `nvm` and then use `5.6`

### `TypeError: OAuth2Strategy requires a clientID option`

`export NODE_ENV=development`


## Creating an Account

### Invite Code

Go to `localhost:8080` and use the `Data Explorer` to run the following command

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

## License

See the [LICENSE](./LICENSE) file.

[game]: https://github.com/LearnersGuild/game
[github-register-application]: https://github.com/settings/applications/new
[install-rethinkdb]: https://www.rethinkdb.com/docs/install/
[redis]: http://redis.io/
[mehserve]: https://github.com/timecounts/mehserve
