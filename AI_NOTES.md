# AI_NOTES.md

## Which AI tools I used, and how work was split

During the development of this project, I primarily used ChatGPT (GPT-5.5) and Claude Sonnet (Chat Based) as an engineering assistant throughout the development process — for planning the architecture, debugging the Discord integration, and
scaffolding the React frontend components.

Roughly how it split: Claude handled architecture decisions, 
and walked through debugging step by step when something
broke. I did the actual typing into my project, ran everything locally, set up
the Discord Developer Portal and Supabase myself, tested each piece in a real
Discord server, and made the final call on trade-offs when there was a choice
to make. 

AI was used to:
- Brainstorm the overall architecture.
- Explain Discord Interactions and Slash Commands.
- Review Sequelize model relationships.
- Debug backend and frontend issues.
- Improve React component structure.
- Suggest API designs.
- Review deployment and production readiness.


The implementation, integration, testing, and debugging were completed by me

### I implemented

- Overall backend architecture
- Express routes and controllers
- Sequelize models and associations
- PostgreSQL database design
- Authentication and JWT flow
- Discord interaction handling
- Rule matching logic
- Webhook integration
- React dashboard
- CRUD operations
- Deployment on Render
- Database hosting on Supabase
- Testing and debugging

### AI assisted with

- Explaining Discord API concepts
- Reviewing code structure
- Finding bugs in Sequelize associations
- React UI improvements
- Production deployment suggestions
- Migration strategy discussion
- Best practices for project organization

## Key decisions I made myself, and why

### 1. Rule-based architecture

Instead of hardcoding responses inside the interaction handler, I created a configurable Rules table.

This allows administrators to create, edit, and remove rules directly from the dashboard without modifying backend code.

### 2. Separate Service Layer

I kept controllers thin and moved business logic into service files.

Benefits:

- Better separation of concerns
- Easier testing
- Reusable logic
- Cleaner controllers

### 3. Database Design

I designed the database using separate entities:

- Admin
- Server
- Rules
- CommandLog
ach server has isolated configuration, enabling multi-server support while maintaining clear relationships between entities.


## Hardest Bug

The most difficult issue involved Sequelize associations between Rules and CommandLog.

Initially, eager loading failed with the error:

```
Rules is associated to CommandLog using an alias.
You must use the 'as' keyword.
```

After fixing the alias, adding the foreign key caused another issue because existing CommandLog records referenced rule IDs that no longer existed.

I diagnosed the problem by inspecting the database constraints and model associations.

The solution involved:

- Correcting the association alias
- Using the correct foreign key (`matchedRuleId`)
- Cleaning invalid database records
- Updating include statements to use the alias

This reinforced the importance of keeping Sequelize associations and database schema synchronized.

## What I Would Improve

Given more time, I would implement:

- Better Ui Design 
- Implement dark mode
- Database migrations using Umzug instead of relying on schema synchronization.
- An AI summarization step on /report text, using a free-tier model
- Retry queue for failed webhook deliveries.
- Real-time dashboard updates using WebSockets.
- Unit and integration tests.
- Rate limiting and request throttling.
- Audit logging improvements.
- AI-powered report summarization and categorization.
- Docker support for easier deployment.

## Overall Reflection

AI significantly accelerated development by providing explanations, reviewing implementation approaches, and helping debug difficult issues. However, all architectural decisions, integrations, debugging, and production fixes required manual verification and implementation. I treated AI as a development assistant rather than an automated code generator, validating each suggestion before incorporating it into the project.
