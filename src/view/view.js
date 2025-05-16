class HabitView {
    constructor() {
        this.habitListDiv = this._getElement('#habit-list');
        this.form = this._getElement('#habit-form');
        this.habitNameInput = this._getElement('#habit-name');
        this.habitDescriptionInput = this._getElement('#habit-description');
        this.habitStatusSelect = this._getElement('#habit-status');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.statusFilterSelect = this._getElement('#status-filter');

        this._temporaryEditData = {};
    }

    _getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Элемент ${selector} не найден`);
        return element;
    }

    resetForm() {
        this.form.reset();
        this.habitNameInput.focus();
        this.submitButton.textContent = 'Добавить Привычку';
        delete this._temporaryEditData.id;
    }

    displayHabits(habits) {
        while (this.habitListDiv.firstChild) {
            this.habitListDiv.removeChild(this.habitListDiv.firstChild);
        }

        if (habits.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'Список привычек пуст. Добавьте новую привычку!';
            this.habitListDiv.append(p);
            return;
        }

        habits.forEach(habit => {
            const habitItemDiv = document.createElement('div');
            habitItemDiv.classList.add('habit-item');
            habitItemDiv.dataset.id = habit.id;
            habitItemDiv.dataset.status = habit.status;

            const titleP = document.createElement('p');
            titleP.classList.add('title');
            titleP.textContent = habit.name;

            const descriptionP = document.createElement('p');
            descriptionP.classList.add('description');
            descriptionP.textContent = habit.description || 'Нет описания';

            const statusP = document.createElement('p');
            statusP.classList.add('status');
            statusP.textContent = `Статус: ${habit.status === 'completed' ? 'Выполнена' : 'Не выполнена'}`;
            statusP.dataset.action = 'toggleStatus';

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('habit-item-actions');

            const editButton = document.createElement('button');
            editButton.textContent = 'Редактировать';
            editButton.dataset.action = 'edit';
            editButton.classList.add('edit-btn');

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.dataset.action = 'delete';
            deleteButton.classList.add('delete-btn');

            actionsDiv.append(editButton, deleteButton);
            habitItemDiv.append(titleP, descriptionP, statusP, actionsDiv);
            this.habitListDiv.append(habitItemDiv);
        });
    }

    bindFormSubmit(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault();
            const name = this.habitNameInput.value.trim();
            const description = this.habitDescriptionInput.value.trim();
            const status = this.habitStatusSelect.value;

            if (name) {
                handler(name, description, status, this._temporaryEditData.id);
                this.resetForm();
            } else {
                alert("Название привычки не может быть пустым!");
                this.habitNameInput.focus();
            }
        });
    }

    bindHabitActions(deleteHandler, editHandler, toggleStatusHandler) {
        this.habitListDiv.addEventListener('click', event => {
            const target = event.target;
            const habitItem = target.closest('.habit-item');
            if (!habitItem) return;

            const id = habitItem.dataset.id;
            const action = target.dataset.action;

            if (action === 'delete') {
                if (confirm('Вы уверены, что хотите удалить эту привычку?')) {
                    deleteHandler(id);
                }
            } else if (action === 'edit') {
                editHandler(id);
            } else if (action === 'toggleStatus') {
                toggleStatusHandler(id);
            }
        });
    }

    bindFilterChange(handler) {
        this.statusFilterSelect.addEventListener('change', event => {
            handler(event.target.value);
        });
    }

    fillFormForEdit(habit) {
        this.habitNameInput.value = habit.name;
        this.habitDescriptionInput.value = habit.description || '';
        this.habitStatusSelect.value = habit.status;
        this.submitButton.textContent = 'Сохранить Изменения';
        this._temporaryEditData.id = habit.id;
        this.habitNameInput.focus();
        window.scrollTo({ top: this.form.offsetTop - 20, behavior: 'smooth' });
    }
}