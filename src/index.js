import './style.css';
import './fontstyle.css';


const taskMaster = {
    projectList: [],
    taskList: [],

    addProject(project) {
        this.projectList.push(project)
    },

    addTask(task) {
        this.taskList.push(task)
    },

    task(name, description, dueDate, priority) {
    
        const getName = () => name;
        const getDescription = () => description;
        const getDueDate = () => dueDate;
        const getPriority = () => priority;

        const setName = (newName) => name = newName;
        const setDescription = (newDescription) => description = newDescription;
        const setDueDate = (newDueDate) => dueDate = newDueDate;
        const setPriority = (newPriority) => priority = newPriority;

        return {getName, setName, getDescription, setDescription, getDueDate, setDueDate, getPriority, setPriority }
    }
}

const Dom = (function () {
    const tasks = document.querySelector('.tasks')
    const form = document.querySelector('.form')
    const newTaskBtn = document.querySelector('.newtask button')
    const formDisplay = document.querySelector('.form-popup');
    const formXBtn = document.querySelector('.x');
    
    const newTask = function (task) {
        const newtask = document.createElement('div')
        newtask.classList.add('task')
        tasks.appendChild(newtask)

        const divName = document.createElement('div')
        divName.classList.add('name')
        divName.textContent = task.getName()
        newtask.appendChild(divName)

        const divDescription = document.createElement('div')
        divDescription.classList.add('description')
        divDescription.textContent = task.getDescription()
        newtask.appendChild(divDescription)

        const divDueDate = document.createElement('div')
        divDueDate.classList.add('duedate')
        divDueDate.textContent = task.getDueDate()
        newtask.appendChild(divDueDate)

        const divPriority = document.createElement('div')
        divPriority.classList.add('priority')
        divPriority.textContent = task.getPriority()
        newtask.appendChild(divPriority)
    }

    const loadTaskList = function (taskList) {
        tasks.innerHTML = "";
        taskList.forEach(task => {
            newTask(task);
        });
    }

    const removeTask = function (id) {
        let deletedtask = document.getElementById(id)
        deletedtask.remove();
    }

    const loadListeners = function () {
        form.addEventListener('submit', (event) => {
            let name = (form.elements['name'].value);
            let description = (form.elements['description'].value);
            let duedate = (form.elements['duedate'].value);
            let priority = (form.elements['priority'].value);
            let t = taskMaster.task(name, description, duedate, priority);

            event.preventDefault();
            taskMaster.addTask(t);
            form.reset();
            formDisplay.style.display = "none";
            loadTaskList(taskMaster.taskList);
        })

        newTaskBtn.addEventListener('click', () => {
            formDisplay.style.display = "grid";
        })

        formXBtn.addEventListener('click', () => {
            formDisplay.style.display = "none";
        })
    }

    return { newTask, removeTask, loadTaskList, loadListeners }
})();

Dom.loadListeners();







