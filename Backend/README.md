                    FRONTEND (React)
                          │
            HTTP Request (login/register/get-me)
                          │
                          ▼
                  server.js (starts server)
                          │
                          ▼
                     app.js (configures app)
                          │
                          ▼
                     auth.routes.js
                          │
               chooses which controller
                          ▼
                auth.controller.js
                          │
          ┌───────────────┴────────────────┐
          ▼                                ▼
   user.model.js                  auth.middleware.js
          │                                │
          ▼                                ▼
      MongoDB                      JWT Verification





server.js → Opens the company.
app.js → Sets company rules.
routes → Receptionist.
controllers → Employees.
models → Database manager.
middleware → Security guard.
database.js → Connects to the warehouse (MongoDB).



Register
↓

Hash Password
↓

Save User
↓

Generate JWT
↓

Store Cookie
──────────────

Login
↓

Verify Password
↓

Generate JWT
↓

Store Cookie
──────────────

Refresh
↓

Cookie
↓

Middleware
↓

Verify JWT
↓

req.user
↓

getMe
──────────────

Logout
↓

Blacklist Token
↓

Clear Cookie
──────────────

Future Requests
↓

Blacklist Check
↓

Reject Old Token