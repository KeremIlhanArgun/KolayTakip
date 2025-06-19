document.addEventListener("DOMContentLoaded", function () {
  let tasks = [];
  
  const STORAGE_KEY = 'kolayTakipTasks';
  
  let isLoading = false;
  
  function setLoadingState(loading) {
    isLoading = loading;
    
    const createButton = document.getElementById('olustur-button');
    if (createButton) {
      createButton.disabled = loading;
    }
    
    const saveButtons = document.querySelectorAll('#kaydet');
    saveButtons.forEach(button => {
      button.disabled = loading;
    });
    
    const deleteButtons = document.querySelectorAll('#sil');
    deleteButtons.forEach(button => {
      button.disabled = loading;
    });
    
    const vazgecButtons = document.querySelectorAll('#vazgec, #vazgec2');
    vazgecButtons.forEach(button => {
      button.disabled = loading;
    });
    
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = loading ? 'block' : 'none';
    }
  }
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function loadTasksFromStorage() {
    setLoadingState(true);
    try {
      await delay(300); 
      
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        try {
          tasks = JSON.parse(storedTasks);
        } catch (error) {
          console.error('Error loading tasks from localStorage:', error);
          tasks = [];
        }
      }
    } finally {
      setLoadingState(false);
    }
  }
  
  async function saveTasksToStorage() {
    setLoadingState(true);
    try {
      await delay(300); 
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } finally {
      setLoadingState(false);
    }
  }
  
  async function addTask(taskData) {
    setLoadingState(true);
    try {
      await delay(300); 
      
      const newTask = {
        id: Date.now().toString(), 
        name: taskData.name,
        description: taskData.description,
        date: taskData.date,
        status: 'open', 
        createdAt: new Date().toISOString()
      };
      
      tasks.push(newTask); 
      await saveTasksToStorage();
      return newTask;
    } finally {
      setLoadingState(false);
    }
  }
  
  async function updateTask(taskId, updatedData) {
    setLoadingState(true);
    try {
      await delay(300); 
      
      const taskIndex = tasks.findIndex(task => task.id === taskId); 
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData }; 
        await saveTasksToStorage();
        return tasks[taskIndex];
      }
      return null;
    } finally {
      setLoadingState(false);
    }
  }
  
  async function deleteTask(taskId) {
    setLoadingState(true);
    try {
      await delay(300); 
      
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1); 
        await saveTasksToStorage();
        return true;
      }
      return false;
    } finally {
      setLoadingState(false);
    }
  }
  
  function getTasksByStatus(status) {
    return tasks.filter(task => task.status === status); 
  }
  
  function renderTasks() {
    const openContainer = document.getElementById('open');
    const inProgressContainer = document.getElementById('in-progress');
    const doneContainer = document.getElementById('done');
    
    if (openContainer) openContainer.innerHTML = '';
    if (inProgressContainer) inProgressContainer.innerHTML = '';
    if (doneContainer) doneContainer.innerHTML = '';
    
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      const container = getContainerByStatus(task.status);
      if (container) {
        container.appendChild(taskElement);
        
        const parentKutu = container.closest('.kutu');
        if (parentKutu) {
          updateTaskStatus(taskElement, parentKutu);
        }
      }
    });
  }
  
  function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('gorev-icerik');
    taskElement.setAttribute('data-task-id', task.id);
    
    const taskName = document.createElement('span');
    taskName.classList.add('Task-isim');
    taskName.textContent = task.name;
    
    const taskDate = document.createElement('span');
    taskDate.classList.add('Son-tarih');
    taskDate.textContent = formatDate(task.date);
    
    taskElement.appendChild(taskName);
    taskElement.appendChild(taskDate);
    
    taskElement.addEventListener('click', function() {
      const taskId = this.getAttribute('data-task-id');
      const currentTask = tasks.find(t => t.id === taskId);
      if (currentTask) {
        openEditModal(taskElement, currentTask.name, currentTask.description, currentTask.date);
      }
    });
    
    makeTaskDraggable(taskElement);
    return taskElement;
  }
  
  function getContainerByStatus(status) {
    switch (status) {
      case 'open': return document.getElementById('open');
      case 'in-progress': return document.getElementById('in-progress');
      case 'done': return document.getElementById('done');
      default: return document.getElementById('open');
    }
  }

  const button = document.getElementById("button1"); 
  const modal = document.getElementById("task-edit-arkaplan"); 
  const vazgec = document.getElementById("vazgec2");
  const YeniTaskEkle = document.getElementById('yeni-task-ekleme-arkaplan')
  const vazgec2 = document.getElementById("vazgec");
  const createButtonModal = document.getElementById("olustur-button");
  const openAlan = document.getElementById("open");
  const taskForm = document.querySelector('.Ana-form-uretme');
  const editForm = document.querySelector('.Ana-form-edit');
  const kutuElements = document.querySelectorAll('.kutu');
  const nameInput = document.getElementById('Task-adı');
  const dateInput = document.getElementById('Task-Tarihi');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  function checkRequiredFields() {
    const nameValue = nameInput.value.trim();
    const dateValue = dateInput.value;
    
    if (nameValue !== '' && isValidDate(dateValue) && !isLoading) {
      createButtonModal.disabled = false;
    } else {
      createButtonModal.disabled = true;
    }
  }

  function isValidDate(dateString) {
    if (!dateString) return true;
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    return selectedDate >= today;
  }

  if (nameInput && createButtonModal) {
    nameInput.addEventListener('input', checkRequiredFields);
  }

  if (dateInput && createButtonModal) {
    dateInput.addEventListener('change', checkRequiredFields);
  }

  if (button && YeniTaskEkle) {
  button.addEventListener('click',function(){
  YeniTaskEkle.style.display ='flex';
  checkRequiredFields });

 if (createButtonModal){
  createButtonModal.addEventListener('click', function(){
    createButtonModal.disabled = true;
    });
  }
 }




  function getTasklarDiv(kutu) {
    return kutu.querySelector('.tasklar');
  }
  
  function formatDate(dateString) {
    if (!dateString) return 'Tarih belirtilmedi';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
  
  function updateTaskStatus(taskCard, column) {
    const taskNameSpan = taskCard.querySelector('.Task-isim');
    const taskDateSpan = taskCard.querySelector('.Son-tarih')
    const doneTasklar = document.getElementById('done');
    if (taskNameSpan) {
      if (getTasklarDiv(column) === doneTasklar) {
        taskNameSpan.style.textDecoration = 'line-through';
        taskNameSpan.style.color = '#888';
        taskDateSpan.style.textDecoration='line-through';
        taskDateSpan.style.color= '#888';
         taskCard.classList.add('done');
      } else {
        taskNameSpan.style.textDecoration = 'none';
        taskNameSpan.style.color = '#333';
        taskDateSpan.style.textDecoration = 'none';
        taskDateSpan.style.color = '#333';
        taskCard.classList.remove('done');
      }
    }
  }
  

  /*   */ /*   */ /*   */ /*   */ /*   */ /*   */ /*   */ /*   */ 


  function makeTaskDraggable(taskCard) {
    taskCard.draggable = true;
    taskCard.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', '');
      taskCard.style.opacity = '0.5';
    });
    
    taskCard.addEventListener('dragend', function(e) {
      taskCard.style.opacity = '';
    });
  }
  
  function makeColumnDroppable(kutu) {
    if (!kutu) return;
    
    kutu.addEventListener('dragover', function(e) {
      e.preventDefault();
      kutu.style.backgroundColor = '#e8f5e8';
    });
    
    kutu.addEventListener('dragleave', function(e) {
      kutu.style.backgroundColor = '';
    });
    
    kutu.addEventListener('drop', async function(e) {
      e.preventDefault();
      kutu.style.backgroundColor = '';
      
      const draggedTask = document.querySelector('.gorev-icerik[style*="opacity: 0.5"]');
      const tasklarDiv = getTasklarDiv(kutu);
      if (draggedTask && tasklarDiv && draggedTask.parentNode !== tasklarDiv) {
        tasklarDiv.appendChild(draggedTask);
        updateTaskStatus(draggedTask, kutu);
        
        const taskId = draggedTask.getAttribute('data-task-id');
        const newStatus = getStatusFromContainer(tasklarDiv);
        if (taskId && newStatus) {
          try {
            await updateTask(taskId, { status: newStatus });
          } catch (error) {
            console.error('Error updating task status:', error);
          }
        }
      }
    });
  }
  
  function getStatusFromContainer(container) {
    if (container.id === 'open') return 'open';
    if (container.id === 'in-progress') return 'in-progress';
    if (container.id === 'done') return 'done';
    return 'open';
  }
  
  if (taskForm) {
    taskForm.addEventListener("submit", function(e) {
      e.preventDefault();
      return false;
    });
  }

  if (editForm) {
    editForm.addEventListener("submit", function(e) {
      e.preventDefault();
      return false;
    });
  }

  if (YeniTaskEkle) {
    YeniTaskEkle.addEventListener("click", function(e) {
      if (e.target === YeniTaskEkle) {
        YeniTaskEkle.style.display = "none";
      }
    });
  }

  if (modal) {
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  if (vazgec && modal) {
    vazgec.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  if (vazgec2 && YeniTaskEkle) {
    vazgec2.addEventListener("click", function () {
      YeniTaskEkle.style.display = "none";
    });
  }

  if (createButtonModal) {
    createButtonModal.addEventListener("click", async function () {
      const nameInputValue = document.getElementById('Task-adı').value;
      const descriptionInput = document.getElementById('Task-acıklaması').value;
      const dateInputValue = document.getElementById('Task-Tarihi').value;

      if (nameInputValue.trim() !== '' && isValidDate(dateInputValue)) {
        YeniTaskEkle.style.display = "none";
        
        try {
          const newTask = await addTask({
            name: nameInputValue,
            description: descriptionInput,
            date: dateInputValue
          });
          
          const taskElement = createTaskElement(newTask);
          const openContainer = document.getElementById('open');
          if (openContainer) {
            openContainer.appendChild(taskElement);
          }
          
          document.getElementById('Task-adı').value = '';
          document.getElementById('Task-acıklaması').value = '';
          document.getElementById('Task-Tarihi').value = '';
        } catch (error) {
          console.error('Error creating task:', error);
          YeniTaskEkle.style.display = "flex"; 
        }
      }
    });
  }
  
  if (button && YeniTaskEkle) {
    button.addEventListener("click", function () {
      YeniTaskEkle.style.display = "flex";
    });
  }

  kutuElements.forEach(makeColumnDroppable);
  
  function openEditModal(taskCard, taskName, taskDescription, taskDate) {
    modal.style.display = "flex";
    const editNameInput = modal.querySelector('#Task-adı');
    const editDescriptionInput = modal.querySelector('#Task-acıklaması');
    const editDateInput = modal.querySelector('#Task-Tarihi');
    
    const modalTitle = modal.querySelector('.pencere-icerigi-edit-title');
    if (modalTitle) {
      modalTitle.textContent = `"${taskName}" Düzenliyorsunuz`;
    }
    
    if (editNameInput) editNameInput.value = taskName;
    if (editDescriptionInput) editDescriptionInput.value = taskDescription;
    if (editDateInput) {
      editDateInput.value = taskDate;
      const today = new Date().toISOString().split('T')[0];
      editDateInput.setAttribute('min', today);
    }
    
    const durumSelect = modal.querySelector('#Task-Durum-editleme');
    if (durumSelect) {
      const options = durumSelect.querySelectorAll('option');
      options.forEach(option => {
        option.disabled = false;
      });
      
      const parentTasklar = taskCard.parentNode;
      let currentStatus = '';
      
      if (parentTasklar && parentTasklar.id === 'open') {
        durumSelect.value = 'open';
        currentStatus = 'open';
      } else if (parentTasklar && parentTasklar.id === 'in-progress') {
        durumSelect.value = 'in-progress';
        currentStatus = 'in-progress';
      } else if (parentTasklar && parentTasklar.id === 'done') {
        durumSelect.value = 'done';
        currentStatus = 'done';
      }
      
      if (currentStatus) {
        const currentOption = durumSelect.querySelector(`option[value="${currentStatus}"]`);
        if (currentOption) {
          currentOption.disabled = true;
        }
      }
    }
    
    const kaydetButton = document.getElementById('kaydet');
    if (kaydetButton) {
      const newKaydetButton = kaydetButton.cloneNode(true);
      kaydetButton.parentNode.replaceChild(newKaydetButton, kaydetButton);
      
      function checkEditFields() {
        const nameValue = editNameInput.value.trim();
        const dateValue = editDateInput.value;
        
        if (nameValue !== '' && isValidDate(dateValue) && !isLoading) {
          newKaydetButton.disabled = false;
        } else {
          newKaydetButton.disabled = true;
        }
      }
      
      if (editNameInput) {
        editNameInput.addEventListener('input', checkEditFields);
      }
      if (editDateInput) {
        editDateInput.addEventListener('change', checkEditFields);
      }
      
      checkEditFields();
      
      newKaydetButton.addEventListener("click", async function(e) {
        e.preventDefault();
        const newName = editNameInput.value;
        const newDescription = editDescriptionInput.value;
        const newDate = editDateInput.value;
        
        if (newName.trim() !== '' && isValidDate(newDate)) {
          const taskId = taskCard.getAttribute('data-task-id');
          
          try {
            const updatedTask = await updateTask(taskId, {
              name: newName,
              description: newDescription,
              date: newDate
            });
            
            if (updatedTask) {
              const taskNameSpan = taskCard.querySelector('.Task-isim');
              const taskDateSpan = taskCard.querySelector('.Son-tarih');
              if (taskNameSpan) taskNameSpan.textContent = newName;
              if (taskDateSpan) taskDateSpan.textContent = formatDate(newDate);
              
              const durumSelect = modal.querySelector('#Task-Durum-editleme');
              if (durumSelect && durumSelect.value !== updatedTask.status) {
                const newStatus = durumSelect.value;
                await updateTask(taskId, { status: newStatus });
                
                const targetContainer = getContainerByStatus(newStatus);
                if (targetContainer && taskCard.parentNode !== targetContainer) {
                  targetContainer.appendChild(taskCard);
                  updateTaskStatus(taskCard, targetContainer.parentNode);
                }
              }
            }
            
            modal.style.display = "none";
          } catch (error) {
            console.error('Error updating task:', error);
          }
        }
      });
    }
    
    const silButton = document.getElementById('sil');
    if (silButton) {
      const newSilButton = silButton.cloneNode(true);
      silButton.parentNode.replaceChild(newSilButton, silButton);
      
      newSilButton.addEventListener("click", async function(e) {
        e.preventDefault();
        const taskId = taskCard.getAttribute('data-task-id');
        
        try {
          const deleted = await deleteTask(taskId);
          if (deleted) {
            taskCard.remove();
          }
          
          modal.style.display = "none";
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  (async function initializeApp() {
    try {
      await loadTasksFromStorage();
      renderTasks();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  })();
});

