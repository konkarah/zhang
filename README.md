# Members API Backend

This project is an Express.js backend with SQLite for managing members.

## Features
- Full CRUD for `/api/members`
- Filtering by country, membership_tier, status (individually or combined)
- Statistics endpoint: `/api/members/stats`
- Input validation and error handling

## Endpoints
- `POST /api/members` — Create member
- `GET /api/members` — List members (with filters)
- `GET /api/members/:id` — Get member by ID
- `PUT /api/members/:id` — Update member
- `DELETE /api/members/:id` — Delete member
- `GET /api/members/stats` — Get statistics

## Filtering
You can filter by `country`, `membership_tier`, and `status` using query parameters (e.g. `/api/members?country=USA&status=active`).

## Setup
1. Install dependencies: `npm install`
2. Start the server: `node index.js`

## Database
- SQLite database file: `members.db` (auto-created)

## Validation
- Uses Joi for input validation.

---

For more details, see the code in `index.js`, `db.js`, and `validation.js`.
