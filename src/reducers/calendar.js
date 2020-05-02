
import {
  MARK_DAY,
  MARK_MONTH,
  MARK_YEAR,
  SELECT_MONTH,
  SELECT_YEAR,
  CREATE_TRACKED_EVENT,
  SELECT_EVENT_START_HOUR,
  SELECT_EVENT_END_HOUR,
  SELECT_EVENT_START_MINUTE,
  SELECT_EVENT_END_MINUTE
} from '../actions/calendar.js';

import { createSelector } from 'reselect';

const INITIAL_STATE = {
  markedDay: (new Date()).getDate(),
  markedMonth: (new Date()).getMonth(),
  markedYear: (new Date()).getYear(),
  selectedMonth: (new Date()).getMonth(),
  selectedYear: (new Date()).getYear(),
  trackedEvents: localStorage.getObject('user') ==  null ? [] : localStorage.getObject('user'),
  selectedEventStartHour: (new Date()).getHours(),
  selectedEventEndHour: Math.min(23,(new Date()).getHours() ),
  
  selectedEventStartMinute: (new Date()).getMinutes(),
  selectedEventEndMinute: (new Date()).getMinutes()
}


const calendar = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MARK_DAY: 
      return {
          ...state,
          markedDay: action.markedDay
      }
    case MARK_MONTH: 
      return {
          ...state,
          markedMonth: action.markedMonth
      }
    case MARK_YEAR: 
      return {
          ...state,
          markedYear: action.markedYear
      }
    case SELECT_MONTH: 
      return {
          ...state,
          selectedMonth: action.selectedMonth
      }
    case SELECT_YEAR: 
      return {
          ...state,
          selectedYear: action.selectedYear
    }
    case SELECT_EVENT_START_HOUR: 
      if (action.startHour > state.selectedEventEndHour) {
          return {
              ...state,
              selectedEventStartHour: action.startHour,
              selectedEventEndHour: action.startHour,
              selectedEventEndMinute: state.selectedEventStartMinute < 59 ? state.selectedEventStartMinute + 1 : state.selectedEventStartMinute
          }
          
      }
      else if (action.startHour == state.selectedEventEndHour && state.selectedEventStartMinute > state.selectedEventEndMinute) {
          
          return {
              ...state,
              selectedEventStartHour: action.startHour,
              selectedEventEndHour: action.startHour,
              selectedEventEndMinute: state.selectedEventStartMinute < 59 ? state.selectedEventStartMinute + 1 : state.selectedEventStartMinute
            }
      }
      
      else {
          return {
              ...state,
              selectedEventStartHour: action.startHour
            }
      }
    
    case SELECT_EVENT_END_HOUR: 
      return {
          ...state,
          selectedEventEndHour: action.endHour
    }
    case SELECT_EVENT_START_MINUTE: 
      if (state.selectedEventStartHour == state.selectedEventEndHour && action.startMinute > state.selectedEventEndMinute) {
          
          return {
              ...state,
              selectedEventStartMinute: action.startMinute,
              selectedEventStartHour: state.selectedEventStartHour,
              selectedEventEndHour: state.selectedEventStartHour,
              selectedEventEndMinute: action.startMinute < 59 ? action.startMinute+ 1 : action.startMinute
            }
      } else {
      return {
          ...state,
          selectedEventStartMinute: action.startMinute
        }
      }
    case SELECT_EVENT_END_MINUTE: 
      return {
          ...state,
          selectedEventEndMinute: action.endMinute
    }
    case CREATE_TRACKED_EVENT:  {
      if (this.trackedEvents.indexOf(action.trackedEvent) === -1) {
          this.trackedEvents.push(action.trackedEvent)
      }
      localStorage.setSate('user',this.trackedEvents);
      return {
          ...state,
          trackedEvents: this.trackedEvents
      }
    }
    default:
      return state;
  }
};

export default calendar;
