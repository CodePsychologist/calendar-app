/**
 * Calendar App JavaScript
 */

/**
 * Display debug messages in an overlay
 * @param {string} message - Message to display
 * @param {string} color - Background color of the message
 */
function showDebugMessage(message, color = 'blue') {
    console.log(`DEBUG: ${message}`);
    
    // Create or update debug element
    let debugElement = document.getElementById('calendar-debug');
    if (!debugElement) {
        debugElement = document.createElement('div');
        debugElement.id = 'calendar-debug';
        debugElement.style.position = 'fixed';
        debugElement.style.bottom = '10px';
        debugElement.style.right = '10px';
        debugElement.style.padding = '10px';
        debugElement.style.background = color;
        debugElement.style.color = 'white';
        debugElement.style.borderRadius = '5px';
        debugElement.style.zIndex = '9999';
        debugElement.style.maxWidth = '300px';
        debugElement.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        document.body.appendChild(debugElement);
    } else {
        debugElement.style.background = color;
    }
    
    debugElement.innerHTML += `<div>${message}</div>`;
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (debugElement.childNodes.length > 1) {
            debugElement.removeChild(debugElement.firstChild);
        } else {
            document.body.removeChild(debugElement);
        }
    }, 5000);
}

/**
 * Calendar class to manage the calendar app
 */
class Calendar {
    /**
     * Initialize a new Calendar instance
     */
    constructor() {
        console.log('Calendar constructor started');
        showDebugMessage('Initializing calendar...', '#333');
        
        // Current date information
        this.today = new Date();
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        
        console.log('Current date:', this.today);
        console.log('Current month/year:', this.currentMonth, this.currentYear);
        
        // DOM elements
        try {
            // Get DOM elements one by one and log status
            this.monthDisplay = document.getElementById('month-display');
            console.log('monthDisplay element:', this.monthDisplay);
            
            this.calendarDays = document.getElementById('calendar-days');
            console.log('calendarDays element:', this.calendarDays);
            
            this.prevMonthBtn = document.getElementById('prev-month');
            console.log('prevMonthBtn element:', this.prevMonthBtn);
            
            this.nextMonthBtn = document.getElementById('next-month');
            console.log('nextMonthBtn element:', this.nextMonthBtn);
            
            this.addEventBtn = document.getElementById('add-event-btn');
            console.log('addEventBtn element:', this.addEventBtn);
            
            this.eventModal = document.getElementById('event-modal');
            console.log('eventModal element:', this.eventModal);
            
            this.closeModalBtn = document.querySelector('.close');
            console.log('closeModalBtn element:', this.closeModalBtn);
            
            this.eventForm = document.getElementById('event-form');
            console.log('eventForm element:', this.eventForm);
            
            this.eventDateInput = document.getElementById('event-date');
            console.log('eventDateInput element:', this.eventDateInput);
            
            // Validate that all required DOM elements are found
            let missingElements = [];
            
            if (!this.monthDisplay) missingElements.push('month-display');
            if (!this.calendarDays) missingElements.push('calendar-days');
            if (!this.prevMonthBtn) missingElements.push('prev-month');
            if (!this.nextMonthBtn) missingElements.push('next-month');
            if (!this.addEventBtn) missingElements.push('add-event-btn');
            if (!this.eventModal) missingElements.push('event-modal');
            if (!this.closeModalBtn) missingElements.push('.close');
            if (!this.eventForm) missingElements.push('event-form');
            if (!this.eventDateInput) missingElements.push('event-date');
            
            if (missingElements.length > 0) {
                const errorMsg = `Required DOM elements not found: ${missingElements.join(', ')}`;
                console.error(errorMsg);
                showDebugMessage(errorMsg, 'red');
                throw new Error(errorMsg);
            } else {
                console.log('All required DOM elements found');
                showDebugMessage('All DOM elements loaded', 'green');
            }
        } catch (error) {
            console.error('Error initializing calendar:', error);
            document.body.innerHTML = `<div style="color: red; padding: 20px; margin: 20px; border: 2px solid red; border-radius: 5px; background: #ffeeee;">
                <h2>Calendar Error</h2>
                <p>${error.message}</p>
                <p>Please check the console for more details (F12)</p>
                <p>Make sure all required HTML elements are present in the document.</p>
            </div>`;
            throw error;
        }
        
        // Month names
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Events storage
        this.events = {};
        this.selectedDate = null;
        
        console.log('Calendar constructor completed successfully');
        showDebugMessage('Calendar structure created', 'darkgreen');
        
        // Initialize the calendar
        this.init();
    }
    
    /**
     * Format a date as YYYY-MM-DD
     * @param {Date} date - The date to format
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    /**
     * Create a Date object from a date string
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {Date} Date object
     */
    parseDate(dateString) {
        const [year, month, day] = dateString.split('-').map(num => parseInt(num));
        return new Date(year, month - 1, day);
    }
    
    /**
     * Check if a date is today
     * @param {number} year - Year to check
     * @param {number} month - Month to check
     * @param {number} day - Day to check
     * @returns {boolean} True if the date is today
     */
    isToday(year, month, day) {
        return (
            day === this.today.getDate() &&
            month === this.today.getMonth() &&
            year === this.today.getFullYear()
        );
    }
    
    /**
     * Initialize calendar functionality
     */
    init() {
        console.log('Calendar initialization started');
        showDebugMessage('Loading calendar data...', 'darkblue');
        
        try {
            // Check if localStorage is available
            this.checkLocalStorageAvailability();
            
            // Load events from storage
            this.loadEvents();
            console.log('Events loaded:', this.events);
            
            // Render the calendar
            this.renderCalendar();
            console.log('Calendar rendering complete');
            
            // Set up event listeners
            this.setupEventListeners();
            console.log('Event listeners set up');
            
            console.log('Calendar initialization complete');
            showDebugMessage('Calendar ready!', 'green');
        } catch (error) {
            console.error('Error during calendar initialization:', error);
            console.error('Error during calendar initialization:', error);
            showDebugMessage(`Initialization error: ${error.message}`, 'red');
        }
    }
    
    /**
     * @returns {boolean} Whether localStorage is available
     */
    checkLocalStorageAvailability() {
        try {
            const testKey = '__test_calendar_storage__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            console.log('localStorage is available');
            return true;
        } catch (e) {
            console.error('localStorage is not available:', e);
            showDebugMessage('Warning: localStorage not available - events will not persist', 'orange');
            return false;
        }
    }
    
    /**
     * Load events from localStorage
     */
    loadEvents() {
        console.log('Loading events from localStorage');
        
        try {
            const storedEvents = localStorage.getItem('calendarEvents');
            console.log('Raw stored events:', storedEvents);
            
            if (storedEvents) {
                this.events = JSON.parse(storedEvents);
                const eventCount = Object.keys(this.events).reduce((count, date) => count + this.events[date].length, 0);
                console.log(`Loaded ${eventCount} events for ${Object.keys(this.events).length} dates`);
                showDebugMessage(`Loaded ${eventCount} events`, 'green');
            } else {
                console.log('No stored events found');
                this.events = {};
            }
        } catch (error) {
            console.error('Error loading events:', error);
            showDebugMessage(`Error loading events: ${error.message}`, 'orange');
            this.events = {};
        }
    }
    
    /**
     * Save events to localStorage
     */
    saveEvents() {
        console.log('Saving events to localStorage');
        
        try {
            localStorage.setItem('calendarEvents', JSON.stringify(this.events));
            console.log('Events saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving events:', error);
            showDebugMessage(`Error saving events: ${error.message}`, 'red');
            alert('Failed to save your event. Please try again.');
            return false;
        }
    }
    
    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        console.log('Setting up event listeners');

        try {
            // Month navigation
            this.prevMonthBtn.addEventListener('click', () => {
                console.log('Previous month button clicked');
                this.navigateMonth(-1);
            });
            
            this.nextMonthBtn.addEventListener('click', () => {
                console.log('Next month button clicked');
                this.navigateMonth(1);
            });
            
            // Modal controls
            this.addEventBtn.addEventListener('click', () => {
                console.log('Add event button clicked');
                this.openModal();
            });
            
            this.closeModalBtn.addEventListener('click', () => {
                console.log('Close modal button clicked');
                this.closeModal();
            });
            
            this.eventForm.addEventListener('submit', (e) => {
                console.log('Event form submitted');
                this.handleEventSubmit(e);
            });
            
            // Close modal on outside click
            window.addEventListener('click', (e) => {
                if (e.target === this.eventModal) {
                    console.log('Modal outside click detected');
                    this.closeModal();
                }
            });
            
            console.log('All event listeners set up successfully');
        } catch (error) {
            console.error('Error setting up event listeners:', error);
            showDebugMessage(`Event listener error: ${error.message}`, 'red');
        }
    }

    /**
     * Navigate to previous or next month
     * @param {number} direction - -1 for previous, 1 for next
     */
    navigateMonth(direction) {
        this.currentMonth += direction;
        
        // Handle year change
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        
        // Re-render calendar with new month
        this.renderCalendar();
        console.log(`Navigated to ${this.monthNames[this.currentMonth]} ${this.currentYear}`);
    }
    
    /**
     * Render the calendar for the current month
     */
    renderCalendar() {
        try {
            console.log('Rendering calendar for:', this.monthNames[this.currentMonth], this.currentYear);
            
            // Clear previous calendar
            this.calendarDays.innerHTML = '';
            
            // Update month/year display
            this.monthDisplay.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
            
            // Get first and last day of month
            const firstDay = new Date(this.currentYear, this.currentMonth, 1);
            const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
            
            const firstDayOfWeek = firstDay.getDay(); // 0 for Sunday
            const daysInMonth = lastDay.getDate();
            
            console.log('First day of month:', firstDay);
            console.log('Last day of month:', lastDay);
            console.log('First day of week:', firstDayOfWeek);
            console.log('Days in month:', daysInMonth);
            // Add empty cells for days before the 1st
            for (let i = 0; i < firstDayOfWeek; i++) {
                const emptyCell = document.createElement('div');
                this.calendarDays.appendChild(emptyCell);
            }
        
            // Create cells for each day of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.classList.add('day');
                
                // Day number
                const dayNumber = document.createElement('span');
                dayNumber.textContent = day;
                dayCell.appendChild(dayNumber);
                
                // Date string for this cell
                const dateString = this.formatDate(new Date(this.currentYear, this.currentMonth, day));
                dayCell.setAttribute('data-date', dateString);
                
                // Check if weekend
                const dayOfWeek = new Date(this.currentYear, this.currentMonth, day).getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    dayCell.classList.add('weekend');
                }
                
                // Check if today
                if (this.isToday(this.currentYear, this.currentMonth, day)) {
                    dayCell.classList.add('current-day');
                }
                
                // Add events for this day
                this.addEventsToDayCell(dayCell, dateString);
                
                // Add click event
                dayCell.addEventListener('click', () => {
                    this.selectedDate = dateString;
                    this.eventDateInput.value = dateString;
                    this.openModal();
                });
                
                this.calendarDays.appendChild(dayCell);
            }
        
            console.log('Calendar rendering complete');
        } catch (error) {
            console.error('Error rendering calendar:', error);
            showDebugMessage('Error rendering calendar: ' + error.message, 'red');
            alert('Error displaying calendar. Please check console logs.');
        }
    }
    
    /**
     * Add event indicators to a day cell
     * @param {HTMLElement} dayCell - The day cell element
     * @param {string} dateString - Date string for this cell
     */
    addEventsToDayCell(dayCell, dateString) {
        try {
            if (this.events[dateString] && this.events[dateString].length > 0) {
                console.log(`Adding ${this.events[dateString].length} events for ${dateString}`);
                
                this.events[dateString].forEach(event => {
                    const eventElement = document.createElement('div');
                    eventElement.classList.add('event-indicator');
                    
                    // Show time if available
                    if (event.time) {
                        eventElement.textContent = `${event.time} - ${event.title}`;
                    } else {
                        eventElement.textContent = event.title;
                    }
                    
                    // Add tooltip with description if available
                    if (event.description) {
                        eventElement.title = event.description;
                    }
                    
                    dayCell.appendChild(eventElement);
                });
                
                // Add visual indicator that the day has events
                dayCell.classList.add('has-events');
            }
        } catch (error) {
            console.error('Error adding events to day cell:', error, dateString);
        }
    }
    
    /**
     * Open the event modal
     */
    openModal() {
        this.eventModal.style.display = 'block';
    }
    
    /**
     * Close the event modal
     */
    closeModal() {
        this.eventModal.style.display = 'none';
        this.eventForm.reset();
    }
    
    /**
     * Handle event form submission
     * @param {Event} e - Form submit event
     */
    handleEventSubmit(e) {
        e.preventDefault();
        
        try {
            console.log('Handling event submission...');
            
            const eventDate = this.eventDateInput.value;
            const eventTitle = document.getElementById('event-title').value;
            const eventTime = document.getElementById('event-time').value;
            const eventDescription = document.getElementById('event-description').value;
            
            console.log('Form values:', { eventDate, eventTitle, eventTime, eventDescription });
            
            // Validate form
            if (!eventDate || !eventTitle) {
                alert('Please enter a date and title for the event');
                console.warn('Form validation failed - missing date or title');
                return;
            }
            
            // Create new event
            const newEvent = {
                id: Date.now(), // Simple unique ID
                title: eventTitle,
                time: eventTime,
                description: eventDescription
            };
            
            console.log('Created new event:', newEvent);
            
            // Add to events storage
            if (!this.events[eventDate]) {
                this.events[eventDate] = [];
            }
            
            this.events[eventDate].push(newEvent);
            this.saveEvents();
            
            console.log(`Event added successfully to ${eventDate}`);
            console.log(`Total events for this date: ${this.events[eventDate].length}`);
            
            // Visual feedback
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Event added successfully!';
            successMessage.style.color = 'green';
            successMessage.style.padding = '10px';
            successMessage.style.textAlign = 'center';
            
            const modalContent = this.eventModal.querySelector('.modal-content');
            modalContent.appendChild(successMessage);
            
            // Remove the success message after a delay
            setTimeout(() => {
                modalContent.removeChild(successMessage);
                // Close modal and refresh
                this.closeModal();
                this.renderCalendar();
            }, 1500);
        } catch (error) {
            console.error('Error handling event submission:', error);
            alert('Failed to add event. Please try again.');
        }
    }
}

/**
 * Finance Tracker class to manage financial transactions
 */
class FinanceTracker {
    /**
     * Initialize a new FinanceTracker instance
     */
    constructor() {
        console.log('FinanceTracker constructor started');
        showDebugMessage('Initializing finance tracker...', '#333');
        
        // Set current date
        this.today = new Date();
        
        // DOM elements
        try {
            // Get DOM elements for finance tracking
            this.totalIncomeElement = document.getElementById('total-income');
            console.log('totalIncomeElement:', this.totalIncomeElement);
            
            this.totalExpensesElement = document.getElementById('total-expenses');
            console.log('totalExpensesElement:', this.totalExpensesElement);
            
            this.balanceElement = document.getElementById('balance');
            console.log('balanceElement:', this.balanceElement);
            
            this.transactionList = document.getElementById('transaction-list');
            console.log('transactionList:', this.transactionList);
            
            this.addTransactionBtn = document.getElementById('add-transaction-btn');
            console.log('addTransactionBtn:', this.addTransactionBtn);
            
            this.transactionModal = document.getElementById('transaction-modal');
            console.log('transactionModal:', this.transactionModal);
            
            this.transactionForm = document.getElementById('transaction-form');
            console.log('transactionForm:', this.transactionForm);
            
            this.transactionModalTitle = document.getElementById('transaction-modal-title');
            console.log('transactionModalTitle:', this.transactionModalTitle);
            
            this.transactionType = document.getElementById('transaction-type');
            console.log('transactionType:', this.transactionType);
            
            this.transactionAmount = document.getElementById('transaction-amount');
            console.log('transactionAmount:', this.transactionAmount);
            
            this.transactionCategory = document.getElementById('transaction-category');
            console.log('transactionCategory:', this.transactionCategory);
            
            this.transactionDate = document.getElementById('transaction-date');
            console.log('transactionDate:', this.transactionDate);
            
            this.transactionDescription = document.getElementById('transaction-description');
            console.log('transactionDescription:', this.transactionDescription);
            
            this.transactionRecurring = document.getElementById('transaction-recurring');
            console.log('transactionRecurring:', this.transactionRecurring);
            
            this.recurringOptions = document.getElementById('recurring-options');
            console.log('recurringOptions:', this.recurringOptions);
            
            this.recurringFrequency = document.getElementById('recurring-frequency');
            console.log('recurringFrequency:', this.recurringFrequency);
            
            this.deleteTransactionBtn = document.getElementById('delete-transaction');
            console.log('deleteTransactionBtn:', this.deleteTransactionBtn);
            
            this.dateFilter = document.getElementById('date-filter');
            console.log('dateFilter:', this.dateFilter);
            
            this.categoryFilter = document.getElementById('category-filter');
            console.log('categoryFilter:', this.categoryFilter);
            
            this.searchTransactions = document.getElementById('search-transactions');
            console.log('searchTransactions:', this.searchTransactions);
            
            this.financeChart = document.getElementById('finance-chart');
            console.log('financeChart:', this.financeChart);

            // Validate that all required DOM elements are found
            let missingElements = [];
            
            if (!this.totalIncomeElement) missingElements.push('total-income');
            if (!this.totalExpensesElement) missingElements.push('total-expenses');
            if (!this.balanceElement) missingElements.push('balance');
            if (!this.transactionList) missingElements.push('transaction-list');
            if (!this.addTransactionBtn) missingElements.push('add-transaction-btn');
            if (!this.transactionModal) missingElements.push('transaction-modal');
            if (!this.transactionForm) missingElements.push('transaction-form');
            if (!this.transactionModalTitle) missingElements.push('transaction-modal-title');
            if (!this.transactionType) missingElements.push('transaction-type');
            if (!this.transactionAmount) missingElements.push('transaction-amount');
            if (!this.transactionCategory) missingElements.push('transaction-category');
            if (!this.transactionDate) missingElements.push('transaction-date');
            if (!this.transactionDescription) missingElements.push('transaction-description');
            if (!this.transactionRecurring) missingElements.push('transaction-recurring');
            if (!this.recurringOptions) missingElements.push('recurring-options');
            if (!this.recurringFrequency) missingElements.push('recurring-frequency');
            if (!this.deleteTransactionBtn) missingElements.push('delete-transaction');
            if (!this.dateFilter) missingElements.push('date-filter');
            if (!this.categoryFilter) missingElements.push('category-filter');
            if (!this.searchTransactions) missingElements.push('search-transactions');
            if (!this.financeChart) missingElements.push('finance-chart');
            
            if (missingElements.length > 0) {
                const errorMsg = `Required finance DOM elements not found: ${missingElements.join(', ')}`;
                console.error(errorMsg);
                showDebugMessage(errorMsg, 'red');
                throw new Error(errorMsg);
            } else {
                console.log('All required finance DOM elements found');
                showDebugMessage('All finance DOM elements loaded', 'green');
            }
        } catch (error) {
            console.error('Error initializing finance tracker:', error);
            showDebugMessage(`Finance tracker initialization error: ${error.message}`, 'red');
            throw error;
        }
        
        // Transactions storage
        this.transactions = [];
        this.currentTransaction = null;
        this.chart = null;
        
        console.log('FinanceTracker constructor completed successfully');
        showDebugMessage('Finance tracker structure created', 'darkgreen');
        
        // Initialize the finance tracker
        this.init();
    }
    
    /**
     * Format currency amounts
     * @param {number} amount - Amount to format
     * @returns {string} Formatted amount
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    /**
     * Format date for display
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {string} Formatted date
     */
    formatDateForDisplay(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }
    
    /**
     * Initialize finance tracker functionality
     */
    init() {
        console.log('Finance tracker initialization started');
        showDebugMessage('Loading finance data...', 'darkblue');
        
        try {
            // Set today's date as default for new transactions
            this.transactionDate.value = new Date().toISOString().split('T')[0];
            
            // Check if localStorage is available (reusing Calendar method)
            // this.checkLocalStorageAvailability();
            
            // Load transactions from storage
            this.loadTransactions();
            console.log('Transactions loaded:', this.transactions);
            
            // Update dashboard with current data
            this.updateDashboard();
            
            // Render the transaction list
            this.renderTransactions();
            
            // Initialize chart
            this.initializeChart();
            
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('Finance tracker initialization complete');
            showDebugMessage('Finance tracker ready!', 'green');
        } catch (error) {
            console.error('Error during finance tracker initialization:', error);
            showDebugMessage(`Finance initialization error: ${error.message}`, 'red');
        }
    }
    
    /**
     * Load transactions from localStorage
     */
    loadTransactions() {
        console.log('Loading transactions from localStorage');
        
        try {
            const storedTransactions = localStorage.getItem('financeTransactions');
            console.log('Raw stored transactions:', storedTransactions);
            
            if (storedTransactions) {
                this.transactions = JSON.parse(storedTransactions);
                console.log(`Loaded ${this.transactions.length} transactions`);
                showDebugMessage(`Loaded ${this.transactions.length} transactions`, 'green');
            } else {
                console.log('No stored transactions found');
                this.transactions = [];
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
            showDebugMessage(`Error loading transactions: ${error.message}`, 'orange');
            this.transactions = [];
        }
    }
    
    /**
     * Save transactions to localStorage
     */
    saveTransactions() {
        console.log('Saving transactions to localStorage');
        
        try {
            localStorage.setItem('financeTransactions', JSON.stringify(this.transactions));
            console.log('Transactions saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving transactions:', error);
            showDebugMessage(`Error saving transactions: ${error.message}`, 'red');
            alert('Failed to save your transaction. Please try again.');
            return false;
        }
    }
    
    /**
     * Set up all event listeners for finance tracking
     */
    setupEventListeners() {
        console.log('Setting up finance event listeners');
        
        try {
            // Add new transaction
            this.addTransactionBtn.addEventListener('click', () => {
                console.log('Add transaction button clicked');
                this.openTransactionModal();
            });
            
            // Transaction form submission
            this.transactionForm.addEventListener('submit', (e) => {
                console.log('Transaction form submitted');
                this.handleTransactionSubmit(e);
            });
            
            // Close modal on X click
            const closeModalBtns = this.transactionModal.querySelectorAll('.close');
            closeModalBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    console.log('Close transaction modal button clicked');
                    this.closeTransactionModal();
                });
            });
            
            // Close modal on outside click
            window.addEventListener('click', (e) => {
                if (e.target === this.transactionModal) {
                    console.log('Transaction modal outside click detected');
                    this.closeTransactionModal();
                }
            });
            
            // Toggle recurring options visibility
            this.transactionRecurring.addEventListener('change', () => {
                this.recurringOptions.classList.toggle('hidden', !this.transactionRecurring.checked);
            });
            
            // Delete transaction button
            this.deleteTransactionBtn.addEventListener('click', () => {
                console.log('Delete transaction button clicked');
                this.deleteTransaction();
            });
            
            // Filter and search functionality
            this.dateFilter.addEventListener('change', () => {
                console.log('Date filter changed:', this.dateFilter.value);
                this.renderTransactions();
            });
            
            this.categoryFilter.addEventListener('change', () => {
                console.log('Category filter changed:', this.categoryFilter.value);
                this.renderTransactions();
            });
            
            this.searchTransactions.addEventListener('input', () => {
                console.log('Search input changed:', this.searchTransactions.value);
                this.renderTransactions();
            });
            
            // Change form fields based on transaction type
            this.transactionType.addEventListener('change', () => {
                console.log('Transaction type changed:', this.transactionType.value);
                this.updateCategoryOptions();
            });
            
            console.log('All finance event listeners set up successfully');
        } catch (error) {
            console.error('Error setting up finance event listeners:', error);
            showDebugMessage(`Finance event listener error: ${error.message}`, 'red');
        }
    }
    
    /**
     * Update category options based on transaction type
     */
    updateCategoryOptions() {
        // Clear current options
        this.transactionCategory.innerHTML = '';
        
        // Create new options based on type
        const type = this.transactionType.value;
        let options = [];
        
        if (type === 'income') {
            options = [
                { value: 'salary', text: 'Salary' },
                { value: 'business', text: 'Business' },
                { value: 'investment', text: 'Investment' },
                { value: 'gift', text: 'Gift' },
                { value: 'other', text: 'Other' }
            ];
        } else {
            options = [
                { value: 'food', text: 'Food & Dining' },
                { value: 'transportation', text: 'Transportation' },
                { value: 'utilities', text: 'Utilities' },
                { value: 'entertainment', text: 'Entertainment' },
                { value: 'shopping', text: 'Shopping' },
                { value: 'health', text: 'Health' },
                { value: 'housing', text: 'Housing' },
                { value: 'other', text: 'Other' }
            ];
        }
        
        // Add options to select
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            if (option.value === 'other') {
                optionElement.selected = true;
            }
            this.transactionCategory.appendChild(optionElement);
        });
    }
    
    /**
     * Opens the transaction modal
     * @param {Object} transaction - Optional transaction to edit
     */
    openTransactionModal(transaction = null) {
        // Reset form
        this.transactionForm.reset();
        this.recurringOptions.classList.add('hidden');
        this.deleteTransactionBtn.classList.add('hidden');
        
        // Set default date to today if not editing
        if (!transaction) {
            this.transactionModalTitle.textContent = 'Add Transaction';
            this.transactionDate.value = new Date().toISOString().split('T')[0];
            this.transactionType.value = 'expense';
            this.updateCategoryOptions();
            this.currentTransaction = null;
        } else {
            // Fill form with transaction data
            this.transactionModalTitle.textContent = 'Edit Transaction';
            this.transactionType.value = transaction.type;
            this.updateCategoryOptions();
            this.transactionAmount.value = transaction.amount;
            this.transactionCategory.value = transaction.category;
            this.transactionDate.value = transaction.date;
            this.transactionDescription.value = transaction.description || '';
            
            if (transaction.recurring) {
                this.transactionRecurring.checked = true;
                this.recurringOptions.classList.remove('hidden');
                this.recurringFrequency.value = transaction.recurringFrequency || 'monthly';
            }
            
            // Show delete button for editing
            this.deleteTransactionBtn.classList.remove('hidden');
            this.currentTransaction = transaction;
        }
        
        // Display the modal
        this.transactionModal.style.display = 'block';
    }
    
    /**
     * Closes the transaction modal
     */
    closeTransactionModal() {
        this.transactionModal.style.display = 'none';
        // Reset form and current transaction
        this.transactionForm.reset();
        this.currentTransaction = null;
    }
    
    /**
     * Handle transaction form submission
     * @param {Event} e - Form submit event
     */
    handleTransactionSubmit(e) {
        e.preventDefault();
        
        try {
            console.log('Processing transaction submission...');
            
            // Get form values
            const type = this.transactionType.value;
            const amount = parseFloat(this.transactionAmount.value);
            const category = this.transactionCategory.value;
            const date = this.transactionDate.value;
            const description = this.transactionDescription.value;
            const recurring = this.transactionRecurring.checked;
            const recurringFrequency = recurring ? this.recurringFrequency.value : null;
            
            console.log('Transaction form values:', { 
                type, amount, category, date, description, recurring, recurringFrequency 
            });
            
            // Validate form
            if (!date || !amount || isNaN(amount) || amount <= 0) {
                alert('Please enter a valid date and amount for the transaction');
                console.warn('Transaction form validation failed - invalid date or amount');
                showDebugMessage('Transaction validation failed', 'orange');
                return;
            }
            
            // Create transaction object
            const transaction = {
                id: this.currentTransaction ? this.currentTransaction.id : Date.now(),
                type,
                amount,
                category,
                date,
                description,
                recurring,
                recurringFrequency,
                createdAt: this.currentTransaction ? this.currentTransaction.createdAt : new Date().toISOString()
            };
            
            console.log('Transaction object created:', transaction);
            
            // Add to transactions or update existing
            if (this.currentTransaction) {
                // Find and update existing transaction
                const index = this.transactions.findIndex(t => t.id === this.currentTransaction.id);
                if (index !== -1) {
                    this.transactions[index] = transaction;
                    console.log('Updated existing transaction at index:', index);
                    showDebugMessage('Transaction updated', 'green');
                }
            } else {
                // Add new transaction
                this.transactions.push(transaction);
                console.log('Added new transaction. Total count:', this.transactions.length);
                showDebugMessage('Transaction added', 'green');
                
                // If recurring, add to calendar events
                if (recurring) {
                    this.addRecurringTransactionToCalendar(transaction);
                }
            }
            
            // Save transactions
            this.saveTransactions();
            
            // Update UI
            this.updateDashboard();
            this.renderTransactions();
            this.updateChart();
            
            // Visual feedback
            const successMessage = document.createElement('div');
            successMessage.textContent = this.currentTransaction 
                ? 'Transaction updated successfully!' 
                : 'Transaction added successfully!';
            successMessage.style.color = 'green';
            successMessage.style.padding = '10px';
            successMessage.style.textAlign = 'center';
            
            const modalContent = this.transactionModal.querySelector('.modal-content');
            modalContent.appendChild(successMessage);
            
            // Remove the success message after a delay
            setTimeout(() => {
                if (modalContent.contains(successMessage)) {
                    modalContent.removeChild(successMessage);
                }
                // Close modal
                this.closeTransactionModal();
            }, 1500);
        } catch (error) {
            console.error('Error processing transaction submission:', error);
            showDebugMessage(`Transaction error: ${error.message}`, 'red');
            alert('Failed to process transaction. Please try again.');
        }
    }
    
    /**
     * Add recurring transaction to calendar events
     * @param {Object} transaction - Transaction to add to calendar
     */
    addRecurringTransactionToCalendar(transaction) {
        try {
            console.log('Adding recurring transaction to calendar:', transaction);
            
            // Get access to the calendar events (this assumes the Calendar class instance is available)
            const calendar = window.calendar;
            
            if (!calendar || !calendar.events) {
                console.warn('Calendar not available for recurring transactions');
                showDebugMessage('Calendar not available for recurring events', 'orange');
                return;
            }
            
            const dateKey = transaction.date;
            const title = `${transaction.type === 'income' ? 'Income' : 'Payment'}: ${this.formatCurrency(transaction.amount)}`;
            const description = `${transaction.category}: ${transaction.description || 'Recurring transaction'}`;
            
            // Create calendar event
            const calendarEvent = {
                id: `finance_${transaction.id}`,
                title,
                description,
                recurring: true,
                financeData: {
                    transactionId: transaction.id,
                    type: transaction.type,
                    amount: transaction.amount
                }
            };
            
            // Add to calendar events
            if (!calendar.events[dateKey]) {
                calendar.events[dateKey] = [];
            }
            
            calendar.events[dateKey].push(calendarEvent);
            calendar.saveEvents();
            
            console.log('Added transaction to calendar events');
            showDebugMessage('Recurring transaction added to calendar', 'green');
            
            // Refresh calendar if visible
            if (typeof calendar.renderCalendar === 'function') {
                calendar.renderCalendar();
            }
        } catch (error) {
            console.error('Error adding transaction to calendar:', error);
            showDebugMessage('Failed to add to calendar', 'orange');
            // Continue without stopping the transaction process
        }
    }
    
    /**
     * Delete the current transaction
     */
    deleteTransaction() {
        try {
            if (!this.currentTransaction) {
                console.warn('No transaction selected for deletion');
                return;
            }
            
            // Confirm deletion
            if (!confirm('Are you sure you want to delete this transaction?')) {
                return;
            }
            
            console.log('Deleting transaction:', this.currentTransaction);
            
            // Find and remove the transaction
            const index = this.transactions.findIndex(t => t.id === this.currentTransaction.id);
            if (index !== -1) {
                this.transactions.splice(index, 1);
                console.log('Transaction removed at index:', index);
                showDebugMessage('Transaction deleted', 'green');
                
                // Remove from calendar if recurring
                if (this.currentTransaction.recurring) {
                    this.removeTransactionFromCalendar(this.currentTransaction);
                }
                
                // Save transactions
                this.saveTransactions();
                
                // Update UI
                this.updateDashboard();
                this.renderTransactions();
                this.updateChart();
                
                // Close modal
                this.closeTransactionModal();
            } else {
                console.warn('Transaction not found for deletion');
                showDebugMessage('Transaction not found', 'orange');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            showDebugMessage(`Delete error: ${error.message}`, 'red');
            alert('Failed to delete transaction. Please try again.');
        }
    }
    
    /**
     * Remove transaction from calendar events
     * @param {Object} transaction - Transaction to remove from calendar
     */
    removeTransactionFromCalendar(transaction) {
        try {
            console.log('Removing transaction from calendar:', transaction);
            
            // Get access to the calendar events
            const calendar = window.calendar;
            
            if (!calendar || !calendar.events) {
                console.warn('Calendar not available for transaction removal');
                return;
            }
            
            const dateKey = transaction.date;
            
            // Check if events exist for this date
            if (calendar.events[dateKey]) {
                // Filter out the related finance event
                const filteredEvents = calendar.events[dateKey].filter(
                    event => event.id !== `finance_${transaction.id}`
                );
                
                if (filteredEvents.length === 0) {
                    // Remove the date key if no events left
                    delete calendar.events[dateKey];
                } else {
                    calendar.events[dateKey] = filteredEvents;
                }
                
                calendar.saveEvents();
                console.log('Removed transaction from calendar events');
                
                // Refresh calendar if visible
                if (typeof calendar.renderCalendar === 'function') {
                    calendar.renderCalendar();
                }
            }
        } catch (error) {
            console.error('Error removing transaction from calendar:', error);
            // Continue without stopping the deletion process
        }
    }
    
    /**
     * Render transactions with filtering
     */
    renderTransactions() {
        try {
            console.log('Rendering transactions');
            
            // Clear current list
            this.transactionList.innerHTML = '';
            
            // Get filter values
            const dateFilter = this.dateFilter.value;
            const categoryFilter = this.categoryFilter.value;
            const searchText = this.searchTransactions.value.toLowerCase();
            
            console.log('Filters:', { dateFilter, categoryFilter, searchText });
            
            // Apply date filter
            let filteredTransactions = this.transactions.slice();
            
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
            const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()).getTime();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
            const startOfYear = new Date(today.getFullYear(), 0, 1).getTime();
            
            if (dateFilter !== 'all') {
                filteredTransactions = filteredTransactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date).getTime();
                    
                    switch (dateFilter) {
                        case 'today':
                            return transactionDate >= startOfDay;
                        case 'week':
                            return transactionDate >= startOfWeek;
                        case 'month':
                            return transactionDate >= startOfMonth;
                        case 'year':
                            return transactionDate >= startOfYear;
                        default:
                            return true;
                    }
                });
            }
            
            // Apply category filter
            if (categoryFilter !== 'all') {
                if (categoryFilter === 'income') {
                    filteredTransactions = filteredTransactions.filter(t => t.type === 'income');
                } else if (categoryFilter === 'expense') {
                    filteredTransactions = filteredTransactions.filter(t => t.type === 'expense');
                } else {
                    filteredTransactions = filteredTransactions.filter(t => t.category === categoryFilter);
                }
            }
            
            // Apply search filter
            if (searchText) {
                filteredTransactions = filteredTransactions.filter(transaction => {
                    return (
                        transaction.description.toLowerCase().includes(searchText) ||
                        transaction.category.toLowerCase().includes(searchText) ||
                        this.formatCurrency(transaction.amount).toLowerCase().includes(searchText)
                    );
                });
            }
            
            console.log(`Filtered to ${filteredTransactions.length} transactions`);
            
            // Sort transactions by date (newest first)
            filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Show empty state if no transactions
            if (filteredTransactions.length === 0) {
                const emptyState = document.createElement('p');
                emptyState.classList.add('empty-state');
                emptyState.textContent = 'No transactions match your filters.';
                this.transactionList.appendChild(emptyState);
                return;
            }
            
            // Create transaction list items
            filteredTransactions.forEach(transaction => {
                const transactionItem = document.createElement('div');
                transactionItem.classList.add('transaction-item');
                transactionItem.setAttribute('data-id', transaction.id);
                
                // Date column
                const dateElement = document.createElement('div');
                dateElement.classList.add('transaction-date');
                dateElement.textContent = this.formatDateForDisplay(transaction.date);
                
                // Details column
                const detailsElement = document.createElement('div');
                detailsElement.classList.add('transaction-details');
                
                const titleElement = document.createElement('div');
                titleElement.classList.add('transaction-title');
                titleElement.textContent = transaction.description || transaction.category;
                
                const categoryElement = document.createElement('div');
                categoryElement.classList.add('transaction-category');
                categoryElement.textContent = transaction.category;
                
                detailsElement.appendChild(titleElement);
                detailsElement.appendChild(categoryElement);
                
                // Amount column
                const amountElement = document.createElement('div');
                amountElement.classList.add('transaction-amount');
                
                if (transaction.type === 'income') {
                    amountElement.classList.add('income-amount');
                    amountElement.textContent = `+${this.formatCurrency(transaction.amount)}`;
                } else {
                    amountElement.classList.add('expense-amount');
                    amountElement.textContent = `-${this.formatCurrency(transaction.amount)}`;
                }
                
                // Actions column
                const actionsElement = document.createElement('div');
                actionsElement.classList.add('transaction-actions');
                
                const editButton = document.createElement('button');
                editButton.classList.add('action-btn');
                editButton.innerHTML = '✏️';
                editButton.title = 'Edit';
                editButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openTransactionModal(transaction);
                });
                
                actionsElement.appendChild(editButton);
                
                // Assemble transaction item
                transactionItem.appendChild(dateElement);
                transactionItem.appendChild(detailsElement);
                transactionItem.appendChild(amountElement);
                transactionItem.appendChild(actionsElement);
                
                // Click on item to edit
                transactionItem.addEventListener('click', () => {
                    this.openTransactionModal(transaction);
                });
                
                // Add to transaction list
                this.transactionList.appendChild(transactionItem);
            });
            
            console.log('Transaction list rendering complete');
            
        } catch (error) {
            console.error('Error rendering transactions:', error);
            showDebugMessage(`Render error: ${error.message}`, 'red');
            
            // Show fallback empty state on error
            this.transactionList.innerHTML = '';
            const errorState = document.createElement('p');
            errorState.classList.add('empty-state');
            errorState.textContent = 'Error loading transactions. Please try again.';
            this.transactionList.appendChild(errorState);
        }
    }
    
    /**
     * Update dashboard with current financial data
     */
    updateDashboard() {
        try {
            console.log('Updating finance dashboard');
            
            // Calculate totals
            let totalIncome = 0;
            let totalExpenses = 0;
            let balance = 0;
            
            this.transactions.forEach(transaction => {
                if (transaction.type === 'income') {
                    totalIncome += transaction.amount;
                } else {
                    totalExpenses += transaction.amount;
                }
            });
            
            balance = totalIncome - totalExpenses;
            
            // Update dashboard elements
            this.totalIncomeElement.textContent = this.formatCurrency(totalIncome);
            this.totalExpensesElement.textContent = this.formatCurrency(totalExpenses);
            this.balanceElement.textContent = this.formatCurrency(balance);
            
            // Adjust styling based on balance
            if (balance < 0) {
                this.balanceElement.style.color = '#dc3545';
            } else {
                this.balanceElement.style.color = '#333';
            }
            
            console.log('Dashboard updated:', { totalIncome, totalExpenses, balance });
            showDebugMessage('Dashboard updated', 'green');
            
        } catch (error) {
            console.error('Error updating dashboard:', error);
            showDebugMessage(`Dashboard error: ${error.message}`, 'red');
        }
    }
    
    /**
     * Initialize the financial chart
     */
    /**
     * Initialize the financial chart
     */
    initializeChart() {
        try {
            console.log('Initializing finance chart');
            
            // Check if the chart already exists
            if (this.chart) {
                this.chart.destroy();
                console.log('Existing chart destroyed');
            }
            
            // Get the chart context
            const ctx = this.financeChart.getContext('2d');
            
            // Create empty pie chart initially
            this.chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            'rgba(40, 167, 69, 0.7)',  // Green for income
                            'rgba(220, 53, 69, 0.7)',  // Red for expenses
                            'rgba(255, 193, 7, 0.7)',  // Yellow
                            'rgba(23, 162, 184, 0.7)', // Cyan
                            'rgba(111, 66, 193, 0.7)', // Purple
                            'rgba(253, 126, 20, 0.7)', // Orange
                        ],
                        borderColor: [
                            'rgb(40, 167, 69)',
                            'rgb(220, 53, 69)',
                            'rgb(255, 193, 7)',
                            'rgb(23, 162, 184)',
                            'rgb(111, 66, 193)',
                            'rgb(253, 126, 20)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Financial Distribution'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(context.parsed);
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
            // Update the chart with data
            this.updateChart();
            
        } catch (error) {
            console.error('Error initializing chart:', error);
            showDebugMessage(`Chart initialization error: ${error.message}`, 'red');
            
            // Show error message on chart
            const ctx = this.financeChart.getContext('2d');
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, this.financeChart.width, this.financeChart.height);
            
            ctx.font = '16px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('Chart could not be loaded', this.financeChart.width / 2, this.financeChart.height / 2);
        }
    }
    
    /**
     * Update the financial chart with current data
     */
    /**
     * Update the financial chart with current data
     */
    updateChart() {
        try {
            console.log('Updating financial chart');
            
            if (!this.chart) {
                console.warn('Chart not initialized');
                return;
            }
            
            // Calculate totals by category
            const categoryTotals = {};
            let total = 0;
            
            this.transactions.forEach(transaction => {
                const amount = transaction.amount;
                const category = transaction.category;
                
                if (!categoryTotals[category]) {
                    categoryTotals[category] = 0;
                }
                
                if (transaction.type === 'expense') {
                    categoryTotals[category] += amount;
                    total += amount;
                }
            });
            
            // Convert to arrays for chart
            const labels = [];
            const data = [];
            
            // Sort categories by amount (descending)
            Object.entries(categoryTotals)
                .sort(([,a], [,b]) => b - a)
                .forEach(([category, amount]) => {
                    // Format category name (capitalize first letter)
                    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
                    labels.push(formattedCategory);
                    data.push(amount);
                });
            
            // Update chart data
            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = data;
            
            // Update chart
            this.chart.update();
            
            console.log('Chart updated with category data:', { labels, data });
            showDebugMessage(`Chart update error: ${error.message}`, 'red');
        }
    }
}

// Initialize calendar and finance tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Add visual indicator during initialization
        const loadingMessage = document.createElement('div');
        loadingMessage.textContent = 'Loading calendar...';
        loadingMessage.style.position = 'fixed';
        loadingMessage.style.top = '10px';
        loadingMessage.style.right = '10px';
        loadingMessage.style.padding = '10px';
        loadingMessage.style.background = '#333';
        loadingMessage.style.color = '#fff';
        loadingMessage.style.borderRadius = '5px';
        loadingMessage.style.zIndex = '9999';
        
        document.body.appendChild(loadingMessage);
        
        // Initialize calendar with a slight delay to ensure DOM is ready
        setTimeout(() => {
            window.calendar = new Calendar();
            console.log('Calendar initialized successfully');
            
            // Initialize finance tracker after calendar
            setTimeout(() => {
                try {
                    window.financeTracker = new FinanceTracker();
                    console.log('Finance tracker initialized successfully');
                } catch (error) {
                    console.error('Failed to initialize finance tracker:', error);
                    showDebugMessage('Finance tracker initialization failed', 'red');
                }
            }, 300);
            
            // Remove loading message
            document.body.removeChild(loadingMessage);
            
            // Add status indicator
            const statusMessage = document.createElement('div');
            statusMessage.textContent = 'Calendar loaded successfully!';
            statusMessage.style.position = 'fixed';
            statusMessage.style.top = '10px';
            statusMessage.style.right = '10px';
            statusMessage.style.padding = '10px';
            statusMessage.style.background = 'green';
            statusMessage.style.color = '#fff';
            statusMessage.style.borderRadius = '5px';
            statusMessage.style.zIndex = '9999';
            
            document.body.appendChild(statusMessage);
            
            // Remove status message after a delay
            setTimeout(() => {
                document.body.removeChild(statusMessage);
            }, 3000);
        }, 200);
    } catch (error) {
        console.error('Failed to initialize calendar:', error);
        
        // Display error message
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = `<strong>Error:</strong> Failed to initialize calendar.<br>Please check the console for details.`;
        errorMessage.style.position = 'fixed';
        errorMessage.style.top = '10px';
        errorMessage.style.right = '10px';
        errorMessage.style.padding = '10px';
        errorMessage.style.background = 'red';
        errorMessage.style.color = '#fff';
        errorMessage.style.borderRadius = '5px';
        errorMessage.style.zIndex = '9999';
        
        document.body.appendChild(errorMessage);
    }
});

/**
 * Service Worker Registration for PWA functionality
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful:', registration.scope);
                showDebugMessage('PWA Service Worker registered', 'green');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
                showDebugMessage('PWA Service Worker registration failed', 'orange');
            });
    });
}
