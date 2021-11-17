var formEl = document.querySelector('#task-form');
var taskList = document.querySelector('#tasks-to-do');
var taskText = document.querySelector('input[name=task-name]');

const createTaskHandler = function(event) {
    event.preventDefault();

    var listItem = document.createElement('li');
    listItem.className = 'task-item';
    listItem.textContent = taskText.value;
    taskList.appendChild(listItem);
}

formEl.addEventListener('submit', createTaskHandler);

