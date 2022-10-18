import './style.css';
import './fontstyle.css';
import { AsyncHook } from 'tapable';


const taskMaster = {
    projList: {
        'default':[
        { name: 'vote', description: 'Go to gordon head and vote', dueDate: 'Today', priority: 'high'},
        { name: 'ToDo Project', description: 'Add in a bunch of code', dueDate: 'This week', priority: 'high'},
        { name: 'Pomodoro Project', description: 'Add some graphs and shit', dueDate: 'This month', priority: 'medium' }
    ]
    },

    storeProjList() {
        console.log(this.projList);
        localStorage.setItem('ToDo', JSON.stringify(taskMaster.projList));
        console.log(localStorage.getItem('ToDo'));
        console.log(JSON.parse(localStorage.getItem('ToDo')));
    },

    addProject(project) {
        //if project doesnt exist, create
        if (!Object.hasOwn(this.projList, project)) {
            Object.defineProperty(this.projList, project, {
                value: [],
                enumerable: true,
                configurable: true
                //needs to be enumerable so JSON.stringify can read.
                //needs to be configurable, so we can delete the property(project) if needed.
            })
        }
        else {
            alert('A project with that name already exists!')
        }

        this.storeProjList()
    },

    removeProject(project) {
        delete this.projList[project];
        this.storeProjList();
    },


    addTask(task, project = 'default') {
        //if project doesnt exist, create and push task in an array
        
        if (!Object.hasOwn(this.projList, project)) {
            this.addProject(project);   
        }

        this.projList[project].push(task);
        console.log(this.projList[project]);

        this.storeProjList();
    },

    removeTask(project, index) {
        console.log(project, index);
        this.projList[project].splice(index, 1)
        this.storeProjList();
    },

    task(name, description, dueDate, priority) {
        return {name, description, dueDate, priority}
    
        // const getName = () => name;
        // const getDescription = () => description;
        // const getDueDate = () => dueDate;
        // const getPriority = () => priority;

        // const setName = (newName) => name = newName;
        // const setDescription = (newDescription) => description = newDescription;
        // const setDueDate = (newDueDate) => dueDate = newDueDate;
        // const setPriority = (newPriority) => priority = newPriority;

        // return {getName, setName, getDescription, setDescription, getDueDate, setDueDate, getPriority, setPriority }
    }
}

const Ui = (function () {
    const tasks = document.querySelector('.tasks')
    const form = document.querySelector('.form')
    const formDisplay = document.querySelector('.form-popup');
    const formXBtn = document.querySelector('.x');
    const sidebar = document.querySelector('.sidebar');
    let priorities = document.querySelectorAll(".input-priority div");
    
    const loadTask = function (task, project, index) {
        const newtask = document.createElement('div')
        newtask.classList.add('task')
        newtask.classList.add(task['priority'])
        tasks.appendChild(newtask)

        const divName = document.createElement('div')
        divName.classList.add('name')
        divName.textContent = task.name
        newtask.appendChild(divName)

        const divDescription = document.createElement('div')
        divDescription.classList.add('description')
        divDescription.textContent = task.description
        newtask.appendChild(divDescription)

        const divDueDate = document.createElement('div')
        divDueDate.classList.add('duedate')
        divDueDate.textContent = task.dueDate
        newtask.appendChild(divDueDate)

        const divTaskTools = document.createElement('div')
        divTaskTools.classList.add('tasktools')
        newtask.appendChild(divTaskTools)

        const deleteTaskBtn = document.createElement('span')
        deleteTaskBtn.classList.add('material-symbols-outlined', 'deletetask')
        deleteTaskBtn.textContent = 'delete'
        divTaskTools.appendChild(deleteTaskBtn)

        deleteTaskBtn.addEventListener('click', () => {
            taskMaster.removeTask(project, index);
            loadTaskList(project);
        })
    }

    const loadTaskList = function (project) {
        //taskList must be array of tasks
        console.log(taskMaster.projList)
        tasks.innerHTML = "";
        taskMaster.projList[project].forEach(task => {
            loadTask(task, project, taskMaster.projList[project].indexOf(task));
        });

        //load new task btn at end of list
        const newTaskBtn = document.createElement('div')
        newTaskBtn.classList.add('newtask', 'material-symbols-outlined')
        newTaskBtn.textContent = 'add'
        tasks.appendChild(newTaskBtn)
        newTaskBtn.addEventListener('click', () => {
            formDisplay.style.display = "grid";
        })
    }

    const loadProjList = function () {
        sidebar.textContent = ""
        let projArray = (Object.keys(taskMaster.projList))
        projArray.forEach(project => {
            const divProject = document.createElement('div')
            const divProjectTitle = document.createElement('div')
           
            divProject.classList.add('project')
            divProjectTitle.textContent = project

            if (!(project == 'default')) {
                //dont allow deletion of default project
                console.log('test');
                const divProjectDelete = document.createElement('span')
                divProjectDelete.classList.add('material-symbols-outlined')
                divProjectDelete.textContent = 'delete'
                divProject.appendChild(divProjectDelete)

                divProjectDelete.addEventListener('click', () => {
                    if (window.confirm(`Are you sure you want to delete the project "${project}"?`)) {
                        taskMaster.removeProject(project)
                        loadTaskList('default')
                        loadProjList()
                    }
                
            })
            }

            divProject.appendChild(divProjectTitle)

            
            sidebar.appendChild(divProject);

            divProjectTitle.addEventListener('click', () => {
                loadTaskList(project);
            })


        })
    }

    const loadListeners = function () {

        //new task form submitted
        form.addEventListener('submit', (event) => {
            let name = (form.elements['name'].value);
            let description = (form.elements['description'].value);
            let duedate = (form.elements['duedate'].value);
            let priority = document.querySelector('.highlighted').id;
            let proj = (form.elements['project'].value);
            let t = taskMaster.task(name, description, duedate, priority);

            event.preventDefault();
            taskMaster.addTask(t, proj);
            form.reset();
            formDisplay.style.display = "none";
            loadTaskList(proj);
            loadProjList();
            
        })

        priorities.forEach((btn) => {
        btn.addEventListener('click', () => {
            priorities.forEach((btnz) => {
                    btnz.classList.remove("highlighted")
            })
            btn.classList.add('highlighted')
            })
        })

        formXBtn.addEventListener('click', () => {
            formDisplay.style.display = "none";
        })
    }

    return { newTask: loadTask, loadTaskList, loadListeners, loadProjList }
})();

const storage = (function () {
    //from MDN web docs
    const storageAvailable = function (type) {
        let storage;
        try {
            storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    };
    return {storageAvailable}
})();


if (storage.storageAvailable('localStorage')) {
    taskMaster.projList = JSON.parse(localStorage.getItem('ToDo'));
    console.log(taskMaster.projList)
}
else {
    taskMaster.taskList = []
    console.log('s')
}

Ui.loadListeners();
Ui.loadTaskList('default');
Ui.loadProjList();






