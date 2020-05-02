

export class TrackedEvent {
    constructor(id, colors, startMinute, startHour, startDay,startMonth, startYear, endMinute, endHour, ontology, level, isCause, est_importance, est_likelihood, is_prediction) {
        this.id = id;
        this.colors = colors;
        this.startMinute = parseInt(startMinute);
        this.startHour = parseInt(startHour);
        this.startDay = parseInt(startDay);
        this.startMonth = parseInt(startMonth);
        this.startYear = parseInt(startYear);
        this.endMinute = parseInt(endMinute);
        this.endHour = parseInt(endHour);
        this.ontology = ontology;
        this.level = level;
        this.isCause = isCause;
        this.est_importance = est_importance;
        this.est_likelihood = est_likelihood;
        this.is_prediction = is_prediction;
        this.eventOrder = -1;

        this.startDateMinutes = new Date(startYear, startMonth, startDay, startHour, startMinute);
        this.endDateMinutes = new Date(startYear, startMonth, startDay, endHour, endMinute);
        this.startDateHours = new Date(startYear, startMonth, startDay, startHour);
        this.endDateHours = new Date(startYear, startMonth, startDay, endHour);
        this.startDateDays = new Date(startYear, startMonth, startDay);
        this.endDateDays = new Date(startYear, startMonth, startDay);
        this.startDateMonths = new Date(startYear, startMonth);
        this.endDateMonths = new Date(startYear, startMonth);
    
    }
}