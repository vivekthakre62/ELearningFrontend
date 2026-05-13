# E-Learning Frontend Project Documentation

## 1. Project Overview

This project is a React-based frontend for an E-Learning platform. It supports three user roles:

- `student`
- `teacher`
- `admin`

The application allows users to browse courses, register and log in, manage profiles, enroll in courses, upload course content, manage tests and questions, and exchange messages in real time.

The frontend is built with:

- React 18
- React Router
- Tailwind CSS
- Axios
- Framer Motion
- SockJS + STOMP for chat
- Nginx for Dockerized static serving

## 2. Main Features

### Student features

- Register and log in
- Browse all courses
- Search courses
- View course details
- Enroll in courses
- View registered courses
- Open course content
- View available tests
- Attempt tests with timer and score
- Chat with teachers
- Update profile
- Send contact form messages

### Teacher features

- Register and log in
- Add courses with image upload
- Update and delete courses
- View students registered in their courses
- Upload course content files
- Create, edit, and delete tests
- Add, update, and delete test questions
- Chat with students
- Update profile

### Admin features

- Log in
- Add categories
- Delete categories

## 3. Tech Stack

### Frontend libraries

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `framer-motion`
- `lucide-react`
- `react-icons`
- `sockjs-client`
- `@stomp/stompjs`

### Build and styling

- `react-scripts`
- `tailwindcss`

### Containerization

- Docker multi-stage build
- Nginx Alpine image for production serving

## 4. Project Structure

```text
E-Learning-Frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Courses.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── PopupProvider.jsx
│   │   └── Searchbar.jsx
│   ├── images/
│   ├── pages/
│   │   ├── AddCategories.jsx
│   │   ├── AddContent.jsx
│   │   ├── AddCourse.jsx
│   │   ├── AttemptTest.jsx
│   │   ├── Chat.jsx
│   │   ├── Contact.jsx
│   │   ├── ContentUpload.jsx
│   │   ├── DeleteCatagorie.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MessageLists.jsx
│   │   ├── PaymentSection.jsx
│   │   ├── Profile.jsx
│   │   ├── Questions.jsx
│   │   ├── RegisteredCourses.jsx
│   │   ├── RegisteredStudents.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ShowContent.jsx
│   │   ├── ShowCourseInDetail.jsx
│   │   ├── Test.jsx
│   │   ├── TestForStudent.jsx
│   │   └── UpdateCourse.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── index.js
├── .dockerignore
├── Dockerfile
├── package.json
└── tailwind.config.js
```

## 5. Application Flow

### Entry point

- `src/index.js` mounts the app and wraps it with `BrowserRouter`.
- `src/App.jsx` defines all routes and wraps the route tree with `PopupProvider`.

### Shared UI components

- `Navbar.jsx`
  - shows different menus for guest, student, teacher, and admin
  - fetches categories
  - shows unread message indicator
  - connects to WebSocket for live message count
- `PopupProvider.jsx`
  - provides `showPopup`
  - provides async confirmation dialog with `confirm`
- `Courses.jsx`
  - fetches all courses
  - shows course cards
  - supports enrollment and teacher-side delete/update actions

## 6. Routes and Pages

Current routes defined in `src/App.jsx`:

| Route | Page | Purpose |
|---|---|---|
| `/` | `HomePage` | Home page with navbar, search, courses, footer |
| `/login` | `LoginPage` | Login for student, teacher, admin |
| `/register` | `RegisterPage` | User registration |
| `/addCourse` | `AddCourse` | Teacher adds a new course |
| `/profile` | `Profile` | User profile update page |
| `/updateCourse/:courseId` | `UpdateCourse` | Update existing course |
| `/registeredCourse` | `RegisteredCourses` | Student’s registered courses |
| `/addContent` | `AddContent` | Teacher course selection for content upload |
| `/message/:studentId` | `Chat` | Direct chat screen |
| `/registeredStudent` | `RegisteredStudents` | Teacher’s registered students |
| `/messageList` | `MessageLists` | Contact list for chat |
| `/contact` | `Contact` | Contact form |
| `/addCategories` | `AddCategories` | Admin adds category |
| `/contentUpload/:courseId` | `ContentUpload` | Upload content file for a course |
| `/payment` | `PaymentSection` | Payment UI for a course |
| `/test` | `Test` | Teacher test management |
| `/test-student` | `TestForStudent` | Student test list |
| `/add-questions/:testId` | `Questions` | Teacher manages questions |
| `/attempt-test/:testId` | `AttemptTest` | Student attempts a test |
| `/show-content/:courseId` | `ShowContent` | View uploaded files for a course |
| `/course/:courseId` | `ShowCourseInDetail` | Course detail page |
| `/deleteCategorie` | `DeleteCatagorie` | Admin deletes categories |

## 7. Page-Level Functional Notes

### `HomePage`

- Renders:
  - `Navbar`
  - `Searchbar`
  - `Courses`
  - `Footer`
- Search is passed down to `Courses` for filtering.

### `LoginPage`

- Sends login request to backend.
- Stores in `localStorage`:
  - `token`
  - `role`
  - `email`
  - `user`

### `RegisterPage`

- Supports all three roles.
- Performs password confirmation on the client.

### `AddCourse`

- Teacher-only page.
- Requires JWT token.
- Fetches categories.
- Uploads:
  - course image file
  - JSON course metadata

### `Courses`

- Fetches all courses from backend.
- Converts binary image data into a displayable base64 image.
- Teacher sees:
  - `Update`
  - `Delete`
- Student/guest sees:
  - `Enroll`
  - `Add to Cart` popup only

### `RegisteredCourses`

- Student-only usage in practice.
- Lists registered courses from backend.
- Opens uploaded content through `ShowContent`.

### `AddContent`

- Teacher selects a course and is redirected to `ContentUpload`.

### `ContentUpload`

- Uploads a file to a specific course.
- Uses JWT from `localStorage`.

### `ShowContent`

- Loads content list for a course.
- Downloads/opens selected files as blobs in the browser.

### `Test`

- Teacher test management:
  - add test
  - edit test
  - delete test
  - open question management

### `Questions`

- Add, update, and delete questions for a test.
- Supports options A-D and correct answer selection.

### `TestForStudent`

- Lists all available tests.
- Opens a selected test in attempt mode.

### `AttemptTest`

- Loads questions for a test.
- Tracks answers in local component state.
- Includes a 10-minute timer.
- Calculates score locally in the browser.

### `RegisteredStudents`

- Teacher view of their courses and enrolled students.
- Allows teacher to open chat with a student.

### `MessageLists`

- Shows teacher or student contacts.
- Supports search by name, email, or phone.

### `Chat`

- Loads conversation history.
- Sends messages via REST.
- Subscribes to live updates using SockJS + STOMP.

### `Profile`

- Loads current user from `localStorage`.
- Allows editing name, email, phone, and profile image.
- Tries multiple possible backend update endpoints.

### `AddCategories`

- Admin creates a category using JWT authorization.

### `DeleteCatagorie`

- Admin-only page in practice.
- Fetches category list.
- Deletes category after confirmation.

### `Contact`

- Sends contact form data to backend.

### `PaymentSection`

- Displays payment methods.
- Sends payment request to backend.
- Relies on `courseId` passed in route state.

## 8. Authentication and Authorization

The frontend uses token-based auth stored in `localStorage`.

### Local storage keys used

- `token`
- `role`
- `email`
- `user`

### Role-based UI behavior

- `student`
  - sees registration-related views and tests
- `teacher`
  - sees course creation, content upload, test management, student list, chat
- `admin`
  - sees category management

### Important note

Most route protection is handled inside page components with checks like:

- redirect to `/login` if token is missing
- redirect if role does not match expected role

There is no centralized protected-route wrapper yet.

## 9. Backend API Dependencies

The frontend assumes a backend running at:

```text
http://localhost:8080
```

### User/auth

- `POST /api/user/login`
- `POST /api/user/register`
- `GET /api/user/getUserById/:id`
- `PUT /api/user/update/:id`
- `PUT /api/user/updateProfile/:id`
- `PUT /api/user/:id`

### Category

- `GET /api/categories/get`
- `POST /api/categories/add`
- `DELETE /api/categories/delete/:id`

### Course

- `GET /api/course/show`
- `GET /api/course/get1/:courseId`
- `POST /api/course/add/:userId`
- `DELETE /api/course/delete/:courseId`

### Course registration

- `POST /api/register/registerCourse/:courseId`
- `GET /api/register/show/:userId`

### Teacher-student data

- `GET /api/teacher/students/:teacherId`

### Course content

- `POST /api/contents/upload/:courseId`
- `GET /api/contents/get/:courseId`
- `GET /api/contents/download/:fileName`

### Tests

- `GET /api/test/show/:userId`
- `GET /api/test/showAll`
- `POST /api/test/add/:userId`
- `PUT /api/test/update/:testId`
- `DELETE /api/test/delete/:testId`

### Questions

- `GET /api/question/show/:testId`
- `POST /api/question/add/:testId`
- `PUT /api/question/update/:questionId`
- `DELETE /api/question/delete/:questionId`

### Messaging

- `GET /api/messages/unread/:userId`
- `GET /api/messages/conversation/:senderId/:receiverId`
- `GET /api/messages/students/:teacherId`
- `GET /api/messages/teachers/:studentId`
- `POST /api/messages/send`

### Contact

- `POST /api/contact`

### Payment

- `POST /api/payment/add/:userId/:courseId`

### WebSocket

- `GET /ws` via SockJS
- topic subscription patterns:
  - `/topic/user-{userId}`
  - `/topic/{roomId}`
- publish destination:
  - `/app/chat/{roomId}`

## 10. Environment Assumptions

There is no `.env` configuration in the current frontend. API URLs are hardcoded in components as `http://localhost:8080`.

For production readiness, the following should ideally be moved to environment variables:

- API base URL
- WebSocket URL
- file service URL if different

## 11. Setup Instructions

### Prerequisites

- Node.js 18+ recommended
- npm
- Backend API running on port `8080`

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm start
```

Frontend will run at:

```text
http://localhost:3000
```

## 12. Docker Usage

### Build image

Run from the project root:

```bash
docker build -t e-learning-frontend .
```

### Run container

```bash
docker run -p 3000:80 e-learning-frontend
```

Then open:

```text
http://localhost:3000
```

### Docker design

- Build stage uses `node:20-alpine`
- App is built with `npm run build`
- Production stage uses `nginx:alpine`
- Static files are served from `/usr/share/nginx/html`

## 13. Build and Deployment Notes

### Current production behavior

- React app is served statically by Nginx in Docker
- Backend URLs remain hardcoded to `localhost:8080`

### Important implication

If the frontend runs inside Docker and the backend does not resolve at `localhost:8080` from the browser environment you use, API calls will fail unless the backend is reachable at that address from the browser.

## 14. Known Gaps and Risks

These are based on the current codebase.

### Routing inconsistencies

- Admin link uses both `/deleteCategory` and `/deleteCategorie`
- Some navbar links like `/allStudents` and `/allTeachers` do not have matching routes in `App.jsx`
- `navigate("/courses")` is used after adding a course, but `/courses` is not currently defined in `App.jsx`

### Hardcoded backend URLs

- API and WebSocket URLs are repeated across files
- No environment-based configuration exists

### Partial route protection

- Protection exists inside pages, not as a shared route guard

### Payment flow coupling

- `PaymentSection` depends on `courseId` passed via route state
- Direct navigation to `/payment` may not work correctly without that state

### Add to cart

- `Add to Cart` currently shows a popup but has no backend or cart state logic

### Test scoring

- Score is computed fully on the client side
- No persistence of student test results is visible in the frontend code

### Some UI text encoding issues

- A few files contain malformed symbols in displayed text, likely due to encoding issues

## 15. Suggested Improvements

- Add centralized auth guard for protected routes
- Move backend URLs to environment variables
- Add route constants to avoid path mismatch bugs
- Normalize naming, especially `DeleteCatagorie` vs `DeleteCategorie`
- Add API service layer instead of repeating raw URLs in components
- Add loading and error boundaries more consistently
- Add test result submission and persistence
- Add actual cart workflow or remove placeholder button
- Add missing routes or remove dead navbar links
- Add Docker Compose for frontend-backend local orchestration

## 16. Important Files to Read First

- [src/App.jsx](/d:/E-Learning-Frontend/src/App.jsx)
- [src/index.js](/d:/E-Learning-Frontend/src/index.js)
- [src/components/Navbar.jsx](/d:/E-Learning-Frontend/src/components/Navbar.jsx)
- [src/components/Courses.jsx](/d:/E-Learning-Frontend/src/components/Courses.jsx)
- [src/components/PopupProvider.jsx](/d:/E-Learning-Frontend/src/components/PopupProvider.jsx)
- [Dockerfile](/d:/E-Learning-Frontend/Dockerfile)
- [.dockerignore](/d:/E-Learning-Frontend/.dockerignore)

## 17. Summary

This frontend is a feature-rich E-Learning portal with:

- multi-role authentication
- course browsing and enrollment
- teacher content and test management
- admin category management
- real-time chat
- Dockerized production serving

It is already functional as a portfolio/demo-style full frontend, but it would benefit from route cleanup, configuration centralization, and stronger production hardening.
