document.addEventListener('DOMContentLoaded', () => {

    const appModel = new HabitModel();
    const appView = new HabitView();
    const appPresenter = new HabitPresenter(appModel, appView);

    appPresenter.init();
});