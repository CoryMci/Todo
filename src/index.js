import "./style.css";
import "./fontstyle.css";
import { AsyncHook } from "tapable";
import { formatWithCursor } from "prettier";
import { format } from "date-fns/format";
import { isPast, isThisMonth, isThisWeek, isToday, parse } from "date-fns";

const taskMaster = {
  projList: {
    default: [
      {
        name: "vote",
        description: "Go to gordon head and vote",
        dueDate: "Today",
        priority: "high",
      },
      {
        name: "ToDo Project",
        description: "Add in a bunch of code",
        dueDate: "This week",
        priority: "high",
      },
      {
        name: "Pomodoro Project",
        description: "Add some graphs and shit",
        dueDate: "This month",
        priority: "medium",
      },
    ],
  },

  storeProjList() {
    console.log(this.projList);
    localStorage.setItem("ToDo", JSON.stringify(taskMaster.projList));
  },

  addProject(project) {
    //if project doesnt exist, create
    if (!Object.hasOwn(this.projList, project)) {
      Object.defineProperty(this.projList, project, {
        value: [],
        enumerable: true,
        configurable: true,
        //needs to be enumerable so JSON.stringify can read.
        //needs to be configurable, so we can delete the property(project) if needed.
      });
    } else {
      alert("A project with that name already exists!");
    }

    this.storeProjList();
  },

  removeProject(project) {
    delete this.projList[project];
    this.storeProjList();
  },

  addTask(task, project = "default") {
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
    this.projList[project].splice(index, 1);
    this.storeProjList();
  },

  editTask(newtask, project, index) {
    this.projList[project][index] = newtask;
  },

  task(name, description, dueDate, priority) {
    return { name, description, dueDate, priority };
  },
};

const Ui = (function () {
  const tasks = document.querySelector(".tasks");
  const form = document.querySelector(".form");
  const formDisplay = document.querySelector(".form-popup");
  const formXBtn = document.querySelector(".x");
  const formTitle = document.querySelector(".form-title");
  const formProjectOptions = document.querySelector("#input-project-options");
  const sidebar = document.querySelector(".sidebar");
  const priorities = document.querySelectorAll(".input-priority div");

  const loadTask = function (task, project, index) {
    const newtask = document.createElement("div");
    newtask.classList.add("task");
    newtask.classList.add(task["priority"]);
    tasks.appendChild(newtask);

    const divName = document.createElement("div");
    divName.classList.add("name");
    divName.textContent = task.name;
    newtask.appendChild(divName);

    const divDescription = document.createElement("div");
    divDescription.classList.add("description");
    divDescription.textContent = task.description;
    newtask.appendChild(divDescription);

    const divDueDate = document.createElement("div");
    divDueDate.classList.add("duedate");
    divDueDate.textContent = task.dueDate;
    newtask.appendChild(divDueDate);

    const divTaskTools = document.createElement("div");
    divTaskTools.classList.add("tasktools");
    newtask.appendChild(divTaskTools);

    const editTaskBtn = document.createElement("span");
    editTaskBtn.classList.add("material-symbols-outlined", "edittask");
    editTaskBtn.textContent = "edit";
    divTaskTools.appendChild(editTaskBtn);

    const deleteTaskBtn = document.createElement("span");
    deleteTaskBtn.classList.add("material-symbols-outlined", "deletetask");
    deleteTaskBtn.textContent = "delete";
    divTaskTools.appendChild(deleteTaskBtn);

    deleteTaskBtn.addEventListener("click", () => {
      taskMaster.removeTask(project, index);
      loadProject(project);
    });

    editTaskBtn.addEventListener("click", () => {
      displayForm(project, task);
      loadProject(project, task);
    });
  };

  const loadProject = function (project) {
    //taskList must be array of tasks
    tasks.innerHTML = "";
    if (project == "default") {
      LoadAllTasks();
    } else {
      taskMaster.projList[project].forEach((task) => {
        loadTask(task, project, taskMaster.projList[project].indexOf(task));

        //load new task btn at end of list
        const newTaskBtn = document.createElement("div");
        newTaskBtn.classList.add("newtask", "material-symbols-outlined");
        newTaskBtn.textContent = "add";
        tasks.appendChild(newTaskBtn);
        newTaskBtn.addEventListener("click", () => {
          formDisplay.style.display = "grid";
          displayForm(project);
        });

        //indexof can be loaded in loadtask function instead of here --refactor
      });
    }
  };

  const LoadAllTasks = function (date = "") {
    tasks.innerHTML = "";
    let projArray = Object.keys(taskMaster.projList);
    projArray.forEach((project) => {
      taskMaster.projList[project].forEach((task) => {
        let taskdate = parse(task.dueDate, "yyyy-LL-dd", new Date());
        if (date == "") {
          loadTask(task, project, taskMaster.projList[project].indexOf(task));
        } else if (!task.dueDate == "") {
          if (date == "overdue" && isPast(taskdate)) {
            loadTask(task, project, taskMaster.projList[project].indexOf(task));
          } else if (date == "today" && isToday(taskdate)) {
            loadTask(task, project, taskMaster.projList[project].indexOf(task));
          } else if (date == "week" && isThisWeek(taskdate)) {
            loadTask(task, project, taskMaster.projList[project].indexOf(task));
          } else if (date == "month" && isThisMonth(taskdate)) {
            loadTask(task, project, taskMaster.projList[project].indexOf(task));
          }
        }
      });
    });
    const newTaskBtn = document.createElement("div");
    newTaskBtn.classList.add("newtask", "material-symbols-outlined");
    newTaskBtn.textContent = "add";
    tasks.appendChild(newTaskBtn);
    newTaskBtn.addEventListener("click", () => {
      formDisplay.style.display = "grid";
      displayForm("default");
    });
  };

  const displayForm = function (project, task = false) {
    formDisplay.style.display = "grid";
    form.elements["project"].value = project;
    if (task) {
      formTitle.textContent = "Edit task";
      form.elements["name"].value = task.name;
      form.elements["description"].value = task.description;
      let priority = document.querySelector(`#${task.priority}`);
      setFormPriority(priority);

      // to give submit event listener the index of task being edited
      form.setAttribute("index", taskMaster.projList[project].indexOf(task));
    } else {
      formTitle.textContent = "New Task";
      form.elements["name"].value = "";
      form.elements["description"].value = "";
      let priority = document.querySelector(`#medium`);
      setFormPriority(priority);
    }
  };

  const loadProjList = function () {
    sidebar.textContent = "";
    formProjectOptions.textContent = "";
    const sidebarProjects = document.createElement("div");
    sidebarProjects.classList.add("sidebar-projects");

    const sidebarAllTasks = document.createElement("div");
    sidebarAllTasks.classList.add("project");
    sidebarAllTasks.textContent = "All Tasks";
    sidebar.appendChild(sidebarAllTasks);
    sidebarAllTasks.addEventListener("click", () => {
      LoadAllTasks();
      setSelectedProject(sidebarAllTasks);
    });

    const sidebarDates = document.createElement("div");
    sidebarDates.classList.add("sidebar-dates");
    sidebar.appendChild(sidebarDates);

    const sidebarLate = document.createElement("div");
    sidebarLate.classList.add("project");
    sidebarLate.id = "overdue";
    sidebarLate.textContent = "Overdue";
    sidebarLate.addEventListener("click", () => {
      LoadAllTasks("overdue");
      setSelectedProject(sidebarLate);
    });
    sidebarDates.appendChild(sidebarLate);

    const sidebarToday = document.createElement("div");
    sidebarToday.classList.add("project");
    sidebarToday.id = "today";
    sidebarToday.textContent = "Today";
    sidebarToday.addEventListener("click", () => {
      LoadAllTasks("today");
      setSelectedProject(sidebarToday);
    });
    sidebarDates.appendChild(sidebarToday);

    const sidebarWeek = document.createElement("div");
    sidebarWeek.classList.add("project");
    sidebarWeek.id = "week";
    sidebarWeek.textContent = "This week";
    sidebarWeek.addEventListener("click", () => {
      LoadAllTasks("week");
      setSelectedProject(sidebarWeek);
    });
    sidebarDates.appendChild(sidebarWeek);

    const sidebarMonth = document.createElement("div");
    sidebarMonth.classList.add("project");
    sidebarMonth.id = "month";
    sidebarMonth.textContent = "This month";
    sidebarMonth.addEventListener("click", () => {
      LoadAllTasks("month");
      setSelectedProject(sidebarMonth);
    });
    sidebarDates.appendChild(sidebarMonth);

    let projArray = Object.keys(taskMaster.projList);
    projArray.forEach((project) => {
      const divProject = document.createElement("div");
      const divProjectTitle = document.createElement("div");
      const datalistOption = document.createElement("option");

      divProject.classList.add("project");
      divProjectTitle.textContent = project;
      divProject.appendChild(divProjectTitle);

      if (!(project == "default")) {
        //dont allow deletion of default project
        const divProjectDelete = document.createElement("span");
        divProjectDelete.classList.add("material-symbols-outlined");
        divProjectDelete.textContent = "delete";
        divProject.appendChild(divProjectDelete);

        sidebar.appendChild(divProject);

        divProjectTitle.addEventListener("click", () => {
          loadProject(project);
          setSelectedProject(divProject);
        });

        divProjectDelete.addEventListener("click", () => {
          if (
            window.confirm(
              `Are you sure you want to delete the project "${project}"?`
            )
          ) {
            taskMaster.removeProject(project);
            LoadAllTasks();
            loadProjList();
          }
        });
      }

      datalistOption.setAttribute("value", project);
      formProjectOptions.appendChild(datalistOption);
    });
  };

  const setSelectedProject = function (selectedproject) {
    const sidebarItems = document.querySelectorAll(".project");
    sidebarItems.forEach((item) => {
      item.classList.remove("active");
    });
    selectedproject.classList.add("active");
  };

  const setFormPriority = function (priobtn) {
    priorities.forEach((btn) => {
      btn.classList.remove("highlighted");
    });
    priobtn.classList.add("highlighted");
  };

  const loadListeners = function () {
    //new task form submitted
    form.addEventListener("submit", (event) => {
      let name = form.elements["name"].value;
      let description = form.elements["description"].value;
      let duedate = form.elements["duedate"].value;
      let priority = document.querySelector(".highlighted").id;
      let proj = form.elements["project"].value;
      let newT = taskMaster.task(name, description, duedate, priority);

      if (formTitle.textContent == "Edit task") {
        let taskindex = form.getAttribute("index");
        taskMaster.editTask(newT, proj, taskindex);
      } else {
        taskMaster.addTask(newT, proj);
      }

      event.preventDefault();

      form.reset();
      formDisplay.style.display = "none";
      if (proj == "default") {
        LoadAllTasks();
      } else {
        loadProject(proj);
      }

      loadProjList();
    });

    priorities.forEach((btn) => {
      btn.addEventListener("click", () => {
        setFormPriority(btn);
      });
    });

    formXBtn.addEventListener("click", () => {
      formDisplay.style.display = "none";
    });
  };

  return {
    newTask: loadTask,
    loadTaskList: loadProject,
    loadListeners,
    loadProjList,
    loadDate: LoadAllTasks,
  };
})();

const storage = (function () {
  //from MDN web docs
  const storageAvailable = function (type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  };
  return { storageAvailable };
})();

if (storage.storageAvailable("localStorage")) {
  if (localStorage.length > 0) {
    taskMaster.projList = JSON.parse(localStorage.getItem("ToDo"));
  }
  console.log(taskMaster.projList);
} else {
  console.log("s");
}

Ui.loadListeners();
Ui.loadProjList();
Ui.loadDate("");
