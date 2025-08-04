"""
URL configuration for todoapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
""" 
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('todolist', views.all_todo, name="todolist"), # This is the api that returns list of tasks
    path('add_task', views.add_task, name="add_task"), # API for adding task
    path('delete_task', views.delete_task, name="delete_task"),
    path('updating_status/<int:task_id>', views.update_data, name="update_status"),
    path('update_data/<int:task_id>', views.update_status, name='update_data'),
    path('manage_task', views.manage_task, name="manage_task")
]
