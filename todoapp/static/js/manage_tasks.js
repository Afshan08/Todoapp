document.addEventListener("DOMContentLoaded", () => {
    fetchTasks();
    const addTask = document.querySelector('.Task-editor');
    const addTaskButton = document.querySelector('#add-task');
    addTaskButton.addEventListener('click', () => addTasks(addTask, addTaskButton));
    const taskSubmitButton = document.querySelector('#task-submit-button');
    const taskCancelButton = document.querySelector('#task-cancel-button');
    taskSubmitButton.addEventListener("click", () => sumbitTask());
    taskCancelButton.addEventListener("click", () => cancelTask(addTask, addTaskButton));

});


function fetchTasks() {
    fetch("/todolist", {
        method: "POST",
    }).then(response => {
        if (!response.ok) throw new Error("Failed to fetch tasks");
        return response.json();
    })
    .then(data => {
        console.log("API response:", data);  
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = "";

        if (data.tasks.length === 0) {
            taskList.innerHTML = "<p class='text-muted'>No tasks found.</p>";
            return;
        }

        data.tasks.forEach(task => {
            const taskItem = document.createElement("div");
            taskItem.className = "list-group-item d-flex flex-column";

            const topRow = document.createElement("div");
            topRow.style.display = "flex";
            topRow.style.justifyContent = "space-between";
            topRow.style.alignItems = "center";

            const leftGroup = document.createElement("div");
            leftGroup.style.display = "flex";
            leftGroup.style.alignItems = "center";
            leftGroup.style.gap = "10px";

            const taskText = document.createElement("span");
            taskText.textContent = task.title;
            if (task.completed){
            taskText.style.textDecoration = "line-through";
            }
            else {
                taskText.style.textDecoration = "none";
            }

            const statusBadge = document.createElement("span");
            statusBadge.className = task.completed ? "badge bg-success" : "badge bg-warning text-dark";
            statusBadge.textContent = task.completed ? "Done" : "Pending";

            // Add click event to update status
            statusBadge.style.cursor = "pointer";
            statusBadge.addEventListener("click", () => {
                fetch(`/update_data/${task.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to update task");
                    }
                    return response.json();
                })
                .then(data => {
                    fetchTasks();
                })
                .catch(error => {
                    console.log("Error updating task:", error);
                });
            });

            leftGroup.appendChild(taskText);
            

            const dropdownContainer = document.createElement("div");
            dropdownContainer.style.display = "flex";
            dropdownContainer.style.flexDirection = "column";
            dropdownContainer.style.alignItems = "flex-start";

            const dropdownToggle = document.createElement("button");
            dropdownToggle.textContent = "▼";
            dropdownToggle.className = "btn btn-sm  ms-2";
            dropdownToggle.style.cursor = "pointer";  // Bootstrap green
            dropdownToggle.style.color = "#198754";
            dropdownToggle.style.border = "none";
            dropdownToggle.style.borderRadius = "5px";
            dropdownToggle.style.minWidth = "30px";
            dropdownToggle.style.minHeight = "30px";
            dropdownToggle.style.fontSize = "0.75em"
            
            const ParentdescriptionDiv = document.createElement("div");
            ParentdescriptionDiv.className = "ParentdescriptionDiv";
            ParentdescriptionDiv.innerHTML = "Description: ";
            

            // Description div (initially hidden)
            const descriptionDiv = document.createElement("div");
            descriptionDiv.style.display = "none";
            descriptionDiv.style.marginTop = "5px";
            descriptionDiv.textContent = task.description || "No description available.";
            descriptionDiv.style.width = "100%";
            descriptionDiv.style.fontSize = "0.95rem";
            descriptionDiv.style.color = "#333";
            descriptionDiv.style.textAlign = 'left';
            descriptionDiv.className = "description-div"
            

            // Toggle logic - fixed to target specific task elements
            dropdownToggle.addEventListener("click", () => {
                // Find the description div and parent description div within this task item
                const taskDescriptionDiv = taskItem.querySelector('.description-div');
                const taskParentDescriptionDiv = taskItem.querySelector('.ParentdescriptionDiv');
                
                [taskDescriptionDiv, taskParentDescriptionDiv].forEach(div => {
                    if (!div) {
                        console.warn("Element not found");
                        return;
                    }
                    console.log(`Toggling: current display:`, div.style.display);
                    if (div.style.display === "none" || div.style.display === "") {
                        div.style.display = "block";
                    } else {
                        div.style.display = "none";
                    }
                });
            });
            
           const moreOptionsButton = document.createElement("div");
           moreOptionsButton.classList.add("fa-solid", "fa-ellipsis-vertical");
           
            moreOptionsButton.style.cursor = "pointer";
            moreOptionsButton.style.fontSize = "18px";
            moreOptionsButton.style.color = "#198754"  // Bootstrap green
            moreOptionsButton.style.display = "flex";

            const optionsMenu = document.createElement("div");
            optionsMenu.style.position = "absolute";
            optionsMenu.style.backgroundColor = "#fff";
            optionsMenu.style.border = "1px solid #ccc";
            optionsMenu.style.borderRadius = "5px";
            optionsMenu.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
            optionsMenu.style.padding = "5px 0";
            optionsMenu.style.display = "none"; // hidden by default
            optionsMenu.style.zIndex = "1000";

            // Sample option items
            const editOption = document.createElement("div");
            editOption.textContent = "Edit";
            editOption.style.padding = "8px 16px";
            editOption.style.cursor = "pointer";
            editOption.addEventListener("click", () => {
                openEditModal(task);
            });

            const deleteOption = document.createElement("div");
            deleteOption.textContent = "Delete";
            deleteOption.style.padding = "8px 16px";
            deleteOption.style.cursor = "pointer";
            deleteOption.addEventListener("click", () => {
                fetch(`/delete_task`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({task_id: task.id})
                }).then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to delete task");
                    }
                    return response.json();
                }).then(data => {
                    fetchTasks();
                }).catch(error => {
                    console.log("Error deleting task:", error);
                })
            });

            // Hover effect
            [editOption, deleteOption].forEach(option => {
                option.addEventListener("mouseenter", () => option.style.backgroundColor = "#f1f1f1");
                option.addEventListener("mouseleave", () => option.style.backgroundColor = "white");
            });

            // Append options to menu
            optionsMenu.appendChild(editOption);
            optionsMenu.appendChild(deleteOption);

            moreOptionsButton.addEventListener("click", () =>{
                if (optionsMenu.style.display == "none"){
                    optionsMenu.style.display = "block";
                }
                else{
                    optionsMenu.style.display = "none";
                }
            })

            
            const rightGroup = document.createElement("div");
            rightGroup.style.display = "flex";
            rightGroup.style.alignItems = "center";
            rightGroup.style.gap = "8px"; // Optional: spacing between dropdown and 3-dots

            dropdownContainer.appendChild(dropdownToggle);
            

            rightGroup.appendChild(statusBadge);
            rightGroup.appendChild(dropdownContainer);
            rightGroup.appendChild(moreOptionsButton);
            



            topRow.appendChild(leftGroup);
            topRow.appendChild(rightGroup);


            taskItem.appendChild(topRow);
            taskItem.appendChild(ParentdescriptionDiv);
           taskItem.appendChild(descriptionDiv);
           taskItem.style.position = "relative"; // make taskItem the positioning context
            rightGroup.appendChild(optionsMenu);

            taskList.appendChild(taskItem);
        });
    })
    .catch(error => {
        console.error(error);
        alert("An error occurred while loading tasks.");
    });
}


function sumbitTask(){
    const title = document.querySelector("#title");
    const description = document.querySelector("#description");
    
    if (!title.value.trim()) {
        alert("Please enter a task title");
        return;
    }
    
    console.log("Submitting task:", title.value, description.value);
    
    addTaskToDatabase(title.value, description.value)
        .then(() => {
            console.log("Task successfully added to database");
            
            // Clear form fields
            title.value = '';
            description.value = '';
            
            // Hide the form
            const addTask = document.querySelector('.Task-editor');
            const addTaskButton = document.querySelector('#add-task');
            cancelTask(addTask, addTaskButton);
            
            // Refresh the task list
            return fetchTasks();
        })
        .then(() => {
            console.log("Tasks refreshed successfully");
        })
        .catch(error => {
            console.error("Error in submitTask:", error);
            alert("Failed to add task. Please try again.");
        });
}

function addTaskToDatabase(title, description){
    return fetch(`/add_task`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": title,
            "description": description
        })
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to add task");
        return response.json();
    })
    .then(data => {
        console.log("Task added to database:", data);
        return data;
    })
    .catch(error => {
        console.error("Error adding task:", error);
        throw error;
    });
}

function cancelTask(addTask, addTaskButton){
    addTask.style.display = "none";
    addTaskButton.style.display = "block";
}

// Edit modal functions
function openEditModal(task) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('editTaskModal');
    if (!modal) {
        modal = createEditModal();
    }
    
    // Populate form with task data
    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-description').value = task.description || '';
    
    // Show modal
    modal.style.display = 'block';
}

function createEditModal() {
    const modal = document.createElement('div');
    modal.id = 'editTaskModal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.zIndex = '1001';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.4)';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fefefe';
    modalContent.style.margin = '15% auto';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '500px';
    modalContent.style.borderRadius = '5px';
    
    modalContent.innerHTML = `
        <h2>Edit Task</h2>
        <form id="edit-task-form">
            <input type="hidden" id="edit-task-id">
            <div class="mb-3">
                <label for="edit-task-title" class="form-label">Title</label>
                <input type="text" class="form-control" id="edit-task-title" required>
            </div>
            <div class="mb-3">
                <label for="edit-task-description" class="form-label">Description</label>
                <textarea class="form-control" id="edit-task-description" rows="3"></textarea>
            </div>
            <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
        </form>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add form submit handler
    document.getElementById('edit-task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updateTask();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeEditModal();
        }
    });
    
    return modal;
}

function closeEditModal() {
    const modal = document.getElementById('editTaskModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function updateTask() {
    const taskId = document.getElementById('edit-task-id').value;
    const title = document.getElementById('edit-task-title').value;
    const description = document.getElementById('edit-task-description').value;
    
    fetch(`/updating_status/${taskId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            task_id: parseInt(taskId),
            title: title,
            description: description
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to update task");
        }
        return response.json();
    })
    .then(data => {
        console.log("Task updated:", data);
        closeEditModal();
        fetchTasks(); // Refresh the task list
    })
    .catch(error => {
        console.error("Error updating task:", error);
        alert("Failed to update task. Please try again.");
    });
}

function addTasks(addTask, addTaskButton){
    if (addTask.style.display == 'block'){
    addTask.style.display = 'none';
    addTaskButton.style.display = 'block';
    }
    else {
    addTask.style.display = 'block';
    addTaskButton.style.display = "none";
    }
}

