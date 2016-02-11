# idm

This is the identity management service.

## Getting Started

Be sure you've read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.
2. Set your `NODE_ENV` environment variable:

        $ export NODE_ENV=development
        
2. Create your `.env` file for your environment. Example:

        PORT=8081
        APP_BASEURL=http://localhost:8081
        RETHINKDB_URL=rethinkdb://localhost:28015/idm_development

3. Run the setup tasks:

        $ npm install
        $ npm run db:create
        $ npm run db:migrate -- up

4. Run the server:

        $ npm start

5. Visit the server in your browser:

        $ open http://localhost:8081


## License

See the [LICENSE](./LICENSE) file.
