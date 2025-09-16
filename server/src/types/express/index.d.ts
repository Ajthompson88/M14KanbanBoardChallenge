// server/src/types/express/index.d.ts
import 'express-serve-static-core';

declare global {
  namespace Express {
    /** Authenticated user payload attached by your auth middleware */
    interface AuthUser {
      id: number;
      email: string;
      username: string;
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
