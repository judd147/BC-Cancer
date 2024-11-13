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
- [x] Communicate with backend
  - [x] React Query
- [x] Implement functionality
  - [x] Login with username/password
  - [x] Event table
    - [x] Row actions
      - [ ] Edit
      - [x] Delete
    - [x] Pagination
    - [x] Sorting
    - [x] Filtering
  - [x] Create new event
    - [x] filter by city & limit
    - [ ] reuse for updating event
    - [ ] add admins
  - [x] Event detail
    - [ ] Donor table
      - [ ] Status tab
      - [ ] Row actions
        - [ ] Exclude
        - [ ] Invite
      - [x] Pagination
      - [x] Sorting
      - [x] Filtering
      - [x] Column visibility
    - [ ] Change history

## Components for Future Reusability

- User Avatar

  - `./src/pages/creat-event.tsx`: Right side of the header on the create-event page
