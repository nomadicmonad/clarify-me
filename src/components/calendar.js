/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html,css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { installRouter } from 'pwa-helpers/router.js';


import { thisMonth } from '../util/dateutil.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import './calendar-element.js';
import './calendar-arrow.js';
import './calendar-dropdown.js'

import { today,months } from '../util/dateutil.js';

class Calendar extends connect(store)(PageViewElement) {

    
  static get properties() {
    return {
      currentDay: { type: Number },
      currentDayIndex: { type: Number },
      currentMonth: { type: Number },
      currentYear: { type: Number },
      markedDay: {type: Number},
      markedMonth: {type: Number},
      markedYear: {type: Number},
      monthDays: {type: Number},
      selectedMonthEvents: {type: Array},
      selectedMonth: { type: Number},
      selectedYear: { type: Number},
      trackingData: {type: Array},
      dayOffset :{ type: Number},
      dateList : {type: Array},
      datesSet :{ type: Number},
      monthSelectionOptions : {type:Array},
      yearSelectionOptions : {type:Array}
      
    }
  }
  static get styles() {
    return [
      SharedStyles,
      
      css`
        #calendar-section {padding: 0; line-height: 4vmin;}
        #calendar_title {display:inline-block; width: 50%; text-align: center;
    margin-right: auto;
    margin-left: auto;
        line-height: 1vmin;
    float: center;}
    #calendar_title_heading {
        width:94vmin;
        padding-right:1%;
        margin-left: auto;
        margin-right: auto;
        line-height: 1vmin;
    margin-bottom: 1%;
    }
        
      `
    ];
  }

  render() {
    this.monthSelectionOptions = typeof(this.monthSelectionOptions) == "string" ? this.monthSelectionOptions : JSON.stringify(this.monthSelectionOptions)
    this.yearSelectionOptions = typeof(this.yearSelectionOptions) == "string" ? this.yearSelectionOptions : JSON.stringify(this.yearSelectionOptions)
    this.selectedMonthEvents = typeof(this.selectedMonthEvents) == "string" ? this.selectedMonthEvents : JSON.stringify(this.selectedMonthEvents)
    
    return html`
    
      <section id="calendar-section">
        <h2 id ="calendar_title_heading">
        <calendar-arrow-element @calendar-arrow-pressed="${(e) => this._calendarArrowPressed(e)}" incrementType="decrement" actionType="year" enabled="${this.selectedYear > 100}"></calendar-arrow-element>
        <calendar-arrow-element @calendar-arrow-pressed="${(e) => this._calendarArrowPressed(e)}" incrementType="decrement" actionType="month" enabled="${this.selectedYear > 100 || (this.selectedYear > 99 && this.selectedMonth > 0)}"></calendar-arrow-element>
        
        <div id="calendar_title">
            <calendar-dropdown-element @calendar-dropdown-selected="${(e) => this._calendarDropdownSelected(e)}" dropDownType="months" dropDownTitle="${months[this.selectedMonth]}" selectionOptions="${this.monthSelectionOptions}"></calendar-dropdown-element>
            ,
            <calendar-dropdown-element @calendar-dropdown-selected="${(e) => this._calendarDropdownSelected(e)}" dropDownType="years" dropDownTitle="${this.selectedYear + 1900}" selectionOptions="${this.yearSelectionOptions}"></calendar-dropdown-element>
        </div>
        
        <calendar-arrow-element @calendar-arrow-pressed="${(e) => this._calendarArrowPressed(e)}" incrementType="increment" actionType="today" enabled="${new Date(this.selectedYear+1900, this.selectedMonth) < thisMonth}" colorType="blue"></calendar-arrow-element>
        <calendar-arrow-element @calendar-arrow-pressed="${(e) => this._calendarArrowPressed(e)}" incrementType="increment" actionType="year" enabled="${this.selectedYear < today.getYear()}"></calendar-arrow-element>
        <calendar-arrow-element @calendar-arrow-pressed="${(e) => this._calendarArrowPressed(e)}" incrementType="increment" actionType="month" enabled="${new Date(this.selectedYear + 1900 + Math.floor(this.selectedMonth/12),(this.selectedMonth + 1)%12) < today}"></calendar-arrow-element>
        
        </h2>
        
       <calendar-element 
       
       markedDay="${this.markedDay}" 
       markedMonth="${this.markedMonth}" 
       markedYear="${this.markedYear}" 
       currentDayIndex ="${this.currentDayIndex}" 
       currentDay="${this.currentDay}"
       currentMonth="${this.currentMonth}"
       currentYear="${this.currentYear}"
       selectedMonthEvents="${this.selectedMonthEvents}"
       selectedMonth="${this.selectedMonth}" 
       selectedYear="${this.selectedYear}" 
       monthDays="${this.monthDays}"
       dayOffset="${this.dayOffset}"
       @day-marked="${(e) => this._dayMarked(e)}" 
       dateList="${typeof(this.dateList) == "string" ? this.dateList : JSON.stringify(this.dateList)}" 
       >Test</calendar-element>
      </section>
      
      

    `;
  }
  
   firstUpdated() {
       this.datesSet = 1
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
  _calendarArrowPressed(e) {
      
     this.dispatchEvent(new CustomEvent('calendar-arrow-pressed',
      {
          detail: {
            actionType: e.detail.actionType,
            incrementType: e.detail.incrementType
          }
      }));
  }
  
  _calendarDropdownSelected(e) {
      this.dispatchEvent(new CustomEvent('calendar-dropdown-selected',
      {
          detail: {
            selectedOptionIndex: e.detail.selectedOptionIndex,
            selectedOption:  e.detail.selectedOption,
            dropdownType: e.detail.dropdownType
          }
      }));
    }
}

window.customElements.define('calendar-view', Calendar);
