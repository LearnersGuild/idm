# idm

[ ![Codeship Status for LearnersGuild/idm](https://app.codeship.com/projects/92d0f5c0-180d-0134-1b2a-7a446e54894e/status?branch=master)](https://app.codeship.com/projects/158637)
[![Code Climate GPA](https://codeclimate.com/github/LearnersGuild/idm/badges/gpa.svg)](https://codeclimate.com/github/LearnersGuild/idm/feed)
[![Code Climate Issue Count](https://codeclimate.com/github/LearnersGuild/idm/badges/issue_count.svg)](https://codeclimate.com/github/LearnersGuild/idm/feed)
[![Test Coverage](https://codeclimate.com/github/LearnersGuild/idm/coverage.svg)](https://codeclimate.com/github/LearnersGuild/idm/coverage)

This is the identity management service.

## Getting Started

Be sure you've read the [instructions for contributing to the LOS repository](https://github.com/LearnersGuild/learning-os-software/blob/master/appendix/how-to-modify.md). These apply here, too, except that you will substitute `idm` for `learning-os-software`.

1. **Globally** install [nvm][nvm], [avn][avn], and [avn-nvm][avn-nvm], insofar as they are not already installed.

If `nvm --version` does not return a version, install [nvm][nvm] with:

    ```bash
    curl -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
    ```
If `which avn` does not return a path and version, install [avn][avn] with:

    ```bash
    npm install -g avn avn-nvm
    avn setup
    ```

2. Create an [npm][npm] account if you don't have one, then setup your `NPM_AUTH_TOKEN`:

    ```bash
    npm login
    # in your current shell as well as in ~/.bashrc (or ~/.zshrc, etc)
    export NPM_AUTH_TOKEN=$(cat $HOME/.npmrc | grep _authToken | cut -d '=' -f2)
    ```

3. Clone the repository.

4. Setup and run [mehserve][mehserve]. Then figure out which port you intend to use and create the mehserve config file:

    ```bash
    echo 9001 > ~/.mehserve/idm.learnersguild
    mehserve run
    ```

5. Set your `NODE_ENV` environment variable:

    ```bash
    export NODE_ENV=development
    ```

6. [Install RethinkDB][install-rethinkdb].

    ```bash
    # With Homebrew on a mac:
    brew install rethinkdb
    ```

7. Install [Redis][redis].

    ```bash
    brew install redis
    ```

8. Obtain your GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (see below) by registering a new [GitHub OAuth application][github-register-application] for _your_ development environment:
    - Application name: Learners Guild IDM (dev)
    - Homepage URL: http://idm.learnersguild.dev
    - Authorization callback URL: http://idm.learnersguild.dev/auth/github/callback

9. Generate a key-pair for JWT token signing / verifying:

    ```bash
    openssl genrsa -out /tmp/private-key.pem 2048
    openssl rsa -in /tmp/private-key.pem -outform PEM -pubout -out /tmp/public-key.pem
    ```

10. Create a free AWS account:
[https://aws.amazon.com](https://aws.amazon.com/)

Make a copy of your access key ID and secret access key. You'll need to include these in your  environment variables in the next step.

11. Create your `.env.development` file for your environment. Example:

    ```bash
    PORT=9001
    REDIS_URL=redis://localhost:6379
    RETHINKDB_URL=rethinkdb://localhost:28015/idm_development
    GITHUB_CLIENT_ID=<from above>
    GITHUB_CLIENT_SECRET=<from above>
    # Both of the URLs below are needed and remove this commented line
    APP_BASE_URL=http://idm.learnersguild.dev
    IDM_BASE_URL=http://idm.learnersguild.dev
    # For JWT string data below, replace all linebreaks with \n
    # and include -----BEGIN RSA PRIVATE KEY----- and -----END RSA PRIVATE KEY-----
    # remove these three commented lines
    JWT_PRIVATE_KEY="<quoted string data from /tmp/private-key.pem >"
    JWT_PUBLIC_KEY="<quoted string data from /tmp/public-key.pem replace all linebreaks with \n >"
    S3_BUCKET=guild-development
    S3_KEY_PREFIX=db
    AWS_ACCESS_KEY_ID=<YOUR_AWS_ACCESS_KEY_ID>
    AWS_SECRET_ACCESS_KEY=<YOUR_AWS_SECRET_ACCESS_KEY>
    ```

12. Run the setup tasks:

    ```bash
    npm install
    npm run db:create
    npm run db:migrate -- up
    ```

13. Seed your development database with test member and project data:
    ```bash
    npm run db:copy
    npm run db:migrate -- up // to ensure migrations are applied to copied data
    ```

14. Run the server:

    ```bash
    npm start
    ```

15. Visit the server in your browser:

    ```bash
    open http://idm.learnersguild.dev
    ```

16. (OPTIONAL) Add some test users:

    ```bash
    npm run data:users -- --verbose --role=learner some-dummy-invite-code
    ```

## Gotchas

### AVN is not working

Perhaps your nvm is not linked, try typing into your terminal  
`cp $(brew --prefix nvm)/nvm.sh ~/.nvm/`

If you are using bash instead of zsh, you might have a logged-in shell and you'll need to add the following code to your `~/.bash_profile` instead of your `~/.bashrc` or `~/.zshrc` because those don't always load. (To test for sure, add an `echo testing` command at the top of your RC files, if you see nothing when opening new tabs, you're using bash_profile logged-in shell)
```sh
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[[ -s "$HOME/.avn/bin/avn.sh" ]] && source "$HOME/.avn/bin/avn.sh" # load avn
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
[ `uname -s` != "Darwin" ] && return
```

### RethinkDB / Python

If you are receiving an error similar to the following when running `npm run db:copy` you might be missing python drivers.  

Error
```
stderr: Error when launching 'rethinkdb-restore': No such file or directory
The rethinkdb-restore command depends on the RethinkDB Python driver, which must be installed.
If the Python driver is already installed, make sure that the PATH environment variable
includes the location of the backup scripts, and that the current user has permission to
access and run the scripts.
Instructions for installing the RethinkDB Python driver are available here:
http://www.rethinkdb.com/docs/install-drivers/python/
```

Try installing python drivers with this command:  
`brew install python && sudo pip2 install rethinkdb`

### Unable to sign in via GitHub

If you've used the db:copy script to seed the database and still aren't logged in, there isn't an idm user in the test data linked to your github account. You'll need to manually insert an invite code to the database and use it to sign up in your local idm service.

Go to `localhost:8080` and use the `Data Explorer` to run the following command to issue yourself an invitation code.

```ReQl
r.db('idm_development').table('inviteCodes').insert({
  id: '0edb08e1-d8ab-4318-8363-0711a7f9edbb',
  code: 'hand_crafted_artisanal_invite_code',
  description: 'hand crafted artisanal invite code',
  roles: ['admin', 'learner'],
  active: true,
  createdAt: r.now(),
  updatedAt: r.now(),
})
```

Use the invitation code `hand_crafted_artisanal_invite_code` to create an account.

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

[echo]: https://github.com/LearnersGuild/echo
[github-register-application]: https://github.com/settings/applications/new
[install-rethinkdb]: https://www.rethinkdb.com/docs/install/
[redis]: http://redis.io/
[mehserve]: https://github.com/timecounts/mehserve
[npm]: https://www.npmjs.com/
[nvm]: https://github.com/creationix/nvm
[avn]: https://github.com/wbyoung/avn
[avn-nvm]: https://github.com/wbyoung/avn-nvm
