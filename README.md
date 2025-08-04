# 📝 Django Todo Application

A full-featured todo application built with Django, featuring user authentication, task management, and a responsive web interface.

## 🚀 Features

- **User Authentication**: Secure registration, login, and logout functionality
- **Task Management**: Create, read, update, and delete tasks
- **Task Status**: Mark tasks as complete/incomplete with visual indicators
- **Task Details**: Add descriptions to tasks and expand/collapse for viewing
- **Edit Tasks**: Update task titles and descriptions via modal interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Task list refreshes automatically after changes

## 🛠️ Tech Stack

- **Backend**: Django 5.2
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: SQLite (default Django database)
- **Styling**: Bootstrap 5 for responsive design
- **Icons**: Font Awesome for UI icons

## 📋 Prerequisites

- Python 3.8 or higher
- Django 5.2 or higher
- pip (Python package manager)

## 🏗️ Installation & Setup

### 1. Clone the Repository
```bash
git clone git clone https://github.com/Afshan08/Todoapp.git
cd django-todo-app
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install django
```

### 4. Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 6. Start the Development Server
```bash
python manage.py runserver
```

The application will be available at `http://localhost:8000`

## 📱 Usage

### For Users
1. **Register**: Create a new account or login with existing credentials
2. **Add Tasks**: Click the "+" button to add new tasks with titles and descriptions
3. **Manage Tasks**: 
   - Click the status badge to mark tasks as complete/incomplete
   - Click the dropdown arrow (▼) to expand/collapse task descriptions
   - Click the three dots (⋯) for more options (edit/delete)
4. **Edit Tasks**: Select "Edit" from the options menu to update task details
5. **Delete Tasks**: Select "Delete" from the options menu to remove tasks

### For Developers
- **Admin Panel**: Access Django admin at `http://localhost:8000/admin`
- **API Endpoints**: All task operations are handled via RESTful endpoints

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Home page |
| `/login/` | GET/POST | User login |
| `/register/` | GET/POST | User registration |
| `/logout/` | POST | User logout |
| `/manage_task/` | GET | Task management page |
| `/todolist` | POST | Get all tasks for logged-in user |
| `/add_task` | POST | Create new task |
| `/delete_task` | POST | Delete task |
| `/update_data/<id>` | POST | Update task status |
| `/updating_status/<id>` | POST | Update task details |

## 🎯 Project Structure

```
todoapp/
├── manage.py                 # Django management script
├── todoapp/                  # Main Django app
│   ├── __init__.py
│   ├── settings.py          # Django settings
│   ├── urls.py              # URL routing
│   ├── views.py             # View functions
│   ├── models.py            # Database models
│   ├── admin.py             # Admin configuration
│   ├── login_form.py        # Authentication forms
│   └── migrations/          # Database migrations
├── static/                  # Static files
│   ├── css/
│   │   ├── styles.css       # Global styles
│   │   └── tasks.css        # Task-specific styles
│   ├── js/
│   │   └── manage_tasks.js  # Frontend JavaScript
│   └── img/                 # Images and icons
└── templates/               # HTML templates
    ├── index.html           # Home page
    ├── login.html           # Login page
    ├── registeration.html   # Registration page
    ├── manage_task.html     # Task management page
    └── layout.html          # Base template
```


## 🔐 Security Features

- CSRF protection enabled
- User authentication required for task operations
- Input validation on both frontend and backend
- SQL injection prevention via Django ORM

## 🚀 Deployment

### Using Docker
```bash
# Build and run with Docker
docker build -t django-todo-app .
docker run -p 8000:8000 django-todo-app
```

### Using Heroku
```bash
# Install Heroku CLI and deploy
heroku create your-app-name
git push heroku main
```

### Environment Variables
Create a `.env` file in the project root:
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Django documentation and community
- Bootstrap for responsive design framework
- Font Awesome for icons

## 📞 Support

For support, create an issue in the GitHub repository.
