class HabitPresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.onHabitsChanged = (habits) => this.onHabitsUpdated(habits);

        this.view.bindFormSubmit(this.handleFormSubmit.bind(this));
        this.view.bindHabitActions(
            this.handleDeleteHabit.bind(this),
            this.handleStartEditHabit.bind(this),
            this.handleToggleHabitStatus.bind(this)
        );
        this.view.bindFilterChange(this.handleFilterChange.bind(this));

        this.currentFilter = this.view.statusFilterSelect.value || 'all';
    }

    init() {
        this.onHabitsUpdated(this.model.getHabits());
        this.view.resetForm();
    }

    onHabitsUpdated(allHabits) {
        const filteredHabits = (this.currentFilter === 'all')
            ? allHabits
            : allHabits.filter(habit => habit.status === this.currentFilter);
        this.view.displayHabits(filteredHabits);
    }

    handleFormSubmit(name, description, status, id) {
        if (id) {
            this.model.updateHabit(id, { name, description, status });
        } else {
            this.model.addHabit(name, description, status);
        }
    }

    handleDeleteHabit(id) {
        this.model.deleteHabit(id);
    }

    handleStartEditHabit(id) {
        const habitToEdit = this.model.getHabitById(id);
        if (habitToEdit) {
            this.view.fillFormForEdit(habitToEdit);
        }
    }

    handleToggleHabitStatus(id) {
        this.model.toggleHabitStatus(id);
    }

    handleFilterChange(status) {
        this.currentFilter = status;
        this.onHabitsUpdated(this.model.getHabits());
    }
}