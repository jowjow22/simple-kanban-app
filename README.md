# Kanban Task Management

This project is a simple task managemant system using the kanban method, it focus on explore the different approaches to interact with drag and drop, state management and persistence.

# Setup instructions

Once you download the repository, install the dependencies, the package manager used is pnpm, this was chosen for its speed and efficiency.

```bash
npm install
```

After that you can run the development server using the following command:

```bash
pnpm dev
```

Or if you want to run the production build, you can use the following command:

```bash
pnpm build
```

and then run it with

```bash
pnpm preview
```

## Architecture

The project is structured into several key directories:

- `src`: Contains the main application code.
- `public`: Contains static assets such as images and icons.
- Each component has its own test file alongside it, the test files can be run using the `pnpm test` command.
- The state management library chosen for this project is `zustand` as it provides a simple and efficient way to manage state in React applications and middlewares that turn persistent state into a more manageable form.
- The project uses `tailwindcss` for styling, allowing for rapid UI development with a utility-first approach. To allow using variants, `class-variance-authority` is used.
- The testing framework used is `vitest`, which provides a powerful and flexible way to test your application, and has a better integration with Vite compared to other testing libraries.
- The project uses `eslint` for linting, ensuring code quality and consistency across the codebase.
- For the drag and drop functionality, the project utilizes the `@dnd-kit` library, which offers a set of hooks and components to create a customizable drag and drop experience. Previously this project was using `react-dnd` but as it no longer has support, i decided to migrate to `@dnd-kit`.
- The project uses `@testing-library/react` for testing React components, providing a simple and effective way to test component behavior and interactions.
- For type checking and linting, the project uses `TypeScript` and `ESLint` to ensure code quality and consistency.

Future improvements could include:

- Using pako for better compression of the data stored on the client-side.
- Implementing e2e testing with a tool like Cypress.
- Adding more comprehensive documentation and examples for using the components.
- Improving accessibility features to ensure a better experience for all users.


# Time of work table

| Date    | Start | end |
| -------- | ------- | ------ |
| 14/08/2025 | 10:30 PM | 11:53 PM |
| 15/08/2025 | 9:27 AM | 10:00 AM |
| 15/08/2025 | 2:50 PM | 3:30 PM |
| 15/08/2025 | 3:40 PM | 4:00 PM |
| 15/08/2025 | 6:50 PM | 10:00 PM |
| 17/08/2025 | 8:30 PM | 10:00 PM |
OBS: Went on a trip to the new country im living right now (Portugal)
| 21/08/2025 | 13:35 PM | 14:45 PM |
| 22/08/2025 | 10:00 AM | 12:00 PM |
| 22/08/2025 | 19:00 PM | 21:00 PM |

# Shortcuts taken

- Used a library for drag and drop instead of implementing it from scratch.
- Use Zustand middleware for persisting state.
- Used copilot to help with code suggestions and fixes.

# Problems during development

- Faced challenges with the drag and drop implementation, particularly with handling nested elements.
- Had a big delay in the development because of my trip to Portugal.
- Had problems with react-dnd which made me migrate all of the previous implementation to @dnd-kit.
- Testing the drag and drop functionality proved to be more complex than anticipated, requiring additional time and effort.
