const tasksListContainer = document.querySelector('.app__section-task-list')
const formTask = document.querySelector('.app__form-add-task')
const btnAddNewTask = document.querySelector('.app__button--add-task')
const formLabel = document.querySelector('.app__form-label')
const textArea = document.querySelector('.app__form-textarea')
const btnSaveTask = document.querySelector('.app__form-footer__button--confirm')
const btnCancelTask = document.querySelector('.app__form-footer__button--cancel')
const btnCleanConcludedTask = document.querySelector('#btn-remover-concluidas')
const btnTrashAllTasks = document.querySelector('#btn-remover-todas')
const taskDescriptionActive = document.querySelector('.app__section-active-task-description')

const imgIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E" />
</svg>`

/* const imgIconSvg = `
<svg  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="12" fill="#FFF" />
<path d="M6 10.7253L16.5938 0.131592L18 1.53784L6 13.5378L0.421875 7.95972L1.82812 6.55347L6 10.7253Z" fill="#01080E"/>
</svg>` */


const localStorageTasks = localStorage.getItem('tasks')
let tasks = localStorageTasks ? JSON.parse(localStorageTasks) : []

let selectedTask = null
let itemSelectedTasks = null
let taskEdition = null
let paragraphEdition = null

const selectionTasks = (task, elem) => {
    
    if (task.concluded) {
        return
    }
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

const limparForm = () => {
    taskEdition = null
    paragraphEdition = null
    textArea.value = ''
    formTask.classList.toggle('hidden')
}

const selectedTaskEdition = (task, element) => {
    if (taskEdition == task) {
        limparForm()
        return
    }

    formLabel.textContent = "Editar Tarefa"
    taskEdition = task
    paragraphEdition = element
    textArea.value = task.description
    formTask.classList.toggle('hidden')
}

function createTask(task) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML = imgIconSvg

    const paragraph = document.createElement('p')
    paragraph.classList.add('app__section-task-list-item-description')

    paragraph.textContent = task.description

    const btnTaskOk = document.createElement('button')
    const btnTaskEdit = document.createElement('button')
    const btnDeleteTask = document.createElement('button')

    btnTaskEdit.classList.add('app_button-edit')
    const editIcon = document.createElement('img')
    editIcon.setAttribute('src', '/imagens/edit.png')
    btnTaskEdit.appendChild(editIcon)

    btnTaskEdit.addEventListener('click', (event) => {
        event.preventDefault()
        selectedTaskEdition(task, paragraph)
    })

    btnDeleteTask.classList.add('app_button-delete')
    const deleteIcon = document.createElement('img')
    deleteIcon.setAttribute('src', '/imagens/delete.png')
    btnDeleteTask.appendChild(deleteIcon)

    btnDeleteTask.addEventListener('click', (event) => {
        event.stopPropagation()
        if (selectedTask) {
            const index = tasks.indexOf(selectedTask)
            if (index != -1) {
                tasks.splice(index, 1)
            }
            itemSelectedTasks.classList.add('app__section-task-list-item-active')
            itemSelectedTasks.remove()
            taskDescriptionActive.textContent = ''
            tasks.filter(t => t != selectedTask)
            itemSelectedTasks = null
            selectedTask = null
            updateLocalStorage()
        }
    })

    li.onclick = () => {
        selectionTasks(task, li)
    }

    svgIcon.addEventListener('click', (event) => {
        if (task == selectedTask) {
            event.stopPropagation()
            btnTaskOk.setAttribute('disabled', true)
            li.classList.add('app__section-task-list-item-complete')
            selectedTask.concluded = true
            taskDescriptionActive.textContent = ''
            selectedTask = null
            updateLocalStorage()
        }
    })


    if (task.concluded) {
        btnTaskOk.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    }

    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(btnTaskEdit)
    li.appendChild(btnDeleteTask)
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
    if (taskEdition) {
        taskEdition.description = textArea.value
        paragraphEdition.textContent = textArea.value
    } else {
        const task = {
            description: textArea.value,
            concluded: false
        }
        tasks.push(task)
        const createItem = createTask(task)
        tasksListContainer.appendChild(createItem)
        btnAddNewTask.classList.toggle('hidden')
    }
    updateLocalStorage()
    limparForm()
})

btnCancelTask.addEventListener('click', () => {
    textArea.value = ""
    formTask.classList.toggle('hidden')
    btnAddNewTask.classList.toggle('hidden')
})

btnCleanConcludedTask.addEventListener('click', () => {

    document.querySelectorAll('.app__section-task-list-item-complete').forEach((element) => {
        element.remove();
    });

    tasks = tasks.filter(t => !t.concluded)
    updateLocalStorage()
    
})

btnTrashAllTasks.addEventListener('click', () => {
    tasksListContainer.remove()
    updateLocalStorage()
})

document.addEventListener('TaskConcluded', function (e) {
    if (selectedTask) {
        selectedTask.concluded = true
        taskDescriptionActive.textContent = ''
        selectedTask = null
        itemSelectedTasks.classList.add('app__section-task-list-item-complete')
        itemSelectedTasks.querySelector('button').setAttribute('disabled', true)
        updateLocalStorage()
    }
})
