# BC Cancer Frontend

## TODO

- [x] Setup Tailwind & shadcn UI
- [x] Routing
  - [x] React Router setup
  - [x] separate auth stack and app stack (display username after login)
- [x] Scaffold basic UI for each page
  - [x] Login
  - [x] Event
  - [x] Create Event
  - [x] Event Detail
- [ ] Communicate with backend
  - [ ] React Query
- [ ] Implement functionality
  - [x] Login with username/password
  - [ ] Event table
    - [ ] Row actions
    - [ ] Pagination
    - [ ] Sorting
    - [ ] Filtering
  - [x] Create new event
    - [ ] filter by city & limit
    - [ ] reuse for updating event
    - [ ] add admins
  - [ ] Event detail donor table
    - [ ] Status management
    - [ ] Row actions
    - [ ] Pagination
    - [ ] Sorting
    - [ ] Filtering
    - [ ] Column visibility

## Components for Future Reusability

- User Avatar

  - `./src/pages/creat-event.tsx`: Right side of the header on the create-event page
