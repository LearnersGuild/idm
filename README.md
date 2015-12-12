# idm

This is the identity management service.

## Getting Started

Be sure you've read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.
2. Create your `.env` file for your environment. Example:
    PORT=8081
    NODE_ENV=development
    APP_BASEURL=http://localhost:8081
    DATABASE_URL=postgres://localhost/idm_development
    ICONS_SERVICE_TAGS_API_URL=https://lg-icons.herokuapp.com/tags
3. Run the setup tasks:
    $ npm install
    $ npm run db:create
    $ npm run db:migrate
4. Run the server:
    $ npm start
5. Visit the server in your browser:
    $ open http://localhost:8081


## License

See the [LICENSE](./LICENSE) file.
