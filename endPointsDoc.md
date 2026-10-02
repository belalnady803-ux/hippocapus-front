# HippoCampus Backend API Documentation

Welcome to the **HippoCampus Backend API Documentation**. This document covers all endpoints, including their query parameters, request bodies, and expected outputs.

All response payloads follow a standard wrapper format:
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message description",
  "success": true
}
```

---

## Table of Contents
1. [Authentication Endpoints (`/api/auth`)](#1-authentication-endpoints-apiauth)
2. [Course & Progress Endpoints (`/api/courses`)](#2-course--progress-endpoints-apicourses)
3. [User Course Enrolment Endpoints (`/api/user/courses`)](#3-user-course-enrolment-endpoints-apiusercourses)
4. [Quiz Endpoints (`/api/quizzes`)](#4-quiz-endpoints-apiquizzes)
5. [Contact Endpoints (`/api/contact`)](#5-contact-endpoints-apicontact)
6. [Upload Endpoints (`/api/upload`)](#6-upload-endpoints-apiupload)
7. [Admin Management Endpoints (`/api/admin/courses`)](#7-admin-management-endpoints-apiadmincourses)
13. [Instructor Endpoints (`/api/instructor/courses`)](#8-instructor-endpoints-apiinstructorcourses)
12. [Question Endpoints (`/api/questions`, `/api/admin/questions`)](#12-question-endpoints-apiquestions-apiadminquestions)

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 User Signup
Registers a new user account.
* **Route**: `POST /api/auth/signup`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123",
    "fullName": "John Doe",
    "phoneNumber": "+201234567890"
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "user": {
        "_id": "64b0f92b77a06c276cd8fb12",
        "fullName": "John Doe",
        "email": "user@example.com",
        "phoneNumber": "+201234567890",
        "roles": ["client"],
        "isVerified": false,
        "createdAt": "2026-07-09T08:00:00.000Z"
      }
    },
    "message": "User created successfully. Please verify your email.",
    "success": true
  }
  ```

### 1.2 Verify Email
Verifies a registered user's email address using a token.
* **Route**: `POST /api/auth/verify-email`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "verificationToken": "123456"
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Email verified successfully",
    "success": true
  }
  ```

### 1.3 User Login
Authenticates user and sets access and refresh tokens in HTTP-only cookies.
* **Route**: `POST /api/auth/login`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "64b0f92b77a06c276cd8fb12",
        "fullName": "John Doe",
        "email": "user@example.com",
        "phoneNumber": "+201234567890",
        "roles": ["client"],
        "isVerified": true,
        "createdAt": "2026-07-09T08:00:00.000Z"
      }
    },
    "message": "Logged in successfully",
    "success": true
  }
  ```

### 1.4 User Logout
Clears auth cookies and pulls the device entry from the user.
* **Route**: `POST /api/auth/logout`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Logged out successfully",
    "success": true
  }
  ```

### 1.5 Check Authentication Status
Returns auth details for the current session.
* **Route**: `GET /api/auth/check-auth`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "64b0f92b77a06c276cd8fb12",
        "deviceId": "e843fdfb-63a1-432d-8a5c-fa62c8201ea1",
        "roles": ["client"]
      }
    },
    "message": "Authenticated successfully",
    "success": true
  }
  ```

---

## 2. Course & Progress Endpoints (`/api/courses`)

### 2.1 Get All Published Courses
Retrieves all courses with status "published". (Cached for 1 hour).
* **Route**: `GET /api/courses`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "64b0f92b77a06c276cd8fb10",
        "title": "Modern JavaScript Course",
        "slug": "modern-javascript-course",
        "description": "Learn JS from scratch.",
        "price": 15000,
        "discount": 10,
        "discountType": "percentage",
        "image": "course-thumbnail.png",
        "category": "Programming",
        "averageRating": 4.8,
        "instructors": [
          {
            "name": "Jane Smith",
            "slug": "jane-smith"
          }
        ]
      }
    ],
    "message": "Courses fetched successfully",
    "success": true
  }
  ```

### 2.2 Get Course Details by Slug
* **Route**: `GET /api/courses/:slug`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fb10",
      "title": "Modern JavaScript Course",
      "slug": "modern-javascript-course",
      "description": "Learn JS from scratch.",
      "whatYouWillLearn": ["Variables", "Functions", "ES6+"],
      "requirements": ["Computer access"],
      "price": 15000,
      "currency": "EGP",
      "discount": 10,
      "discountType": "percentage",
      "image": "course-thumbnail.png",
      "category": "Programming",
      "level": "beginner",
      "averageRating": 4.8,
      "reviewsCount": 2,
      "totalDurationMinutes": 120,
      "enrollmentsCount": 10,
      "instructors": [
        {
          "_id": "64b0f92b77a06c276cd8fb09",
          "name": "Jane Smith",
          "slug": "jane-smith",
          "title": "Senior Developer",
          "specialization": "Web Development",
          "bio": "10+ years coding.",
          "image": "jane-avatar.png"
        }
      ]
    },
    "message": "Course fetched successfully",
    "success": true
  }
  ```

### 2.3 Get Course Modules & Videos
Retrieves the modules list with video locking details based on the user's purchase access.
* **Route**: `GET /api/courses/:slug/modules`
* **Headers**: Optional Auth Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "64b0f92b77a06c276cd8fb15",
        "title": "Introduction to JS",
        "description": "Basic concepts of JS.",
        "order": 1,
        "videos": [
          {
            "_id": "64b0f92b77a06c276cd8fb16",
            "title": "Hello World Video",
            "durationInSeconds": 360,
            "isFree": true,
            "order": 1,
            "locked": false
          },
          {
            "_id": "64b0f92b77a06c276cd8fb17",
            "title": "Variables & Constants",
            "durationInSeconds": 480,
            "isFree": false,
            "order": 2,
            "locked": true
          }
        ]
      }
    ],
    "message": "Course modules fetched successfully",
    "success": true
  }
  ```

### 2.4 Get Course Reviews
Paginated list of reviews for a course.
* **Route**: `GET /api/courses/:slug/reviews`
* **Query Parameters**:
  * `page` (number, default: 1)
  * `limit` (number, default: 10)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "reviews": [
        {
          "_id": "64b0f92b77a06c276cd8fb20",
          "rating": 5,
          "comment": "Excellent structure!",
          "createdAt": "2026-07-09T08:00:00.000Z",
          "user": {
            "fullName": "John Doe"
          }
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalCount": 1,
        "totalPages": 1
      }
    },
    "message": "Course reviews fetched successfully",
    "success": true
  }
  ```

### 2.5 Update Video Watch Progress
Updates how much time the user has spent watching a video and marks it as completed if applicable.
* **Route**: `POST /api/courses/:videoId/progress`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Request Body**:
  ```json
  {
    "courseId": "64b0f92b77a06c276cd8fb10",
    "moduleId": "64b0f92b77a06c276cd8fb15",
    "watchedSeconds": 150,
    "isCompleted": false
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fb35",
      "user": "64b0f92b77a06c276cd8fb12",
      "video": "64b0f92b77a06c276cd8fb16",
      "course": "64b0f92b77a06c276cd8fb10",
      "module": "64b0f92b77a06c276cd8fb15",
      "watchedSeconds": 150,
      "isCompleted": false,
      "lastWatchedAt": "2026-07-09T08:05:00.000Z"
    },
    "message": "Video progress updated",
    "success": true
  }
  ```

### 2.6 Get Video Watch Progress
Fetches current progress for a video.
* **Route**: `GET /api/courses/:videoId/progress`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fb35",
      "user": "64b0f92b77a06c276cd8fb12",
      "video": "64b0f92b77a06c276cd8fb16",
      "course": "64b0f92b77a06c276cd8fb10",
      "module": "64b0f92b77a06c276cd8fb15",
      "watchedSeconds": 150,
      "isCompleted": false,
      "lastWatchedAt": "2026-07-09T08:05:00.000Z"
    },
    "message": "Video progress fetched",
    "success": true
  }
  ```

---

## 3. User Course Enrolment Endpoints (`/api/user/courses`)

### 3.1 Get User Enrolled Courses
* **Route**: `GET /api/user/courses/`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "uniqueCourses": [
        {
          "_id": "64b0f92b77a06c276cd8fb10",
          "title": "Modern JavaScript Course",
          "description": "Learn JS from scratch.",
          "image": "course-thumbnail.png"
        }
      ]
    },
    "message": "Enrolled courses fetched successfully",
    "success": true
  }
  ```

### 3.2 Get Enrolled Course Modules
Lists all modules in a course that the user has bought.
* **Route**: `GET /api/user/courses/:id/modules`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "modules": [
        {
          "_id": "64b0f92b77a06c276cd8fb15",
          "title": "Introduction to JS",
          "isPublished": true
        }
      ]
    },
    "message": "Enrolled modules fetched successfully",
    "success": true
  }
  ```

### 3.3 Get Module Videos (Authorized)
* **Route**: `GET /api/user/courses/:id/modules/:moduleId`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "64b0f92b77a06c276cd8fb16",
        "title": "Hello World Video",
        "durationInSeconds": 360,
        "isFree": true,
        "order": 1,
        "module": "64b0f92b77a06c276cd8fb15"
      }
    ],
    "message": "Videos fetched successfully",
    "success": true
  }
  ```

### 3.4 Get Full Video Data & Stream URL
Ensures user has permissions to view the video before returning stream properties and resources.
* **Route**: `GET /api/user/courses/:id/modules/:moduleId/video/:videoId`
* **Headers**: Optional/Required Auth Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fb16",
      "module": "64b0f92b77a06c276cd8fb15",
      "title": "Hello World Video",
      "videoId": "cloudflare-stream-id-12345",
      "isFree": true,
      "durationInSeconds": 360,
      "order": 1,
      "files": [
        {
          "_id": "64b0f92b77a06c276cd8fb19",
          "name": "cheat-sheet.pdf",
          "key": "files/cheat-sheet.pdf",
          "fileType": "pdf",
          "uploadedAt": "2026-07-09T08:00:00.000Z"
        }
      ],
      "quiz": "64b0f92b77a06c276cd8fb88"
    },
    "message": "Video fetched successfully",
    "success": true
  }
  ```

### 3.5 Generate Video Stream Token
Generates a secure Bunny.net video token with an expiration time for the frontend player.
* **Route**: `GET /api/user/courses/:id/modules/:moduleId/video/:videoId/token`
* **Headers**: Optional/Required Auth Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "token": "a1b2c3d4e5f6...",
      "expires": 1720512000,
      "bunnyVideoId": "b1234567-890a-bcde-f123-4567890abcde"
    },
    "message": "Video token generated.",
    "success": true
  }
  ```

---

## 4. Quiz Endpoints (`/api/quizzes`)

### 4.1 Get Quiz Details
Loads questions and answers (sanitized: hides which options are correct).
* **Route**: `GET /api/quizzes/:id`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fb88",
      "title": "JS Basics Quiz",
      "questions": [
        {
          "_id": "64b0f92b77a06c276cd8fb90",
          "question": "What does JS stand for?",
          "options": [
            { "_id": "64b0f92b77a06c276cd8fb91", "option": "JavaSource" },
            { "_id": "64b0f92b77a06c276cd8fb92", "option": "JavaScript" }
          ]
        }
      ],
      "timeLimit": 30,
      "passingScore": 70,
      "video": "64b0f92b77a06c276cd8fb16"
    },
    "message": "Quiz fetched successfully",
    "success": true
  }
  ```

### 4.2 Submit Quiz Answers
Scores the quiz, sets correct options, yields passing outcome, and registers result details.
* **Route**: `POST /api/quizzes/:quizId/submit`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Request Body**:
  ```json
  {
    "answers": [
      {
        "questionId": "64b0f92b77a06c276cd8fb90",
        "optionId": "64b0f92b77a06c276cd8fb92"
      }
    ]
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "score": 100,
      "isPassed": true,
      "totalQuestions": 1,
      "correctAnswers": 1,
      "details": [
        {
          "questionId": "64b0f92b77a06c276cd8fb90",
          "userOptionId": "64b0f92b77a06c276cd8fb92",
          "isCorrect": true,
          "correctOptionId": "64b0f92b77a06c276cd8fb92",
          "explanation": "JS is short for JavaScript."
        }
      ]
    },
    "message": "Quiz submitted successfully",
    "success": true
  }
  ```

### 4.3 Get Quiz History
* **Route**: `GET /api/quizzes/history`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "64b0f92b77a06c276cd8fcc8",
        "user": "64b0f92b77a06c276cd8fb12",
        "quiz": {
          "_id": "64b0f92b77a06c276cd8fb88",
          "title": "JS Basics Quiz"
        },
        "score": 100,
        "correctAnswers": 1,
        "totalQuestions": 1,
        "isPassed": true,
        "answers": [
          {
            "questionId": "64b0f92b77a06c276cd8fb90",
            "optionId": "64b0f92b77a06c276cd8fb92",
            "isCorrect": true
          }
        ],
        "createdAt": "2026-07-09T08:10:00.000Z"
      }
    ],
    "message": "Quiz history fetched successfully",
    "success": true
  }
  ```

---

## 5. Contact Endpoints (`/api/contact`)

### 5.1 Send Contact Message
* **Route**: `POST /api/contact`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "fullName": "John Doe",
    "subject": "Help regarding JS",
    "message": "Need support with Module 2 lessons."
  }
  ```
* **Expected Output**:
  ```json
  {
    "message": "Contact message received successfully!"
  }
  ```

---

## 6. Upload Endpoints (`/api/upload`)

### 6.1 Get Presigned Upload URL
Generates a 60-second valid presigned URL for directly uploading files to Cloudflare R2 bucket.
* **Route**: `GET /api/upload/presigned-url`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Query Parameters**:
  * `fileName` (String, required)
  * `fileType` (String, required)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "url": "https://r2.cloudflare.com/bucket-name/fileName.jpg?signature=...",
      "fileName": "fileName.jpg"
    },
    "message": "Presigned URL generated successfully",
    "success": true
  }
  ```

---

## 7. Admin Management Endpoints (`/api/admin/courses`)

> [!IMPORTANT]
> **Authentication & Role Authorization**:
> All routes in this section require:
> 1. Authentication (`accessToken` cookie present and valid)
> 2. Admin Role (user roles must contain `"admin"`)

### 7.1 Course Operations

#### Create a Course
* **Route**: `POST /api/admin/courses/`
* **Request Body**:
  ```json
  {
    "title": "React Course",
    "description": "Learn React Hooks, Redux, and more.",
    "price": 25000,
    "image": "react-thumbnail.jpg",
    "level": 1
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "_id": "64b0f92b77a06c276cd8fb40",
      "title": "React Course",
      "slug": "react-course",
      "description": "Learn React Hooks, Redux, and more.",
      "price": 25000,
      "image": "react-thumbnail.jpg",
      "level": 1,
      "modules": [],
      "instructors": [],
      "createdAt": "2026-07-09T08:15:00.000Z"
    },
    "message": "Course created successfully",
    "success": true
  }
  ```

#### Update Course details
* **Route**: `PUT /api/admin/courses/:id`
* **Request Body**:
  ```json
  {
    "price": 30000
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fb40",
      "title": "React Course",
      "slug": "react-course",
      "description": "Learn React Hooks, Redux, and more.",
      "price": 30000,
      "image": "react-thumbnail.jpg"
    },
    "message": "Course updated successfully",
    "success": true
  }
  ```

#### Delete Course
Removes the course along with associated modules, videos, progress stats, reviews, and quizzes.
* **Route**: `DELETE /api/admin/courses/:id`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Course and all related data deleted successfully",
    "success": true
  }
  ```

---

### 7.2 Instructor Assignment

#### Link Instructor to Course
* **Route**: `POST /api/admin/courses/:id/instructor/:instructorId`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Instructor added to course successfully",
    "success": true
  }
  ```

#### Unlink Instructor from Course
* **Route**: `DELETE /api/admin/courses/:id/instructor/:instructorId`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Instructor removed from course successfully",
    "success": true
  }
  ```

#### List Course Instructors
* **Route**: `GET /api/admin/courses/:id/instructor`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "64b0f92b77a06c276cd8fb09",
        "name": "Jane Smith",
        "slug": "jane-smith",
        "title": "Senior Developer"
      }
    ],
    "message": "Instructors fetched successfully",
    "success": true
  }
  ```

---

### 7.3 Manual Reviews Management

#### Add a Review Manually
* **Route**: `POST /api/admin/courses/:id/review`
* **Request Body**:
  ```json
  {
    "user": "64b0f92b77a06c276cd8fb12",
    "rating": 5,
    "comment": "Totally loved it, great examples!"
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "_id": "64b0f92b77a06c276cd8fb56",
      "course": "64b0f92b77a06c276cd8fb40",
      "user": "64b0f92b77a06c276cd8fb12",
      "rating": 5,
      "comment": "Totally loved it, great examples!",
      "createdAt": "2026-07-09T08:20:00.000Z"
    },
    "message": "Review added successfully",
    "success": true
  }
  ```

---

### 7.4 Module Management

#### Add Module to Course
* **Route**: `POST /api/admin/courses/:id/modules`
* **Request Body**:
  ```json
  {
    "title": "Components & Props",
    "price": 5000,
    "isPublished": true
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "module": "64b0f92b77a06c276cd8fbaa"
    },
    "message": "Module added successfully",
    "success": true
  }
  ```

#### Get Module details
* **Route**: `GET /api/admin/courses/:id/modules/:moduleId`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fbaa",
      "title": "Components & Props",
      "course": "64b0f92b77a06c276cd8fb40",
      "videos": []
    },
    "message": "Module fetched successfully",
    "success": true
  }
  ```

#### Update Module Details
* **Route**: `PUT /api/admin/courses/:id/modules/:moduleId`
* **Request Body**:
  ```json
  {
    "title": "React Components & Props",
    "price": 6000,
    "isPublished": true
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fbaa",
      "title": "React Components & Props",
      "price": 6000,
      "isPublished": true
    },
    "message": "Module updated successfully",
    "success": true
  }
  ```

#### Toggle Module Status
Toggles the module publishing status.
* **Route**: `PATCH /api/admin/courses/:id/modules/:moduleId/status`
* **Request Body**:
  ```json
  {
    "isPublished": false
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fbaa",
      "title": "React Components & Props",
      "isPublished": false
    },
    "message": "Module status updated successfully",
    "success": true
  }
  ```

#### Delete Module
* **Route**: `DELETE /api/admin/courses/:id/modules/:moduleId`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Module deleted successfully",
    "success": true
  }
  ```

---

### 7.5 Module Enrollments

#### Grant Module Access
* **Route**: `POST /api/admin/courses/:slug/modules/:moduleId/enrollments`
* **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "User enrolled in module successfully",
    "success": true
  }
  ```

#### Revoke Module Access
* **Route**: `DELETE /api/admin/courses/:slug/modules/:moduleId/enrollments/:userId`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "User un-enrolled from module successfully",
    "success": true
  }
  ```

#### List Module Enrollments
* **Route**: `GET /api/admin/courses/:slug/modules/:moduleId/enrollments`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "users": [
        {
          "_id": "64b0f92b77a06c276cd8fb12",
          "fullName": "John Doe",
          "email": "user@example.com"
        }
      ]
    },
    "message": "Enrollments fetched successfully",
    "success": true
  }
  ```

---

### 7.6 Course Enrollments

#### Grant Full Access to Course
* **Route**: `POST /api/admin/courses/:slug/enrollments`
* **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Access granted successfully",
    "success": true
  }
  ```

#### Revoke Full Access from Course
* **Route**: `DELETE /api/admin/courses/:slug/enrollments/:userId`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Access revoked successfully",
    "success": true
  }
  ```

#### List Fully Subscribed Course Users
* **Route**: `GET /api/admin/courses/:slug/enrollments`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "users": [
        {
          "_id": "64b0f92b77a06c276cd8fb12",
          "fullName": "John Doe",
          "email": "user@example.com"
        }
      ]
    },
    "message": "Enrollments fetched successfully",
    "success": true
  }
  ```

---

### 7.7 Video Management

#### Create Bunny Video Entry
* **Route**: `POST /api/admin/courses/:slug/modules/:moduleId/video/create-entry`
* **Request Body**:
  ```json
  {
    "title": "Introduction to Hooks"
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "bunnyVideoId": "b1234567-890a-bcde-f123-4567890abcde",
      "uploadUrl": "https://video.bunnycdn.com/tupload/..."
    },
    "message": "تم إنشاء الإدخال بنجاح. يرجى رفع الفيديو.",
    "success": true
  }
  ```

#### Add Video to Module
* **Route**: `POST /api/admin/courses/:id/modules/:moduleId/video`
* **Request Body**:
  ```json
  {
    "title": "Introduction to Hooks",
    "url": "https://stream.cloudflare.com/...",
    "duration": 500,
    "isFree": false
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "message": "Video added",
      "module": {
        "_id": "64b0f92b77a06c276cd8fbaa",
        "videos": [
          {
            "_id": "64b0f92b77a06c276cd8fb60",
            "title": "Introduction to Hooks",
            "videoId": "cloudflare-uid-567",
            "isFree": false,
            "durationInSeconds": 500,
            "order": 1,
            "files": []
          }
        ]
      }
    },
    "success": true
  }
  ```

#### List Module Videos
* **Route**: `GET /api/admin/courses/:id/modules/:moduleId/video`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "64b0f92b77a06c276cd8fb60",
        "title": "Introduction to Hooks",
        "videoId": "cloudflare-uid-567",
        "isFree": false,
        "durationInSeconds": 500,
        "order": 1
      }
    ],
    "message": "Videos fetched successfully",
    "success": true
  }
  ```

#### Get Video details
* **Route**: `GET /api/admin/courses/:id/modules/:moduleId/video/:videoId`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fb60",
      "title": "Introduction to Hooks",
      "videoId": "cloudflare-uid-567",
      "isFree": false,
      "durationInSeconds": 500,
      "order": 1,
      "files": []
    },
    "message": "Video fetched successfully",
    "success": true
  }
  ```

#### Update Video details
* **Route**: `PUT /api/admin/courses/:id/modules/:moduleId/video/:videoId`
* **Request Body**:
  ```json
  {
    "title": "Introduction to React Hooks"
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "video": {
        "_id": "64b0f92b77a06c276cd8fb60",
        "title": "Introduction to React Hooks"
      }
    },
    "message": "Video updated successfully",
    "success": true
  }
  ```

#### Delete Video
* **Route**: `DELETE /api/admin/courses/:id/modules/:moduleId/video/:videoId`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "video": {
        "_id": "64b0f92b77a06c276cd8fb60",
        "title": "Introduction to React Hooks"
      }
    },
    "message": "Video deleted successfully",
    "success": true
  }
  ```

#### Add Supporting File Link to Video
* **Route**: `POST /api/admin/courses/:id/modules/:moduleId/video/:videoId/file`
* **Request Body**:
  ```json
  {
    "name": "lesson-resources.zip",
    "url": "https://storage.googleapis.com/...",
    "fileType": "zip"
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "file": {
        "_id": "64b0f92b77a06c276cd8fb9c",
        "name": "lesson-resources.zip",
        "url": "https://storage.googleapis.com/...",
        "fileType": "zip"
      }
    },
    "message": "File added successfully",
    "success": true
  }
  ```

#### List Video Supporting Files
* **Route**: `GET /api/admin/courses/:id/modules/:moduleId/video/:videoId/file`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "64b0f92b77a06c276cd8fb9c",
        "name": "lesson-resources.zip",
        "url": "https://storage.googleapis.com/...",
        "fileType": "zip"
      }
    ],
    "message": "Files fetched successfully",
    "success": true
  }
  ```

#### Delete Supporting File Link from Video
* **Route**: `DELETE /api/admin/courses/:id/modules/:moduleId/video/:videoId/file/:fileId`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "File deleted successfully",
    "success": true
  }
  ```

---

### 7.8 Video Quizzes

#### Add Quiz to Video
* **Route**: `POST /api/admin/courses/:moduleId/:videoId/quiz`
* **Request Body**:
  ```json
  {
    "title": "React Component Quiz",
    "timeLimit": 15,
    "passingScore": 80,
    "questions": [
      {
        "question": "What hook is used to store state?",
        "options": [
          { "option": "useEffect", "isCorrect": false },
          { "option": "useState", "isCorrect": true }
        ]
      }
    ]
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "quizId": "64b0f92b77a06c276cd8fb9f"
    },
    "message": "Quiz added and linked successfully",
    "success": true
  }
  ```

#### Get Quiz details
* **Route**: `GET /api/admin/courses/:moduleId/:videoId/quiz/:quizId`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fb9f",
      "title": "React Component Quiz",
      "timeLimit": 15,
      "passingScore": 80,
      "questions": [
        {
          "_id": "64b0f92b77a06c276cd8fba5",
          "question": "What hook is used to store state?",
          "options": [
            { "_id": "64b0f92b77a06c276cd8fba6", "option": "useEffect", "isCorrect": false },
            { "_id": "64b0f92b77a06c276cd8fba7", "option": "useState", "isCorrect": true }
          ]
        }
      ]
    },
    "message": "Quiz fetched successfully",
    "success": true
  }
  ```

#### Update Quiz details
* **Route**: `PUT /api/admin/courses/:moduleId/:videoId/quiz/:quizId`
* **Request Body**:
  ```json
  {
    "timeLimit": 20
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fb9f",
      "title": "React Component Quiz",
      "timeLimit": 20,
      "passingScore": 80,
      "questions": [...]
    },
    "message": "Quiz updated successfully",
    "success": true
  }
  ```

#### Delete Quiz
* **Route**: `DELETE /api/admin/courses/:moduleId/:videoId/quiz/:quizId`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Quiz deleted successfully",
    "success": true
  }
  ```

---

### 7.9 Cache Operations

#### Flush Cache
* **Route**: `POST /api/admin/courses/cache/clear`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Cache cleared successfully",
    "success": true
  }
  ```


### 7.10 Module & Video Publishing (Admin)

#### Change Module Instructor
* **Route**: `PUT /api/admin/courses/:slug/modules/:moduleId`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Request Body**:
  ```json
  {
    "instructor": "64b0f92b77a06c276cd8fb12"
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "title": "Module Title",
      "instructor": "64b0f92b77a06c276cd8fb12"
    },
    "message": "Module updated successfully",
    "success": true
  }
  ```

#### Publish / Unpublish Video
* **Route**: `PATCH /api/admin/courses/:slug/modules/:moduleId/video/:videoId/status`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Request Body**:
  ```json
  {
    "isPublished": true
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "title": "Hello World Video",
      "isPublished": true
    },
    "message": "تم تحديث حالة النشر بنجاح",
    "success": true
  }
  ```


---

## 8. Instructor Endpoints (`/api/instructor/courses`)

These routes allow instructors to manage videos within modules they are assigned to. Videos uploaded here start as `isPublished: false` and require admin approval.

### 8.1 Get Instructor Courses
Retrieves courses where the instructor has at least one assigned module.
* **Route**: `GET /api/instructor/courses`
* **Headers**: Requires Authentication Cookie (`accessToken`)

### 8.2 Get Instructor Modules
Retrieves modules assigned to the instructor in a specific course.
* **Route**: `GET /api/instructor/courses/:slug/modules`
* **Headers**: Requires Authentication Cookie (`accessToken`)

### 8.3 Manage Videos (Same structure as Admin, but no publishing rights)
Instructors have access to the following endpoints under `/api/instructor/courses/:slug/modules/:moduleId/video`:
* `POST /create-entry` (Create Bunny Video Entry)
* `POST /` (Add Video - defaults to `isPublished: false`)
* `GET /` (List Videos in module)
* `GET /:videoId` (Get single video)
* `PUT /:videoId` (Update video - cannot change `isPublished`)
* `DELETE /:videoId` (Delete video)
* `POST /:videoId/file` (Add file)
* `DELETE /:videoId/file/:fileId` (Delete file)

---

## 12. Question Endpoints (`/api/questions`, `/api/admin/questions`)

### 12.1 Get All Published Questions (Public)
Retrieves all published questions. Accepts a `category` query parameter to filter by category.
* **Route**: `GET /api/questions`
* **Query Parameters**:
  * `category` (String, optional)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "64b0f92b77a06c276cd8fc40",
        "question": "What is the refund policy?",
        "answer": "You can request a refund within 14 days.",
        "category": "general",
        "order": 1,
        "isPublished": true,
        "createdAt": "2026-07-14T07:00:00.000Z",
        "updatedAt": "2026-07-14T07:00:00.000Z"
      }
    ],
    "message": "Questions fetched successfully",
    "success": true
  }
  ```

### 12.2 Get Question by ID (Public)
Retrieves a specific published question by ID.
* **Route**: `GET /api/questions/:id`
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fc40",
      "question": "What is the refund policy?",
      "answer": "You can request a refund within 14 days.",
      "category": "general",
      "order": 1,
      "isPublished": true,
      "createdAt": "2026-07-14T07:00:00.000Z",
      "updatedAt": "2026-07-14T07:00:00.000Z"
    },
    "message": "Question fetched successfully",
    "success": true
  }
  ```

### 12.3 Get All Questions (Admin)
Retrieves all questions (including unpublished). Requires admin permissions.
* **Route**: `GET /api/admin/questions`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "64b0f92b77a06c276cd8fc40",
        "question": "What is the refund policy?",
        "isPublished": false
      }
    ],
    "message": "Questions fetched successfully",
    "success": true
  }
  ```

### 12.4 Get Question by ID (Admin)
Retrieves a specific question by ID. Requires admin permissions.
* **Route**: `GET /api/admin/questions/:id`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fc40",
      "question": "What is the refund policy?",
      "isPublished": false
    },
    "message": "Question fetched successfully",
    "success": true
  }
  ```

### 12.5 Create Question (Admin)
Creates a new question. Requires admin permissions.
* **Route**: `POST /api/admin/questions`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Request Body**:
  ```json
  {
    "question": "What is the refund policy?",
    "answer": "You can request a refund within 14 days.",
    "category": "general",
    "order": 1,
    "isPublished": true
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 201,
    "data": {
      "_id": "64b0f92b77a06c276cd8fc40",
      "question": "What is the refund policy?",
      "isPublished": true
    },
    "message": "Question created successfully",
    "success": true
  }
  ```

### 12.6 Update Question (Admin)
Updates an existing question. Requires admin permissions.
* **Route**: `PUT /api/admin/questions/:id`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Request Body**:
  ```json
  {
    "isPublished": false
  }
  ```
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "64b0f92b77a06c276cd8fc40",
      "question": "What is the refund policy?",
      "isPublished": false
    },
    "message": "Question updated successfully",
    "success": true
  }
  ```

### 12.7 Delete Question (Admin)
Deletes a question. Requires admin permissions.
* **Route**: `DELETE /api/admin/questions/:id`
* **Headers**: Requires Authentication Cookie (`accessToken`)
* **Expected Output**:
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Question deleted successfully",
    "success": true
  }
  ```
