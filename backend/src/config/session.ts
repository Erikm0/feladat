import session from "express-session";

export const sessionMiddleware = session({
    secret: "dev_titok",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
    },
});
