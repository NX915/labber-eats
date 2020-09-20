# App Routes

| HTTP method | URL pattern | Use |
|---|---|---|
| GET   | /                   | Shows full menu of restaurant |
| GET   | /items              | Return JSON with menu items |
| POST  | /orders             | Submit order |
| GET   | /control            | See all orders (restaurant side) |
| GET   | /orders             | Return JSON with active orders (populates both columns) | 
| POST  | /orders/:id         | confirm order |
| POST  | /orders/:id/decline | decline order|
| POST  | /orders/:id/delete  | Archive orders that were fufilled |
