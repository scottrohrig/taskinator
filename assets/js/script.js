var addTaskBtn = document.querySelector("#save-task");
var taskList = document.querySelector('#tasks-to-do');

const createTaskHandler = (textContent) => {
    var listItem = document.createElement('li');
    listItem.className = 'task-item';
    listItem.textContent = textContent;
    taskList.appendChild(listItem)
}

addTaskBtn.addEventListener('click', () => createTaskHandler(prompt('To Do: ')));