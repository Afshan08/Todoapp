from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django import forms
from django.contrib import messages
from django.contrib.auth.models import User as Users
import json
from .login_form import LoginForm, RegistrationForm 
from .models import TodoList
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone


def index(request):
    """Render the index page."""
    return render(request, 'index.html')

def login_view(request):
    """Handle user login."""
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('index')
            else:
                messages.error(request, "Invalid username or password.")
    
    else:
        form = LoginForm()

    return render(request, 'login.html', {'form': form})


@login_required
def logout_view(request):
    """Handle user logout."""
    logout(request)
    return redirect('index')


def register_view(request):
    """Handle user registration."""
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            password2 = form.cleaned_data['password2']
            if password != password2:
                messages.error(request, "Passwords do not match.")
                return redirect('register')
            email = form.cleaned_data['email']
            user = Users.objects.create_user(username=username, password=password, email=email)
            user.save()
            login(request, user)
            messages.success(request, "Registration successful. You can now log in.")
            return redirect('index')

    else:
        form = RegistrationForm()

    return render(request, 'registeration.html', {'form': form})


@csrf_exempt
def all_todo(request):
    """This is an api that return list of task of the authenticated user."""
    if request.method == "POST":
        tasks = TodoList.objects.filter(user=request.user)
        return JsonResponse({
            "tasks": [
                {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "completed": task.is_completed,
                } for task in tasks
            ]
        })
    else:
        return JsonResponse({"Error":"Bad request"})
 
 

@csrf_exempt
@login_required  
def add_task(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = request.user.id
        title = data.get('title')
        description = data.get('description')
        print(f"title\n{title}, \n\ndescription:\n{description}\n\n")
        try: 
            if user_id != request.user.id:
                return JsonResponse({"Error": "You are not authorized to add tasks for this user"}, status=403)
            elif not title or not user_id:
                return JsonResponse({"Error": "Incomplete Information"}, status=400)
            task = TodoList.objects.create(
                user=get_object_or_404(Users, id=user_id),
                title=title,
                description=description,
            )
        except Users.DoesNotExist:
            return JsonResponse({"Error": "User does not exist"}, status=404)
        
        return JsonResponse({'message': 'Task created successfully', 'task_id': task.id})
    else:
        return JsonResponse({"Error": "Bad request"}, status=400)
    
 
@csrf_exempt 
@login_required  
def delete_task(request):
    if request.method != "POST":
        return JsonResponse({"Error": "Bad request"}, status=400)

    data = json.loads(request.body)
    task_id = data.get('task_id')

    if not task_id:
        return JsonResponse({"Error": "task_id is required"}, status=400)

    if not TodoList.objects.filter(id=task_id, user=request.user).exists():
        return JsonResponse({"Error": "You are not authorized to delete this task"}, status=403)

    try:
        task = TodoList.objects.get(id=task_id, user=request.user)
        task.delete()
        return JsonResponse({'message': 'Task deleted successfully'})
    except TodoList.DoesNotExist:
        return JsonResponse({"Error": "Task does not exist"}, status=404)

@csrf_exempt
def update_status(request, task_id):
    if request.method == "POST":
        try:
            task = TodoList.objects.get(id=task_id, user=request.user)
            task.is_completed = not task.is_completed
            task.completed_at = timezone.now() if task.is_completed else None
            task.save()
            return JsonResponse({'message': 'Task status updated successfully'})
        except TodoList.DoesNotExist:
            return JsonResponse({"Error": "Task does not exist or you are not authorized to update this task"}, status=404)
    else:
        return JsonResponse({"Error": "Bad request"}, status=400)



@csrf_exempt
@login_required
def update_data(request, task_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        if not task_id:
            return JsonResponse({"error": "task_id is required"}, status=400)

        try:
            task = TodoList.objects.get(id=task_id, user=request.user)
        except TodoList.DoesNotExist:
            return JsonResponse({"error": "Task does not exist or unauthorized"}, status=404)

        # Only update if keys are provided
        for field in ['title', 'description']:
            if field in data:
                setattr(task, field, data[field])

        task.save()
        return JsonResponse({'message': 'Task updated successfully'})

    return JsonResponse({"error": "Bad request method"}, status=400)



def manage_task(request):
    """Render the manage task page."""
    if not request.user.is_authenticated:
        return redirect('login')
    return render(request, 'manage_task.html')

