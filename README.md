# Structure-Ts

A high-level web framework for TypeScript, inspired by Django, designed for rapid development and clean code.

---

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Your First App](#app-configuration)
    - [Controllers](#controllers)
    - [Routing](#routing)
- [Testing](#testing)
<!-- - [Contributing](#contributing) -->
- [License](#license)

---

## Overview

**structure‑ts** is a high-level web framework built with TypeScript. Its design is inspired by Django to promote rapid development, clear code organization, and ease of maintenance. It provides a built-in routing system, configurable server options, and a modular way to define applications (or “apps”) that can be integrat.

---

# Installation

```bash
pnpm i -g structure-ts

# or if you using npm
npm install -g structure-ts
```

---

# Getting Started

```bash
st create project <project-name>

# or alternative way
structure-ts create project <project-name>
```

it should give you structure like this

```bash
<project name>/
├── package.json    # package json for npm
├── src             # actual app source code
│   ├── app.ts      # actual config module of the app
│   ├── main.ts     # the main entry point of the app
│   └── settings.ts # all the config file
└── tsconfig.json   # tsconfig file for typesctipt
```

---

## Configuration

### Settings

You can find all the configuration options in `src/settings.ts`

```typescript
import type { DatabaseType, SettingsType } from 'structure-ts';

const PORT = 2000; // <chenge as your preffer port>

const APPS = []; // add all your apps here

const DATABASE: DatabaseType = false; // database config "false" if you are not using db at all

const TEMPLATE_DIR = 'templates'; // template dir where all your .ejs files are stored

export default {
  PORT,
  APPS,
  DATABASE,
  TEMPLATE_DIR,
} satisfies SettingsType;

```

---

## App Configuration

The framework automatically gathers routes by your installed apps in `src/settings.ts`, so you don't have configure any thing from scratch.

Here how you can create your first app 

1.  Go to your project dir. where src folder exists.

2. Run the following command to create your first app:

```sh
st create app <app-name>

# or alternative way
structure-ts create app <app-name>
```

3. Add your app name to settings.ts file :

```typescript
const APPS = ["<your-app>"]; // add all your apps here
```

4. you are good to go for creating your controller.

---


### Controllers
Add all your controller in the `<app-name>/controllers.ts` file. 


```typescript
import { type ControllerType, ok } from 'structure-ts';

const myFirstController: ControllerType = (question, reply) => {
  reply.status(ok()).json({
    success: true,
    data: {
      message: 'working',
    },
  });
};

export { myFirstController };

```

### Routing

Configure all your routing configurations in the `<app-name>/routes.ts` file.


```typescript
import { Router } from 'structure-ts';

import { myFirstController } from './controllers';

const { routes, route } = Router();

route.get('/', myFirstController);

export default routes;
```
--- 

## Testing

Test is going to added to project letter till then use node builtin test runner.

```ts
import assert from 'node:assert';
import { describe, it } from 'node:test';
```


## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.