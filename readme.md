# YouBeOn

Frontend for the [YouBeOn - Young Believers Online](https://youbeon.eu) project.

Deployed at <https://app.youbeon.eu>.

## Prerequisites

- [node.js v22](https://nodejs.org/en/download)
- [pnpm v10](https://pnpm.io/installation)

> [!TIP]
>
> You can use `pnpm` to install the required node.js version with `pnpm env use 22 --global`.

Install project dependencies with:

```bash
pnpm install
```

This will also generate (i) the JSON "database" in the `src/db` folder from `.xlsx` files in the
`data` folder, (ii) generate an imprint page, and (iii) generate favicons.

## How to run

Run a development server with:

```bash
pnpm run dev
```

Preview a production build locally with:

```bash
pnpm run build && pnpm run start
```

## Deployment

A GitHub action is triggered on every push to the `main` branch, which builds a new Docker image,
and notifies `rancher` to deploy that image to the ACDH-CH cluster.

## Validation

Validation scripts for code formatting (`prettier`), linting (`eslint` and `stylelint`), and type
checking (`typescript`) run as `pre-commit` and `pre-push` git hooks.
