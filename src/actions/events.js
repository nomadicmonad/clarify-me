
export const SUBMIT_EVENT = 'SUBMIT_EVENT';
export const EDIT_EVENT = 'EDIT_EVENT';
export const REMOVE_EVENT = 'REMOVE_EVENT';



export const submitEvent = (submittedEvent) =>{
  return {
    type: SUBMIT_EVENT,
    submittedEvent
  };
};


export const editEvent = (oldEvent,edittedEvent) =>{
  return {
    type: EDIT_EVENT,
    oldEvent,
    edittedEvent
  };
};

export const removeEvent = (removedEvent) =>{
  return {
    type: REMOVE_EVENT,
    removedEvent
  };
};
