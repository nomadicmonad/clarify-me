
export const MARK_DAY = 'MARK_DAY';
export const MARK_MONTH = 'MARK_MONTH';
export const MARK_YEAR = 'MARK_YEAR';
export const SELECT_MONTH = 'SELECT_MONTH';
export const SELECT_YEAR = 'SELECT_YEAR';
export const CREATE_TRACKED_EVENT = 'CREATE_TRACKED_EVENT';
export const SELECT_EVENT_START_HOUR = 'SELECT_EVENT_START_HOUR';
export const SELECT_EVENT_END_HOUR = 'SELECT_EVENT_END_HOUR';
export const SELECT_EVENT_START_MINUTE = 'SELECT_EVENT_START_MINUTE';
export const SELECT_EVENT_END_MINUTE = 'SELECT_EVENT_END_MINUTE';



const DAY_LIST = [
  {"id": 1},
  {"id": 2},
  {"id": 3},
  {"id": 4},
  {"id": 5},
  {"id": 6},
  {"id": 7},
  {"id": 8},
  {"id": 9},
  {"id": 10},
  {"id": 11},
  {"id": 12},
  {"id": 13},
  {"id": 14},
  {"id": 15},
  {"id": 16},
  {"id": 17},
  {"id": 18},
  {"id": 19},
  {"id": 20},
  {"id": 21},
  {"id": 22},
  {"id": 23},
  {"id": 24},
  {"id": 25},
  {"id": 26},
  {"id": 27},
  {"id": 28},
  {"id": 29},
  {"id": 30},
  {"id": 31},
  {"id": 32},
  {"id": 33},
  {"id": 34},
  {"id": 35}
];

const MONTH_LIST = [
  {"id": 1},
  {"id": 2},
  {"id": 3},
  {"id": 4},
  {"id": 5},
  {"id": 6},
  {"id": 7},
  {"id": 8},
  {"id": 9},
  {"id": 10},
  {"id": 11},
  {"id": 12}
];


export const markDay = (markedDay) =>{
  return {
    type: MARK_DAY,
    markedDay
  };
};


export const markMonth = (markedMonth) =>{
  return {
    type: MARK_MONTH,
    markedMonth
  };
};

export const markYear = (markedYear) =>{
  return {
    type: MARK_YEAR,
    markedYear
  };
};

export const selectMonth = (selectedMonth) =>{
  return {
    type: SELECT_MONTH,
    selectedMonth
  };
};

export const selectYear = (selectedYear) =>{
  return {
    type: SELECT_YEAR,
    selectedYear
  };
};

export const createTrackedEvent = (trackedEvent) =>{
  return {
    type: CREATE_TRACKED_EVENT,
    trackedEvent
  };
};

export const selectEventStartHour = (startHour) =>{
  return {
    type: SELECT_EVENT_START_HOUR,
    startHour
  };
};

export const selectEventEndHour = (endHour) =>{
  return {
    type: SELECT_EVENT_END_HOUR,
    endHour
  };
};

export const selectEventStartMinute = (startMinute) =>{
  return {
    type: SELECT_EVENT_START_MINUTE,
    startMinute
  };
};

export const selectEventEndMinute = (endMinute) =>{
  return {
    type: SELECT_EVENT_END_MINUTE,
    endMinute
  };
};