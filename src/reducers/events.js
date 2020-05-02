
import {
  SUBMIT_EVENT,
  EDIT_EVENT,
  REMOVE_EVENT
} from '../actions/events.js';

import { createSelector } from 'reselect';

const INITIAL_STATE = {
  trackedEvents: localStorage.getObject('user') == undefined ? [] : localStorage.getObject('user'),
  trackedIDs: localStorage.getObject('event_ids') == undefined ? [] : localStorage.getObject('event_ids'),
  eventOrder: localStorage.getObject('order') == undefined ? 0 : localStorage.getObject('order')
}


const events = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBMIT_EVENT:  {
      if (state.trackedIDs.indexOf(action.submittedEvent.id) === -1) {
          var submittedEvent = action.submittedEvent
          state.eventOrder = state.eventOrder + 1
          submittedEvent.eventOrder = state.eventOrder
          state.trackedIDs.push(action.submittedEvent.id)
          state.trackedEvents.push(action.submittedEvent)
          
      }
      localStorage.setObject('user',state.trackedEvents);
      localStorage.setObject('event_ids',state.trackedIDs);
      localStorage.setObject('order',state.eventOrder);
      
      return {
          ...state,
          trackedEvents: state.trackedEvents,
          trackedIDs: state.trackedIDs,
          eventOrder: state.eventOrder
      }
      
    }
    case EDIT_EVENT: {
        var evtId = action.oldEvent.id
        var evtIdx = state.trackedIDs.indexOf(evtId)
        state.trackedEvents[evtIdx] = action.edittedEvent
        state.trackedIDs[evtIdx] = action.edittedEvent.id
        localStorage.setObject('user',state.trackedEvents);
        localStorage.setObject('event_ids',state.trackedIDs);
        return {
          ...state,
          trackedEvents: state.trackedEvents,
          trackedIDs: state.trackedIDs
      }
    }
    case REMOVE_EVENT: {
        var evtId = action.removedEvent.id
        var evtIdx = state.trackedIDs.indexOf(evtId)
        state.trackedEvents.splice(evtIdx,1);
        state.trackedIDs.splice(evtIdx, 1);
        localStorage.setObject('user',state.trackedEvents);
        localStorage.setObject('event_ids',state.trackedIDs);
        return {
          ...state,
          trackedEvents: state.trackedEvents,
          trackedIDs: state.trackedIDs
      }
    }
    default:
      return state;
  }
};

export default events;
