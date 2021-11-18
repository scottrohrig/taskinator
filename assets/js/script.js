var taskIdCounter = 0;
var formEl = document.querySelector('#task-form');
var taskList = document.querySelector('#tasks-to-do');
var taskText = document.querySelector('input[name="task-name"]');
var taskType = document.querySelector('select[name="task-type"]');
var pageContent = document.querySelector('.page-content')

const taskFormHandler = function(event) {
    event.preventDefault();

    if ( !taskText.value || !taskType.value ) {
        alert('Please fill out the task first.')
        return false;
    }

    var taskDataObj = {
        name: taskText.value,
        type: taskType.value
    };

    createTaskEl(taskDataObj);
    formEl.reset();

}

const createTaskEl = function(taskDataObj) {
    
    // create list item
    var listItem = document.createElement('li');
    listItem.className = 'task-item';

    // give each task an id as a custom attribute
    listItem.setAttribute('data-task-id', taskIdCounter);
    
    // create div to hold task info and add to list item
    var taskInfo = document.createElement('div');
    // assign class name
    taskInfo.className = 'task-info';
    // add html to div
    taskInfo.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    
    listItem.appendChild(taskInfo);
    
    var taskActionEl = createTaskActions(taskIdCounter);
    listItem.appendChild(taskActionEl);

    // add entire list item to list
    taskList.appendChild(listItem);
    taskIdCounter++;
}

const createTaskActions = function(taskId) {
    // create a new div with class name "task-actions"
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "btn edit-btn";
    editButton.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButton);

    // create delete button
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn delete-btn";
    deleteButton.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButton);

    // create select-status dropdown element
    var statusSelectEl = document.createElement('select');
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute('name', 'status-change');
    statusSelectEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ['To Do', 'In Progress', 'Completed'];

    for (let choice of statusChoices) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = choice;
        statusOptionEl.setAttribute('value', choice);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};


const taskButtonHandler = function(event) {
    
    // edit task
    if (event.target.matches(".edit-btn")) {
        var taskId = event.target.getAttribute('data-task-id');
        editTask(taskId);
    }
    
    // delete task
    if (event.target.matches(".delete-btn")) {
        var taskId = event.target.getAttribute('data-task-id');
        deleteTask(taskId);
    }
};

const editTask = function(taskId) {
    var taskSelected = document.querySelector('.task-item[data-task-id="' + taskId + '"]');
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector('span.task-type').textContent;

    document.querySelector('input[name="task-name"').value = taskName;
    document.querySelector('select[name="task-type"').value = taskType;

    document.querySelector('#save-task').textContent = 'Save Task';

    formEl.setAttribute('data-task-id', taskId);

};

const deleteTask = function(taskId) {
    var taskSelected = document.querySelector('.task-item[data-task-id="' + taskId + '"]');

    if (confirmDeleteTask()) {
        taskSelected.remove();
    }
};

const confirmDeleteTask = function() {
    return window.confirm('Are you sure you want to delete this task?')
}

formEl.addEventListener('submit', taskFormHandler);
pageContent.addEventListener('click', taskButtonHandler);
