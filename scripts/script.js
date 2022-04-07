let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.querySelector('.calendar');
const newEventContainer = document.querySelector('.newEventContainer');
const deleteEventContainer = document.querySelector('.deleteEventContainer');
const eventSection = document.querySelector('.eventSection');
const eventTitleInput = document.querySelector('.newEventContainer__input');
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function openDayWindow(date) {

    clicked = date;

    let count = 0;
    let events_for_day = [];

    for (let i = 0; i < events.length; i++) {

        if (events[i].date === clicked) {
            count++;
            events_for_day.push(events[i]);
        }
    }

    if (newEventContainer.style.display === 'block') {
        removeAllChildWindows();
    }

    document.querySelector('.windowTitle--newEvent').innerText = clicked;


    if (count > 0) {

        for (let i = 0; i < events_for_day.length; i++) {

            const clonedEventContainer = document.createElement('div');
            const clonedContainerText = document.createElement('p');
            const clonedContainerBtnDel = document.createElement('button');

            //* content of cloned container
            clonedEventContainer.classList.add('eventSection__deleteEventContainer');
            clonedEventContainer.classList.add('deleteEventContainer');
            clonedEventContainer.append(clonedContainerText, clonedContainerBtnDel);

            //* content of text
            clonedContainerText.classList.add('deleteEventContainer__text');
            clonedContainerText.innerText = events_for_day[i].title;

            //* content of button
            clonedContainerBtnDel.classList.add('deleteEventContainer__button');
            clonedContainerBtnDel.classList.add('deleteEventContainer__button--delete');
            clonedContainerBtnDel.setAttribute('id', `${events.filter(e => e.date === clicked)[i].id}`);
            clonedContainerBtnDel.innerText = 'Delete';

            eventSection.appendChild(clonedEventContainer);
            clonedEventContainer.style.display = 'grid';

        }

        newEventContainer.style.display = 'block';

    } else {

        newEventContainer.style.display = 'block';

    }

    initiateButtons();

}

function loadCalendar() {

    const date = new Date();

    if (nav !== 0) {

        date.setMonth(new Date().getMonth() + nav);
        
    }

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const first_day_month = new Date(year, month, 1);
    const days_in_month = new Date(year, month + 1, 0).getDate();

    const date_str = first_day_month.toLocaleDateString('en-gb', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
    
    const padding_days = weekdays.indexOf(date_str.split(', ')[0]);

    document.querySelector('.monthDisplay__name').innerText = `${ date.toLocaleDateString('en-gb', { month: 'long' }) } ${ year }`;

    calendar.innerHTML = '';
    
    for(let i = 1; i <= padding_days + days_in_month; i++) {

        const day_container = document.createElement('div');
        day_container.classList.add('calendar__day');
        day_container.classList.add('day');

        const day_num = document.createElement('div');
        day_num.classList.add('day__num');
        day_container.appendChild(day_num);

        const day_str = `${i - padding_days}.${month}.${year}`;

        if (i > padding_days) {

            day_num.innerText = i - padding_days;

            if (i - padding_days === day && nav === 0) {
                day_container.classList.add('day--current');
            }

            let count = events.filter(e => e.date === day_str).length;

            if (count !== 0){

                const event_indicator = document.createElement('div');
                day_container.appendChild(event_indicator);
                event_indicator.classList.add('day__eventIndicator');
                event_indicator.innerText = count;

            }
                

            day_container.addEventListener('click', () => {
                openDayWindow(day_str);
            });

        } else {

            day_container.classList.add('calendar__day--padding');

        }

        calendar.appendChild(day_container);

    }

}

function closeNewEventWindow() {

    eventTitleInput.classList.remove('error');
    newEventContainer.style.display = 'none';
    deleteEventContainer.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;

};

function saveEvent() {

    if (eventTitleInput.value) {

        eventTitleInput.classList.remove('error');

        events.push({
            id: events.length,
            date: clicked,
            title: eventTitleInput.value
        });

        localStorage.setItem('events', JSON.stringify(events));

        closeNewEventWindow();
        loadCalendar();
        sortEvents();
        removeAllChildWindows();

    } else {

        eventTitleInput.classList.add('error');

    }

};

function deleteEvent(idBtn) {
    events = events.filter(e => e.id !== idBtn);
    localStorage.setItem('events', JSON.stringify(events));
    loadCalendar();
    sortEvents();
    removeAllChildWindows();
    closeNewEventWindow();
}

function removeAllChildWindows() {
    while (eventSection.children.length > 1) {
        eventSection.removeChild(eventSection.lastChild);
    }
}

function removeChildWindows() {
    while (eventSection.children.length > 2) {
        eventSection.removeChild(eventSection.lastChild);
    }
}

function sortEvents() {
    for (let j = 0; j < events.length; j++) {
        for (let i = 0; i < events.length - 1; i++) {
            let splitFirst = events[i].date.split('.');
            let splitSecond = events[i+1].date.split('.');

            if (parseInt(splitFirst[2]) > parseInt(splitSecond[2])) {
                temp = events[i];
                events[i] = events[i+1];
                events[i+1] = temp;
            }

            if (parseInt(splitFirst[2]) === parseInt(splitSecond[2])) {

                if (parseInt(splitFirst[1]) > parseInt(splitSecond[1])) {
                    temp = events[i];
                    events[i] = events[i+1];
                    events[i+1] = temp;
                }

                if (parseInt(splitFirst[1]) === parseInt(splitSecond[1])) {

                    if (parseInt(splitFirst[0]) > parseInt(splitSecond[0])) {
                       temp = events[i];
                       events[i] = events[i+1];
                       events[i+1] = temp;
                    }
               }
            }
        }
    }
}

function initiateButtons() {

    document.querySelector('.monthDisplay__btn--next').addEventListener('click', () => {

        nav++;
        loadCalendar();

    });

    document.querySelector('.monthDisplay__btn--back').addEventListener('click', () => {

        nav--;
        loadCalendar();

    });

    document.querySelector('.newEventContainer__button--save').addEventListener('click', () => {

        saveEvent();

    });

    document.querySelector('.newEventContainer__button--cancel').addEventListener('click', () => {

        closeNewEventWindow();
        removeAllChildWindows();

    });

    let delEv = events.filter(e => e.date === clicked);

    if (delEv.length > 0) {
        for (let i = 0; i <= delEv.length; i++) {
            let tempBtn = document.querySelectorAll('.deleteEventContainer__button--delete')[i];
            tempBtn.addEventListener('click', () => deleteEvent(parseInt(tempBtn.id)));
        }
    }

}

loadCalendar();
initiateButtons();

const todos = document.querySelectorAll('.todo');
const allStatus = document.querySelectorAll('.status');
let draggableTodo = null;

todos.forEach((todo) => {

    todo.addEventListener('dragstart', dragStart);
    todo.addEventListener('dragend', dragEnd);

});

function dragStart() {
    
    draggableTodo = this;

};

function dragEnd() {

    draggableTodo = null;

};

allStatus.forEach((status) => {

    status.addEventListener('dragover', dragOver);
    status.addEventListener('drop', dragDrop);

});

function dragOver(e) {

    e.preventDefault();

};

function dragDrop() {

    this.appendChild(draggableTodo);

}

const btns = document.querySelectorAll('[data-target]');
const close_modals = document.querySelectorAll('.modal__close');

btns.forEach((btn) => {

    btn.addEventListener('click', () => {

        document.querySelector(btn.dataset.target).classList.add("active");

    });

});

close_modals.forEach((btn) => {

    btn.addEventListener('click', () => {

        const modal = btn.closest('.modal');
        modal.classList.remove('active');

    });

});

const submit = document.querySelector('.modal__submit');
const no_status = document.querySelector('.todoContainer__status--noStatus');

submit.addEventListener('click', createTodo);

function createTodo() {

    const todo_div = document.createElement('div');
    const input_value = document.querySelector('.modal__input').value;
    const text = document.createTextNode(input_value);

    todo_div.appendChild(text);
    todo_div.classList.add('status__todo');
    todo_div.classList.add('todo');
    todo_div.setAttribute('draggable', 'true');

    const span = document.createElement('span');
    const span_text = document.createTextNode('\u00D7');
    span.classList.add('todo__close');
    span.appendChild(span_text);

    todo_div.appendChild(span);

    no_status.appendChild(todo_div);

    todo_form.classList.remove('active');

    todo_div.addEventListener('dragstart', dragStart);
    todo_div.addEventListener('dragend', dragEnd);

    document.querySelector('.modal__input').innerText = '';

};

const close_btns = document.querySelectorAll('.todo__close');

close_btns.forEach((btn) => {

    btn.addEventListener('click', () => {

        btn.parentElement.style.display = 'none';

    });

});