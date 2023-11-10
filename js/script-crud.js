const tasksListContainer = document.querySelector('.app__section-task-list')
const formTask = document.querySelector('.app__form-add-task')
const btnAddNewTask = document.querySelector('.app__button--add-task')
const formLabel = document.querySelector('.app__form-label')
const textArea = document.querySelector('.app__form-textarea')
const btnSaveTask = document.querySelector('.app__form-footer__button--confirm')
const btnCancelTask = document.querySelector('.app__form-footer__button--cancel')
const btnCleanTask = document.querySelector('.app__form-footer__button--delete')
const taskDescriptionActive = document.querySelector('.app__section-active-task-description')

const imgIconSvg = `
<svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="12" fill="#FFF" />
<path d "M9 16.1719119.5938 5.57812121 6.9843819 18.9844L3.42188 13.4062L4.82812 12L19 16.17192" 
fill="#01080E"
/>
</svg>
`

const localStorageTasks = localStorage.getItem('tasks')
let tasks = localStorageTasks ? JSON.parse(localStorageTasks) : []

let selectedTask = null
let itemSelectedTasks = null

const selectionTasks = (task, elem) => {
    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active')
    })

    if (selectedTask == task) {
        taskDescriptionActive.textContent = null
        itemSelectedTasks = null
        taskAtiveDescription = null
        return
    }

    selectedTask = task
    itemSelectedTasks = elem
    taskDescriptionActive.textContent = task.description
    elem.classList.add('app__section-task-list-item-active')
}

function createTask(task) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML = imgIconSvg

    const paragraph = document.createElement('p')
    paragraph.classList.add('app__section-task-list-item-description')

    const button = document.createElement('button')

    paragraph.textContent = task.description

    li.onclick = () => {
        selectionTasks(task, li)
    }

    svgIcon.addEventListener('click', (event) => {
        event.stopPropagation()
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    })

    if (task.concluded) {
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    }

    li.appendChild(svgIcon)
    li.appendChild(paragraph)

    return li
}

tasks.forEach(task => {
    const taskItem = createTask(task)
    tasksListContainer.appendChild(taskItem)
})

btnAddNewTask.addEventListener('click', () => {
    formLabel.textContent = "Adicionando Tarefa"
    formTask.classList.toggle('hidden')
    btnAddNewTask.classList.toggle('hidden')
})

const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault()
    const task = {
        description: textArea.value,
        concluded: false
    }
    tasks.push(task)
    const createItem = createTask(task)
    tasksListContainer.appendChild(createItem)
    textArea.value = ""
    formTask.classList.toggle('hidden')
    btnAddNewTask.classList.toggle('hidden')
    updateLocalStorage()
})

btnCancelTask.addEventListener('click', () => {
    textArea.value = ""
    formTask.classList.toggle('hidden')
    btnAddNewTask.classList.toggle('hidden')
})

btnCleanTask.addEventListener('click', () => {
    textArea.value = ""
})
