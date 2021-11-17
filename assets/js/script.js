var formEl = document.querySelector('#task-form');
var taskList = document.querySelector('#tasks-to-do');
var taskText = document.querySelector('input[name="task-name"]');
var taskType = document.querySelector('select[name="task-type"]');

const createTaskHandler = function(event) {
    event.preventDefault();

    // create list item
    var listItem = document.createElement('li');
    listItem.className = 'task-item';

    // create div to hold task info and add to list item
    var taskInfo = document.createElement('div');
    // assign class name
    taskInfo.className = 'task-info';
    // add html to div
    taskInfo.innerHTML = "<h3 class='task-name'>" + taskText.value + "</h3><span class='task-type'>" + taskType.value + "</span>";

    listItem.appendChild(taskInfo);

    // add entire list item to list
    taskList.appendChild(listItem);
}

formEl.addEventListener('submit', createTaskHandler);

