
import {
  SELECT_DAY
} from '../actions/days.js';

import { createSelector } from 'reselect';

const INITIAL_STATE = {
  selectedDay: (35 + (new Date()).getDay() - parseInt((new Date().getDate())))%7 + 7 + (new Date()).getDate()
};


const days = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SELECT_DAY: 
      return {
          ...state,
          selectedDay: action.selectedDay
      }
    default:
      return state;
  }
};

export default days;
