

import { LitElement, html, css } from 'lit-element';

import './day-element.js';

  
class CalendarElement extends LitElement {
  static get properties() {
    return {
      currentDay: { type: Number },
      currentDayIndex: { type: Number },
      currentMonth: { type: Number },
      currentYear: { type: Number },
      markedDay: { type: Number},
      markedMonth: { type: Number},
      markedYear: { type: Number},
      selectedMonthEvents: {type: Array},
      selectedMonth: { type: Number},
      selectedYear: { type: Number},
      trackingData: { type: Array},
      dayOffset: {type: Number},
      dateList: {type: Array},
      monthDays: {type: Number}
    }
  }

  static get styles() {
    return [
      css`
        #calendar { float:center;
            display: block;
            margin-left: auto;
            width: 96vmin;
            height: 90%;
            margin-right: auto;}
        
      `
    ];
  }
  
  

  render() {
      
    var weekstring = []
    for (var i = 1; i <= 6; i++) {
        for (var j = 1; j <= 7; j++) {
            var dayIndex = (i-1)*7 + j-1
            var dayEvents = typeof(this.selectedMonthEvents[dayIndex]) == "string" ? this.selectedMonthEvents[dayIndex] : JSON.stringify(this.selectedMonthEvents[dayIndex])
            var actualMonth = this.selectedMonth + (dayIndex < this.dayOffset ? - 1 : (dayIndex >= this.dayOffset + this.monthDays ?  + 1: 0))
            var actualYear = this.selectedYear  + (actualMonth < 0 ? - 1 : (actualMonth > 11  ? 1 : 0))
            actualMonth = actualMonth%12
            weekstring.push(
            html`<day-element 
            weekNumber="${i}" 
            dayEvents="${dayEvents}"
            markedDay="${this.markedDay}" 
            markedMonth="${this.markedMonth}" 
            markedYear="${this.markedYear}"
            ownMonth="${actualMonth}" 
            ownYear="${actualYear}" 
            selectedMonth="${this.selectedMonth}" 
            selectedYear="${this.selectedYear}" 
            isCurrentDay="${this.currentDayIndex == dayIndex && this.currentMonth == this.selectedMonth && this.currentYear == this.selectedYear}" 
            currentDay="${this.currentDay}" 
            dayIndex="${dayIndex}" 
            dayOfMonth="${this.dateList[dayIndex]}"
            @day-marked="${(e) => this._dayMarked(e)}" 
            </day-element>`
            );
            
        }
        
    }
    return html`
    <div id="calendar">
      ${weekstring}
    </div>
    `;
  }
  
  constructor() {
    super();
  }
  
  _dayMarked(e) {
      this.dispatchEvent(new CustomEvent('day-marked',
      {
          detail: {
            markedDay: e.detail.markedDay,
            markedMonth: e.detail.markedMonth,
            markedYear: e.detail.markedYear
          }
      }));
  }


}

window.customElements.define('calendar-element', CalendarElement);
