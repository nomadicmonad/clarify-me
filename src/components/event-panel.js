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
import {TrackedEvent} from '../util/tracked-event.js'

import { hours, minutes } from '../util/dateutil.js';
import './form-submit-element.js';
import './event-time-dropdown.js';
import './event-panel-input.js'
import {randomHsl} from '../util/color-util.js'
import { getDateSuffix,daysFormal, months, today, earliestDate,hoursFrom, minutesFrom } from '../util/dateutil.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class EventPanel extends PageViewElement {
  static get properties() {
    return {
      inputTarget: {type: Object},
      eventName: {type:String},
      markedDay: {type: String},
      markedMonth: {type: String},
      markedYear: {type:String},
      hourList: {type: Array},
      minuteList: {type: Array},
      timestamp_start: {type: String},
      timestamp_end: {type: String},
      ontology: {type: String},
      level: {type: String},
      cause_or_effect: {type: String},
      est_importance: {type: String},
      est_likelihood: {type: String},
      is_prediction: {type: String},
      selectedEventStartHour: {type: String},
      selectedEventEndHour: {type: String},
      selectedEventStartMinute: {type: String},
      selectedEventEndMinute: {type: String},
      panelName: {type:String},
      eventPanelEvent: {type: String},
      changeCounter: {type: Number},
      globalCounter: {type: String},
      isCause: {type: Boolean}
    };
  }

  static get styles() {
    return [
      SharedStyles,
      
      css`
        #event-panel-title {display:inline-block; font-size: 5vmin; width: 40%; text-align: center; margin: auto; float: center;
            line-height: 10vmin; margin-left: 18%;}
        #event-panel-heading {font-size: 3vmin; color:#484848;}
        .event-form-div {display: block; width: 100%; text-align: center; margin:auto; float: center; margin-top: 2%;}
        .event-form-label {
            display: block;
            width: 60%;
            float: center;
            text-align: left; 
            margin: auto;
            font-family: 'Lato';
            font-weight: 300;
            font-size: 3vmin;
            line-height: 4vmin;
            -webkit-font-smoothing: antialiased;
            clear: both;
            padding-left: 8%;
            padding-top: 5vmin;
            
            border-radius: 0.7vmin;
        }
        #event-panel-section {
            width: 100%;
            display: block;
            margin: auto;
            float: center;
            clear: both;}
        #event-panel-section input {
            border-radius: 0.7vmin;
            display: inline-block;
            margin: auto;
            float: center;
            width: 30%;
            margin-left: calc(4% + 10px);
            text-align: center; 
            font-family: 'Lato';
            font-weight: 400;
            font-size: 3vmin;
            line-height: 4vmin;
            -webkit-font-smoothing: antialiased;
        }
        #comma-span {
            font-size: 3vmin;
            display: inline-block;
        }
        #time-span {
            display: inline-block;
            float: center;
            margin-left: calc(10%);
        }
        
        .description {
            display: inline-block;
            width: 40%;
            float: center;
        }
        
        .date {
            width: 50%;
            float: center;
            font-size: 4vmin;
            font-weight: 400;
            line-height: 4vmin;
            display: inline-block;
            text-align: center;
        }


          
        .cause-button:not([selected="true"]) {
          width: 12vmin;
          height: 12vmin;
           color: black;
          display: inline-block;
          border-radius: 1vmax;
            line-height: 10vmin;
            box-shadow: 0 0 0.5vmax 0px rgba(0,0,0,0.2);
            text-decoration: none;
            background: url("./images/cause.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 8vmin;
            opacity: 0.3;
          font-size: 2.5vmin;
        }
        .cause-button:hover {
          width: 12vmin;
          height: 12vmin;
          display: inline-block;
            line-height: 10vmin;
          border-radius: 1vmax;
            box-shadow: 0 0 0.5vmax 0px rgba(0,0,0,0.1);
          animation: none;
            text-decoration: inherit;
            background: url("./images/cause.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 8vmin;
           color: black;
            opacity: 0.7;
            font-size: 2.5vmin;
        }
        .cause-button[selected="true"]{
          width: 12vmin;
          height: 12vmin;
          display: inline-block;
          border-radius: 1vmax;
            line-height: 10vmin;
            box-shadow: 0 0 0.5vmax 0px rgba(0,0,0,0.1);
          animation: none;
            text-decoration: inherit;
            background: url("./images/cause.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 8vmin;
           color: black;
            opacity: 0.7;
            font-size: 2.5vmin;
        }
      
          
        .effect-button:not([selected="true"]) {
          width: 12vmin;
          height: 12vmin;
          display: inline-block;
           color: black;
            line-height: 10vmin;
          border-radius: 1vmax;
            box-shadow: 0 0 0.5vmax 0px rgba(0,0,0,0.2);
            background: url("./images/effect.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 8vmin;
            opacity: 0.3;
          font-size: 2.5vmin;
        }
        .effect-button:hover {
          width: 12vmin;
          height: 12vmin;
          display: inline-block;
          border-radius: 1vmax;
            line-height: 10vmin;
          
            box-shadow: 0 0 0.5vmax 0px rgba(0,0,0,0.1);
            text-decoration: inherit;
            background: url("./images/effect.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 8vmin;
           color: black;
            opacity: 0.7;
          font-size: 2.5vmin;
        }
        .effect-button[selected="true"] {
          width: 12vmin;
          height: 12vmin;
          display: inline-block;
          border-radius: 1vmax;
            line-height: 10vmin;
          
            box-shadow: 0 0 0.5vmax 0px rgba(0,0,0,0.1);
            text-decoration: inherit;
            background: url("./images/effect.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 8vmin;
           color: black;
            opacity: 0.7;
          font-size: 2.5vmin;
        }
        #cause-or-effect {
          display: block;
          width: 100%;
          margin: auto;
          margin-top: 8vmin;
        }
        .button-text {
          position: relative;
            top: 50%;
            transform: translateY(-135%);
            font-size: 3vmin;
            text-align: center;
            font-weight: 400;
        }
      `
    ];
  }
    
    _onInput(e) {
          this.inputTarget = e.target;
    }
  render() {
    var hourList = JSON.stringify(hours)
    var minuteList = JSON.stringify(minutes)
    var panelEvent = this.eventPanelEvent == "undefined" ? undefined : JSON.parse(this.eventPanelEvent)
    var endHours = JSON.stringify(hoursFrom(parseInt(this.selectedEventStartHour)))
    var endMinutes = this.selectedEventStartHour == this.selectedEventEndHour ? JSON.stringify(minutesFrom(parseInt(this.selectedEventStartMinute))) : minuteList
    var dateString = String(daysFormal[((new Date(this.markedYear, this.markedMonth,this.markedDay)).getDay()+1)%7]) + " " +  String(this.markedDay) + getDateSuffix(parseInt(this.markedDay)) + " " +   months[parseInt(this.markedMonth)] + ", " + String(parseInt(this.markedYear) + 1900)
    dateString = panelEvent == undefined ? dateString : String(daysFormal[((new Date(panelEvent.startYear, panelEvent.startMonth,panelEvent.startDay)).getDay()+1)%7]) + " " +  String(panelEvent.startDay) + getDateSuffix(parseInt(panelEvent.startDay)) + " " +   months[parseInt(panelEvent.startMonth)] + ", " + String(parseInt(panelEvent.startYear) + 1900);
    return html`
      <section id="event-panel-section">
      <h2 id ="event-panel-heading">
       
        <div id="event-panel-title">
            ${this.panelName} Event
        </div>
        <form-submit-element  @form-submitted="${(e) => this._handleSubmit(e)}"></form-submit-element>
            
      </h2>
        <div class="event-form-div">
        <span class="date">${dateString}
                </span>
        <span class="event-form-label">
            <span class="description">Event name:</span>
              <input id="event-name-input" type="text" @input=${(e) => this._onInput(e)} value="${this.eventName}">
        </span>
        <span class="event-form-label">
             <span class="description">Event start time:</span>
            <span id="time-span">
            <event-time-dropdown-element @event-time-dropdown-selected="${(e) => this._eventTimeDropdownSelected(e)}" start="true" dropDownType="hours" dropDownTitle="${this.selectedEventStartHour}" selectionOptions="${hourList}"></event-time-dropdown-element>
            <span id="comma-span">:</span>
            <event-time-dropdown-element @event-time-dropdown-selected="${(e) => this._eventTimeDropdownSelected(e)}" start="true" dropDownType="minutes" dropDownTitle="${this.selectedEventStartMinute}" selectionOptions="${minuteList}"></event-time-dropdown-element></span>
            </span>
        <span class="event-form-label">
        <span class="description">Event end time:</span>
        <span id="time-span">
            <event-time-dropdown-element @event-time-dropdown-selected="${(e) => this._eventTimeDropdownSelected(e)}" start="false" dropDownType="hours" dropDownTitle="${this.selectedEventEndHour}" selectionOptions="${endHours}"></event-time-dropdown-element>
            <span id="comma-span">:</span>
            <event-time-dropdown-element @event-time-dropdown-selected="${(e) => this._eventTimeDropdownSelected(e)}" start="false" dropDownType="minutes" dropDownTitle="${this.selectedEventEndMinute}" selectionOptions="${endMinutes}"></event-time-dropdown-element></span>
        </span>
        <div id ="cause-or-effect">
            <div id="cause-or-effect-slider">
            <div id ="cause-button" class="cause-button" selected="${this.isCause}"><div class="button-text">Event</div></div>
            <div id ="effect-button" class="effect-button" selected="${this.isCause == false}"><div class="button-text">Symptom</div></div>
            </div>
        </div>
       
      </div>
        
      </section>
    `;
  }
  
  updated() {
      if (this.changeCounter !== parseInt(this.globalCounter)) {
          this.changeCounter = parseInt(this.globalCounter)
          var panelEvent = this.eventPanelEvent == "undefined" ? undefined : JSON.parse(this.eventPanelEvent)
          this.isCause = panelEvent == undefined ? true : panelEvent.isCause;
          this.shadowRoot.getElementById('event-name-input').value = this.eventName
      }
  }

  constructor() {
    super();
    this.ontology = " "
    this.changeCounter = parseInt(this.globalCounter)
    this.isCause = true;
    
  }
  
  _handleSubmit(event) {
      var ev = this.eventPanelEvent == "undefined" ? undefined : JSON.parse(this.eventPanelEvent)
      var id = this.shadowRoot.getElementById('event-name-input').value + "_" + this.markedDay + "/" + this.markedMonth + "/" + this.markedYear + "_" + this.selectedEventStartHour + ":" + this.selectedEventStartMinute
      if (id !== undefined && this.shadowRoot.getElementById('event-name-input').value.length > 1 && this.shadowRoot.getElementById('event-name-input').value !== " ") {
        var theTrackedEvent = undefined
        if (ev == undefined) {
            theTrackedEvent = new TrackedEvent(id, randomHsl(), this.selectedEventStartMinute, this.selectedEventStartHour, this.markedDay, this.markedMonth, this.markedYear, this.selectedEventEndMinute, this.selectedEventEndHour, String(this.ontology), String(10), this.isCause, String(5), String(0.9), String(0))
        } else {
            theTrackedEvent = new TrackedEvent(id, ev.colors, this.selectedEventStartMinute, this.selectedEventStartHour, this.markedDay, this.markedMonth, this.markedYear, this.selectedEventEndMinute, this.selectedEventEndHour,ev.ontology,ev.level, this.isCause, ev.est_importance, ev.est_likelihood, ev.is_prediction)
        }
        this.dispatchEvent(new CustomEvent('form-submitted',
        {
            detail: {
              oldEvent: ev,
              trackedEvent: theTrackedEvent
            }
        }));
      }
    }
  
    
      
   _eventTimeDropdownSelected(e) {
      this.dispatchEvent(new CustomEvent('event-time-dropdown-selected',
      {
          detail: {
            selectedOptionIndex: e.detail.selectedOptionIndex,
            selectedOption:  e.detail.selectedOption,
            dropdownType: e.detail.dropdownType,
            start: e.detail.start
          }
      }));
    }
  
  firstUpdated() {
    
      this.shadowRoot.getElementById('cause-button').addEventListener("click",(evt) => {this._buttonPressed(evt,true)},false)
      this.shadowRoot.getElementById('effect-button').addEventListener("click",(evt) => {this._buttonPressed(evt,false)},false)
  }
  _buttonPressed(evt,isCause) {
      
      this.isCause = isCause;
  }
 
  
  
}



window.customElements.define('event-panel-view', EventPanel);
