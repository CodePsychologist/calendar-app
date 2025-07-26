// Calendar App JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Event Storage
    let events = loadEvents();
    // Elements
    const calendarDays = document.getElementById('calendar-days');
    const monthYearElement = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const todayBtn = document.getElementById('today-btn');
    
    // Current date
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    
    // Month names
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Generate calendar
    function generateCalendar(month, year) {
        // Clear previous days
        calendarDays.innerHTML = '';
        
        // Update month and year display
        monthYearElement.textContent = `${months[month]} ${year}`;
        
        // Get first day of month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Get day of week for first day (0 = Sunday, 6 = Saturday)
        const firstDayIndex = firstDay.getDay();
        
        // Days from previous month
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevMonthYear = month === 0 ? year - 1 : year;
        const prevMonthLastDay = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
        
        // Calculate total days needed (current month + padding days)
        const totalDaysToShow = 42; // 6 rows × 7 days
        
        // Days from current month
        const daysInMonth = lastDay.getDate();
        
        // Add animation class for transition
        calendarDays.classList.add('fade-in');
        
        // Generate the days
        for (let i = 0; i < totalDaysToShow; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            let dayNumber;
            let dateStr;
            
            // Previous month days
            if (i < firstDayIndex) {
                const prevMonthDay = prevMonthLastDay - (firstDayIndex - i - 1);
                dayNumber = prevMonthDay;
                dayElement.classList.add('other-month');
                
                // Add data attributes for potential event handling
                dateStr = `${prevMonthYear}-${prevMonth + 1}-${prevMonthDay}`;
                dayElement.dataset.date = dateStr;
            } 
            // Current month days
            else if (i < firstDayIndex + daysInMonth) {
                const day = i - firstDayIndex + 1;
                dayNumber = day;
                
                // Check if it's today
                if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                    dayElement.classList.add('current');
                }
                
                // Add data attributes for potential event handling
                dateStr = `${year}-${month + 1}-${day}`;
                dayElement.dataset.date = dateStr;
            } 
            // Next month days
            else {
                const nextMonthDay = i - (firstDayIndex + daysInMonth) + 1;
                dayNumber = nextMonthDay;
                dayElement.classList.add('other-month');
                
                const nextMonth = month === 11 ? 0 : month + 1;
                const nextMonthYear = month === 11 ? year + 1 : year;
                
                // Add data attributes for potential event handling
                dateStr = `${nextMonthYear}-${nextMonth + 1}-${nextMonthDay}`;
                dayElement.dataset.date = dateStr;
            }
            
            // Create day number element
            const dayNumberElement = document.createElement('div');
            dayNumberElement.classList.add('day-number');
            dayNumberElement.textContent = dayNumber;
            dayElement.appendChild(dayNumberElement);
            
            // Check if day has events and add event previews
            const dateEvents = getEventsForDate(dateStr);
            if (dateEvents.length > 0) {
                dayElement.classList.add('has-events');
                
                // Add event count indicator
                if (dateEvents.length > 1) {
                    const eventCount = document.createElement('div');
                    eventCount.classList.add('event-count');
                    eventCount.textContent = dateEvents.length;
                    dayElement.appendChild(eventCount);
                }
                
                // Add event previews
                const previewContainer = document.createElement('div');
                previewContainer.classList.add('event-preview-container');
                
                // Sort events by start time
                dateEvents.sort((a, b) => {
                    if (!a.startTime) return 1;
                    if (!b.startTime) return -1;
                    return a.startTime.localeCompare(b.startTime);
                });
                
                // Add up to 2 event previews
                const previewCount = Math.min(dateEvents.length, 2);
                for (let j = 0; j < previewCount; j++) {
                    const event = dateEvents[j];
                    const preview = document.createElement('div');
                    preview.classList.add('event-preview');
                    
                    // Add time if available
                    if (event.startTime) {
                        const time = formatTime(event.startTime).replace(/\s[AP]M$/, ''); // Shorter time format
                        preview.textContent = `${time} ${event.title}`;
                    } else {
                        preview.textContent = event.title;
                    }
                    
                    previewContainer.appendChild(preview);
                }
                
                // Add "more" indicator if there are more events
                if (dateEvents.length > 2) {
                    const moreEvents = document.createElement('div');
                    moreEvents.classList.add('more-events');
                    moreEvents.textContent = `+${dateEvents.length - 2} more`;
                    previewContainer.appendChild(moreEvents);
                }
                
                dayElement.appendChild(previewContainer);
            }
            
            calendarDays.appendChild(dayElement);
        }
        
        // Remove animation class after animation completes
        setTimeout(() => {
            calendarDays.classList.remove('fade-in');
        }, 300);
    }
    
    // Event: Previous month
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    // Event: Next month
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    // Event: Go to today
    todayBtn.addEventListener('click', function() {
        today = new Date();
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        generateCalendar(currentMonth, currentYear);
    });
    
    // Event: Click on a day
    calendarDays.addEventListener('click', function(e) {
        if (e.target.classList.contains('day')) {
            // Remove 'selected' class from all days
            document.querySelectorAll('.day').forEach(day => {
                day.classList.remove('selected');
            });
            
            // Add 'selected' class to clicked day
            e.target.classList.add('selected');
            
            // Get the date from data attribute
            const selectedDate = e.target.dataset.date;
            
            // Show events for this date
            showEventsForDate(selectedDate);
        }
    });
    
    // ===== EVENT MANAGEMENT =====
    
    // DOM Elements for event modal
    const eventModal = document.getElementById('event-modal');
    const eventsListModal = document.getElementById('events-list-modal');
    const eventForm = document.getElementById('event-form');
    const modalTitle = document.getElementById('modal-title');
    const eventIdInput = document.getElementById('event-id');
    const eventDateInput = document.getElementById('event-date');
    const eventTitleInput = document.getElementById('event-title');
    const eventStartTimeInput = document.getElementById('event-start-time');
    const eventEndTimeInput = document.getElementById('event-end-time');
    const eventDescriptionInput = document.getElementById('event-description');
    const deleteButton = document.getElementById('delete-button');
    const cancelButton = document.getElementById('cancel-button');
    const addEventButton = document.getElementById('add-event-button');
    const eventsContainer = document.getElementById('events-container');
    const eventsDateTitle = document.getElementById('events-date-title');
    
    // Close buttons
    document.querySelectorAll('.close-button').forEach(btn => {
        btn.addEventListener('click', () => {
            eventModal.style.display = 'none';
            eventsListModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            eventModal.style.display = 'none';
        }
        if (e.target === eventsListModal) {
            eventsListModal.style.display = 'none';
        }
    });
    
    // Cancel button
    cancelButton.addEventListener('click', () => {
        eventModal.style.display = 'none';
    });
    
    // Add new event button
    addEventButton.addEventListener('click', () => {
        const selectedDate = document.querySelector('.day.selected').dataset.date;
        openNewEventModal(selectedDate);
    });
    
    // Save event
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const eventId = eventIdInput.value || generateEventId();
        const eventDate = eventDateInput.value;
        const title = eventTitleInput.value;
        const startTime = eventStartTimeInput.value;
        const endTime = eventEndTimeInput.value;
        const description = eventDescriptionInput.value;
        
        const eventData = {
            id: eventId,
            date: eventDate,
            title: title,
            startTime: startTime,
            endTime: endTime,
            description: description
        };
        
        // If editing existing event, remove old one
        if (eventIdInput.value) {
            events = events.filter(event => event.id !== eventIdInput.value);
        }
        
        // Add new/updated event
        events.push(eventData);
        
        // Save to localStorage
        saveEvents();
        
        // Close modal
        eventModal.style.display = 'none';
        
        // Update calendar to show event indicators
        generateCalendar(currentMonth, currentYear);
        
        // Show updated events list
        showEventsForDate(eventDate);
    });
    
    // Delete event
    deleteButton.addEventListener('click', () => {
        const eventId = eventIdInput.value;
        if (eventId) {
            // Filter out the event to delete
            events = events.filter(event => event.id !== eventId);
            
            // Save to localStorage
            saveEvents();
            
            // Close modal
            eventModal.style.display = 'none';
            
            // Update calendar to remove event indicators
            generateCalendar(currentMonth, currentYear);
            
            // Show updated events list for the date
            showEventsForDate(eventDateInput.value);
        }
    });
    
    // Show events for a specific date
    function showEventsForDate(date) {
        // Format date for display
        const dateObj = parseDateString(date);
        const formattedDate = formatDate(dateObj);
        eventsDateTitle.textContent = `Events for ${formattedDate}`;
        
        // Get events for this date
        const dateEvents = events.filter(event => event.date === date);
        
        // Clear events container
        eventsContainer.innerHTML = '';
        
        if (dateEvents.length === 0) {
            eventsContainer.innerHTML = '<p>No events for this day.</p>';
        } else {
            // Sort events by start time
            dateEvents.sort((a, b) => {
                if (!a.startTime) return 1;
                if (!b.startTime) return -1;
                return a.startTime.localeCompare(b.startTime);
            });
            
            // Create event items
            dateEvents.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.classList.add('event-item');
                eventItem.dataset.eventId = event.id;
                
                const eventTitle = document.createElement('h4');
                eventTitle.textContent = event.title;
                eventItem.appendChild(eventTitle);
                
                if (event.startTime) {
                    const eventTime = document.createElement('div');
                    eventTime.classList.add('event-time');
                    
                    if (event.endTime) {
                        eventTime.textContent = `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
                    } else {
                        eventTime.textContent = formatTime(event.startTime);
                    }
                    
                    eventItem.appendChild(eventTime);
                }
                
                if (event.description) {
                    const eventDesc = document.createElement('div');
                    eventDesc.classList.add('event-desc');
                    eventDesc.textContent = event.description;
                    eventItem.appendChild(eventDesc);
                }
                
                // Open edit modal on click
                eventItem.addEventListener('click', () => {
                    openEditEventModal(event.id);
                });
                
                eventsContainer.appendChild(eventItem);
            });
        }
        
        // Show events list modal
        eventsListModal.style.display = 'flex';
    }
    
    // Open modal for new event
    function openNewEventModal(date) {
        // Hide events list modal
        eventsListModal.style.display = 'none';
        
        // Set modal title
        modalTitle.textContent = 'Add New Event';
        
        // Clear form
        eventForm.reset();
        eventIdInput.value = '';
        eventDateInput.value = date;
        
        // Hide delete button for new events
        deleteButton.style.display = 'none';
        
        // Show the modal
        eventModal.style.display = 'flex';
    }
    
    // Open modal for editing event
    function openEditEventModal(eventId) {
        // Find the event
        const event = events.find(e => e.id === eventId);
        if (!event) return;
        
        // Hide events list modal
        eventsListModal.style.display = 'none';
        
        // Set modal title
        modalTitle.textContent = 'Edit Event';
        
        // Fill form with event data
        eventIdInput.value = event.id;
        eventDateInput.value = event.date;
        eventTitleInput.value = event.title;
        eventStartTimeInput.value = event.startTime || '';
        eventEndTimeInput.value = event.endTime || '';
        eventDescriptionInput.value = event.description || '';
        
        // Show delete button for existing events
        deleteButton.style.display = 'inline-block';
        
        // Show the modal
        eventModal.style.display = 'flex';
    }
    
    // Check if a date has events
    function hasEventsOnDate(date) {
        return events.some(event => event.date === date);
    }
    
    // Get all events for a specific date
    function getEventsForDate(date) {
        return events.filter(event => event.date === date);
    }
    
    // Generate a unique ID for events
    function generateEventId() {
        return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
    }
    
    // Parse date string (YYYY-MM-DD)
    function parseDateString(dateStr) {
        const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
        return new Date(year, month - 1, day);
    }
    
    // Format date for display
    function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
    
    // Format time for display
    function formatTime(timeStr) {
        if (!timeStr) return '';
        
        const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    
    // Load events from localStorage
    function loadEvents() {
        const storedEvents = localStorage.getItem('calendarEvents');
        return storedEvents ? JSON.parse(storedEvents) : [];
    }
    
    // Save events to localStorage
    function saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }
    
    // Initialize calendar with current month and year
    generateCalendar(currentMonth, currentYear);
});

