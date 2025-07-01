# Centralized Notes Sharing Platform

A full-stack web application for creating, managing, and sharing notes with other users.

## Features

- **User Authentication**: Register and login functionality
- **Note Management**: Create, edit, delete, and view notes
- **Privacy Controls**: Public and private note sharing
- **Search & Filter**: Find notes by title, content, or tags
- **File Upload**: Upload and manage files
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Dynamic content updates

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Lucide React (icons)
- Context API for state management

### Backend
- Node.js
- Express.js
- Multer (file uploads)
- CORS
- In-memory data storage (can be replaced with database)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd centralized-notes-platform
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm start
   ```
   The server will run on http://localhost:5000

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The app will run on http://localhost:3000

### Default Credentials
- Username: `admin`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Notes
- `GET /api/notes` - Get all accessible notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### File Upload
- `POST /api/upload` - Upload file

### Users
- `GET /api/users` - Get all users

## Project Structure

```
centralized-notes-platform/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Features Overview

### Authentication System
- Secure login and registration
- Token-based authentication
- User session management

### Note Management
- Rich text note creation
- Public/private visibility settings
- Tag-based organization
- Search functionality

### File Upload System
- File attachment support
- Secure file storage
- File access control

### Responsive Design
- Mobile-first design approach
- Cross-device compatibility
- Modern UI/UX patterns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Real-time collaboration
- Rich text editor
- Email notifications
- Advanced search filters
- User roles and permissions
- Note categories and folders
- Export functionality
- Dark mode theme