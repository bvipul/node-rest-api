# node-rest-api
Node Rest API

# Installation

1. `npm install` - Install all dependency
2. Start mongo server
3. Change the mongo connection url in db.js
4. Seed Organization - `node seed-org.js`
5. Run the Server - `node server.js`

# APIs

## /api/auth/register - Register a new User and get token
## /api/auth/login - Login with email and password and get token
## /api/auth/me - profile

### When creating a new user, change the organization Object ID in register body