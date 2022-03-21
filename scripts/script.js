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


    if (count > 0) {

        const event_for_day = events.find(event => event.date === clicked);

        for (let i = 0; i < events_for_day.length; i++) {

            const clonedEventContainer = document.createElement('div');
            const clonedContainerTitle = document.createElement('h2');
            const clonedContainerText = document.createElement('p');
            const clonedContainerBtnDel = document.createElement('button');
            const clonedContainerBtnCancel = document.createElement('button');

            //* content of cloned container
            clonedEventContainer.classList.add('eventSection__deleteEventContainer');
            clonedEventContainer.classList.add('deleteEventContainer');
            clonedEventContainer.append(clonedContainerTitle, clonedContainerText, clonedContainerBtnDel, clonedContainerBtnCancel);

            //* content of title
            clonedContainerTitle.classList.add('windowTitle');
            clonedContainerTitle.classList.add('windowTitle--deleteEvent');
            clonedContainerTitle.innerText = 'Existing event';

            //* content of text
            clonedContainerText.classList.add('deleteEventContainer__text');
            clonedContainerText.innerText = events_for_day[i].title;

            //* content of buttons
            clonedContainerBtnDel.classList.add('deleteEventContainer__button');
            clonedContainerBtnDel.classList.add('deleteEventContainer__button--delete');
            clonedContainerBtnDel.innerText = 'Delete';
            clonedContainerBtnCancel.classList.add('deleteEventContainer__button');
            clonedContainerBtnCancel.classList.add('deleteEventContainer__button--cancel');
            clonedContainerBtnCancel.innerText = 'Cancel';

            eventSection.appendChild(clonedEventContainer);
            clonedEventContainer.style.display = 'block';

        }

        newEventContainer.style.display = 'block';

    } else {

        newEventContainer.style.display = 'block';

    }

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

        const day_str = `${i - padding_days}.${month}.${year}`;

        if (i > padding_days) {

            day_container.innerText = i - padding_days;

            if (i - padding_days === day && nav === 0) {
                day_container.classList.add('day__current');
            }

            //const event_for_day = events.find(e => e.date === day_str);

            let count = events.filter(e => e.date === day_str).length;

            if (count !== 0){

                if (count === 1) {
                    const event_div = document.createElement('div');
                    event_div.classList.add('day__eventContainer');
                    event_div.innerText = count+' event';
                    day_container.appendChild(event_div);
                }

                if (count > 1) {
                    const event_div = document.createElement('div');
                    event_div.classList.add('day__eventContainer');
                    event_div.innerText = count+' events';
                    day_container.appendChild(event_div);
                }

            }
                

            day_container.addEventListener('click', () => openDayWindow(day_str));

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
            date: clicked,
            title: eventTitleInput.value
        });

        localStorage.setItem('events', JSON.stringify(events));

        closeNewEventWindow();
        loadCalendar();
        removeChildWindows();

    } else {

        eventTitleInput.classList.add('error');

    }

};

function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeNewEventWindow();
    loadCalendar();
    console.log('Successfully deleted');
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
        removeChildWindows();
    });

    document.querySelector('.deleteEventContainer__button--delete').addEventListener('click', () => {

        deleteEvent();
        removeChildWindows();

    });

    document.querySelector('.deleteEventContainer__button--cancel').addEventListener('click', () => {

        closeNewEventWindow();
        removeChildWindows();

    })


}

initiateButtons();
loadCalendar();