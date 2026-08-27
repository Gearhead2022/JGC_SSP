workspace/
│
├── apps/
│   │
│   ├── web/                                                # Next.js frontend application
│   │   │
│   │   ├── src/
│   │   │   │
│   │   │   ├── app/                                        # Next.js routes and route layouts
│   │   │   │   │
│   │   │   │   ├── (auth)/                                 # Public authentication routes
│   │   │   │   │   ├── login/                              
│   │   │   │   │   │   └── page.tsx                        # Login route
│   │   │   │   │   └── layout.tsx                          # Authentication page layout
│   │   │   │   │
│   │   │   │   ├── (protected)/                            # Routes requiring authentication
|   |   |   |   |   |
│   │   │   │   |   |── admin/                              # Administrator-only modules
│   │   │   │   |   │   ├── dashboard/                      # Admin dashboard route
│   │   │   │   |   │   ├── access-control/       
│   │   │   │   │   │   |   └── page.tsx                    # Access-control route entry point
│   │   │   │   |   │   └── layout.tsx                      # Admin section layout
|   |   |   |   |   |
│   │   │   │   │   ├── feature-1/                          # Protected feature route
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── feature-2/                          # Protected feature route
│   │   │   │   │   │   └── page.tsx
│   │   │   │   |   └── layout.tsx                          # Authentication boundary/layout
│   │   │   │   │
│   │   │   │   ├── unauthorized/                           # default page route when not authorized access
│   │   │   │   │   └──page.tsx                             # Access-denied page
│   │   │   │   │
│   │   │   │   ├── layout.tsx                              # Root application layout
│   │   │   │   ├── loading.tsx                             # Global route loading UI
│   │   │   │   ├── error.tsx                               # Global route error boundary
│   │   │   │   └── not-found.tsx                           # Global 404 page
│   │   │   │
│   │   │   ├── modules/                                    # Feature-based application modules
│   │   │   │   │
│   │   │   │   ├── auth/                                   # Authentication feature
│   │   │   │   │   ├── components/                         # Feature-specific UI components
│   │   │   │   │   │   └── LoginForm.tsx
│   │   │   │   │   |
│   │   │   │   │   ├── context/                            # Authentication context definition
│   │   │   │   │   │   └── AuthContext.ts    
│   │   │   │   │   |
│   │   │   │   │   ├── hooks/                              # Feature hooks and React Query logic
│   │   │   │   │   │   ├── useAuth.ts
│   │   │   │   │   │   └── useLogin.ts
│   │   │   │   │   |
│   │   │   │   │   ├── providers/                          # Authentication state provider
│   │   │   │   │   │   └── AuthProvider.tsx
│   │   │   │   │   |
│   │   │   │   │   ├── services/                           # Authentication API requests
│   │   │   │   │   │   └── auth.service.ts
│   │   │   │   │   |
│   │   │   │   │   ├── types/                              # Frontend-only authentication types
│   │   │   │   │   │   └── auth.types.ts       
│   │   │   │   │   |
│   │   │   │   │   ├── views/                              # Route-level screen compositions
│   │   │   │   │   │   └── LoginView.tsx
│   │   │   │   │   |
│   │   │   │   │   └── index.ts                            # Public module exports
│   │   │   │   │
│   │   │   │   ├── admin/                                  # Administrative features
|   |   |   |   │   ├── dashboard/                          # Administrative dashboard
|   |   |   |   │   |   └── ...
|   |   |   |   │   ├── access-control/                     # User, role, and permission management
│   │   │   │   │   │   ├── components/                     # Access-control UI components
│   │   │   │   │   │   │   ├── users/                      # User management UI
│   │   │   │   │   │   │   │   ├── UserTable.tsx
│   │   │   │   │   │   │   │   └── UserForm.tsx
│   │   │   │   │   │   │   ├── roles/                      # User management UI
│   │   │   │   │   │   │   │   ├── RoleTable.tsx
│   │   │   │   │   │   │   │   └── RoleForm.tsx
│   │   │   │   │   │   │   └── permissions/                # User management UI
│   │   │   │   │   │   │       └── PermissionMatrix.tsx
│   │   │   │   │   │   │
│   │   │   │   │   │   ├── fixtures/                       # Fixture data for skeleton/loading previews
│   │   │   │   │   │   │   └── accessControlFixtures.ts    # Access-control skeleton fixture data
│   │   │   │   │   │   │
│   │   │   │   │   │   ├── hooks/                          # Access-control queries/mutations
│   │   │   │   │   │   │   ├── useAccessControl.ts 
|   |   |   |   |   |   |   └── useAccessControlSocket.ts   # Subscribes to socket events
│   │   │   │   │   │   │
│   │   │   │   │   │   ├── services/                       # Access-control API requests
│   │   │   │   │   │   │   └── access-control.service.ts
│   │   │   │   │   │   │
│   │   │   │   │   │   ├── types/                          # Frontend-only access-control types
│   │   │   │   │   │   │   └── access-control.types.ts
│   │   │   │   │   │   │
│   │   │   │   │   │   ├── views/                          # Access-control screen composition
│   │   │   │   │   │   │   └── AccessControlView.tsx
│   │   │   │   │   │   │
│   │   │   │   │   │   └── index.ts                        # Public module exports
│   │   │   │   │   |
│   │   │   │   │   ├── Configuration                       # System configuration feature
│   │   │   │   │   |   └── ...
│   │   │   │   │   └── System Logs                         # System log management feature
│   │   │   │   │       └── ...
│   │   │   │   │   
│   │   │   │   └── feature-1/                              # Example business feature module
│   │   │   │       ├── components/                         # Feature-specific UI components
│   │   │   │       ├── hooks/                              # Feature hooks/query logic
│   │   │   │       ├── services/                           # Feature API requests
│   │   │   │       ├── schemas/                            # Frontend-only validation schemas
│   │   │   │       ├── types/                              # Frontend-only feature types
│   │   │   │       ├── views/                              # Feature screen compositions
│   │   │   │       └── index.ts                            # Public module exports
│   │   │   │        
│   │   │   ├── components/                                 # Reusable application components
│   │   │   │   ├── ui/                                     # Primitive reusable UI components
│   │   │   │   │   ├── button.tsx 
│   │   │   │   │   ├── card.tsx 
│   │   │   │   │   └── input.tsx 
│   │   │   │   |
│   │   │   │   ├── layout/                                 # Application shell components
│   │   │   │   │   ├── Header.tsx                          # Global application header
│   │   │   │   │   ├── Sidebar.tsx                         # Global application sidebar
│   │   │   │   │   └── Footer.tsx                          # Global application footer
│   │   │   │   |
│   │   │   │   ├── guards/                                 # Frontend authorization guards
│   │   │   │   │   ├── PermissionGuard.tsx                 # Restricts UI actions by permission
│   │   │   │   │   └── RoleGuard.tsx                       # Restricts page/module access by role
│   │   │   │   |   
│   │   │   │   └── common/                                 # Shared composite components
│   │   │   │       ├── LoadingScreen.tsx                   # Reusable loading display
│   │   │   │       ├── ModalHeader.tsx                     # Reusable modal container
│   │   │   │       └── TableComponent/                     # Reusable table component
│   │   │   │           ├── index.ts                        # Barrel exports for table components and types
│   │   │   │           ├── table.types.ts                  # Shared table types and interfaces
│   │   │   │           ├── RowsPerPageSelector.tsx         # Rows-per-page selection control
│   │   │   │           ├── Table.tsx                       # Main reusable table component
│   │   │   │           ├── TableBody.tsx                   # Table body and row rendering
│   │   │   │           ├── TableEmpty.tsx                  # Empty-state display
│   │   │   │           ├── TableHeader.tsx                 # Table header and column rendering
│   │   │   │           ├── TableLoading.tsx                # Table loading state
│   │   │   │           └── TablePagination.tsx             # Pagination controls
│   │   │   │
│   │   │   ├── config/                                     # Frontend application configuration
│   │   │   │   ├── env.ts                                  # Validates environment variables
│   │   │   │   ├── app.config.ts                           # Application metadata/settings
│   │   │   │   └── navigation.config.ts                    # Navigation/menu definitions
│   │   │   │
│   │   │   ├── hooks/                                      # Application-wide React hooks
│   │   │   │   ├── useDebounce.ts                          # Debounces rapidly changing values
│   │   │   │   └── useDisclosure.ts                        # Manages open/closed UI state
│   │   │   │   
│   │   │   ├── providers/                                  # Global React providers
│   │   │   │   ├── AppProvider.tsx                         # Composes application providers
│   │   │   │   ├── QueryProvider.tsx                       # Configures TanStack Query
│   │   │   │   ├── SocketProvider.tsx                      # Provides socket connection
│   │   │   │   └── ThemeProvider.tsx                       # Provides application theme  
│   │   │   │
│   │   │   └── lib/                                        # Infrastructure/library integrations
│   │   │   |   ├── api/                
│   │   │   |   |   └── api-client.ts                       # Configured HTTP/API client
│   │   │   |   ├── socket/
│   │   │   |   |   └── socket-client.ts                    # Configured Socket.IO client
│   │   │   |   ├── alerts/
│   │   │   |   |   └── alert.ts                            # Application alert helpers
│   │   │   |   └── toast/                                  # Toast notification infrastructure
│   │   │   |       ├── app-toast.tsx
│   │   │   |       ├── index.ts
│   │   │   |       ├── toast-icons.tsx
│   │   │   |       └── toast.types.ts
│   │   │   │
│   │   │   ├── utils/                                      # Pure reusable utility functions
│   │   │   │   ├── cn.ts                                   # Combines conditional class names
│   │   │   │   ├── format-date.ts                          # Date formatting helpers
│   │   │   │   └── format-currency.ts                      # Currency formatting helpers
│   │   │   │   
│   │   │   ├── constants/                                  # Frontend constant values
│   │   │   │   └── route.constants.ts                      # Centralized frontend route paths
│   │   │   │   
│   │   │   └── types/                                      # Application-wide frontend types
│   │   │       ├── navigation.types.ts                     # Navigation-related types
│   │   │       └── pagination.types.ts                     # Frontend pagination types        
│   │   │
│   │   ├── public/                                         # Static assets served directly by Next.js
│   │   │   ├── images/                                     # Public images and graphics
│   │   │   ├── files/                                      # General downloadable/static files
|   |   |   └── documents/                                  # Public document assets (PDFs, forms, etc.)
│   │   │
│   │   ├── bones/                                          # Boneyard.js skeleton definitions and registry
│   │   │   ├── admin-access-control.bones.json             # Access Control page skeleton configuration
│   │   │   ├── admin-dashboard.bones.json                  # Admin Dashboard page skeleton configuration
│   │   │   └── registry.ts                                 # Registers Boneyard skeleton definitions
│   │   │
│   |   ├── .env                                            # Local environment variables and secrets
│   |   ├── .env.example                                    # Documents required environment variables without secrets
│   │   ├── boneyard.config.json                            # Boneyard.js configuration
│   │   ├── next.config.ts                                  # Next.js application configuration
│   │   ├── package.json                                    # Frontend dependencies and pnpm scripts
│   │   └── tsconfig.json                                   # Frontend TypeScript configuration
│   │
│   └── api/                                                # Express backend application
│       │
│       ├── prisma/                                         # Database schema and data management
│       │   ├── schema.prisma                               # Prisma database schema
│       │   ├── migrations/                                 # Database migration history
│       │   ├── seed.ts                                     # Main database seeding entry point
|       |   |
|       |   ├── factories/                                  # Generates fake/test data
│       │   |   ├── user.factory.ts
│       │   |   └── index.ts
|       |   |
│       │   └── seeders/                                    # Seeds required/initial application data
│       │       ├── user.seeder.ts
│       │       ├── role.seeder.ts
│       │       ├── permission.seeder.ts
│       │       └── index.ts
|       |
│       ├── logs/                                           # Application-generated log files
│       │   ├── app.log                                     # General application logs
│       │   ├── error.log                                   # Error-level logs
│       │   └── .gitkeep
│       │
│       ├── src/
│       │   │
│       │   ├── server.ts                                   # Starts the HTTP server
│       │   ├── app.ts                                      # Configures the Express application
│       │   │
│       │   ├── config/                                     # Backend application configuration
│       │   │   ├── auth.config.ts                          # Authentication configuration
│       │   │   ├── cors.config.ts                          # CORS configuration
│       │   │   ├── env.ts                                  # Environment validation/configuration
│       │   │   ├── jwt.config.ts                           # JWT configuration
│       │   │   ├── socket.config.ts                        # Socket.IO configuration
|       |   |   └── logger.config.ts                        # Logging configuration
│       │   │
│       │   ├── lib/                                        # Backend infrastructure integrations
│       │   │   ├── logger/
│       │   │   │   └── logger.ts                           # Configured application logger
│       │   │   ├── http/
│       │   │   │   └── response.ts                         # Standard API response helpers
│       │   │   └── database/
│       │   │       └── prisma.ts                           # Prisma client instance
|       |   |
│       │   ├── modules/                                    # Backend business feature modules
│       │   │   │
│       │   │   ├── auth/                                   # Authentication domain
│       │   │   │   ├── auth.routes.ts                      # Defines authentication endpoints
│       │   │   │   ├── auth.controller.ts                  # Handles HTTP request/response flow
│       │   │   │   ├── auth.service.ts                     # Authentication business logic
│       │   │   │   ├── auth.repository.ts                  # Authentication database operations
│       │   │   │   ├── auth.mapper.ts                      # Converts database models to API models
│       │   │   │   ├── auth.types.ts                       # Backend-only authentication types
|       |   |   |   ├── auth.service.test.ts                # Authentication service unit tests
│       │   │   │   │
│       │   │   |   └── internal/                           # Private authentication implementation
|       |   |   |       ├── password.service.ts             # Password hashing/verification
│       │   │   │       └── token.service.ts                # Token generation/verification
│       │   │   │
│       │   │   ├── access-control/                         # User, role, permission management
│       │   │   │   ├── access-control.routes.ts            # Defines access-control endpoints
│       │   │   │   ├── access-control.controller.ts        # Handles HTTP request/response flow
│       │   │   │   ├── access-control.repository.ts        # Access-control database operations
│       │   │   │   ├── access-control.service.ts           # Access-control business logic
│       │   │   │   ├── access-control.mapper.ts            # Converts persistence data to API models
│       │   │   │   ├── access-control.schema.ts            # Backend-only request validation
│       │   │   │   └── access-control.types.ts             # Backend-only types
│       │   │   │
│       │   │   └── feature-3/
│       │   │       ├── feature-3.routes.ts
│       │   │       ├── feature-3.controller.ts
│       │   │       ├── feature-3.service.ts
│       │   │       ├── feature-3.repository.ts
│       │   │       ├── feature-3.schema.ts
│       │   │       └── feature-3.types.ts
│       │   │
│       │   ├── routes/
│       │   │   └── index.ts
│       │   │
│       │   ├── middleware/                                 # Cross-cutting HTTP middleware
│       │   │   ├── authenticate.middleware.ts              # Verifies authenticated requests
│       │   │   ├── authorize.middleware.ts                 # Enforces roles and permissions (RBAC & PBAC)
│       │   │   ├── validate.middleware.ts                  # Validates request data against schemas
|       |   |   ├── request-logger.middleware.ts            # Logs HTTP request/response activity
│       │   │   ├── error-handler.middleware.ts             # Converts errors into standard responses
│       │   │   └── not-found.middleware.ts                 # Handles unknown API routes       
│       │   │
│       │   ├── socket/                                     # Real-time communication infrastructure
│       │   │   ├── index.ts                                # Initializes Socket.IO 
│       │   │   ├── socket-auth.ts                          # Authenticates socket connections
│       │   │   ├── socket.types.ts.ts                      # Socket.IO-specific backend types
│       │   │   ├── handlers/
│       │   │   │   └── notification.handler.ts             # Handles client-to-server notification events
│       │   │   └── emitters/
│       │   │       └── user.emitter.ts                     # Emits server-to-client user events
│       │   │
│       │   ├── errors/                                     # Application error definitions
│       │   │   ├── app-error.ts                            # Custom operational error class
│       │   │   └── error-codes.ts                          # Standard application error codes
│       │   │
│       │   └── types/
│       │       └── express.d.ts                            # Extends Express TypeScript definitions
│       │
│       ├── .env                                            # Local environment variables and secrets
│       ├── .env.example                                    # Documents required environment variables without secrets
│       ├── package.json                                    # Backend dependencies and pnpm scripts
|       ├── prisma.config.ts                                # Prisma CLI, schema, migration, and datasource configuration
│       └── tsconfig.json                                   # Backend TypeScript compiler configuration
│
├── packages/
│   │
│   ├── shared/                                             # Contracts shared by frontend and backend
│   │   ├── src/
│   │   │   ├── schemas/                                    # Shared validation/data schemas
│   |   │   |   ├── auth/
│   |   │   │   |   └── auth.schema.ts
│   |   │   |   ├── admin/
│   |   │   │   |   └── access-control/
│   |   │   |   |       ├── user.schema.ts
│   |   │   |   |       ├── role.schema.ts
│   |   │   │   |       └── permission.schema.ts
|   |   |   |   |
│   |   │   │   └── index.ts                                # Public schema exports 
|   |   |   |
│   │   │   ├── types/                                      # Shared TypeScript contracts
|   |   |   |   ├── pagination.types.ts
│   |   │   |   ├── auth/
│   |   │   │   |   └── auth.types.ts
│   |   │   │   └── index.ts                                # Public type exports
│   |   │   │
│   │   │   ├── socket/                                      # Shared event contracts
|   |   |   |   ├── notification.events.ts
│   |   │   |   ├── admin/
│   |   │   │   |   └── role.events.ts
│   |   │   │   └── index.ts                                # Public type exports
|   |   |   |   
│   │   │   ├── constants/                                  # Constants needed by both applications
│   |   │   │   └── index.ts
│   │   │   ├── enums/                                      # Enums needed by both applications
│   |   │   │   └── index.ts
│   │   │   └── index.ts                                    # Public @repo/shared API
|   |   |   
│   │   ├── package.json                                    # Shared package dependencies, scripts, and exports
│   │   └── tsconfig.json                                   # Shared package TypeScript configuration
│   │
│   ├── eslint-config/                                      # Shared ESLint configuration for workspace apps/packages
│   │   └── package.json                                    # ESLint config package definition and dependencies
│   │
│   └── typescript-config/                                  # Shared TypeScript configurations for workspace projects
│       └── package.json                                    # TypeScript config package definition and exports
│
├── package.json                                            # Root workspace dependencies and monorepo scripts
├── pnpm-workspace.yaml                                     # Defines pnpm workspace packages
├── README.md                                               # Project architecture, setup, and development documentation
├── pnpm-lock.yaml                                          # Locks exact dependency versions across the workspace
├── tsconfig.json                                           # Root TypeScript configuration
└── .gitignore                                              # Defines files and directories excluded from Git



                     WORKSPACE
                         │
             ┌───────────┴───────────┐
             │                       │
          apps/                  packages/
             │                       │
      ┌──────┴───────┐             shared
      │              │                 │
     web            api        ┌──────┼──────┐
      │              │         │      │      │
  Next.js         Express   schemas  types  enums
      │              │
  ┌───┴───┐       modules
  │       │          │
app/    modules/  feature
routes    │          │
          │        routes
      feature    controller
          │          ↓
      components  service
      hooks          ↓
      services   repository
      schemas        ↓
      types        Prisma
      views          ↓
                  PostgreSQL