class HabitModel {
    constructor() {
        this.habits = JSON.parse(localStorage.getItem('habits')) || [
            { id: this._generateId(), name: 'Утренняя зарядка', description: '15 минут упражнений по видео', status: 'active' },
            { id: this._generateId(), name: 'Читать книгу', description: '30 минут перед сном (фантастика)', status: 'completed' },
        ];
        this.onHabitsChanged = null;
    }

    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    _commit() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
        if (this.onHabitsChanged) {
            this.onHabitsChanged(this.getHabits());
        }
    }

    getHabits() {
        return [...this.habits];
    }

    addHabit(name, description, status) {
        const newHabit = {
            id: this._generateId(),
            name,
            description,
            status
        };
        this.habits.push(newHabit);
        this._commit();
    }

    deleteHabit(id) {
        this.habits = this.habits.filter(habit => habit.id !== id);
        this._commit();
    }

    updateHabit(id, updatedData) {
        this.habits = this.habits.map(habit =>
            habit.id === id ? { ...habit, ...updatedData } : habit
        );
        this._commit();
    }

    toggleHabitStatus(id) {
        this.habits = this.habits.map(habit => {
            if (habit.id === id) {
                return { ...habit, status: habit.status === 'active' ? 'completed' : 'active' };
            }
            return habit;
        });
        this._commit();
    }

    getHabitById(id) {
        return this.habits.find(habit => habit.id === id);
    }
}