# Bug Reporter

## Project Overview
The Bug Reporter is a comprehensive web application for tracking and managing software bugs. It allows users to report bugs, comment on them, and vote on both bugs and comments. The system includes user authentication, moderation capabilities, and a scoring system based on user contributions.

## Current State of the Project

### Implemented Features
1. **User Management**
   - User registration with encrypted passwords
   - User authentication
   - User profile management (update, delete)

2. **Bug Management**
   - Creating bug reports with title, description, image URL, and status
   - Updating and deleting bugs (only by authors)
   - Viewing all bugs and filtering by ID

3. **Comment System**
   - Adding comments to bugs
   - Editing and deleting comments (only by authors)
   - Viewing all comments for a bug

4. **Entity Relationships**
   - Proper associations between users, bugs, comments, and tags
   - Cascading deletions to maintain data integrity

### Pending Features
1. **Tag System**
   - Entity exists but controller and service for tag management are not implemented
   - Bug filtering by tags not implemented

2. **Voting System**
   - Entity exists but controller and service for voting are not implemented
   - Vote counting functionality not fully implemented

3. **User Scoring System**
   - Score field exists in User entity but calculation logic not implemented

4. **Moderation Features**
   - User ban/unban functionality partially implemented
   - No email/SMS notifications for banned users

5. **Front-end Integration**
   - No front-end code is present in the current project state

## Tech Stack
- **Backend**: Java with Spring Boot (v3.4.3)
- **Database**: PostgreSQL
- **Security**: Spring Security with BCrypt password encryption
- **API**: RESTful endpoints
- **Testing**: JUnit for unit and integration tests
- **Build Tool**: Maven

## Database Schema
The database has the following main entities:
- **Users**: User accounts with authentication and role information
- **Bug**: Bug reports with details and status
- **Comment**: User comments on bugs
- **Tag**: Categories for bugs
- **Vote**: User votes on bugs and comments
- **BugTag**: Junction table for many-to-many relationship between bugs and tags

## Project Architecture
The project follows a layered architecture pattern:
1. **Controller Layer**: Handles HTTP requests and responses
2. **Service Layer**: Contains business logic
3. **Repository Layer**: Data access layer using Spring Data JPA
4. **Entity Layer**: JPA entity classes representing database tables

## Setup and Installation

### Prerequisites
- Java 23
- PostgreSQL
- Maven

### Database Setup
1. Create a PostgreSQL database named "breport"
2. Run the SQL script in `script.sql` to create the necessary tables

### Configuration
The application is configured to connect to a PostgreSQL database with these settings:
- URL: `jdbc:postgresql://localhost:5432/breport`
- Username: `postgres`
- Password: `admin`

You can modify these settings in `application.properties` if needed.

### Building and Running
```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd BugReport

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

The application will start on port 8080.

## API Endpoints

### User Endpoints
- POST `/users/register` - Register a new user
- GET `/users/getUser/{id}` - Get user by ID
- GET `/users/getEmail/{email}` - Get user by email
- GET `/users/getAllUsers` - Get all users
- PUT `/users/updateUser/{id}` - Update user
- DELETE `/users/deleteUser/{id}` - Delete user

### Bug Endpoints
- POST `/bug/addBug` - Create a new bug
- GET `/bug/getBug/{id}` - Get bug by ID
- GET `/bug/getAllBugs` - Get all bugs
- PUT `/bug/updateBug/{id}` - Update bug
- DELETE `/bug/deleteBug/{id}` - Delete bug

### Comment Endpoints
- POST `/comment/addComment` - Add a comment
- GET `/comment/getComment/{id}` - Get comment by ID
- GET `/comment/getAllComments` - Get all comments
- PUT `/comment/editComment/{id}` - Edit a comment
- DELETE `/comment/deleteComment/{id}` - Delete a comment

## Testing
The project includes integration tests for:
- User CRUD operations
- Bug CRUD operations
- Comment CRUD operations
- Entity relationships
- Password encryption
- Email uniqueness constraint

Run tests with:
```bash
./mvnw test
```

## Development Roadmap

### Phase 1 (Current Phase)
- Complete core functionality (Users, Bugs, Comments)
- Implement testing for basic operations

### Phase 2
- Implement Tag system and filtering
- Implement Vote system with proper business logic
- Implement user score calculation

### Phase 3
- Develop moderator functionality
- Implement notification system (email/SMS)
- Develop frontend UI with Angular

## Security Notes
The application currently has security configured but most endpoints are publicly accessible. This will need to be revised for production deployment.