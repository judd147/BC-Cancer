<a id="readme-top"></a>

<!-- ABOUT -->
## About

<img src="Resources/teamlogo.jpg" alt="Team Logo" height="256" width="256" align="right">

This repository contains the source code of BC Cancer Event Data Management System for our CS5500 Software Engineering project partnered with [BC Cancer Foundation](https://bccancerfoundation.com/).

In this project, we were given virtual presentations on various pain points of donor invitation and event management in the BC Cancer fundraising process. We came up with serveral possible solutions and decided to build a dashboard that features user-friendly data tables and change history log to help streamline the process of managing donor invitations for events. For more details, please refer to our [final presentation](https://youtu.be/IOEh6w2Bd4Q) where we demonstrated the dashboard in action in front of BC Cancer representatives.

### Built With

* [NestJS](https://nestjs.com/)
* [SQLite](https://www.sqlite.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [React Router](https://reactrouter.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [shadcn/ui](https://ui.shadcn.com/)
* [TanStack Query](https://tanstack.com/query/latest)
* [TanStack Table](https://tanstack.com/table/latest)
* [React Hook Form](https://react-hook-form.com/)
* [Zod](https://zod.dev/)

<!-- GETTING STARTED -->
## Getting Started

If you want to run the project locally, you can follow these steps:

### Installation

First, you might need to install yarn on your machine.
Then navigate to `project/packages/backend` and run the following commands:
```sh
yarn install
yarn start
```
Similarly, navigate to `project/packages/frontend` and run the following commands:
```sh
yarn install
yarn dev
```

The defalut port for the frontend is 5173, and you should be able to access our application at http://localhost:5173 by now.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
<!-- ## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- ROADMAP -->
## Roadmap (frontend)

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
- [x] Implement functionality
  - [x] Login with username/password
  - [x] Logout and user avatar
  - [x] Event table
    - [x] Row actions
      - [x] Edit
      - [x] Delete
    - [x] Pagination
    - [x] Sorting
    - [x] Filtering
  - [x] Create/Edit event
    - [x] filter by city & limit
    - [x] reuse for updating event
    - [x] add admins
    - [x] add navigation to edit inside event detail
  - [x] Event detail
    - [x] Donor table
      - [x] Status tab
      - [x] Row actions
        - [x] Exclude
        - [x] Invite
        - [x] Patch status
        - [x] Document reasons for change
      - [x] Pagination
      - [x] Sorting
      - [x] Filtering
      - [x] Column visibility
      - [x] Global search
    - [x] Change history
      - [x] improve UI
      - [x] reflect reasons for change

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributors
| Image                                                                                                 | Name                                                       | Email                        |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------- |
| <img src="https://avatars.githubusercontent.com/u/126201955" alt="Jiahuan He" height="64" width="64"> | <a href="https://github.com/nakurahe">Jiahuan He</a>       | he.jiahuan@northeastern.edu  |
| <img src="https://avatars.githubusercontent.com/u/57974800" alt="Liyao Zhang" height="64" width="64"> | <a href="https://github.com/judd147">Liyao Zhang</a>       | zhang.liya@northeastern.edu  |
| <img src="https://avatars.githubusercontent.com/u/92060735" alt="Tsz Wai Tam" height="64" width="64"> | <a href="https://github.com/dtszwai">Tsz Wai Tam</a>       | tam.ts@northeastern.edu      |
| <img src="https://avatars.githubusercontent.com/u/156369896" alt="Yuxin Wang" height="64" width="64"> | <a href="https://github.com/YuxinWang-Nora">Yuxin Wang</a> | wang.yuxin5@northeastern.edu |
| <img src="https://avatars.githubusercontent.com/u/144647060?v=4" alt="Harshil Chudasama" height="64" width="64"> | <a href="https://github.com/xojoyboy">Harshil Chudasama</a> | chudasama.h@northeastern.edu |