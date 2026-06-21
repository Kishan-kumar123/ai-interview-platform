# AI Interview Platform

AI Interview Platform is a full-stack web application designed to help students and job seekers prepare for technical, HR, and aptitude interviews through AI-powered mock interviews, coding practice, and resume analysis.

## Features

* AI-powered mock interviews
* Technical interview preparation
* HR interview question practice
* Aptitude and reasoning tests
* Coding practice challenges
* Resume analyzer
* User authentication (Register/Login)
* Dashboard for tracking progress
* Responsive and modern UI

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### AI Integration

* Google Gemini AI

## Project Structure

```bash
ai-interview-platform/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── routes/
│
├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
├── .env.example
├── package.json
└── vite.config.js
```

## Installation

1. Clone the repository

```bash
git clone https://github.com/Kishan-kumar123/ai-interview-platform.git
```

2. Navigate to the project directory

```bash
cd ai-interview-platform
```

3. Install dependencies

```bash
npm install
```

4. Configure environment variables

Create a `.env` file and add:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
APP_URL=http://localhost:3000
```

5. Start the development server

```bash
npm run dev
```

## Future Enhancements

* AI feedback on interview answers
* Voice-based mock interviews
* Leaderboards and contests
* Performance analytics
* Company-specific interview preparation

## Author

**Kishan Kumar**

* GitHub: https://github.com/Kishan-kumar123
* LinkedIn: https://www.linkedin.com/in/kishan-kumar-26aa13296

## License

This project is created for learning, interview preparation, and portfolio purposes.
