/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

import '../util/swiped-events.js';
// This element is connected to the Redux store.
import { store } from '../store.js';

import { getDayOffset, getDateLists, getIndexToday, monthToDays, months, years, today, earliestDate } from '../util/dateutil.js';
import { TrackedEvent} from '../util/tracked-event.js';
import './event-button-element.js'

import { createModel, compileModel,trainModel, testModel, convertToTensor} from '../util/ml-util.js'

import { markDay, markMonth, markYear, selectMonth, selectYear,selectEventStartHour,selectEventEndHour,selectEventStartMinute,selectEventEndMinute } from '../actions/calendar.js';
import {submitEvent,removeEvent,editEvent} from '../actions/events.js';
// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState
} from '../actions/app.js';

import calendar from '../reducers/calendar.js';
store.addReducers({
  calendar
});

import events from '../reducers/events.js';
store.addReducers({
  events
});

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { menuIcon } from './my-icons.js';
import './snack-bar.js';


class ClarifyMe extends connect(store)(LitElement) {
     
  
  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean },
      _currentDay: { type: Number},
      _currentDayIndex: { type: Number},
      _currentMonth: { type: Number},
      _currentYear: { type: Number},
      _markedDayEvents: {type: Array},
      _sortedEvents: {type:Array},
      _sortedBoxCoords: {type:Array},
      _markedDay: {type: Number},
      _markedMonth: {type: Number},
      _markedYear: {type: Number},
      _selectedMonthEvents: {type: Array},
      _selectedMonth: { type: Number},
      _selectedYear: { type: Number},
      _dayOffset :{ type: Number},
      _dateList: {type: Array},
      _dateListDetailed: {type: Array},
      _monthSelectionOptions : {type:Array},
      _yearSelectionOptions : {type:Array},
      _enter: {type: String},
      _exit: {type: String},
      _trackedEvents: {type: Array},
      _trackedEventsTypes: {type: Array},
      _trackedEventsDateList: {type: Array},
      _trackedEventsData: {type: Array},
      _trackedIDs: {type: Array},
      _selectedEventStartHour: {type: String},
      _selectedEventEndHour: {type: String},
      _selectedEventStartMinute: {type: String},
      _selectedEventEndMinute: {type: String},
      _panelName: {type: String},
      _eventPanelEvent: {type: Object},
      _globalCounter: {type: Number},
      _causeList: {type: Array},
      _effectList: {type: Array},
      _inputsML: {type: Array},
      _labelsML: {type: Array},
      _modelTrained: {type: Boolean},
      _modelTraining: {type: Boolean}

    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;

          --app-drawer-width: 256px;
          --app-footer-background-color: white;

          --app-primary-color: #1975d3;
          --app-secondary-color: #484848;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: #484848;
          --app-section-even-color: white;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color-calendar:  rgb(0,0,0);
          --app-header-selected-color-day: rgb(255,0,0);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-color: white;
        }

        app-header {
          border-radius: 100vh;
          z-index: 100;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #eee;
        }

        .toolbar-top {
          z-index: 100;
          background-color: white;
          line-height:0vw;
          padding-left:0;
          width: 100%;
        }

        [main-title] {
            
          font-family: Lato,sans-serif;
          /*text-transform: lowercase;*/
          font-size: 8vmin;
          line-height:4vmax;
          margin-top: 0;
          margin-bottom: 0;
          padding-top: 0;
          padding-bottom: 0;
          font-weight: 900;
          letter-spacing: -1px;
          -ms-text-size-adjust:100%;
          -webkit-text-size-adjust:100%;
          z-index: 200;
         
        }

        .toolbar-list {
          display: block;
          font-size: 2vmin;
          padding-top: 2vh;
          padding-bottom: 0.2vh;
          background: white;
        }
        
        .toolbar-list a {
          font-weight: 300;
          margin-left: 1vmin;
          margin-right: 1vmin;
          border-radius: 1vmin;
          box-shadow: 0 0 0.5vmax 0 rgba(0,0,0,0.2);
        }
        
        .toolbar-list a:not([selected]):hover {
          font-weight: 300;
          margin-left: 1vmin;
          margin-right: 1vmin;
          border-radius: 1vmin;
          box-shadow: 0 0 0.1vmax 0 rgba(0,0,0,0.2);
        }

        .toolbar-list > a {

          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 8vmin;
          padding: 4vmin 4vmin;
        }

        .toolbar-list > #calendar_nav[selected] {
            background: url("./images/calendar.svg");
          background-repeat: no-repeat;
          background-position: center;
            background-size: 8vmin;
          -webkit-filter: grayscale(0%);
            filter: grayscale(0%);
            opacity: 1;
        }
        
        .toolbar-list > #day_nav[selected] {
            background: url("./images/day.svg");
          background-repeat: no-repeat;
          background-position: center;
            background-size: 8vmin;
          -webkit-filter: grayscale(0%);
            filter: grayscale(0%);
            opacity: 1;
        }
        
        .toolbar-list > #settings_nav[selected] {
            background: url("./images/settings.svg");
          background-repeat: no-repeat;
          background-position: center;
            background-size: 9vmin 9vmin;
          -webkit-filter: grayscale(0%);
            filter: grayscale(0%);
            opacity: 1;
        }
        
        .toolbar-list > #calendar_nav:not([selected]) {
            background: url("./images/calendar.svg");
          background-repeat: no-repeat;
          background-position: center;
            background-size: 8vmin;
          -webkit-filter: grayscale(100%);
            opacity: 0.5;
        }
        
        
        .toolbar-list > #day_nav:not([selected]) {
            background: url("./images/day.svg");
          background-repeat: no-repeat;
          background-position: center;
            background-size: 8vmin;
          -webkit-filter: grayscale(100%);
            opacity: 0.5;
        }
        
        .toolbar-list > #settings_nav:not([selected]) {
          background: url("./images/settings.svg");
          background-repeat: no-repeat;
          background-position: center;
            background-size: 9vmin 9vmin;
          -webkit-filter: grayscale(100%);
            opacity: 0.3;
        }

        .toolbar-list > #day_nav:hover {
          -webkit-filter: grayscale(0%); 
            filter: grayscale(0%);
            opacity: 1;
        }
        .toolbar-list > #calendar_nav:hover {
          -webkit-filter: grayscale(0%); 
            filter: grayscale(0%);
            opacity: 1;
        }
        .toolbar-list > #settings_nav:hover {
          -webkit-filter: grayscale(0%); 
            filter: grayscale(0%);
            opacity: 1;
        }



        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          padding-top: calc(12vh + 10vmin);
          min-height: 100vh;
          color: var(--app-drawer-text-color);
        }
        .page: {
            width: 100vw;
            margin: auto;
            display: block;
        }

        .page:not([active])[left] {
            display: none;
            left: 100vw;
            width: 100vw;
            margin: auto;
          -webkit-overflow-scrolling: touch;
          /*transition: transform 0.25s ease-in-out;*/
          /*transform: translate(-100vw, 0);*/
          
          -webkit-animation: translateLeft 0.25s forwards;
    
            animation: translateLeft 0.25s normal;
        }
        
        .page:not([active]):not([left]) {
            display: none;
            left: -100vw;
            width: 100vw;
            margin: auto;
          -webkit-overflow-scrolling: touch;
          /*transition: transform 0.25s ease-in-out;*/
          /*transform: translate(100vw, 0);*/
          
          -webkit-animation: translateRight 0.25s forwards;
    
            animation: translateRight 0.25s normal;
        }

        .page[active]:not([left]) {
            left: 0vw;
            width: 100vw;
            margin: auto;
            display: block;
          -webkit-overflow-scrolling: touch;
          /*transition: transform 0.25s ease-in-out;*/
          /*transform: translate(100vw 0) 0.25s ease-in-out;*/
          -webkit-animation: translateLeft 0.25s backwards;
    
            animation: translateLeft 0.25s reverse;
        }
        
        .page[active][left] {
            left: 0vw;
            width: 100vw;
            margin: auto;
            display: block;
          -webkit-overflow-scrolling: touch;
          /*transition: transform 0.25s ease-in-out;*/
          /*transform: translate(100vw 0) 0.25s ease-in-out;*/
          -webkit-animation: translateRight 0.25s backwards;
    
            animation: translateRight 0.25s reverse;
        }
        
        @-webkit-keyframes translateLeft {
            0% { left: 0vw; }
            25% { left: -25vw; }
            50% { left: -50vw; display:none;}
            75% { left: -75vw; display:none;}
            100% { left: -100vw; display:none;}
        }

        @keyframes translateLeft {
            0% { left: 0vw; }
            25% { left: -25vw; }
            50% { left: -50vw; display:none;}
            75% { left: -100vw; display:none;}
            100% { left: -100vw; display:none;}
        }
        
        
        
        @-webkit-keyframes translateRight {
            0% { left: 0vw; }
            25% { left: 25vw; }
            50% { left: 50vw; display:none;}
            75% { left: 75vw; display:none;}
            100% { left: 100vw; display:none;}
        }

        @keyframes translateRight {
            0% { left: 0vw; }
            25% { left: 25vw; }
            50% { left: 50vw; display:none;}
            75% { left: 75vw; display:none;}
            100% { left: 100vw; display:none;}
        }
        
        @-webkit-keyframes translateCenter {
            100% { left: 0vw; }
        }

        @keyframes translateCenter {
            100% { left: 0vw;}
        }

        
        footer {
            font-size: 2vmin;
          padding: 3vh;
          background: var(--app-footer-background-color);
          color: var(--app-drawer-text-color);
          text-align: center;
        }



        }
      `
    ];
  }

  render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <!-- Header -->
      <app-header condenses reveals effects="waterfall">
        <app-toolbar class="toolbar-top">
          <div main-title>${this.appTitle}</div>
        </app-toolbar>
        <nav class="toolbar-list">
          <a id="calendar_nav" ?selected="${this._page === 'calendar'}" href="/calendar"></a>
          <a id="day_nav" ?selected="${this._page === 'day'}" href="/day"></a>
          <a id="settings_nav" ?selected="${this._page === 'settings'}" href="/settings"></a>
        </nav>
      </app-header>


      <!-- Main content -->
      <main role="main" class="main-content">
        <calendar-view 
            class="page"
            id="calendar-view" 
            ?active="${this._page === 'calendar'}"
            ?enter="${this._enter === 'calendar'}"
            ?left="${this._page !== 'calendar'}"
            currentMonth="${this._currentMonth}"
            currentYear="${this._currentYear}"
            currentDayIndex="${this._currentDayIndex}"
            markedDay="${this._markedDay}"
            markedMonth="${this._markedMonth}"
            markedYear="${this._markedYear}"
            selectedMonthEvents="${typeof(this._selectedMonthEvents) == "string" ? this._selectedMonthEvents : JSON.stringify(this._selectedMonthEvents)}"
            selectedMonth="${this._selectedMonth}"
            selectedYear="${this._selectedYear}"
            @day-marked="${(e) => this._dayMarked(e)}"
            @calendar-arrow-pressed="${(e) => this._calendarArrowPressed(e)}"
            @calendar-dropdown-selected="${(e) => this._calendarDropdownSelected(e)}"
            dayOffset="${this._dayOffset}"
            monthDays="${monthToDays(this._selectedMonth,this._selectedYear)}"
            dateList="${this._dateList}"
            monthSelectionOptions="${this._monthSelectionOptions}"
            yearSelectionOptions="${this._yearSelectionOptions}"
            datesSet="-1"></calendar-view>
  
        <day-view
            class="page"
            id="day-view" 
            ?active="${this._page === 'day'}"
            ?enter="${this._page  === 'day'}"
            ?left="${(this._page === 'day' && this._exit === 'calendar') || (this._page  === 'settings') || this._page ==='event-panel'}"
            markedDayEvents="${typeof(this._markedDayEvents) == "string" ? this._markedDayEvents : JSON.stringify(this._markedDayEvents)}"
            sortedEvents="${typeof(this._sortedEvents) == "string" ? this._sortedEvents : JSON.stringify(this._sortedEvents)}" 
            sortedBoxCoords="${typeof(this._sortedBoxCoords) == "string" ? this._sortedBoxCoords : JSON.stringify(this._sortedBoxCoords)}" 
            markedDay="${this._markedDay}"
            markedMonth="${this._markedMonth}"
            markedYear="${this._markedYear}"
            selectedMonth="${this._selectedMonth}"
            selectedYear="${this._selectedYear}"
            pageChanged="${this._prevPage !== this._page}"
            dateList="${this._dateList}"
            dateListDetailed="${this._dateListDetailed}"
            @day-marked="${(e) => this._dayMarked(e)}"
            @modify-event="${(e) => this._modifyEvent(e)}"
            @delete-event="${(e) => this._deleteEvent(e)}"
            @calendar-arrow-pressed="${(e) => this._calendarArrowPressed(e)}"
            
            ></day-view>
       
        <settings-view id="settings-view" class="page" ?active="${this._page === 'settings'}" 
            ?left="${this._page === 'settings' && this._exit !== 'event-panel'}"
            ?enter="${(this._page  === 'settings' && this._exit ==='day') || (this._page  === 'settings' && this._exit ==='calendar')}"
            
            markedDay="${this._markedDay}"
            markedMonth="${this._markedMonth}"
            markedYear="${this._markedYear}"
       @day-selected="${(e) => this._daySelected(e)}"></settings-view>
       <event-panel-view id="event-panel-view" class="page"
        selectedEventStartHour="${this._selectedEventStartHour}"
        selectedEventStartMinute="${this._selectedEventStartMinute}"
        selectedEventEndHour="${this._selectedEventEndHour}"
        selectedEventEndMinute="${this._selectedEventEndMinute}"
        eventName="${this._eventPanelEvent == JSON.stringify(undefined) ?  " " : this._eventPanelEvent.id.split("_")[0].trim()}"
        panelName="${this._panelName}"
        eventPanelEvent="${typeof(this._eventPanelEvent) == "string" ? this._eventPanelEvent : JSON.stringify(this._eventPanelEvent)}"
        globalCounter="${this._globalCounter}"
        
       ?active="${this._page === 'event-panel'}" 
       @event-time-dropdown-selected="${(e) => this._eventTimeDropdownSelected(e)}" 
        @form-submitted="${(e) => this._eventFormSubmitted(e)}"    
            
            markedDay="${this._markedDay}"
            markedMonth="${this._markedMonth}"
            markedYear="${this._markedYear}"
       ></event-panel-view>
        <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
        
      </main>

      <footer>
        <p>Made in London with &#9730;</p>
      </footer>
      
        <event-button-element enabled="${this._page !== 'event-panel'}"
        
        ></event-button-element>

      <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.
      </snack-bar>
    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
     // localStorage.setObject('user',[]);
      //localStorage.setObject('event_ids',[]);
     //localStorage.setObject('order',0);
    setPassiveTouchGestures(true);
    this._enter = this._page
    this._exit = ""
    this._currentDay = today.getDate()
    this._currentMonth = today.getMonth()
    this._currentYear = today.getYear()
    this._selectedMonthEvents = new Array(42)
    this._selectedMonth = today.getMonth()
    this._selectedYear = today.getYear()
    var dateLists = getDateLists(this._selectedMonth,this._selectedYear)
    this._dateList = dateLists[0]
    this._dateListDetailed = dateLists[1]
    this._dateList =  typeof(this._dateList) == "string" ? this._dateList : JSON.stringify(this._dateList)
    this._dateListDetailed = typeof(this._dateListDetailed) == "string" ? this._dateListDetailed : JSON.stringify(this._dateListDetailed)
    this._markedDayEvents = new Array()
    this._sortedEvents = new Array()
    this._sortedBoxCoords = new Array()
    this._markedDay = getIndexToday(this._selectedMonth,this._selectedYear)
    this._markedMonth = this._selectedMonth
    this._markedYear = this._selectedYear
    this._currentDayIndex = getIndexToday(this._selectedMonth,this._selectedYear)
    this._dayOffset = getDayOffset(this._selectedMonth,this._selectedYear)
    this._monthSelectionOptions = this._selectedYear == today.getYear() ? months.slice(0,today.getMonth() + 1) : months
    this._yearSelectionOptions = years
    this._monthSelectionOptions = typeof(this._monthSelectionOptions) == "string" ? this._monthSelectionOptions : JSON.stringify(this._monthSelectionOptions)
    this._yearSelectionOptions = typeof(this._yearSelectionOptions) == "string" ? this._yearSelectionOptions : JSON.stringify(this._yearSelectionOptions)
    this._selectedEventStartHour = (new Date()).getHours()
    this._selectedEventEndHour = Math.min(23,(new Date()).getHours())
    this._selectedEventStartMinute = (new Date()).getMinutes()
    this._selectedEventEndMinute = (new Date()).getMinutes()
    this._panelName = "Add"
    this._eventPanelEvent = JSON.stringify(undefined)
    this._globalCounter = 0

    this._trackedEventsData = new Array()
    this._trackedEventsDateList = new Array()
    this._trackedEventsTypes = new Array()
    this._modelTrained = false
    this._modelTraining = false



      
  }

  firstUpdated() {
    installRouter((location) => {this._locationChanged(location);});
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 0px)`,
        () => store.dispatch(updateDrawerState(false)));
    
      this.addEventListener('swiped-left', function(e) {
        
          const newLocation = this._page === 'calendar' ? `/day`: `/settings`
          window.history.pushState({}, '', newLocation);
          store.dispatch(navigate(decodeURIComponent(newLocation)))
      });
      this.addEventListener('swiped-right', function(e) {
        
          const newLocation = this._page === 'settings' ? `/day`: `/calendar`
          window.history.pushState({}, '', newLocation);
          store.dispatch(navigate(decodeURIComponent(newLocation)))
      });
  }
  
  _locationChanged(loc) {
      if (loc.pathname !== '/event-panel') {
          this._panelName = "Add"
          this._eventPanelEvent = JSON.stringify(undefined)
      }
      store.dispatch(navigate(decodeURIComponent(location.pathname)))
      this._globalCounter += 1
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _menuButtonClicked() {
    store.dispatch(updateDrawerState(true));
  }

  _drawerOpenedChanged(e) {
    store.dispatch(updateDrawerState(e.target.opened));
  }
  
  _dayMarked(e) {
      var markedDate = new Date(1900 + e.detail.markedYear, e.detail.markedMonth, e.detail.markedDay)
      if (markedDate <= today && markedDate >= earliestDate) {
          this._markedDayEvents = new Array()
          store.dispatch(markDay(e.detail.markedDay));
          store.dispatch(markMonth(e.detail.markedMonth));
          store.dispatch(markYear(e.detail.markedYear));
          
          store.dispatch(selectMonth(e.detail.markedMonth));
          store.dispatch(selectYear(e.detail.markedYear));
          const newLocation = `/day`
          window.history.pushState({}, '', newLocation);
          this._locationChanged({pathname:newLocation})
      }
  }
  
  _modifyEvent(e) {
      
          this._panelName = "Modify"
          this._eventPanelEvent = e.detail.trackedEvent
          store.dispatch(selectEventStartHour(parseInt(e.detail.trackedEvent.startHour)))
          store.dispatch(selectEventEndHour(parseInt(e.detail.trackedEvent.endHour)))
          store.dispatch(selectEventStartMinute(parseInt(e.detail.trackedEvent.startMinute)))
          store.dispatch(selectEventEndMinute(parseInt(e.detail.trackedEvent.endMinute)))
          const newLocation = `/event-panel`
          window.history.pushState({}, '', newLocation);
          this._locationChanged({pathname:newLocation})
      
  }
  
  _deleteEvent(e) {
      store.dispatch(removeEvent(e.detail.trackedEvent));
  }

  
  _calendarArrowPressed(e) {
      var increment = e.detail.incrementType == 'increment' ? 1 : -1;
      if (e.detail.actionType == 'year') {
        if (this._selectedYear + increment > today.getYear() || (this._selectedYear + increment == today.getYear() && this._selectedMonth > today.getMonth())) {
            store.dispatch(selectYear(today.getYear()));
            store.dispatch(selectMonth(today.getMonth()));
        }
        else if (this._selectedYear + increment < 100) {
            store.dispatch(selectYear(100));
        } else {
            store.dispatch(selectYear(this._selectedYear + increment));
        }
      } else if (e.detail.actionType == 'month') {
        if ((this._selectedYear == today.getYear()) && this._selectedMonth + increment > today.getMonth()) {
        }
        else {
            if (this._selectedMonth + increment == 12) {
                store.dispatch(selectYear(this._selectedYear + 1))
                store.dispatch(selectMonth((12 + this._selectedMonth + increment)%12));
            } else if (this._selectedMonth + increment == -1) {
                if (this._selectedYear - 1 < 100) {
                    
                } else {
                    store.dispatch(selectYear(this._selectedYear - 1))
                    store.dispatch(selectMonth((12 + this._selectedMonth + increment)%12));
                }
                
            } else {
                
                store.dispatch(selectMonth((12 + this._selectedMonth + increment)%12));
            }
            
        }
      } else {
        store.dispatch(selectYear(today.getYear()));
        store.dispatch(selectMonth(today.getMonth()));
      }
  }
  _calendarDropdownSelected(e) {
      if (e.detail.dropdownType == "months") {
          store.dispatch(selectMonth(e.detail.selectedOptionIndex))
      }
      else {store.dispatch(selectYear(e.detail.selectedOption - 1900))}
      
  }
  
  _eventTimeDropdownSelected(e) {
      if (e.detail.dropdownType == "hours") {
          if (e.detail.start == "true") {
            store.dispatch(selectEventStartHour(parseInt(e.detail.selectedOption)))
          }
          else {
            store.dispatch(selectEventEndHour(parseInt(e.detail.selectedOption)))
              
          }
      }
      if (e.detail.dropdownType == "minutes") {
          if (e.detail.start == "true") {
            store.dispatch(selectEventStartMinute(parseInt(e.detail.selectedOption)))
          }
          else {
            store.dispatch(selectEventEndMinute(parseInt(e.detail.selectedOption)))
              
          }
          
      }
    }
    
   _eventFormSubmitted(e) {
       if (this._eventPanelEvent == JSON.stringify(undefined)) {
           store.dispatch(submitEvent(e.detail.trackedEvent));
       } else {
           store.dispatch(editEvent(e.detail.oldEvent,e.detail.trackedEvent));
           this._eventPanelEvent = JSON.stringify(undefined)
       }
       const newLocation = `/day`
       window.history.pushState({}, '', newLocation);
       this._locationChanged({pathname:newLocation})
   }

   testModel(model, inputTensor) {
      this._modelTrained = true
      this._modelTraining = false
      //alert(testModel(model,inputTensor))
   }

  stateChanged(state) {
    this._prevPage = this._page
    this._page = state.app.page;
    this._exit = this._prevPage == this._page ? this._exit : this._prevPage
    this._enter = this._page;
    this._offline = state.app.offline;
    this._snackbarOpened = state.app.snackbarOpened;
    this._drawerOpened = state.app.drawerOpened;
    this._markedDay = state.calendar.markedDay;
    this._markedMonth = state.calendar.markedMonth;
    this._markedYear = state.calendar.markedYear;
    this._selectedMonth = state.calendar.selectedMonth;
    this._selectedYear = state.calendar.selectedYear;
    var dateLists = getDateLists(this._selectedMonth,this._selectedYear)
    this._dateList = dateLists[0]
    this._dateListDetailed = dateLists[1]
    var dateListSpecificDates = dateLists[2]
    this._dateList = typeof(this._dateList) == "string" ? this._dateList : JSON.stringify(this._dateList)
    this._dateListDetailed = typeof(this._dateListDetailed) == "string" ? this._dateListDetailed : JSON.stringify(this._dateListDetailed)
    this._dayOffset = getDayOffset(this._selectedMonth,this._selectedYear)
    this._monthSelectionOptions = this._selectedYear == today.getYear() ? months.slice(0,today.getMonth() + 1) : months
    this._monthSelectionOptions = typeof(this._monthSelectionOptions) == "string" ? this._monthSelectionOptions : JSON.stringify(this._monthSelectionOptions)
    this._yearSelectionOptions = typeof(this._yearSelectionOptions) == "string" ? this._yearSelectionOptions : JSON.stringify(this._yearSelectionOptions)
    this._trackedEvents = state.events.trackedEvents
    this._trackedIDs = state.events.trackedIDs
    this._selectedEventStartHour = state.calendar.selectedEventStartHour
    this._selectedEventEndHour = state.calendar.selectedEventEndHour
    this._selectedEventStartMinute = state.calendar.selectedEventStartMinute
    this._selectedEventEndMinute =state.calendar.selectedEventEndMinute
    for (var i =0; i < 42; i++) {
        this._selectedMonthEvents[i] = []
    }
    this._markedDayEvents = new Array();
    this._effectList = new Array();
    this._causeList = new Array();
    var list = [];
    for (var i =0; i < this._trackedEvents.length; i++) {
        var name = this._trackedEvents[i].id.split("_")[0].trim()
        if (this._trackedEventsTypes.indexOf(name) == -1) {
          this._trackedEventsTypes.push(name)
          if (this._trackedEvents[i].isCause) {
            this._causeList.push(name)
          } else {
          this._effectList.push(name)}
        }
        if (this._trackedEventsDateList.indexOf(this._trackedEvents[i].startDateMinutes) == -1) {
          this._trackedEventsDateList.push(this._trackedEvents[i].startDateMinutes)
          list.push({'date': this._trackedEventsDateList[i], 'object': this._trackedEvents[i]});
          
        }
        if (!this._markedDayEvents.includes(this._trackedEvents[i]) && this._trackedEvents[i].startDay == this._markedDay && this._trackedEvents[i].startMonth == this._markedMonth && this._trackedEvents[i].startYear == this._markedYear) {
            this._markedDayEvents.push(this._trackedEvents[i])
        }
        var dateString = String(this._trackedEvents[i].startDay) + "/" + String(this._trackedEvents[i].startMonth) + "/" + String(this._trackedEvents[i].startYear)
        if (dateListSpecificDates.includes(dateString)) {
            this._selectedMonthEvents[dateListSpecificDates.indexOf(dateString)].push(this._trackedEvents[i])
        }
            
    }
    
    list.sort(function(a, b) {
          return ((a.date < b.date) ? -1 : ((a.date == b.date) ? 0 : 1));
    });

    this._sortedBoxCoords = new Array()
    this._sortedEvents = new Array()
    if (this._markedDayEvents.length > 0) {
        this._sortedEvents = this._markedDayEvents
              .map((item, index) => [parseInt(this._markedDayEvents[index].startMinute) + parseInt(this._markedDayEvents[index].startHour)*60, item])
              .sort(([count1], [count2]) => count2 - count1)
              .map(([, item]) => item)
        for (var i = 0; i < this._sortedEvents.length; i++) {
            this._sortedBoxCoords.push([0,0,0,0])
        }
    }
    this._trackedEventsData = new Array(this._trackedEventsDateList.length)

    var typePlaceholder = new Array(this._trackedEventsTypes.length)
    for (var i = 0; i < typePlaceholder.length;i++) {
      typePlaceholder[i] = 0
    }
    var daySequence = new Array(1440)
    for (var i =0; i < 1440; i++) {
      daySequence[i] = typePlaceholder
    }
    /*var eventChunks = new Array()
    var currentChunk = new Array()
    //Create list of events that are less than a week apart (i.e. might be causally linked)
    for (var i =0; i < list.length; i++) {

      if (i > 0 && (list[i].date.getTime() - list[i-1].date.getTime()) > 1000*60*60*24*7) {
        eventChunks.push(currentChunk)
        currentChunk = new Array()
      }
      currentChunk.push(list[i])
      this._trackedEventsData[i] = daySequence
    }
    var beginning = 0
    eventChunkArrays = new Array()
    for (var i =0; i < eventChunks.length; i++) {
      var currentArray = new Array(168)
      for (var j=0; j < 168; j++) {
        currentArray[j] = new Array()
      }
      beginning = eventChunks[i][0].date.getTime()
      for (var j=0; j < eventChunks[i].length; j++) {
        var hoursFromBeginning = Math.floor((list[i] - beginning)*1000*60*60)
        currentArray[hoursFromBeginning].push(eventChunks[i][j])

      }
      eventChunkArrays.push(currentArray)
    }


    for (var i =0; i < this._trackedEvents.length; i++) {
        var name = this._trackedEvents[i].id.split("_")[0].trim()
        var startTime = parseInt(this._trackedEvents[i].startHour)*60 + parseInt(this._trackedEvents[i].startMinute)
        var endTime = this._trackedEvents[i].endHour*60 + this._trackedEvents[i].endMinute
        for (var j =startTime; j < endTime + 1; j++) {
          this._trackedEventsData[this._trackedEventsDateList.indexOf(this._trackedEvents[i].startDateDays)][j][this._trackedEventsTypes.indexOf(name)] = 1
        }
    }
    this._inputsML = this._trackedEventsData.flat().map((item2, index2) => this._causeList.map((item,index) => item2[this._trackedEventsTypes.indexOf(item)]))
    this._labelsML = this._trackedEventsData.flat().map((item2, index2) => this._effectList.map((item,index) => item2[this._trackedEventsTypes.indexOf(item)]))*/

    //Bayesian analysis

    //Brainstorming:
    //Causality one week max. Try different timescales and do information criterion etc.
    //Treat combinations of events up to third order. (i.e. ~ n^3 events --> ~ n^6 combos)
    //Limit maximal number of events. 
    // Only do higher order for events with explanatory power over threshold.
    // How to combine combos at different time-scales? e.g. X works over days while Y over hours? --> combine into days (derp)
    // Minimum time: 1 hour.
    // 24*7 to test. 168 * causes.
    if (this._causeList.length > 0 && this._effectList.length > 0 && (this._modelTrained == false || this._modelTraining == false)) {

    }

    if (false && this._causeList.length > 0 && this._effectList.length > 0 && (this._modelTrained == false || this._modelTraining == false)) {
      this._modelTraining = true
      var inputTensor = undefined
      if (this._inputsML.length !== undefined && this._inputsML.length > 0) {
        inputTensor = convertToTensor(1440*this._trackedEventsDateList.length,this._causeList.length,this._inputsML,true)
      }
      var labelTensor = undefined
      if (this._labelsML.length !== undefined && this._labelsML.length > 0) {
        labelTensor = convertToTensor(1440*this._trackedEventsDateList.length,this._effectList.length,this._labelsML,true)
      }
      const model = createModel(1440*this._trackedEventsDateList.length,this._causeList.length,this._effectList.length);  
      compileModel(model);
      alert('training ML model')
      trainModel(this, model, inputTensor, labelTensor, 1, 1)
      alert('test')

    }

    
  }
  
 
}

window.customElements.define('clarify-me', ClarifyMe);
