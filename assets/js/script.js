var formEl = document.querySelector('#task-form');
var tasksToDo = document.querySelector('#tasks-to-do');
var tasksInProgress = document.querySelector('#tasks-in-progress');
var tasksCompleted = document.querySelector('#tasks-completed');
var taskText = document.querySelector('input[name="task-name"]');
var taskType = document.querySelector('select[name="task-type"]');
var pageContent = document.querySelector('.page-content');
var snackBar = document.getElementById('snackbar');

var tasks = [];
var taskIdCounter = 0;

/** captures 'add task' event and delegates task values to new object creation or edited task object */
const taskFormHandler = function(event) {
    event.preventDefault();
    
    if ( !taskText.value || !taskType.value ) {
        alert('Please fill out the task first.')
        return false;
    }

    var isEdit = formEl.hasAttribute('data-task-id');
    
    if (isEdit) {
        // get task id
        var taskId = formEl.getAttribute('data-task-id');
        // complete the edit
        completeEditTask(taskText.value, taskType.value, taskId);
    } else {

        var taskDataObj = {
            name: taskText.value,
            type: taskType.value,
            status: 'to do'
        };
        
        createTaskEl(taskDataObj);
        formEl.reset();
    }
};

/** creates list and child elements assigns attributes */
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
    
    // add task obj to the 'tasks' data array
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    saveTasks();
    
    // add entire list item to To DO element
    tasksToDo.appendChild(listItem);
    taskIdCounter++;
};

/** creates an inner div inside the task element with editing functionality */
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

/** delegates edit and delete actions */
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

/** moves tasks to the corresponding task list */
const taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute('data-task-id');

    // get the current selected option's value and convert to lowercase
    // the event.target == the 'select' ele, the value == the selected 'option'
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector('.task-item[data-task-id="' + taskId + '"]');

    if ( statusValue === 'to do') {
        tasksToDo.appendChild(taskSelected);
    } else if ( statusValue === 'in progress') {
        tasksInProgress.appendChild(taskSelected);
    } else if ( statusValue === 'completed') {
        tasksCompleted.appendChild(taskSelected);
    }

    // update tasks array
    for (let task of tasks) {
        if ( task.id === parseInt(taskId) ) {
            toast(sep=", ", task.status, statusValue);
            task.status = statusValue;
        }
    }

    saveTasks();
};

/** gets task values from input and sets task values on task with matching id */
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


const completeEditTask = function(taskName,taskType,taskId) {
    // get ref to task-item by id
    var taskSelected = document.querySelector('.task-item[data-task-id="' + taskId + '"]');
    // set new values
    taskSelected.querySelector('h3.task-name').textContent = taskName;
    taskSelected.querySelector('span.task-type').textContent = taskType;

    // loop thru tasks array and edit task obj with new values
    for (let task of tasks) {
        if (task.id === parseInt(taskId)) {
            task.name = taskName;
            task.type = taskType;
        }
    }

    saveTasks();
    
    // show updated message
    var slicedName = taskName.slice(
        0, taskName.length - Math.floor(taskName.length*.65)
        )
    toast(sep=' ', `Updated Task: ${slicedName}...!`)

    // clean up [form & button] after edit
    formEl.removeAttribute('data-task-id');
    document.querySelector('#save-task').textContent = 'Add Task';
};

/** removes the task from the id */
const deleteTask = function(taskId) {
    var taskSelected = document.querySelector('.task-item[data-task-id="' + taskId + '"]');

    if (confirmDeleteTask()) {
        taskSelected.remove();

        // create new empty array
        var updatedTaskArray = [];

        // loop to add non-matching tasks
        for (let task of tasks) {
            if (task.id !== parseInt(taskId)) {
                updatedTaskArray.push(task);
            }
        }
        // reassign tasks to updated tasks
        tasks = updatedTaskArray;

        toast('Task deleted!')
    }
    saveTasks();
};

/** window alert to provide user confirmation option */
const confirmDeleteTask = function() {
    return window.confirm('Are you sure you want to delete this task?')
};

/** save the list of tasks to localStorage */
const saveTasks = function() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};


const loadTasks = function() {
    // parse localStorage into array
    tasks = JSON.parse(localStorage.getItem('tasks'));
    
    // null check validation
    if ( !tasks ) {
        tasks = [];
        return false
    }
    
    for (let task of tasks) {
        
        // keep tasks in sync
        task.id = taskIdCounter;
        var listItem = document.createElement('li');
        listItem.className = 'task-item';
        listItem.setAttribute('data-task-id', task.id);
        
        var taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        taskInfo.innerHTML = "<h3 class='task-name'>" + task.name + "</h3><span class='task-type'>" + task.type + "</span>";
        
        listItem.appendChild(taskInfo);
        
        var taskActions = createTaskActions(task.id);
        listItem.appendChild(taskActions);

        // set the value of the `select` element in the `list item` to the corresponding task list [1: to do, 2: in progress, 3: completed]
        if (task.status === 'to do') {
            listItem.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDo.appendChild(listItem);
        } else if (task.status === 'in progress') {
            listItem.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgress.appendChild(listItem);
        } else if (task.status === 'completed') {
            listItem.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompleted.appendChild(listItem);
        }
                
        taskIdCounter++;
        console.log(listItem);
    }
};

/** Show a toast notification with a given */
const toast = function(sep=' ', ...message) {
    if (message.length > 1) {

        message = message.join(sep)
    }

    snackBar.querySelector('span').textContent = message;
    snackBar.className = 'show';
    setTimeout(function() { snackBar.className = snackBar.className.replace('show', ''); }, 3000 );

};

loadTasks();

formEl.addEventListener('submit', taskFormHandler);
pageContent.addEventListener('click', taskButtonHandler);
pageContent.addEventListener('change', taskStatusChangeHandler);

