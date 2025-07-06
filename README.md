# TDHCA

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5.

---

## Project Structure & Navigation

```
src/app/
  ├── app.routes.ts                # Main Angular routes
  ├── layout/                      # Header, Sidenav, Footer, MainContent
  ├── home/                        # Home page component
  ├── help/                        # Help page component
  ├── create-account-modal/        # Modal dialog for Create Account
  ├── create-application/          # Application workflow (multi-step)
  │     ├── personal-info/         # Personal Information step
  │     ├── household-members/     # Household Members step
  │     ├── ...                    # Other steps (income, documents, etc.)
  ├── create-account/              # (Legacy) Create Account component
  ├── popup-messages/              # Global popup messages
  ├── household-form/              # Household form component
  └── _variables.scss              # Global SCSS variables
```

## Routing Overview

- `/home` – Home page
- `/help` – Help/FAQ page
- `/createapplication/personal-info` – Start of the application (Personal Info form)
- `/createapplication/household-members` – Next step in the application
- (Other `/createapplication/...` routes for additional steps)

The default route (`/`) redirects to `/home`.

## Navigation & Button Behavior

- **Header and Sidenav:**

  - Both contain navigation links for Home, Help, Create Application, etc.
  - The **Create Account** button opens a modal dialog (not a route).
  - All navigation actions are logged to the console for debugging.

- **Form Buttons:**

  - **Save and Continue:** Submits the current form step.
  - **Cancel:** Resets the form and shows a Material Snackbar ("Changes canceled").
  - **Next:** Navigates to the next step (e.g., Household Members).

- **Create Account Modal:**
  - Triggered from both header and sidenav.
  - Appears as a dialog overlay, not a route change.

## Mobile Responsiveness

- The layout is fully responsive:
  - On mobile, the sidenav collapses to a drawer.
  - Buttons and form fields stack vertically for smaller screens.
  - All navigation and modal features work on mobile.

## How the App Works

- Users start at Home and can begin an application via the navigation.
- The application process is multi-step, with each step as a separate route under `/createapplication/`.
- Navigation is available at all times via the header and sidenav.
- The Create Account modal can be opened from anywhere.
- All forms have validation, tooltips, and placeholders for a professional user experience.

---

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
