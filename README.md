# SkillSwap

SkillSwap is a peer-to-peer platform designed to democratize learning by allowing users to trade skills instead of money. Think of it like a barter system but for knowledge—you teach someone what you know, and they teach you something they know in return. 

I built this as a comprehensive full-stack project to solve a common problem: people want to learn new skills but often find courses or tutors too expensive. SkillSwap removes the financial barrier by matching individuals who have complementary skills and goals.

## Core Features

- **Skill Matching:** Users set up their profiles with the skills they can teach and the skills they want to learn. The platform helps match them with ideal learning partners.
- **Real-Time Messaging:** Once matched, users can communicate instantly through an integrated live chat system to schedule their sessions and share resources.
- **No-Currency System:** The entire platform operates on the principle of direct skill exchange. No payment gateways, no subscription fees—just pure knowledge transfer.
- **Secure Authentication:** Complete user registration and login system ensuring that profiles and conversations remain private.

## Tech Stack

**Frontend:**
- **React (Vite):** Fast, modern UI development.
- **Tailwind CSS:** Fully responsive, utility-first styling.
- **React Router:** For seamless single-page application navigation.
- **React Query & Axios:** To handle data fetching and API communication efficiently.
- **Socket.io-client:** Enabling the real-time chat interface.

**Backend:**
- **Node.js & Express:** Robust server architecture handling the API routes.
- **Sequelize ORM (PostgreSQL):** Managing the relational database schema for users, skills, and chat logs.
- **Socket.io:** Managing real-time bidirectional event-based communication for the messaging feature.
- **JWT & bcryptjs:** Handling secure user authentication and password hashing.
- **Multer:** Managing file and image uploads.

## Deployment

The platform is designed with a decoupled architecture. The backend is configured for deployment on Render (utilizing the included `render.yaml` configuration), while the frontend is optimized for deployment on Vercel.

---
