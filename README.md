# LiepChat

# ⚠️ This project is archived ⚠️

## Why

Some reasons:

- I no longer enjoy working on this project
- Many parts of my code aren't well written

## Which parts need to be reviewed

- Sign in/up (see the [Supabase doc](https://supabase.com/docs/reference/javascript/auth-signup))
- Remove the usage of `localStorage`, and instead use [getUser](https://supabase.com/docs/reference/javascript/auth-getuser)
- JSON files for languages (need to be reorganized)
- And more

## Description

LiepChat is a website to chat in the LIEP.
You have to create an account to login the website.

Then you can use it for temporary conversations (the messages will be automatically deleted when you logout) or saved conversations

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development (also compile Sass on change)

```sh
npm run dev
```

### Compile Sass on change

```sh
npm run sass
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Format with [Prettier](https://prettier.io)

```sh
npm run format
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
