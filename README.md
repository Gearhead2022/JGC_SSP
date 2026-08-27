# Full-Stack TypeScript Monorepo

A reusable, production-oriented full-stack TypeScript monorepo architecture for building modern web applications with **Next.js, React, Express, Prisma, PostgreSQL, TanStack Query, Zod, Socket.IO, pnpm Workspaces, and Turborepo**.

This repository is designed as a common application foundation rather than being tied to a specific business domain.

It establishes consistent conventions for frontend architecture, backend architecture, authentication, authorization, shared contracts, validation, database access, real-time communication, logging, testing, and deployment.

---

## Table of Contents

- [Overview](#overview)
- [Goals](#goals)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Command Reference](#development-command-reference)
- [Boneyard Skeleton Generation](#boneyard-skeleton-generation)
- [Modal Management](#modal-management)
- [Monorepo Architecture](#monorepo-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Shared Package](#shared-package)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Validation](#validation)
- [API Architecture](#api-architecture)
- [Database Architecture](#database-architecture)
- [Real-Time Communication](#real-time-communication)
- [Error Handling](#error-handling)
- [Logging and Observability](#logging-and-observability)
- [Testing Strategy](#testing-strategy)
- [Naming Conventions](#naming-conventions)
- [Development Guidelines](#development-guidelines)
- [Build](#build)
- [Production](#production)
- [Security Principles](#security-principles)
- [Architectural Principles](#architectural-principles)
- [Adding a New Feature](#adding-a-new-feature)
- [Future Improvements](#future-improvements)
- [Using This Architecture for a New Project](#using-this-architecture-for-a-new-project)
- [License](#license)

---

# Overview

This repository provides a standardized foundation for building full-stack applications using a TypeScript monorepo.

The workspace contains separate frontend and backend applications together with reusable packages shared between them.

```text
workspace/
│
├── apps/
│   ├── web/                  # Next.js frontend application
│   └── api/                  # Express backend application
│
├── packages/
│   ├── shared/               # Shared schemas, types, constants, and enums
│   ├── eslint-config/        # Shared ESLint configuration
│   └── typescript-config/    # Shared TypeScript configuration
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
└── tsconfig.json
```

The architecture is intended to be reused across different application domains.

Individual projects can introduce their own business modules without changing the fundamental application structure.

---

# Goals

The architecture is designed around the following principles:

- Clear separation of concerns
- Feature-based organization
- Strong TypeScript type safety
- Shared frontend/backend contracts
- Runtime validation
- Secure authentication and authorization
- Reusable UI and application infrastructure
- Predictable backend layering
- Scalable database access
- Structured logging
- Testability
- Maintainability
- Production readiness
- Consistent development conventions

The goal is not to create unnecessary abstraction.

The architecture should remain understandable while providing enough structure for applications to grow safely.

---

# Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework |
| React | UI library |
| TypeScript | Static type safety |
| Tailwind CSS | Styling |
| TanStack Query | Server-state management |
| Axios | HTTP client |
| Zod | Runtime validation |
| Socket.IO Client | Real-time communication |
| Boneyard.js | Skeleton/loading states |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express | HTTP API framework |
| TypeScript | Static type safety |
| Prisma | ORM and database access |
| PostgreSQL | Relational database |
| Zod | Request/data validation |
| JWT | Authentication tokens |
| Socket.IO | Real-time communication |
| Pino | Structured logging |
| pino-http | HTTP request logging |
| pino-pretty | Development log formatting |

## Monorepo

| Technology | Purpose |
|---|---|
| pnpm | Package manager |
| pnpm Workspaces | Workspace/package management |
| Turborepo | Monorepo task orchestration |
| TypeScript | Shared type system |

## Testing

| Technology | Purpose |
|---|---|
| Vitest | Unit/integration testing |
| Supertest | Express API testing |
| Playwright | End-to-end browser testing |

---

# Architecture Overview

```text
                         pnpm Workspace
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
      apps/web            apps/api        packages/shared
       Next.js             Express          Schemas
       React               Prisma           Types
       Query               Socket.IO        Constants
       Axios               Pino             Enums
          │                   │                   │
          │                   └─────────┬─────────┘
          │                             │
          └──────── HTTP / Socket.IO ───┘
                                        │
                                        ▼
                                   PostgreSQL
```

The frontend and backend remain independent applications.

Shared transport contracts and common definitions live inside `@repo/shared`.

---

# Project Structure

A high-level workspace structure:

```text
workspace/
│
├── apps/
│   │
│   ├── web/
│   │   ├── public/
│   │   ├── bones/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── modules/
│   │   │   ├── components/
│   │   │   ├── config/
│   │   │   ├── hooks/
│   │   │   ├── providers/
│   │   │   ├── lib/
│   │   │   ├── utils/
│   │   │   ├── constants/
│   │   │   └── types/
│   │   │
│   │   ├── tests/
│   │   ├── boneyard.config.json
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   ├── factories/
│       │   └── seeders/
│       │
│       ├── logs/
│       ├── tests/
│       │
│       └── src/
│           ├── config/
│           ├── lib/
│           ├── modules/
│           ├── middleware/
│           ├── socket/
│           ├── errors/
│           ├── types/
│           ├── app.ts
│           └── server.ts
│
├── packages/
│   ├── shared/
│   ├── eslint-config/
│   └── typescript-config/
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
└── tsconfig.json
```

---

# Getting Started

## Prerequisites

Install the following:

- Node.js
- pnpm
- PostgreSQL
- Git

Verify the installations:

```bash
node --version
pnpm --version
git --version
```

# Development Command Reference

This section contains the commonly used commands for developing, maintaining, testing, and running this monorepo.

Unless otherwise specified, commands should be executed from the **workspace root folder**.

---

## Install Dependencies

Install all dependencies for the monorepo:

```bash
pnpm install
```

Use this after cloning the repository or whenever dependencies in `package.json` or `pnpm-lock.yaml` have changed.

---

## Package Management

### Add Backend Package

Install a package specifically in the `api` workspace:

```bash
pnpm add --filter api <package-name>
```

Example:

```bash
pnpm add --filter api toast
```

### Add Backend Development Package

```bash
pnpm add --filter api -D <package-name>
```

Example:

```bash
pnpm add --filter api -D vitest
```

### Remove Backend Package

```bash
pnpm remove --filter api <package-name>
```

Example:

```bash
pnpm remove --filter api toast
```

### Add Frontend Package

Install a package specifically in the `web` workspace:

```bash
pnpm add --filter web <package-name>
```

### Remove Frontend Package

```bash
pnpm remove --filter web <package-name>
```

---

# Prisma Commands

Run Prisma commands from the workspace root using the `api` workspace filter.

## Generate Prisma Client

Run after modifying `schema.prisma` or after installing dependencies on a fresh project:

```bash
pnpm --filter api prisma generate
```

---

## Create Database Migration

Create and apply a new development migration:

```bash
pnpm --filter api prisma migrate dev --name "<migration-name>"
```

Example:

```bash
pnpm --filter api prisma migrate dev --name "create_user_roles"
```

Use descriptive migration names such as:

```text
create_users_table
add_user_roles
add_is_active_to_users
create_permissions_table
```

---

## Run Database Seeders

Seed the database:

```bash
pnpm --filter api prisma db seed
```

Use seeders for initial or required application data such as:

```text
roles
permissions
admin accounts
system configuration
reference data
```

---

## Run Prisma Factory

Run the configured user factory command:

```bash
pnpm --filter api create:user
```

This command depends on the custom `create:user` command configured by the backend project.

---

## Validate Prisma Schema

Validate `schema.prisma`:

```bash
pnpm --filter api prisma validate
```

---

## Format Prisma Schema

Format `schema.prisma`:

```bash
pnpm --filter api prisma format
```

---

## Reset Development Database

Reset the development database and reapply all migrations:

```bash
pnpm --filter api prisma migrate reset
```

---

## Check Migration Status

Check which migrations have been applied:

```bash
pnpm --filter api prisma migrate status
```

Warning: This command deletes all existing data in the development database.
---

## Production Database Migration

Apply existing migrations in a production environment:

```bash
pnpm --filter api prisma migrate deploy
```

Do not use `prisma migrate dev` for production deployments.

---

# Testing Commands

## Run Backend Unit Tests

```bash
pnpm --filter api test
```

---

## Run Vitest Once

Run all Vitest tests once without watch mode:

```bash
pnpm --filter api vitest:run
```

---

## Run Test Coverage

Generate backend test coverage:

```bash
pnpm --filter api test:coverage
```

Coverage should be reviewed for important application areas such as:

```text
services
repositories
authentication
authorization
validation
business rules
```

---

# Build Commands

## Build Complete Monorepo

From the workspace root:

```bash
pnpm build
```

## Build Backend Only

```bash
pnpm --filter api build
```

## Build Frontend Only

```bash
pnpm --filter web build
```

---

# Run Development Environment

Run the complete project from the workspace root:

```bash
pnpm run dev
```

This starts the development tasks configured for the monorepo.

## Run Backend Only

```bash
pnpm --filter api dev
```

## Run Frontend Only

```bash
pnpm --filter web dev
```

---

# Common Development Workflows

## First-Time Project Setup

After cloning the repository:

```bash
pnpm install
```
---

## After Changing Prisma Schema

After modifying:

```text
apps/api/prisma/schema.prisma
```

Create a migration:

```bash
pnpm --filter api prisma migrate dev --name "<migration-name>"
```

### Seed Required Data

After applying migrations, seed required/reference data when necessary:

```bash
pnpm --filter api prisma db seed
```

Optionally generate development or test data using a factory:

```bash
pnpm --filter api create:user
```

in package.json

```json
"scripts": {
    "create:user": "tsx prisma/factories/user.factory.ts",
  },
  ```

Then regenerate Prisma Client if necessary:

```bash
pnpm --filter api prisma generate
```

---

## After Pulling Database Changes

If another developer added new migrations:

```bash
pnpm install

pnpm --filter api prisma generate

pnpm --filter api prisma migrate dev
```

Then start the project:

```bash
pnpm run dev
```

---

## Before Committing Changes

Run tests:

```bash
pnpm --filter api test
```

Check test coverage when necessary:

```bash
pnpm --filter api test:coverage
```

Build the project:

```bash
pnpm build
```

Fix any TypeScript, test, or build errors before committing.


---

## Install Dependencies

From the workspace root:

```bash
pnpm install
```

pnpm installs dependencies for all workspace applications and packages and creates the necessary local workspace links.

---

## Environment Variables

Frontend and backend applications should provide `.env.example` files.

Create local environment files:

```text
apps/web/.env
apps/api/.env
```

Example backend database configuration:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Never commit production credentials or secrets.

---

## Database

Generate the Prisma client:

```bash
pnpm --filter api prisma generate
```

Apply development migrations:

```bash
pnpm --filter api prisma migrate dev
```

Seed the database using the configured project seed command.

Example:

```bash
pnpm --filter api seed
```

---

## Development

Run the complete workspace:

```bash
pnpm dev
```

Run only the frontend:

```bash
pnpm --filter web dev
```

Run only the backend:

```bash
pnpm --filter api dev
```

---

## Boneyard Skeleton Generation

Boneyard.js is used to generate skeleton/loading states for frontend pages.

The following setup should be completed before generating skeletons.

### 1. Install Boneyard.js

Install Boneyard.js in the `web` workspace:

```bash
pnpm --filter web add boneyard-js
```

### 2. Install Playwright

Install Playwright as a development dependency:

```bash
pnpm --filter web add -D playwright
```

Install the Chromium browser required by Playwright:

```bash
pnpm --filter web exec playwright install chromium
```

### 3. Add the Skeleton Component

Add the `Skeleton` component to the page or view where a loading skeleton is required.

Import the Boneyard `Skeleton` component and the generated skeleton registry:

```tsx
import { Skeleton } from "boneyard-js/react";

import "@/bones/registry";
```

The registry import is required so Boneyard can resolve the generated skeletons by their registered names.

Then wrap the page content with the `Skeleton` component:

```tsx
import { Skeleton } from "boneyard-js/react";

import "@/bones/registry";

export function AccessControlView() {
    return (
        <Skeleton
            name="admin-access-control"
            loading={showSkeleton}
            fixture={
                // fixture
            }
        >
            {/* Page content */}
        </Skeleton>
    );
}
```

The `name` should uniquely identify the page or feature:

```tsx
name="admin-access-control"
```

Use the appropriate loading state for the page:

```tsx
loading={showSkeleton}
```

or when using the loading state directly from a query:

```tsx
loading={isLoading}
```

The actual page content should be placed inside the `Skeleton` component:

```tsx
<Skeleton
    name="admin-access-control"
    loading={showSkeleton}
    fixture={
        // fixture
    }
>
    {/* Page content */}
</Skeleton>
```

---

### 4. Start the Development Server

The application must be running and the target page must be accessible before generating skeletons.

From the workspace root:

```bash
pnpm run dev
```

Verify that the target page loads successfully before running the Boneyard build command.

---

### 5. Generate Skeletons

For authenticated pages, provide a valid authentication cookie:

```bash
pnpm --filter web exec boneyard-js build http://192.168.1.115:3000 --cookie "access_token=YOUR_NEW_TOKEN"
```

Replace `YOUR_NEW_TOKEN` with a valid access token.

> **Important:** Never commit real access tokens, authentication cookies, or other credentials to the repository.

---

### 6. Verify Generated Skeletons

After the Boneyard build command completes successfully, check the frontend `src/bones/` directory.

The generated files should appear similar to:

```text
apps/web/src/
│
├── app/
│
├── bones/
│   ├── admin-access-control...
│   ├── admin-dashboard...
│   └── registry.ts
│
├── components/
├── config/
└── ...
```

Each generated skeleton should have a corresponding file inside `src/bones/`.

For example, when the component uses:

```tsx
<Skeleton
    name="admin-access-control"
    loading={showSkeleton}
>
    {/* Page content */}
</Skeleton>
```

a corresponding generated skeleton for `admin-access-control` should appear inside:

```text
src/bones/
```

Also verify that:

```text
src/bones/registry.ts
```

exists and contains the generated skeleton registrations.

The registry is loaded by the application through:

```tsx
import "@/bones/registry";
```

This allows the `Skeleton` component to find the generated skeleton using its `name`.

Conceptually:

```text
<Skeleton name="admin-access-control">
              │
              ▼
      "@/bones/registry"
              │
              ▼
     Generated Skeleton
              │
              ▼
src/bones/admin-access-control...
```

If the expected skeleton file appears in `src/bones/` and is registered through `registry.ts`, the skeleton generation was successful.

The final verification should also be done in the browser:

1. Open the page where the skeleton is used.
2. Set or trigger the `loading` state to `true`.
3. Confirm that the generated skeleton is displayed instead of the normal page content.
4. Set or allow the `loading` state to become `false`.
5. Confirm that the normal page content is displayed.

For temporary verification, you can force the skeleton to display:

```tsx
<Skeleton
    name="admin-access-control"
    loading={true}
>
    {/* Page content */}
</Skeleton>
```

After verifying that the generated skeleton displays correctly, restore the actual loading state:

```tsx
loading={showSkeleton}
```

or:

```tsx
loading={isLoading}
```

---

### 7. Regenerate Skeletons

When significant changes are made to the page layout or loading-state structure, regenerate the skeletons:

```bash
pnpm --filter web exec boneyard-js build http://192.168.1.115:3000 --cookie "access_token=YOUR_NEW_TOKEN"
```

After regeneration, verify that the corresponding files under `src/bones/` have been updated.

### Workflow

```text
Install Boneyard.js
        ↓
Install Playwright + Chromium
        ↓
Import Skeleton + bones registry
        ↓
Wrap page content with <Skeleton>
        ↓
Configure name, loading state, and fixture
        ↓
Start development server
        ↓
Run Boneyard build
        ↓
Check src/bones/
        ↓
Verify generated file + registry.ts
        ↓
Trigger loading state in browser
        ↓
Confirm generated skeleton is displayed
```

## Modal Management with `useDisclosure`

Use the reusable `useDisclosure` hook to manage modal open and close states.

This keeps modal state management consistent and avoids creating separate boolean state variables for every modal.

### Basic Usage

Create a disclosure instance for each modal:

```tsx
const userModal = useDisclosure();
const roleModal = useDisclosure();
```

Each modal receives its own disclosure instance and can therefore be controlled independently.

Conceptually:

```text
useDisclosure()
     │
     ├── isOpen
     ├── open()
     └── close()
```

Example:

```tsx
const userModal = useDisclosure();

userModal.open();
userModal.close();

console.log(userModal.isOpen);
```

---

### Using `useDisclosure` with Modal

Pass the disclosure state and close handler to the reusable `Modal` component:

```tsx
<Modal
    isOpen={userModal.isOpen}
    onClose={handleCloseUserModal}
    title={
        selectedUser
            ? "Edit User"
            : "Create User"
    }
    size="md"
    footer={
        <>
            <Button
                type="button"
                onClick={() => {
                    userModal.close();
                    setSelectedUser(null);
                }}
            >
                Cancel
            </Button>

            <Button
                type="submit"
                form="user-form"
                disabled={
                    pendingCreateUser ||
                    pendingUpdateUser
                }
            >
                {selectedUser ? "Update" : "Save"}
            </Button>
        </>
    }
>
    <UserForm
        mode={selectedUser ? "edit" : "create"}
        user={selectedUser}
        roles={roles}
        onCreate={handleCreateUser}
        onUpdate={handleUpdateUser}
        isSubmitting={
            pendingCreateUser ||
            pendingUpdateUser
        }
    />
</Modal>
```

---

### Opening a Create Modal

When creating a new record, clear the selected record before opening the modal:

```tsx
function handleOpenCreateUser() {
    setSelectedUser(null);
    userModal.open();
}
```

Example:

```tsx
<Button onClick={handleOpenCreateUser}>
    Create User
</Button>
```

The modal will then use create mode:

```tsx
mode={selectedUser ? "edit" : "create"}
```

Since `selectedUser` is `null`, the form receives:

```tsx
mode="create"
```

---

### Opening an Edit Modal

When editing an existing record, set the selected record before opening the modal:

```tsx
function handleOpenEditUser(user: User) {
    setSelectedUser(user);
    userModal.open();
}
```

Example:

```tsx
<Button onClick={() => handleOpenEditUser(user)}>
    Edit
</Button>
```

The selected user determines that the modal is in edit mode:

```tsx
title={selectedUser ? "Edit User" : "Create User"}
```

and:

```tsx
mode={selectedUser ? "edit" : "create"}
```

---

### Closing the Modal

When closing an edit/create modal, also clear its associated selected record:

```tsx
function handleCloseUserModal() {
    userModal.close();
    setSelectedUser(null);
}
```

Use the same handler for the modal:

```tsx
<Modal
    isOpen={userModal.isOpen}
    onClose={handleCloseUserModal}
>
    ...
</Modal>
```

The Cancel button should also use the same close handler:

```tsx
<Button
    type="button"
    onClick={handleCloseUserModal}
>
    Cancel
</Button>
```

This is preferable to duplicating:

```tsx
onClick={() => {
    userModal.close();
    setSelectedUser(null);
}}
```

because all modal cleanup remains in one place.

---

### Multiple Modals

Create a separate disclosure instance for each independent modal:

```tsx
const userModal = useDisclosure();
const roleModal = useDisclosure();
```

For example:

```tsx
<Button onClick={userModal.open}>
    Create User
</Button>

<Button onClick={roleModal.open}>
    Create Role
</Button>
```

Then connect each instance to its corresponding modal:

```tsx
<Modal
    isOpen={userModal.isOpen}
    onClose={userModal.close}
    title="User"
>
    ...
</Modal>

<Modal
    isOpen={roleModal.isOpen}
    onClose={roleModal.close}
    title="Role"
>
    ...
</Modal>
```

Each modal maintains independent open/close state.

---

### Recommended Pattern

For CRUD modals that support both create and edit operations:

```tsx
const userModal = useDisclosure();
const [selectedUser, setSelectedUser] = useState<User | null>(null);

function handleOpenCreateUser() {
    setSelectedUser(null);
    userModal.open();
}

function handleOpenEditUser(user: User) {
    setSelectedUser(user);
    userModal.open();
}

function handleCloseUserModal() {
    userModal.close();
    setSelectedUser(null);
}
```

The state responsibilities are separated as follows:

```text
userModal
    │
    └── Controls whether the modal is open

selectedUser
    │
    ├── null
    │    └── Create mode
    │
    └── User
         └── Edit mode
```

This allows the same modal and form to support both create and edit operations:

```text
Create User
     │
     ├── selectedUser = null
     └── userModal.open()
              │
              ▼
         Create Mode


Edit User
     │
     ├── selectedUser = user
     └── userModal.open()
              │
              ▼
          Edit Mode


Close Modal
     │
     ├── userModal.close()
     └── selectedUser = null
```

### Guideline

Prefer:

```tsx
const userModal = useDisclosure();
const roleModal = useDisclosure();
```

instead of managing individual modal booleans:

```tsx
const [isUserModalOpen, setIsUserModalOpen] = useState(false);
const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
```

Use `useDisclosure` for reusable open/close UI state such as:

- Modals
- Dialogs
- Drawers
- Side panels
- Other toggleable overlays

Keep record-specific state such as `selectedUser` separate from the disclosure state.


# Monorepo Architecture

## pnpm Workspaces

pnpm Workspaces manages applications and shared packages from a single repository.

Responsibilities include:

- Dependency installation
- Workspace package discovery
- Local package linking
- Shared dependency management
- Package filtering

Examples:

```bash
pnpm --filter web dev
pnpm --filter api dev
```

---

## Turborepo

Turborepo manages tasks across the workspace.

Typical tasks include:

```text
dev
build
lint
test
```

Turbo understands package dependencies and can execute tasks in the correct order.

Example:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

Turborepo provides:

- Parallel task execution
- Dependency-aware builds
- Task caching
- Workspace orchestration

---

# Frontend Architecture

The frontend follows a feature-based architecture.

```text
src/
├── app/
├── modules/
├── components/
├── config/
├── hooks/
├── providers/
├── lib/
├── utils/
├── constants/
└── types/
```

---

## `app/`

The Next.js `app/` directory is primarily responsible for:

- Routes
- Layouts
- Route groups
- Route-level loading states
- Route-level error boundaries
- Route-level composition

Business implementation should generally remain inside feature modules.

Example:

```text
app/
├── (auth)/
│   └── login/
│
├── (protected)/
│   ├── admin/
│   └── feature/
│
├── unauthorized/
├── layout.tsx
├── loading.tsx
├── error.tsx
└── not-found.tsx
```

---

## `modules/`

Business features belong inside `modules/`.

A typical feature:

```text
modules/
└── feature/
    ├── components/
    ├── hooks/
    ├── services/
    ├── schemas/
    ├── types/
    ├── views/
    └── index.ts
```

The normal frontend dependency flow is:

```text
Route
  │
  ▼
View
  │
  ▼
Component
  │
  ▼
Hook
  │
  ▼
Service
  │
  ▼
Backend API
```

### Components

Contain feature-specific presentation and interaction.

### Hooks

Contain React-specific application logic and TanStack Query queries/mutations.

### Services

Contain communication with backend APIs.

### Views

Compose complete feature screens.

### Schemas

Contain frontend-only runtime schemas when they are not shared API contracts.

### Types

Contain frontend-only TypeScript definitions.

---

# Shared Components

Globally reusable components belong in:

```text
src/components/
```

Examples include:

```text
components/
├── common/
│   ├── Modal/
│   └── Table/
│
├── guards/
│   ├── RoleGuard.tsx
│   └── PermissionGuard.tsx
│
└── ui/
```

A reusable table may be organized as:

```text
Table/
├── index.ts
├── table.types.ts
├── RowsPerPageSelector.tsx
├── Table.tsx
├── TableBody.tsx
├── TableEmpty.tsx
├── TableHeader.tsx
├── TableLoading.tsx
└── TablePagination.tsx
```

---

# Frontend State Management

Different types of state should be handled by the appropriate tool.

## Local UI State

Use React state for local component state:

```ts
const [isOpen, setIsOpen] = useState(false);
```

Reusable UI state can be encapsulated in hooks:

```ts
const modal = useDisclosure();
```

## Server State

Use TanStack Query for backend/server data.

Examples:

```ts
useQuery(...)
useMutation(...)
```

TanStack Query handles:

- Loading states
- Caching
- Invalidations
- Refetching
- Mutation state
- Server-state synchronization

---

# Frontend Mutation Pattern

Feature hooks should primarily manage server-state behavior.

Example:

```ts
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUserService,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["access-control", "users"],
            });
        },
    });
}
```

Page or view handlers can manage UI-specific consequences:

```ts
async function handleCreateUser(data: CreateUserSchema) {
    try {
        await createUser(data);

        userModal.close();

        SweetAlert.successAlert(
            "Success",
            "User created successfully."
        );
    } catch {
        SweetAlert.errorAlert(
            "Failed",
            "Failed to create user."
        );
    }
}
```

This keeps server-state responsibilities separate from page-specific presentation behavior.

---

# Backend Architecture

The backend follows a layered, feature-based architecture.

```text
src/
├── config/
├── lib/
├── modules/
├── middleware/
├── socket/
├── errors/
├── types/
├── app.ts
└── server.ts
```

Business capabilities belong inside `modules/`.

---

## Backend Module Structure

A typical backend feature:

```text
modules/
└── feature/
    ├── feature.routes.ts
    ├── feature.controller.ts
    ├── feature.service.ts
    ├── feature.repository.ts
    ├── feature.mapper.ts
    ├── feature.schema.ts
    └── feature.types.ts
```

The normal dependency flow is:

```text
HTTP Request
     │
     ▼
   Route
     │
     ▼
 Middleware
     │
     ▼
 Controller
     │
     ▼
  Service
     │
     ▼
 Repository
     │
     ▼
   Prisma
     │
     ▼
 PostgreSQL
```

---

## Routes

Routes define HTTP endpoints and compose middleware.

Routes should not contain business logic.

---

## Controllers

Controllers handle HTTP-specific concerns.

Responsibilities include:

- Reading validated request data
- Calling services
- Selecting HTTP status codes
- Returning responses

Controllers should remain thin.

---

## Services

Services contain business logic.

Responsibilities include:

- Business rules
- Application orchestration
- Domain decisions
- Coordinating repositories
- Coordinating external services

Services should remain independent from Express whenever practical.

---

## Repositories

Repositories contain persistence logic.

Responsibilities include:

- Prisma queries
- Database reads
- Database writes
- Persistence-specific operations

Repositories should not decide authorization or HTTP behavior.

---

## Mappers

Mappers transform one representation into another.

Example:

```text
Prisma Model
    │
    ▼
   Mapper
    │
    ▼
API Model
```

Mappers are useful when persistence models should not be exposed directly through the API.

---

# `app.ts` vs `server.ts`

The Express application separates application configuration from server startup.

## `app.ts`

Responsible for constructing the Express application.

Typical responsibilities:

- Express initialization
- JSON middleware
- Cookie parsing
- CORS
- Request logging
- API routes
- Not-found middleware
- Error middleware

`app.ts` should not start the network server.

---

## `server.ts`

Responsible for process-level startup.

Typical responsibilities:

- Creating the HTTP server
- Initializing Socket.IO
- Starting the server
- Listening on the configured port
- Process lifecycle handling
- Graceful shutdown

This separation makes the application easier to test.

---

# Shared Package

Shared contracts belong in:

```text
packages/shared/
```

Example:

```text
shared/
└── src/
    ├── schemas/
    ├── types/
    ├── constants/
    ├── enums/
    └── index.ts
```

The package is consumed as:

```ts
import {
    User,
    Role,
    CreateUserSchema,
} from "@repo/shared";
```

---

# What Belongs in `@repo/shared`

Place something in the shared package when it represents a contract or definition required by more than one application.

Good candidates include:

- API request schemas
- API response types
- Shared domain types
- Pagination metadata
- Role/permission constants
- Shared enums
- Shared Zod schemas

Do not automatically place every type into the shared package.

Frontend-only and backend-only implementation details should remain local.

---

# Next.js Shared Package Transpilation

If `@repo/shared` exports TypeScript source directly:

```json
{
  "main": "./src/index.ts"
}
```

the Next.js application can transpile it through:

```ts
transpilePackages: ["@repo/shared"]
```

This allows changes in the shared package to be consumed without requiring a manual package rebuild during development.

If the shared package later becomes independently distributed or significantly larger, it may be changed to produce compiled `dist` output.

---

# Authentication

Authentication answers:

> Who is making the request?

The backend is the authority for authentication.

A typical flow:

```text
Login Form
    │
    ▼
POST /auth/login
    │
    ▼
Authentication Service
    │
    ├── Validate credentials
    ├── Create token
    └── Set authentication cookie
    │
    ▼
Frontend
    │
    ▼
GET /auth/me
    │
    ▼
Authenticated User
```

The frontend maintains authenticated-user state through an authentication provider.

---

# Backend Authentication Flow

```text
Client Request
      │
      ▼
authenticate.middleware.ts
      │
      ├── Read access token from cookie
      ├── Verify JWT
      ├── Load authenticated user
      │       │
      │       ▼
      │   auth.service.ts
      │       │
      │       ▼
      │   auth.repository.ts
      │       │
      │       ▼
      │     Prisma
      │
      ├── Attach authenticated user to req.user
      │
      ▼
Protected Route
```

Roles and permissions are loaded as part of the authenticated user when appropriate.

This prevents authorization middleware from repeatedly querying the same user information within one request.

---

# Authenticated User

The frontend should receive only the information required for authentication and authorization.

Example:

```ts
export type AuthenticatedUser = {
    id: number;
    name: string;
    username: string;
    email: string;
    isActive: boolean;

    roles: string[];
    permissions: string[];
};
```

This allows simple authorization checks:

```ts
user.roles.includes("ADMIN");
```

and:

```ts
user.permissions.includes("USER_CREATE");
```

---

# Authorization

Authentication and authorization are separate concerns.

```text
Authentication
      │
      ▼
Who is the user?
      │
      ▼
Authorization
      │
      ▼
What is the user allowed to do?
```

The architecture supports roles and permissions.

---

## Roles

Roles provide broad access grouping.

Examples:

```text
ADMIN
USER
MANAGER
```

Frontend example:

```tsx
<RoleGuard roles={["ADMIN"]}>
    <AdminView />
</RoleGuard>
```

Roles are useful for page or module access.

---

## Permissions

Permissions provide granular action-level access.

Examples:

```text
USER_CREATE
USER_UPDATE
USER_DELETE

ROLE_CREATE
ROLE_UPDATE

PERMISSION_ASSIGN
```

Frontend example:

```tsx
<PermissionGuard permissions={["USER_CREATE"]}>
    <Button>Create User</Button>
</PermissionGuard>
```

A missing action permission should normally hide or disable the relevant action rather than deny the entire module when the user otherwise has module access.

---

# Backend Authorization

Frontend guards are not security boundaries.

Users can manually call backend endpoints even when buttons or pages are hidden.

Therefore:

```text
Frontend Guard
      │
      ▼
User Experience
      │
      ▼
API Request
      │
      ▼
Authentication Middleware
      │
      ▼
Authorization Middleware
      │
      ▼
Controller
```

The backend must independently verify authorization.

Example:

```ts
router.post(
    "/users",
    authenticate,
    authorize({
        roles: ["ADMIN"],
        permissions: ["USER_CREATE"],
    }),
    validate(createUserSchema),
    createUserController
);
```

The backend remains the authoritative security layer.

---

# Frontend Routing and Authorization

The frontend separates authentication, authorization, routing errors, and data states.

```text
app/
│
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx
│
├── (protected)/
│   ├── admin/
│   ├── feature-1/
│   ├── feature-2/
│   └── layout.tsx
│
├── unauthorized/
│   └── page.tsx
│
├── layout.tsx
├── loading.tsx
├── error.tsx
└── not-found.tsx
```

Typical responsibility split:

| Concern | Responsibility |
|---|---|
| Authentication state | `AuthProvider` |
| Current authenticated user | `AuthProvider` |
| Roles and permissions | `AuthProvider` |
| Protected route authentication | `(protected)/layout.tsx` |
| Module authorization | Role guard |
| UI/action authorization | Permission guard |
| Unauthorized page | `/unauthorized` |
| Route loading | `loading.tsx` |
| Route/runtime errors | `error.tsx` |
| Missing resources/routes | `not-found.tsx` |
| API query state | TanStack Query |
| API authentication | Backend middleware |
| API authorization | Backend middleware |

---

# Unauthorized vs Not Found vs Error

These states should remain separate.

```text
401 / Unauthenticated
        │
        └── Login

403 / Unauthorized
        │
        └── /unauthorized

404 / Not Found
        │
        └── not-found.tsx

Unexpected Application Error
        │
        └── error.tsx
```

---

# Validation

Zod provides runtime validation.

Shared API contracts should normally live in:

```text
packages/shared/src/schemas/
```

---

## Schema Naming

Runtime schemas use camelCase:

```ts
export const registerUserSchema = z.object({
    name: z.string().min(1),
    username: z.string().min(3),
    email: z.string().email().optional(),
    password: z.string().min(8),
});
```

Inferred TypeScript types use PascalCase:

```ts
export type RegisterUserSchema =
    z.infer<typeof registerUserSchema>;
```

Therefore:

```text
registerUserSchema
       │
       └── Runtime Zod schema

RegisterUserSchema
       │
       └── TypeScript type
```

Use the runtime schema for validation and composition:

```ts
registerUserSchema.parse(data);

registerUserSchema.extend({
    // additional fields
});
```

Use the inferred type for TypeScript typing:

```ts
const data: RegisterUserSchema = {
    name: "John Doe",
    username: "john",
    password: "Password123",
};
```

---

# Schema Composition

Reuse common schemas instead of duplicating fields.

Example base registration schema:

```ts
export const registerUserSchema = z.object({
    email: z.string().email().optional(),
    name: z.string().min(1),
    username: z.string().min(3),
    password: z.string().min(8),
});
```

Administrative creation can extend it:

```ts
export const createUserSchema =
    registerUserSchema.extend({
        roleIds: z
            .array(z.number().int().positive())
            .min(1, "At least one role is required"),
    });
```

Conceptually:

```text
registerUserSchema
    │
    ├── name
    ├── username
    ├── email
    └── password
         │
         │ extend
         ▼
createUserSchema
    │
    └── roleIds
```

Public registration should not automatically be allowed to assign privileged roles.

---

# Transport-Independent Shared Schemas

Shared schemas should normally describe data rather than framework-specific request objects.

Prefer:

```ts
export const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    roleIds: z.array(z.number().int().positive()).optional(),
    isActive: z.boolean().optional(),
});
```

Avoid putting Express-specific structures such as this inside global shared schemas:

```ts
z.object({
    params: z.object({
        userId: z.coerce.number(),
    }),
    body: updateUserSchema,
});
```

`body`, `params`, and `query` are transport/framework concerns.

---

# Partial Updates

Update schemas should avoid unintended defaults.

Prefer:

```ts
isActive: z.boolean().optional()
```

over:

```ts
isActive: z.boolean().default(false)
```

when an omitted field should mean:

> Do not modify the existing value.

---

# API Architecture

A request should move through predictable layers:

```text
Client
  │
  ▼
Route
  │
  ▼
Authentication
  │
  ▼
Authorization
  │
  ▼
Validation
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
Repository
  │
  ▼
Database
```

Each layer should have a clear responsibility.

---

# Database Architecture

Prisma manages database access and schema migrations.

```text
apps/api/prisma/
├── schema.prisma
├── migrations/
├── factories/
└── seeders/
```

## Schema

`schema.prisma` defines database models and relationships.

## Migrations

Database schema changes are tracked through Prisma migrations.

## Seeders

Seeders create required initial/reference data.

Examples:

```text
roles
permissions
administrative users
system settings
```

## Factories

Factories generate reusable development or testing data.

---

# Real-Time Communication

This directory contains the backend real-time communication infrastructure using Socket.IO.

The socket layer complements the existing HTTP API. Normal CRUD operations and business transactions should continue to use HTTP endpoints, while Socket.IO is primarily used to notify connected clients about real-time changes and handle interactions that are naturally real-time.

---

## Directory Structure

```text
src/
├── config/
│   └── socket.config.ts
│       # Creates and configures the Socket.IO server
│
└── socket/
    ├── index.ts
    │   # Registers middleware and handlers
    │   # Stores the Socket.IO instance
    │   # Exposes getIO()
    │
    ├── socket-auth.ts
    │   # Authenticates Socket.IO connections
    │
    ├── socket.types.ts
    │   # Socket.IO-specific backend types
    │
    ├── handlers/
    │   ├── notification.handler.ts
    │   └── chat.handler.ts
    │
    └── emitters/
        └── user.emitter.ts
```

Shared socket event contracts are located in:

```text
packages/shared/src/socket/
├── index.ts
├── user.events.ts
├── notification.events.ts
└── admin/
    └── role.events.ts
```

Frontend socket infrastructure is located in:

```text
apps/web/src/
├── lib/socket/
│   └── socket-client.ts
│
└── modules/
    └── <module>/
        └── hooks/
            └── use<Module>Socket.ts
```

---

# Architecture

The application uses HTTP for business operations and Socket.IO for real-time synchronization.

Typical flow:

```text
Frontend
   │
   │ HTTP POST / PATCH / DELETE
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Database
   │
   ▼
Socket Emitter
   │
   │ server-to-client event
   ▼
Connected Clients
   │
   ▼
Module Socket Hook
   │
   ▼
React Query Invalidation
   │
   ▼
HTTP Refetch
   │
   ▼
Updated UI
```

Example:

```text
POST /users
    ↓
createUserController()
    ↓
createUser()
    ↓
repository.createUser()
    ↓
Database updated
    ↓
emitUserCreated()
    ↓
"user:created"
    ↓
useAccessControlSocket()
    ↓
invalidate ["access-control", "users"]
    ↓
React Query refetches users
```

Socket.IO should not replace the existing REST API for normal CRUD operations.

---

# Shared Event Contracts

Socket events that are used by both the frontend and backend belong in:

```text
@repo/shared
```

Example:

```ts
// packages/shared/src/socket/user.events.ts

import type { User } from "../types";

export interface UserServerToClientEvents {
    "user:created": (user: User) => void;
    "user:updated": (user: User) => void;
}
```

Client-to-server events can be defined separately:

```ts
// packages/shared/src/socket/notification.events.ts

export interface NotificationClientToServerEvents {
    "notification:read": (
        notificationId: number
    ) => void;
}
```

The event interfaces are combined in:

```ts
// packages/shared/src/socket/index.ts

import type {
    UserServerToClientEvents,
} from "./user.events";

import type {
    NotificationClientToServerEvents,
} from "./notification.events";

export interface ServerToClientEvents
    extends UserServerToClientEvents {}

export interface ClientToServerEvents
    extends NotificationClientToServerEvents {}
```

They must also be exported from the shared package root.

```ts
export * from "./socket";
```

This allows both applications to use:

```ts
import type {
    ClientToServerEvents,
    ServerToClientEvents,
} from "@repo/shared";
```

---

# Server-to-Client Events

Server-to-client events are emitted by the backend and received by connected frontend clients.

Examples:

```text
user:created
user:updated
role:created
vehicle:created
vehicle:updated
notification:new
```

They belong in:

```ts
ServerToClientEvents
```

Example:

```ts
export interface UserServerToClientEvents {
    "user:created": (user: User) => void;
    "user:updated": (user: User) => void;
}
```

Backend:

```ts
getIO().emit("user:created", user);
```

Frontend:

```ts
socket.on("user:created", handleUserCreated);
```

---

# Client-to-Server Events

Client-to-server events originate from the frontend and are handled directly by the Socket.IO backend.

Examples may include:

```text
notification:read
chat:send
chat:typing
chat:stop-typing
```

They belong in:

```ts
ClientToServerEvents
```

Example:

```ts
export interface NotificationClientToServerEvents {
    "notification:read": (
        notificationId: number
    ) => void;
}
```

Frontend:

```ts
socket.emit("notification:read", notificationId);
```

Backend:

```ts
socket.on(
    "notification:read",
    async (notificationId) => {
        // Handle event
    }
);
```

Client-to-server Socket.IO events should primarily be used when the interaction is naturally real-time.

Normal business operations should generally remain HTTP operations.

---

# Handlers

Handlers process incoming client-to-server Socket.IO events.

Location:

```text
src/socket/handlers/
```

Example:

```ts
export function notificationHandler(
    io: AppSocketServer,
    socket: AppSocket
) {
    socket.on(
        "notification:read",
        async (notificationId) => {
            // Handle notification read event
        }
    );
}
```

Handlers should be registered when a socket connects.

```ts
io.on("connection", (socket) => {
    notificationHandler(io, socket);
    chatHandler(io, socket);
});
```

Handlers should not contain large amounts of business logic.

When possible, delegate business logic to the appropriate service:

```text
Socket Handler
      ↓
Service
      ↓
Repository
      ↓
Database
```

---

# Emitters

Emitters are responsible for sending server-to-client events.

Location:

```text
src/socket/emitters/
```

Example:

```ts
import { getIO } from "@/socket";
import type { User } from "@repo/shared";

export function emitUserCreated(user: User) {
    getIO().emit("user:created", user);
}

export function emitUserUpdated(user: User) {
    getIO().emit("user:updated", user);
}
```

Keeping emitters separate prevents Socket.IO logic from being duplicated throughout controllers and services.

---

# Socket Types

Backend-specific Socket.IO types belong in:

```text
src/socket/socket.types.ts
```

Current setup:

```ts
import type {
    Server,
    Socket,
} from "socket.io";

import type {
    ClientToServerEvents,
    ServerToClientEvents,
} from "@repo/shared";

export type AppSocketServer = Server<
    ClientToServerEvents,
    ServerToClientEvents
>;

export type AppSocket = Socket<
    ClientToServerEvents,
    ServerToClientEvents
>;
```

These aliases ensure that backend emitters and handlers use the same shared event contracts.

Example:

```ts
export function notificationHandler(
    io: AppSocketServer,
    socket: AppSocket
) {
    // ...
}
```

Additional Socket.IO generic types should only be introduced when they are actually required.

---

# Socket Initialization

Socket.IO is created in:

```text
src/config/socket.config.ts
```

Example:

```ts
const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents
>(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});

registerSocketHandlers(io);
```

The configuration layer is responsible for creating the Socket.IO server.

The `socket/index.ts` file is responsible for registering middleware and event handlers.

---

# Socket Instance

The initialized Socket.IO instance is stored so that emitters can access it without passing `io` through every controller or service.

```ts
let ioInstance: AppSocketServer | null = null;
```

During registration:

```ts
export function registerSocketHandlers(
    io: AppSocketServer
) {
    ioInstance = io;

    io.use(authenticateSocket);

    io.on("connection", (socket) => {
        notificationHandler(io, socket);
        chatHandler(io, socket);
    });
}
```

The instance can then be accessed through:

```ts
export function getIO(): AppSocketServer {
    if (!ioInstance) {
        throw new Error(
            "Socket.IO is not initialized"
        );
    }

    return ioInstance;
}
```

Emitters can therefore simply use:

```ts
getIO().emit("user:created", user);
```

---

# Authentication

Socket authentication is handled by:

```text
src/socket/socket-auth.ts
```

The application uses the authentication cookie sent during the Socket.IO handshake.

The frontend Socket.IO client must therefore use:

```ts
io(SOCKET_URL, {
    withCredentials: true,
});
```

The backend validates the token before allowing the connection.

```text
Browser
   │
   │ Cookie
   ▼
Socket.IO handshake
   │
   ▼
authenticateSocket()
   │
   ├── valid → connection allowed
   │
   └── invalid → connection rejected
```

Do not trust user IDs or permission information sent manually from the frontend when the authenticated socket identity can provide that information.

---

# Frontend Socket Client

The frontend maintains a reusable Socket.IO client.

Location:

```text
apps/web/src/lib/socket/socket-client.ts
```

Example:

```ts
import {
    io,
    Socket,
} from "socket.io-client";

const SOCKET_URL =
    process.env.NEXT_PUBLIC_BACKEND_LAN_URL;

let socket: Socket | null = null;

export const createSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL!, {
            autoConnect: true,
            withCredentials: true,
        });
    }

    return socket;
};
```

The socket instance is shared rather than creating a new connection for every module.

---

# Frontend Module Listeners

Socket listeners should normally be organized by module.

Example:

```text
modules/access-control/hooks/
└── useAccessControlSocket.ts
```

```ts
"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { createSocket } from "@/lib/socket/socket-client";

export function useAccessControlSocket() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const socket = createSocket();

        const handleUserCreated = () => {
            queryClient.invalidateQueries({
                queryKey: [
                    "access-control",
                    "users",
                ],
            });
        };

        const handleUserUpdated = () => {
            queryClient.invalidateQueries({
                queryKey: [
                    "access-control",
                    "users",
                ],
            });
        };

        socket.on(
            "user:created",
            handleUserCreated
        );

        socket.on(
            "user:updated",
            handleUserUpdated
        );

        return () => {
            socket.off(
                "user:created",
                handleUserCreated
            );

            socket.off(
                "user:updated",
                handleUserUpdated
            );
        };
    }, [queryClient]);
}
```

The module can activate the listener from its main view:

```ts
export function AccessControlView() {
    useAccessControlSocket();

    // ...
}
```

---

# React Query Integration

Socket events should usually signal that server state has changed.

React Query remains responsible for retrieving and caching the actual server state.

Therefore, prefer:

```ts
socket.on("user:updated", () => {
    queryClient.invalidateQueries({
        queryKey: [
            "access-control",
            "users",
        ],
    });
});
```

instead of manually modifying large amounts of cached data unless there is a specific performance reason to do so.

This provides:

```text
Socket event
     ↓
Query invalidation
     ↓
HTTP refetch
     ↓
Backend remains source of truth
```

Prefix invalidation can update all variations of a query.

For example:

```ts
queryClient.invalidateQueries({
    queryKey: ["access-control", "users"],
});
```

can invalidate queries such as:

```text
["access-control", "users", { page: 1 }]
["access-control", "users", { page: 2 }]
["access-control", "users", { search: "john" }]
```

---

# Listener Cleanup

Feature hooks must remove the listeners they register.

Correct:

```ts
socket.on("user:created", handleUserCreated);

return () => {
    socket.off(
        "user:created",
        handleUserCreated
    );
};
```

Avoid disconnecting the shared socket from a module hook:

```ts
// Avoid in feature hooks
socket.disconnect();
```

The socket client is shared by multiple modules.

Disconnecting it when one component unmounts could interrupt socket listeners used by other parts of the application.

---

# When to Use HTTP vs Socket.IO

Use HTTP for normal business operations:

```text
Create user
Update user
Delete user
Create role
Update permissions
Create vehicle
Update vehicle
Create service record
Fetch data
Pagination
Search
Filtering
```

Example:

```text
PATCH /users/:id
```

Use Socket.IO for real-time synchronization:

```text
user:created
user:updated
vehicle:updated
notification:new
system:announcement
```

Use client-to-server Socket.IO events for interactions that are naturally real-time:

```text
chat:send
chat:typing
chat:stop-typing
```

The general rule is:

```text
HTTP
    = commands, CRUD, queries and business operations

Socket.IO
    = real-time events and synchronization
```

---

# Adding a New Server-to-Client Event

Example: vehicle updates.

## 1. Add the shared event contract

```ts
// @repo/shared/socket/vehicle.events.ts

import type { Vehicle } from "../types";

export interface VehicleServerToClientEvents {
    "vehicle:created": (
        vehicle: Vehicle
    ) => void;

    "vehicle:updated": (
        vehicle: Vehicle
    ) => void;
}
```

## 2. Register it with ServerToClientEvents

```ts
export interface ServerToClientEvents
    extends
        UserServerToClientEvents,
        VehicleServerToClientEvents {}
```

## 3. Create the backend emitter

```ts
// src/socket/emitters/vehicle.emitter.ts

import { getIO } from "@/socket";
import type { Vehicle } from "@repo/shared";

export function emitVehicleCreated(
    vehicle: Vehicle
) {
    getIO().emit(
        "vehicle:created",
        vehicle
    );
}

export function emitVehicleUpdated(
    vehicle: Vehicle
) {
    getIO().emit(
        "vehicle:updated",
        vehicle
    );
}
```

## 4. Emit after a successful operation

```ts
const result = await service.createVehicle(
    req.body
);

emitVehicleCreated(result);
```

Only emit after the business operation succeeds.

## 5. Create the frontend module listener

```ts
export function useVehicleSocket() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const socket = createSocket();

        const handleVehicleUpdated = () => {
            queryClient.invalidateQueries({
                queryKey: ["vehicles"],
            });
        };

        socket.on(
            "vehicle:updated",
            handleVehicleUpdated
        );

        return () => {
            socket.off(
                "vehicle:updated",
                handleVehicleUpdated
            );
        };
    }, [queryClient]);
}
```

---

# Naming Convention

Use domain-prefixed event names:

```text
user:created
user:updated

role:created
role:updated

service:created
service:updated

notification:new
notification:read

```

Preferred format:

```text
<domain>:<action>
```

This keeps event names predictable and avoids collisions as the application grows.

---

# Guidelines

1. Keep shared event contracts in `@repo/shared`.
2. Keep backend Socket.IO infrastructure inside `apps/api`.
3. Keep frontend socket connection infrastructure inside `apps/web`.
4. Group event contracts by business domain as the number of events grows.
5. Use handlers for client-to-server events.
6. Use emitters for server-to-client events.
7. Keep business logic in services rather than socket handlers.
8. Keep normal CRUD and queries in the HTTP API.
9. Use Socket.IO to notify clients about real-time changes.
10. Use React Query invalidation when an event indicates cached server state has changed.
11. Remove feature listeners during component cleanup.
12. Do not disconnect the shared socket from individual feature hooks.
13. Keep event names and payloads strongly typed.
14. Do not duplicate frontend and backend event contracts.
15. Add additional socket abstractions only when the application actually needs them.

---

# Error Handling

Errors should be handled centrally whenever possible.

Backend flow:

```text
Controller / Service
        │
        ▼
      throw
        │
        ▼
Error Handler
        │
        ├── Log error
        ├── Select status code
        └── Return safe response
```

Production responses should not expose stack traces or sensitive implementation details.

Example response:

```json
{
  "success": false,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error"
}
```

---

# Operational Errors vs Unexpected Errors

Expected operational errors include:

```text
INVALID_CREDENTIALS
UNAUTHORIZED
FORBIDDEN
VALIDATION_ERROR
NOT_FOUND
CONFLICT
```

These may generally be logged as `warn`.

Unexpected failures should generally use `error`.

Examples:

```text
Unexpected database failure
Unhandled exception
External service failure
Filesystem failure
Programming error
```

---

# Frontend Error Handling

Different frontend errors belong at different layers.

| Situation | Handler |
|---|---|
| Route rendering error | `error.tsx` |
| Missing route/resource | `not-found.tsx` |
| Unauthorized route | `/unauthorized` |
| Authentication failure | Authentication flow |
| Query/mutation error | TanStack Query / UI |
| Form validation | Zod / form library |

Route loading and API loading are separate concerns.

```text
loading.tsx
    │
    └── Route/segment loading

TanStack Query
    │
    └── API query/mutation loading
```

---

# Logging and Observability

The backend uses structured logging with:

- Pino
- pino-http
- pino-pretty

The logging system should help answer:

```text
What happened?
When did it happen?
Which request caused it?
Which operation was running?
Which user was involved?
Where did it fail?
How long did it take?
```

---

# Logging Architecture

```text
Development Bug
      │
      ▼
VS Code / Node Debugger

Runtime Information
      │
      ▼
Pino Structured Logging

Production Incident
      │
      ▼
Pino Logs
      │
      ▼
stdout / Log Collector
      │
      ▼
Centralized Logging

Performance / Memory Problem
      │
      ▼
Node Diagnostics
```

Logging, debugging, and runtime diagnostics complement each other.

---

# Logging Directory Structure

```text
apps/api/
│
├── logs/
│   ├── app.log
│   ├── error.log
│   └── .gitkeep
│
└── src/
    ├── config/
    │   └── logger.config.ts
    │
    ├── lib/
    │   └── logger/
    │       └── logger.ts
    │
    └── middleware/
        ├── request-logger.middleware.ts
        └── error-handler.middleware.ts
```

Generated log files should not be committed to source control.

---

# Log Levels

```text
trace
debug
info
warn
error
fatal
```

Recommended usage:

```text
debug → developer diagnostic information
info  → normal operational or business event
warn  → expected but undesirable condition
error → unexpected failed operation
fatal → critical process-level failure
```

Recommended environment defaults:

```text
development → debug
production  → info
```

---

# Structured Logging

Prefer:

```ts
logger.info(
    {
        userId: user.id,
        username: user.username,
    },
    "User authenticated"
);
```

instead of:

```ts
logger.info(
    `User ${user.id} ${user.username} authenticated`
);
```

Structured logs are easier to:

- Search
- Filter
- Aggregate
- Analyze
- Send to centralized logging systems

---

# Request Logging

HTTP requests should pass through `pino-http`.

Request logging can provide:

```text
HTTP method
URL
status code
response time
request ID
authenticated user ID
errors
```

Example:

```json
{
  "method": "POST",
  "url": "/api/v1/users",
  "statusCode": 201,
  "responseTime": 43
}
```

---

# Request IDs

Every HTTP request should receive a unique request ID.

Node provides:

```ts
import { randomUUID } from "node:crypto";
```

Conceptually:

```text
Frontend Request
       │
       ▼
   Request ID
       │
       ▼
   Controller
       │
       ▼
    Service
       │
       ▼
   Repository
       │
       ▼
    Database
```

Logs associated with the request can then be correlated through the same identifier.

---

# Sensitive Logging

Never intentionally log:

- Passwords
- Password hashes
- JWT tokens
- Access tokens
- Refresh tokens
- Authorization headers
- Cookies
- API secrets
- Database credentials
- Password-reset tokens
- Private keys

Logger redaction should provide additional defense in depth.

Example:

```ts
redact: {
    paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "password",
        "*.password",
        "passwordHash",
        "*.passwordHash",
        "accessToken",
        "refreshToken"
    ],
    censor: "[REDACTED]"
}
```

---

# Production Logging

Production should normally output structured JSON.

```text
Express API
     │
     ▼
    Pino
     │
     ▼
stdout / stderr
     │
     ▼
Docker / systemd / Cloud Runtime
     │
     ▼
Log Collector
     │
     ▼
Centralized Logging
```

Possible platforms include:

- Grafana Loki
- Datadog
- Elastic
- AWS CloudWatch
- Google Cloud Logging
- Azure Monitor
- Better Stack

The application should remain as independent from the logging platform as practical.

---

# Development Debugging

Pino should not replace a debugger.

For local application logic debugging use:

```text
VS Code
   +
Node.js Debugger
   +
Breakpoints
```

Use a debugger for problems involving:

```text
incorrect conditions
unexpected variable values
control flow
async behavior
incorrect transformations
business logic bugs
```

Use logging when you need historical runtime information or when attaching a debugger is impractical.

---

# Performance Logging

Slow operations can be measured.

Example:

```ts
const start = performance.now();

const users = await userRepository.findAll();

const durationMs =
    performance.now() - start;

if (durationMs > 500) {
    logger.warn(
        {
            durationMs,
        },
        "Slow user query detected"
    );
}
```

This can help identify:

```text
slow database queries
slow external APIs
expensive calculations
document generation bottlenecks
serialization costs
```

---

# CPU Profiling

For excessive CPU usage, Node.js CPU profiling may be used.

Example:

```bash
node --cpu-prof ./node_modules/tsx/dist/cli.mjs src/server.ts
```

Use CPU profiling for:

```text
high CPU usage
expensive loops
large transformations
CPU-intensive serialization
computational bottlenecks
```

---

# Memory Investigation

For suspected memory leaks:

```bash
node --inspect ./node_modules/tsx/dist/cli.mjs src/server.ts
```

Heap snapshots can help identify:

```text
retained objects
growing arrays
unreleased event listeners
socket cleanup problems
cache growth
timers retaining objects
```

---

# Node Diagnostic Reports

Node diagnostic reports can help investigate serious runtime failures.

Example:

```bash
node \
  --report-on-fatalerror \
  --report-uncaught-exception \
  ./node_modules/tsx/dist/cli.mjs \
  src/server.ts
```

They can help investigate:

```text
fatal runtime errors
process crashes
uncaught exceptions
runtime resource information
```

---

# Graceful Shutdown

The application should gracefully close resources during intentional shutdown.

Example:

```ts
async function shutdown(signal: string) {
    logger.info(
        { signal },
        "Shutdown signal received"
    );

    server.close(async () => {
        logger.info("HTTP server closed");

        await prisma.$disconnect();

        logger.info("Database disconnected");

        process.exit(0);
    });
}
```

Listen for:

```ts
process.on("SIGTERM", () =>
    shutdown("SIGTERM")
);

process.on("SIGINT", () =>
    shutdown("SIGINT")
);
```

---

# Logging Rules

## Rule 1 — Avoid permanent `console.log()`

Avoid:

```ts
console.log("User created");
```

Prefer:

```ts
logger.info(
    {
        userId: user.id,
    },
    "User created"
);
```

Temporary local debugging logs should not remain in committed production code.

## Rule 2 — Never log passwords or tokens

Avoid logging entire request objects that may contain credentials.

## Rule 3 — Log meaningful context

Prefer:

```ts
logger.error(
    {
        err: error,
        userId,
        requestId,
    },
    "Operation failed"
);
```

over:

```ts
logger.error("Error");
```

## Rule 4 — Do not over-log

Focus logging on:

```text
business events
security events
unexpected conditions
external integrations
slow operations
errors
process lifecycle
```

## Rule 5 — Use the correct severity

```text
debug → developer diagnostics
info  → normal events
warn  → undesirable but expected condition
error → unexpected failure
fatal → process-critical failure
```

## Rule 6 — Prefer request-scoped logging

Inside Express request handlers:

```ts
req.log.info(...)
```

Outside the HTTP request lifecycle:

```ts
logger.info(...)
```

---

# Testing Strategy

The architecture separates:

```text
Unit Tests
Integration Tests
End-to-End Tests
```

---

# Unit Tests

Unit tests should generally be colocated with the code they test.

Example:

```text
auth/
├── auth.service.ts
└── auth.service.test.ts
```

Use:

- Vitest
- Mocked external dependencies

Unit tests should focus on isolated business logic.

---

# Integration Tests

Backend integration tests belong under:

```text
apps/api/tests/integration/
```

Use:

- Vitest
- Supertest
- Test database

Integration tests verify interaction between:

```text
Express
  ↓
Service
  ↓
Repository
  ↓
Test Database
```

---

# End-to-End Tests

Frontend E2E tests belong under:

```text
apps/web/tests/e2e/
```

Use Playwright for critical real-user workflows.

Example:

```text
Login
  ↓
Open Module
  ↓
Create Record
  ↓
Verify Result
```

---

# Naming Conventions

Consistency should be maintained across the workspace.

| Resource | Convention | Example |
|---|---|---|
| Route folders | kebab-case | `access-control/` |
| Feature folders | kebab-case | `access-control/` |
| React components | PascalCase | `UserForm.tsx` |
| React views | PascalCase | `AccessControlView.tsx` |
| Hooks | `useSomething` | `useDisclosure.ts` |
| Services | `domain.service.ts` | `auth.service.ts` |
| Controllers | `domain.controller.ts` | `auth.controller.ts` |
| Repositories | `domain.repository.ts` | `auth.repository.ts` |
| Mappers | `domain.mapper.ts` | `auth.mapper.ts` |
| Schemas | `domain.schema.ts` | `auth.schema.ts` |
| Types | `domain.types.ts` | `auth.types.ts` |
| Middleware | `action.middleware.ts` | `authenticate.middleware.ts` |
| Configuration | `purpose.config.ts` | `logger.config.ts` |
| Seeders | `entity.seeder.ts` | `user.seeder.ts` |
| Factories | `entity.factory.ts` | `user.factory.ts` |
| Barrel exports | `index.ts` | `index.ts` |

---

# Development Guidelines

## Frontend

Prefer:

```text
Route
  ↓
View
  ↓
Component
  ↓
Hook
  ↓
Service
```

Avoid placing HTTP/API calls directly inside large UI components.

Keep reusable components independent from specific business modules whenever practical.

---

## Backend

Prefer:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
```

Avoid directly accessing Prisma from controllers for non-trivial business features.

---

## Business Logic

Business rules belong primarily in services.

Database operations belong in repositories.

HTTP concerns belong in controllers.

Validation belongs in schemas and validation middleware.

---

## Shared Contracts

Share contracts when frontend and backend must agree on the same structure.

Do not use `@repo/shared` as a dumping ground for every type in the repository.

---

# Build

Build the frontend:

```bash
pnpm --filter web build
```

Build the backend:

```bash
pnpm --filter api build
```

Build the complete workspace through the root task:

```bash
pnpm build
```

A production build should complete without TypeScript errors.

---

# Production

A general production workflow:

```text
Source
  │
  ▼
Install Dependencies
  │
  ▼
Type Check
  │
  ▼
Lint
  │
  ▼
Tests
  │
  ▼
Build
  │
  ▼
Database Migration
  │
  ▼
Deploy
  │
  ▼
Start Applications
```

Frontend and backend may be deployed independently even though they belong to the same monorepo.

---

# Security Principles

The architecture follows several fundamental security rules.

## Backend Is the Security Boundary

Frontend authorization exists primarily for user experience.

Backend authorization provides actual security.

## Never Trust Client Authorization Data

Do not trust client-provided roles or permissions as evidence that an operation is authorized.

## Validate External Input

Requests entering the application should be validated before reaching business logic.

## Protect Secrets

Secrets belong in environment variables.

Never commit:

```text
.env
private keys
production credentials
access tokens
database passwords
```

## Password Storage

Passwords must never be stored as plain text.

Only secure password hashes should be persisted.

## Logging

Sensitive authentication and credential information must never be intentionally logged.

---

# Architectural Principles

## Single Responsibility

Each component, file, module, and layer should have a clear responsibility.

## Separation of Concerns

Routing, UI, server state, business logic, persistence, validation, and infrastructure should remain separated.

## Feature Modularity

Business capabilities should be grouped by feature instead of placing every controller, service, or component into global directories.

## Type Safety

Use TypeScript throughout frontend, backend, and shared packages.

## Runtime Validation

Use Zod at application boundaries where runtime data cannot be trusted.

## Shared Contracts

Share API contracts when multiple applications depend on the same structure.

## Backend Authority

Security and business rules must ultimately be enforced by the backend.

## Testability

Architecture should allow individual layers to be tested independently.

## Observability

Production behavior should be diagnosable through structured logs and request correlation.

## Simplicity

Do not introduce abstraction unless it solves a real problem.

---

# Adding a New Feature

A new frontend feature should generally be created under:

```text
apps/web/src/modules/<feature>/
```

Example:

```text
feature/
├── components/
├── hooks/
├── services/
├── schemas/
├── types/
├── views/
└── index.ts
```

A corresponding backend feature should generally be created under:

```text
apps/api/src/modules/<feature>/
```

Example:

```text
feature/
├── feature.routes.ts
├── feature.controller.ts
├── feature.service.ts
├── feature.repository.ts
├── feature.mapper.ts
├── feature.schema.ts
└── feature.types.ts
```

Shared contracts can be added under:

```text
packages/shared/src/
```

This keeps new business capabilities consistent with the rest of the workspace.

---

# Future Improvements

Potential improvements include:

- [ ] Docker development environment
- [ ] Docker production images
- [ ] GitHub Actions CI/CD
- [ ] Automated linting
- [ ] Automated type checking
- [ ] Expanded unit test coverage
- [ ] Backend integration test suite
- [ ] Playwright E2E test suite
- [ ] OpenAPI/API documentation
- [ ] Rate limiting
- [ ] Production monitoring
- [ ] Centralized logging
- [ ] Health endpoints
- [ ] Readiness endpoints
- [ ] Metrics collection
- [ ] Distributed tracing
- [ ] Automated dependency updates
- [ ] Production deployment templates

---

# Using This Architecture for a New Project

This repository is intended to act as a reusable starting point for future applications.

When beginning a new project:

1. Keep the core monorepo structure.
2. Configure project-specific environment variables.
3. Define the required Prisma models.
4. Define shared domain and API contracts.
5. Add backend feature modules.
6. Add corresponding frontend feature modules.
7. Configure roles and permissions.
8. Create required seed data.
9. Add tests for critical business rules.
10. Add project-specific documentation.

The architecture remains stable while the business domain changes.

```text
Reusable Full-Stack Monorepo
          │
          ├── Project A
          ├── Project B
          ├── Project C
          └── Future Applications
```

---

# License

Add the appropriate license before public distribution.