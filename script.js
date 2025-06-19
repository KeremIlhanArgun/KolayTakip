document.addEventListener("DOMContentLoaded", function () {
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
    
    if (nameValue !== '' && isValidDate(dateValue)) {
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
    
    kutu.addEventListener('drop', function(e) {
      e.preventDefault();
      kutu.style.backgroundColor = '';
      
      const draggedTask = document.querySelector('.gorev-icerik[style*="opacity: 0.5"]');
      const tasklarDiv = getTasklarDiv(kutu);
      if (draggedTask && tasklarDiv && draggedTask.parentNode !== tasklarDiv) {
        tasklarDiv.appendChild(draggedTask);
        updateTaskStatus(draggedTask, kutu);
      }
    });
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
    createButtonModal.addEventListener("click", function () {
      const nameInputValue = document.getElementById('Task-adı').value;
      const descriptionInput = document.getElementById('Task-acıklaması').value;
      const dateInputValue = document.getElementById('Task-Tarihi').value;

      if (nameInputValue.trim() !== '' && isValidDate(dateInputValue)) {
        YeniTaskEkle.style.display = "none";
        
        const TaskKartEkle = document.createElement('div');
        TaskKartEkle.classList.add('gorev-icerik');

        const Taskisim = document.createElement('span');
        Taskisim.classList.add('Task-isim');
        Taskisim.textContent = nameInputValue;

        const TaskTarih = document.createElement('span');
        TaskTarih.classList.add('Son-tarih');
        TaskTarih.textContent = formatDate(dateInputValue);

        TaskKartEkle.appendChild(Taskisim);
        TaskKartEkle.appendChild(TaskTarih);

        TaskKartEkle.setAttribute('data-description', descriptionInput);
        TaskKartEkle.setAttribute('data-name', nameInputValue);
        TaskKartEkle.setAttribute('data-date', dateInputValue);

        TaskKartEkle.addEventListener("click", function() {
          const currentName = this.getAttribute('data-name');
          const currentDescription = this.getAttribute('data-description');
          const currentDate = this.getAttribute('data-date');
          openEditModal(TaskKartEkle, currentName, currentDescription, currentDate);
        });

        makeTaskDraggable(TaskKartEkle);

        openAlan.appendChild(TaskKartEkle);

        document.getElementById('Task-adı').value = '';
        document.getElementById('Task-acıklaması').value = '';
        document.getElementById('Task-Tarihi').value = '';
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
        
        if (nameValue !== '' && isValidDate(dateValue)) {
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
      
      newKaydetButton.addEventListener("click", function(e) {
        e.preventDefault();
        const newName = editNameInput.value;
        const newDescription = editDescriptionInput.value;
        const newDate = editDateInput.value;
        
        if (newName.trim() !== '' && isValidDate(newDate)) {
          const taskNameSpan = taskCard.querySelector('.Task-isim');
          const taskDateSpan = taskCard.querySelector('.Son-tarih');
          if (taskNameSpan) taskNameSpan.textContent = newName;
          if (taskDateSpan) taskDateSpan.textContent = formatDate(newDate);
          
          taskCard.setAttribute('data-description', newDescription);
          taskCard.setAttribute('data-name', newName);
          taskCard.setAttribute('data-date', newDate);
          
          makeTaskDraggable(taskCard);
          const durumSelect = modal.querySelector('#Task-Durum-editleme');
          if (durumSelect) {
            let targetTasklar = null;
            if (durumSelect.value === 'open') {
              targetTasklar = document.getElementById('open');
            } else if (durumSelect.value === 'in-progress') {
              targetTasklar = document.getElementById('in-progress');
            } else if (durumSelect.value === 'done') {
              targetTasklar = document.getElementById('done');
            }
            if (targetTasklar && taskCard.parentNode !== targetTasklar) {
              targetTasklar.appendChild(taskCard);
              updateTaskStatus(taskCard, targetTasklar.parentNode); 
            }
          }
          modal.style.display = "none";
        }
      });
    }
    
    const silButton = document.getElementById('sil');
    if (silButton) {
      const newSilButton = silButton.cloneNode(true);
      silButton.parentNode.replaceChild(newSilButton, silButton);
      
      newSilButton.addEventListener("click", function(e) {
        e.preventDefault();
        taskCard.remove();
        modal.style.display = "none";
      });
    }
  }
});

