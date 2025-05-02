# Project Itinerary Order

1. **Set up your environment**
   - Copy `.env.EXAMPLE` to `.env` and populate with DB credentials and JWT secret.

2. **Implement authentication middleware**
   - Complete the `authenticateToken` function in `server/src/middleware/auth.ts`.

3. **Finish the server’s login route**
   - Flesh out the login handler in `server/src/routes/auth-routes.ts` to validate credentials and issue JWTs.

4. **Protect API routes**
   - Apply the `authenticateToken` middleware to the routes in `server/src/routes/index.ts`.

5. **Build out the client login flow**
   - Implement the `login` function in `client/src/api/authAPI.tsx` and complete the methods in `client/src/utils/auth.ts` to store and attach the JWT.

6. **Create the Login UI**
   - Develop the React login page: handle form inputs, call the login API, store the token on success, redirect to the board, and display errors on failure.
