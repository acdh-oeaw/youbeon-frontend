# YouBeOn

Web frontend for the [YouBeOn - Young Believers Online](https://youbeon.eu) project.

Deployed at <https://app.youbeon.eu>.

Made with [`Vue`](https://vuejs.org/), built with [`Vite`](https://vitejs.dev/).

## Prerequisites

Install [`Node.js v16`](https://nodejs.org/), and install project dependencies with:

```bash
npm install
```

This will also generate (i) the JSON "database" in the `src/db` folder from `.xlsx` files in the
`data` folder, (ii) generate an imprint page, and (iii) generate favicons.

## How to run

Run a development server with:

```bash
npm run dev
```

Preview a production build locally with:

```bash
npm run build && npm run preview
```

## Deployment

A GitHub action is triggered on every push to the `main` branch, which builds a new Docker image,
and notifies `rancher` to deploy that image to the ACDH-CH cluster.

## Validation

Validation scripts for code formatting (`prettier`), linting (`eslint` and `stylelint`), and type
checking (`typescript`) run as `pre-commit` and `pre-push` git hooks.
