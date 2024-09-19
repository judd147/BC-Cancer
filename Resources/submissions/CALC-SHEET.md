## Part 2: Analyzing the Backend (NodeJS)

### 1. **Examine the RESTful API**

- **How data is created, read, updated, and deleted (CRUD operations):**

  - **Create**:  
    Data is created using the `POST /documents/create/:name` endpoint. The document name is passed in the URL, and user information (such as `userName`) is sent in the request body. The server then uses the `createDocument` method from `DocumentHolder` to create a new document and associates it with the user.
  - **Read**:  
    Data can be retrieved in two ways:
    - `GET /documents`: Retrieves a list of all document names stored in the system.
    - `GET /documents/:name`: Retrieves the details (in JSON format) of a specific document identified by its `name`.
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

---

### 2. **Real-Time Communication (if applicable)**

There is no implementation of real-time communication. The backend uses a request-response model.

---

### 3. **User Management**

There are no mechanisms in place for handling user authentication or roles.

---

### 4. **Middleware and Error Handling**

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
