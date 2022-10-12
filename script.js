const taskMaster = {
    'currentID': -1,
    'tasklist': {},
    addTask() {
        taskMaster.currentID++
        taskMaster.tasklist[taskMaster.currentID] = taskMaster.task(taskMaster.currentID, 'Car', 'Pick up car before 6pm at CDN tire', 'today', 'high')
        return taskMaster.tasklist[taskMaster.currentID]
    },

    task(id, name, description, dueDate, priority) {
    
        const getName = () => name;
        const getDescription = () => description;
        const getDueDate = () => dueDate;
        const getPriority = () => priority;

        const setName = (newName) => name = newName;
        const setDescription = (newDescription) => description = newDescription;
        const setDueDate = (newDueDate) => dueDate = newDueDate;
        const setPriority = (newPriority) => priority = newPriority;

        return {id, getName, setName, getDescription, setDescription, getDueDate, setDueDate, getPriority, setPriority }
    }
}

const Dom = (function () {
    let tasks = document.querySelector('.tasks')
    
    const newTask = function (task) {
        const newtask = document.createElement('div')
        newtask.classList.add('task')
        newtask.id = task.id
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

    const removeTask = function (id) {
        let deletedtask = document.getElementById(id)
        deletedtask.remove();
    }
    return { newTask, removeTask}
})();



const newTaskBtn = document.querySelector('.newtask button')
newTaskBtn.addEventListener('click', (e) => {e
    Dom.newTask(taskMaster.addTask())
})

