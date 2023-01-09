# Angular Recipe Book App

Extended version of the exercise project `recipe-book-app` from `Angular - The Complete Guide` course made by Maximilian Schwarzmüller.

### Live version:

-

### Description:

Serverless single-page application that authenticates and creates recipes.

### Features:

-   You can create, edit, delete, update recipes, save changes & fetch data from server.
-   You can create, edit, delete, update shopping list items - they are currently not saved to server and kept in browser only.
-   You can also send recipe ingredients to the shopping list directly to extend the shopping list.
-   It supports Authentication: Signup, Sign-in, Sign-out, Auto Sign-in and Sign-out with token expiry management.

### Technologies used:

-   Angular 8.3.29 + NgRx 8.6.0
-   Bootstrap 3.4.1
-   Google Firebase realtime database as backend
-   Webpack
-   Netlify for deployment

### Extended additions list:

-   Better environment secret management via custom Webpack config with the help of `"dotenv"`, `"@angular-builders/custom-webpack"` and `"@angular-builders/dev-server"` npm packages.
-   `"_redirects"` config for Netlify deployment.
-   More extensions in progress.

### How to run with a custom Firebase realtime database

-   Take a look at the `".env.example"` file. Place your `"API_URL"` and `"API_KEY"` accordingly in an `".env"` file, make sure it is git-ignored properly.
-   If you need to add more environment variables, follow the convention in the `"custom-webpack.config.js"`:

```javascript
// custom-webpack.config.js

module.exports = {
    plugins: [
        new EnvironmentPlugin([
            // Insert the keys to your environment variables here.
            // Eg: API_URL="http://localhost:3000/api/v1"
            'API_URL',
            'API_KEY',
        ]),
    ],
}
```

### How to access env variables:

```javascript
// In any environment file under environment folder,
// just point via process.env.YOUR_ENV_VAR_NAME:

export const environment = {
   production: ...
   API_URL: process.env.API_URL,
   API_KEY: process.env.API_KEY
};
```

# How-to from Angular CLI:

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.29.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
