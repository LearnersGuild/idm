# idm

This is the identity management service.

## Getting Started

Be sure you've read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.
2. Create your `.env` file for your environment. Example:

    ```bash
    PORT=8081
    NODE_ENV=development
    APP_BASEURL=http://localhost:8081
    DATABASE_URL=postgres://localhost/idm_development
    ICONS_SERVICE_TAGS_API_URL=https://lg-icons.herokuapp.com/tags
    ```

3. Run the setup tasks:

    ```bash
    $ npm install
    $ npm run db:create
    $ npm run db:migrate -- up
    ```

4. Run the server:

    ```bash
    $ npm start
    ```

5. Visit the server in your browser:

    ```bash
    $ open http://localhost:8081
    ```


## License

See the [LICENSE](./LICENSE) file.
