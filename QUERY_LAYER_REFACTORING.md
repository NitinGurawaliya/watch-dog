# Query Layer Refactoring Summary

## Overview
This document summarizes the creation of a dedicated query layer to abstract all database logic from the API routes, improving code organization, reusability, and maintainability.

## Architecture Changes

### 1. Created Query Layer Structure
```
queries/
├── index.ts          # Export all query classes
├── user.ts           # User-related database operations
├── project.ts        # Project-related database operations
└── event.ts          # Event-related database operations
```

### 2. Created Database Interfaces
```
interfaces/
├── api.ts            # API-related interfaces
└── database.ts       # Database-related interfaces
```

## Query Classes

### UserQueries (`queries/user.ts`)
**Purpose**: Handle all user-related database operations

**Key Methods**:
- `findById(id)` - Find user by ID
- `findByEmail(email)` - Find user by email
- `findMany(filters, options)` - Find users with filters
- `findWithProjects(userId)` - Find user with their projects
- `create(userData)` - Create new user
- `update(id, userData)` - Update user
- `delete(id)` - Delete user
- `updateEmailVerification(email, verified)` - Update email verification status
- `exists(id)` - Check if user exists
- `count(filters)` - Get user count

### ProjectQueries (`queries/project.ts`)
**Purpose**: Handle all project-related database operations

**Key Methods**:
- `findById(id)` - Find project by ID
- `findByIdAndUser(id, userId)` - Find project with user verification
- `findMany(filters, options)` - Find projects with filters
- `findByUserId(userId)` - Find projects by user ID
- `findWithEvents(projectId)` - Find project with events
- `create(projectData)` - Create new project
- `update(id, projectData)` - Update project
- `delete(id)` - Delete project
- `exists(id)` - Check if project exists
- `belongsToUser(projectId, userId)` - Check project ownership
- `count(filters)` - Get project count
- `countByUser(userId)` - Get project count by user

### EventQueries (`queries/event.ts`)
**Purpose**: Handle all event-related database operations and analytics

**Key Methods**:
- `findById(id)` - Find event by ID
- `findMany(filters, options)` - Find events with filters
- `findByProjectId(projectId, options)` - Find events by project
- `findRecentEvents(projectId, minutesAgo)` - Find recent events
- `findInTimeRange(projectId, startDate, endDate)` - Find events in time range
- `findRecentBySession(projectId, sessionId, minutesAgo)` - Find recent event by session
- `create(eventData)` - Create new event
- `update(id, eventData)` - Update event
- `delete(id)` - Delete event
- `getRealtimeStats(projectId, minutesAgo)` - Get real-time visitor stats
- `getDailyStats(projectId, days)` - Get daily visitor stats
- `getCountryStats(projectId, days)` - Get country-based stats
- `getReferrerStats(projectId, days)` - Get referrer-based stats
- `count(filters)` - Get event count
- `countByProject(projectId)` - Get event count by project

## Database Interfaces (`interfaces/database.ts`)

### Base Interfaces
- `DatabaseUser` - User model interface
- `DatabaseProject` - Project model interface
- `DatabaseEvent` - Event model interface

### Query Result Interfaces
- `UserWithProjects` - User with related projects
- `ProjectWithEvents` - Project with related events
- `EventWithProject` - Event with related project

### Filter Interfaces
- `UserFilters` - User query filters
- `ProjectFilters` - Project query filters
- `EventFilters` - Event query filters

### Query Options Interfaces
- `QueryOptions` - General query options
- `PaginationOptions` - Pagination options
- `StatsQueryOptions` - Statistics query options

### Analytics Result Interfaces
- `VisitorStats` - Visitor statistics
- `DailyStats` - Daily visitor stats
- `CountryStats` - Country-based stats
- `ReferrerStats` - Referrer-based stats
- `PageStats` - Page-based stats
- `RealtimeStats` - Real-time visitor stats

### Operation Result Interfaces
- `CreateResult<T>` - Create operation result
- `UpdateResult<T>` - Update operation result
- `DeleteResult` - Delete operation result
- `QueryResult<T>` - Query operation result

## Updated API Routes

### Project Routes
- **`app/api/project/route.ts`**: Uses `ProjectQueries.create()` and `ProjectQueries.findByUserId()`
- **`app/api/project/[id]/route.ts`**: Uses `ProjectQueries.delete()`

### Tracking Route
- **`app/api/track/route.ts`**: Uses `ProjectQueries.findById()`, `EventQueries.findRecentBySession()`, `EventQueries.create()`, and `EventQueries.update()`

### Stats Routes
- **`app/api/stats/project/[id]/realtime/route.ts`**: Uses `EventQueries.getRealtimeStats()`
- **`app/api/stats/project/[id]/7days/route.ts`**: Uses `EventQueries.getDailyStats()`
- **`app/api/stats/project/[id]/countries/route.ts`**: Uses `EventQueries.getCountryStats()`
- **`app/api/stats/project/[id]/referrers/route.ts`**: Uses `EventQueries.getReferrerStats()`

### Payment Route
- **`app/api/stripe/checkout/route.ts`**: Uses `UserQueries.findByEmail()`

### Real-time Route
- **`app/api/realtime/route.ts`**: Uses utility functions that leverage the query layer

## Updated Utility Functions

### API Utils (`lib/api-utils.ts`)
- **`verifyProjectOwnership()`**: Now uses `ProjectQueries.findByIdAndUser()`
- Removed direct Prisma imports
- All database operations now go through the query layer

## Benefits of Query Layer

### 1. **Separation of Concerns**
- Database logic is separated from API route logic
- Each query class handles a specific domain
- Clear responsibility boundaries

### 2. **Code Reusability**
- Query methods can be reused across different API routes
- Common database operations are centralized
- Reduced code duplication

### 3. **Type Safety**
- Strong typing for all database operations
- Consistent return types with success/error handling
- Better IDE support and error detection

### 4. **Maintainability**
- Single source of truth for database operations
- Easier to update database logic
- Consistent error handling patterns

### 5. **Testability**
- Query classes can be easily unit tested
- Mock database operations for testing
- Isolated business logic

### 6. **Performance**
- Optimized queries with proper indexing
- Reusable query patterns
- Efficient data fetching strategies

## Usage Examples

### Before Query Layer
```typescript
// Direct Prisma calls in API routes
const project = await prisma.project.findFirst({
  where: {
    id: projectId,
    userId: user.id,
  },
});

const events = await prisma.event.findMany({
  where: {
    projectId,
    timestamp: {
      gte: oneMinuteAgo,
    },
  },
  orderBy: { timestamp: 'desc' },
});
```

### After Query Layer
```typescript
// Using query classes
const projectResult = await ProjectQueries.findByIdAndUser(projectId, user.id);
if (!projectResult.success || !projectResult.data) {
  throw new Error('Project not found');
}

const statsResult = await EventQueries.getRealtimeStats(projectId, 1);
if (!statsResult.success) {
  throw new Error('Failed to get stats');
}
```

## Error Handling

All query methods return consistent result objects:
```typescript
interface QueryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}
```

This ensures:
- Consistent error handling across the application
- Type-safe error responses
- Easy error propagation

## Next Steps

1. **Add Caching Layer**: Implement Redis caching for frequently accessed data
2. **Add Query Optimization**: Implement query optimization strategies
3. **Add Database Migrations**: Create migration scripts for schema changes
4. **Add Query Logging**: Implement query performance monitoring
5. **Add Connection Pooling**: Optimize database connection management

## Files Created/Modified

### New Files
- `interfaces/database.ts` - Database-related interfaces
- `queries/index.ts` - Query layer exports
- `queries/user.ts` - User query operations
- `queries/project.ts` - Project query operations
- `queries/event.ts` - Event query operations
- `QUERY_LAYER_REFACTORING.md` - This documentation

### Modified Files
- `lib/api-utils.ts` - Updated to use query layer
- `app/api/project/route.ts` - Updated to use ProjectQueries
- `app/api/project/[id]/route.ts` - Updated to use ProjectQueries
- `app/api/track/route.ts` - Updated to use EventQueries and ProjectQueries
- `app/api/stats/project/[id]/realtime/route.ts` - Updated to use EventQueries
- `app/api/stats/project/[id]/7days/route.ts` - Updated to use EventQueries
- `app/api/stats/project/[id]/countries/route.ts` - Updated to use EventQueries
- `app/api/stats/project/[id]/referrers/route.ts` - Updated to use EventQueries
- `app/api/stripe/checkout/route.ts` - Updated to use UserQueries
- `app/api/realtime/route.ts` - Updated to use utility functions

This query layer refactoring establishes a robust foundation for scalable database operations and clean API architecture. 