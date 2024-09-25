## Part 1: Understanding Design Patterns
### Identify and document at least three design patterns used in the client-server architecture.  

1. **Singleton** for managing single instances of services.  
**No, this application did not implement** [the Singleton Design Pattern](https://www.geeksforgeeks.org/singleton-design-pattern/). The definition and key components of Singleton Design Pattern is:
    - **Definition**: Singleton design pattern ensures a class only has one instance, and provides a global point of access to it.
    - **Key components**:
      1. Static Instance Variable.
      2. Private Constructor.
      3. Static Method to Get the Instance.

    Since in all reachable files, either the instances are initialized directly, or the constructor of that object is not private, we acknowledge that **this application did not implement the Singleton Design Pattern**.
2. **Observer** or **Publisher-Subscriber** for handling real-time communication between the client and server.  
**Yes, this application implemented** [the Observer Design Pattern](https://www.geeksforgeeks.org/observer-pattern-set-1-introduction/). The definition and key components of Observer Design Pattern is:
    - **Definition**: The Observer Design Pattern is a behavioral design pattern that defines a one-to-many dependency between objects so that when one object (the subject) changes state, all its dependents (observers) are notified and updated automatically.
    - **Key components**:
      1. Subject: The `SpreadSheetController` class acts as the subject that maintains the state of the spreadsheet and notifies the contributing users of changes., which are implemented by the following snippets.
          - Maintain a list of observers:
            ```
            private _contributingUsers: Map<string, ContributingUser> = new Map<string, ContributingUser>();
            private _cellsBeingEdited: Map<string, string> = new Map<string, string>();
            ```
          - Notify observers of changes:  
          The methods `requestViewAccess`, `requestEditAccess`, `releaseEditAccess`, `addToken`, `addCell`, `removeToken`, and `clearFormula` manage the state of the spreadsheet and notify the contributing users of changes.
      2. Observer(s): The contributing users (`ContributingUser` instances) act as observers that are notified of changes in the spreadsheet. The specific implementations are as follows:
          - Update and notify changes:  
          The methods `addToken`, `addCell`, `removeToken`, and `clearFormula` update the spreadsheet and notify the system of changes by calling evaluateSheet.

    In conclusion, the `SpreadSheetController` class in `SpreadSheetController.ts` implements the **Observer design pattern**, since it maintains a list of contributing users (observers), notifies them of changes to the spreadsheet (subject), and implemented methods that manage user access and update the spreadsheet, ensuring that all relevant parties are informed of changes.
3. **Model-View-Controller (MVC)** for separating concerns in the backend.  
**Yes, this application implemented** [the MVC Design Pattern](https://www.geeksforgeeks.org/mvc-design-pattern/). The definition and key components of MVC Design Pattern is:
    - **Definition**: The MVC design pattern specifies that an application consists of a data model, presentation information, and control information.
    - **Key components**:
      1. Model: The `Engine` folder contains the business logic and data manipulation code. This includes classes and functions that handle the core functionality of the application, such as the `SpreadSheetController.ts` and other files that manage the state and logic of the spreadsheet.
      2. View: The `Components` folder contains the React components that render the user interface. These components display data to the user and handle user interactions. `SpreadSheet.tsx`, `LoginPageComponent.tsx`, and other components are the evidence.
      3. Controller: The `Server` folder contains the server-side code that handles HTTP requests, processes user inputs, and interacts with the Model (`DocumentHolder`) to update the state and retrieve data.  

    Therefore, the structure of this application aligns with the MVC architecture, where each folder in `src` has a specific responsibility, ensuring a clear separation of concerns.
4. **Component Pattern** as a common good practice.  
From `App.tsx` we know that this entire file is structured around the Component pattern, which is a core concept in React. The `App` function is a React component that renders other components (`SpreadSheet`, `LoginPageComponent`). The Component Pattern is a key practice in React applications, where the user interface is split into independent, reusable components. This modular design allows for code reusability, better isolation of concerns, and easier testing. In this project, components such as `LoginPageComponent.tsx` and `SpreadSheet.tsx` demonstrate this pattern by focusing on rendering specific parts of the UI and managing their own state. This pattern enhances maintainability and allows for rapid changes without impacting other components.

5. **Single Responsibility Principle** as a common good practice.  
The `App` component adheres to the Single Responsibility Principle by focusing on rendering the appropriate components based on the `documentName` state. It delegates the actual spreadsheet and login functionalities to `SpreadSheet` and `LoginPageComponent` respectively. The Single Responsibility Principle (SRP) is followed throughout the application. For example, the `App.tsx` component’s sole responsibility is to manage which component is rendered based on the current URL or document state, delegating the actual functionality to other components like `LoginPageComponent` and `SpreadSheet`. This ensures that each component focuses on a single task, making the code easier to understand and maintain, while reducing the likelihood of bugs when features need to change.


## Part 2: Analyzing the Backend (NodeJS)

### 1. **Examine the RESTful API**

- **How data is created, read, updated, and deleted (CRUD operations):**

  - **Create**:  
    Data is created using the `POST /documents/create/:name` endpoint. The document name is passed in the URL, and user information (such as `userName`) is sent in the request body. The server then uses the `createDocument` method from `DocumentHolder` to create a new document and associates it with the user.
  - **Read**:  
    Data can be retrieved from two Endpoints:
    - `GET /documents`: Retrieves a list of all document names stored in the system.
    - `GET /documents/:name`: Checks if the document exists and validates the userName in the request body.If valid, it retrieves the details (in JSON format) of a specific document identified by its `name`.
  - **Delete**:  
    Data (tokens) is deleted via the `PUT /document/removetoken/:name` endpoint. This removes a token from the document for the specified user. Although the code doesn’t explicitly show full document deletion, it handles token removal and potentially document reset.
  - **Update**:  
    Data is updated using several `PUT` endpoints:
    - `PUT /documents/:name`: Ensures the document exists and returns its data. If the document doesn’t exist, it is created.
    - `PUT /document/cell/edit/:name`: Grants a user edit access to a specific cell within the document.
    - `PUT /document/addtoken/:name`: Adds a token to the document for a specific user.

- **How the server validates and processes client requests before responding:**
  - The server performs basic validation on incoming requests:
    - It checks for required fields in the request body, such as `userName`. If a required field is missing, the server responds with a `400 Bad Request` error (e.g., in `PUT /documents/:name`, `userName` is mandatory).
    - Before performing operations on a document, it checks if the document exists. If the document is not found, it responds with a `404 Not Found` (e.g., `PUT /document/cell/edit/:name`).
  - Once the request is validated, the server interacts with the `DocumentHolder` class to process the request. This class contains the logic for document creation, modification, and retrieval.
  - The server then sends the appropriate response:
    - If the request is successful, the server returns the requested data (e.g., document JSON) with a `200 OK` status.
    - For invalid or failed requests (e.g., missing documents or data), the server returns an appropriate error code and message, such as `400 Bad Request` or `404 Not Found`.
      
The backend’s RESTful API is well-structured, handling typical CRUD operations on documents. It validates inputs, such as checking for missing `userName` fields and invalid document names, and returns appropriate errors (400 and 404). However, there is no centralized error handler for unexpected issues (e.g., internal server errors), which could be implemented to improve maintainability and user experience. Additionally, the system currently saves documents as files in the local file system, which works well for small-scale applications but may benefit from a more scalable solution, such as using a database like MongoDB or PostgreSQL in the future.

---

### 2. **Real-Time Communication (if applicable)**

There is no implementation of real-time communication. The backend uses a request-response model. However, real-time features could be implemented using WebSockets to enable live document collaboration, where multiple users can see each other's changes in real-time. This would significantly improve the user experience in a collaborative environment.

---

### 3. **User Management**

Currently, user management is minimal, with no authentication system in place. All users can access documents as long as they provide a `userName`. To improve security, future implementations could add JWT-based authentication or OAuth, ensuring that users are properly authenticated and their roles (e.g., editor, viewer) are managed securely.

---

### 4. **Middleware and Error Handling**

The backend includes middleware for handling CORS and parsing incoming requests (via `bodyParser.json()`), ensuring that the API is accessible from different origins and that request bodies are processed correctly. To further improve the system, a global error handler could be implemented to catch unhandled errors and log them for easier debugging and consistent error messages to the client.

- **Authentication and Session Management**:  
  No authentication or session management middleware is present.

- **Data Validation**:  
  Basic validation exists in some route handlers by checking for required fields like `userName`. If `userName` is not provided in the request body, the server responds with a validation error.

- **CORS Middleware**:  
  The backend uses `CORS` middleware to allow cross-origin requests.

- **Logging Middleware**:  
  A logging middleware is in place that logs each request method and URL if the `debug` flag is set.

- **Body Parsing**:  
  The server uses `bodyParser.json()` to parse incoming request bodies in JSON format.

## Part 3 Frontend Analysis

### 1. **Multi-Screen Navigation**:

Examine how the React app handles navigation between different screens and UI components:

- How is routing set up (e.g., using React Router)?
    - Instead of using React Router, the application handles navigation between `SpreadSheet` and `LoginPageComponent` using `window` API by manually fetching and updating the URL to determine which screen to display. Specifically, if no document name is present in the URL, the `LoginPageComponent` will be rendered. Otherwise, the `SpreadSheet` component will be rendered and the corresponding document name will be reflected in the URL. The major drawback of this approach is that the page will have to reload whenever the key components in the URL are updated, leading to performance issues.
- How does the app handle protected routes (i.e., only allowing certain users to access specific pages)?
    - There are no protected routes as the spreadsheet documents are public and available to all users as long as there is a username in `window.sessionStorage`. In addition, a robust user authentication and authorization system is not implemented while the log in & out options are mainly serving the purpose of page navigation, which is a major concern in terms of security.

### 2. **State Management**:

Investigate how the app manages state across different screens and components:

- How is user state (e.g., authentication status, role) maintained and shared between components?
    - As mentioned before, the user state (`userName`) is stored in `window.sessionStorage`. According to MDN Web Docs, sessionStorage accesses a session Storage object and a page session survives page reloads and restores. The data in sessionStorage will be cleared when the session ends. In this case, it could be used for global state management as all components have access to the sessionStorage during the session via `window.sessionStorage.getItem()` or `window.sessionStorage.setItem()` .
- Are tools like Redux or Context API used to manage global state?
    - Neither Redux or Context API is used in the application to manage global state though they are widely used in React ecosystem. Context could be really useful to handle user state since most components require access to it. Flux-architecture solutions like Redux Toolkit or Zustand refactor all states into one giant store and define the reducer functions that update the states at one place, making state management easier in complex applications.

### 3. **API Interaction**:

Analyze how the frontend communicates with the backend:

- How are API calls made (e.g., using fetch, axios) and how is the data from the backend processed and displayed in the UI?
    - API calls are made using `fetch` API. Although there are several endpoints being used, the pattern remains consistent. After the request is resolved, the returned `Response` object then will be parsed as `JSON` asynchronously. Finally, the parsed `DocumentTransport` object is passed to `_updateDocument` function to update the `_document` field in `SpreadSheetClient` Class. Then back at the frontend, a `useEffect` hook is implemented to call `updateDisplayValues` function every 0.05 second to update the states using the getter functions from `SpreadSheetClient` Class, resulting the updated UI. However, this approach is not efficient as the document might not need an update every 0.05 second. Instead, protocols like WebSocket could be used to enable two-way communication between server and client.
- How is the client updated so that they can see other users updating the cells.
    - If a user starts editing a cell, a `PUT` request containing the `userName` will be made to the backend which will then grant edit access to that user if eligible. Eventually, that piece of information will be added to the `JSON` file of the document. As mentioned, the `useEffect` hook will fire `updateDisplayValues` function every 0.05 second to update the states including cell ownership from `SpreadSheetClient` Class.

### 4. **User Interface**:

Investigate how the app displays different UI components based on user roles:

- How does the frontend handle the display of real-time data if applicable (e.g., chat messages, notifications)?
    - As discussed before, the frontend does not use any real-time communication mechanism. It relies on the `useEffect` hook to update the UI every 0.05 second.
- How is the cell ownership displayed to the users.
    - When another client pushes for the next update, their cells state will be updated by the `getSheetDisplayStringsForGUI` function in `SpreadSheetClient` Class in the form of `cell value|name of the user that is editing`. The cells state is passed as a prop to `SheetHolder` component and then to `SheetComponent` component where it is parsed as cell value and editor’s name respectively. Then the editor’s name will be rendered as a `<label>` wrapped by the cell `<button>` to all users.

## Part 4 Frontend and Backend Interaction

### API Request-Response Flow

Trace the flow of data from the moment the frontend sends a request to the server to when it receives a response:

- Identify key points in the code where data flows from the server to the client and vice versa.
    - In Part 3.3 API Interaction, a detailed analysis on how the data from backend is displayed at frontend has been given. Now let’s focus on the data flow from request to response. Take endpoint `/document/addcell/:name` as an example: `userName` and `cell` values are stored in the body of the `PUT` request.
        
        ```tsx
        public addCell(cell: string): void {
            const requestAddCellURL = `${this._baseURL}/document/addcell/${this._documentName}`;
        
            const body = {
                "userName": this._userName,
                "cell": cell
            };
        
            fetch(requestAddCellURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
                .then(response => {
                    return response.json() as Promise<DocumentTransport>;
                }
                ).then((document: DocumentTransport) => {
                    this._updateDocument(document);
                });
        }
        ```
        
        Then the backend extracts `userName` and `cell` values from the request and passes them to `addCell` function from `DocumentHolder` Class.
        
        ```tsx
        app.put('/document/addcell/:name', (req: express.Request, res: express.Response) => {
            const name = req.params.name;
        
            // is this name valid?
            const documentNames = documentHolder.getDocumentNames();
            if (documentNames.indexOf(name) === -1) {
                res.status(404).send(`Document ${name} not found`);
                return;
            }
            // get the user name  and the cell from the body
            const userName = req.body.userName;
            const cell = req.body.cell;
            if (!userName) {
                res.status(400).send('userName is required');
                return;
            }
            // add the token
            const resultJSON = documentHolder.addCell(name, cell, userName);
        
            res.status(200).send(resultJSON);
        });
        ```
        
        From there, the data will go through multiple layers of Classes: `DocumentHolder`  → `SpreadSheetController` → `SheetMemory` where the data will be saved. Then `DocumentHolder` will utilize the `SpreadSheetController` again to access the updated memory in `SheetMemory` and write to `JSON` file under `documents` folder. After all the procedures, a `DocumentTransport` object is returned to the frontend as response with code 200.
        
- How does the frontend handle errors returned by the server?
    - The frontend does not implement error handling. It just assumes that the server will always return a `200 OK` status code. This is a risky practice as it does not account for potential errors or exceptions that may occur during the request-response cycle. Implementing error handling on the frontend would ensure that the application can gracefully handle unexpected responses from the server, improving the overall user experience and application reliability.
