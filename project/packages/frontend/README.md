# BC Cancer Frontend

## TODO

- [x] Setup Tailwind & shadcn UI
- [x] Routing
  - [x] React Router setup
  - [x] separate auth stack and app stack
- [x] Scaffold basic UI for each page
  - [x] Login
  - [x] Event
  - [x] Create Event
  - [x] Event Detail
- [x] Communicate with backend
  - [x] React Query
  - [ ] Refactor queries and mutations
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
    - [x] reuse for updating event
    - [ ] add admins
  - [x] Event detail
    - [x] Donor table
      - [x] Status tab
      - [x] Row actions
        - [x] Exclude
        - [x] Invite
        - [x] Patch status
      - [x] Pagination
      - [x] Sorting
      - [x] Filtering
      - [x] Column visibility
      - [ ] Global search & category filter
    - [ ] Change history

## Components for Future Reusability

- User Avatar

  - `./src/pages/creat-event.tsx`: Right side of the header on the create-event page
