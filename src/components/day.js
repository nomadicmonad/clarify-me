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

import { hoursAMPM,getDateSuffix,daysFormal, months, today, earliestDate } from '../util/dateutil.js';
import './calendar-arrow.js';
import {hslToRgb,shadeColor,randomHsl} from '../util/color-util.js'
import {getMousePos, onClick, getHover} from '../util/mouse-util.js'
// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class Day extends PageViewElement {
  static get properties() {
    return {
      // This is the data from the store.
      markedDay: { type: Number},
      markedMonth: { type: Number},
      markedYear: { type: Number},
      currentDay: { type: Number},
      trackingData: {type: Array},
      dateList: {type: Array},
      selectedMonth: { type: Number},
      selectedYear: { type: Number},
      dateListDetailed: {type: Array},
      markedDayEvents: {type: Array},
      sortedBoxCoords: {type: Array},
      sortedEvents: {type: Array},
      currentSelectedBox: {type: Number},
      addedEventListeners: {type : Number},
      pageChanged: {type: String},
      currentHoverBox: {type: Number}
      
    };
  }

  static get styles() {
    return [
      SharedStyles,
      
      css`
        #day-section {padding: 0; line-height: 5vmin;}
        #day_title {display:inline-block; width: 70%; text-align: center; line-height: 7vmin;}
        #calendar_title_heading {font-size: 4.5vmin;
    margin-bottom: 1%;
        line-height:7vmin;
        width: 94vmin;
        padding-right:1%;
        }
        #option-buttons[visible="true"] {
            display: block;
            width: 90vmin;
            margin: auto;
            visibility: visible;
        }
        #option-buttons[visible="false"] {
            display: block;
            width: 90vmin;
            margin: auto;
            visibility: hidden;
        }
        #modify-button {
            
          display: inline-block;
          box-shadow: 0 0 0.8vmin 0px rgba(0,0,0,0.2);
          
           border-radius: 1vmin;
           line-height: 4vmin;
           border: 1px solid white;
           padding: 2vmin;
           padding-top: 0.5vmin;
           padding-bottom: 0.5vmin;
           font-size: 3vmin;
           margin-left: 18vmin;
           float: left;
           visibility: inherit;
           font-weight:400;
        }
        #modify-button:hover {
            
          display: inline-block;
          box-shadow: 0 0 0.8vmin 0px rgba(0,0,0,0.05);
          color: rgb(0,200,0);
           border-radius: 1vmin;
           line-height: 4vmin;
           border: 1px solid rgb(240,240,240);
           padding: 2vmin;
           padding-top: 0.5vmin;
           padding-bottom: 0.5vmin;
           font-size: 3vmin;
           margin-left: 18vmin;
           float: left;
           font-weight:400;
        }
         #delete-button {
            
          display: inline-block;
          box-shadow: 0 0 0.8vmin 0px rgba(0,0,0,0.2);
           border-radius: 1vmin;
           line-height: 4vmin;
           border: 1px solid white;
           padding: 2vmin;
           padding-top: 0.5vmin;
           padding-bottom: 0.5vmin;
           font-size: 3vmin;
           margin-right: 21vmin;
           float: right;
           visibility: inherit;
           font-weight:400;
           
        }
        #delete-button:hover {
            
          display: inline-block;
          box-shadow: 0 0 0.8vmin 0px rgba(0,0,0,0.05);
          color: red;
           border-radius: 1vmin;
           line-height: 4vmin;
           border: 1px solid rgb(240,240,240);
           padding: 2vmin;
           padding-top: 0.5vmin;
           padding-bottom: 0.5vmin;
           font-size: 3vmin;
           font-weight:400;
           margin-right: 21vmin;
           float: right;
        }
        
    
        
      `
    ];
  }

  render() {
    var eventNames = [];
    for (var i =0; i < this.markedDayEvents.length; i++) {
        eventNames.push(this.markedDayEvents[i].id.split("_")[0] + " ")
    }
    return html`
      <section id="day-section">
      <h2 id ="calendar_title_heading">
        <calendar-arrow-element @calendar-arrow-pressed="${(e) => this._calendarArrowPressed(e)}" incrementType="decrement" actionType="day" enabled="${new Date(this.markedYear + 1900, this.markedMonth, this.markedDay) > earliestDate}"></calendar-arrow-element>
        
        <div id="day_title">
        ${String(daysFormal[((new Date(this.markedYear, this.markedMonth,this.markedDay)).getDay()+1)%7]) + " " +  String(this.markedDay) + getDateSuffix(parseInt(this.markedDay)) + " " +   months[parseInt(this.markedMonth)] + ", " + String(this.markedYear + 1900)}  
        </div>
        <calendar-arrow-element @calendar-arrow-pressed="${(e) => this._calendarArrowPressed(e)}" incrementType="increment" actionType="today" enabled="${new Date(this.markedYear + 1900, this.markedMonth, this.markedDay) < today}" colorType="blue"></calendar-arrow-element>
        
        <calendar-arrow-element @calendar-arrow-pressed="${(e) => this._calendarArrowPressed(e)}" incrementType="increment" actionType="day" enabled="${new Date(this.markedYear + 1900, this.markedMonth, this.markedDay) < today}"></calendar-arrow-element>
        
        </h2>
        
        <canvas style="display: block;float: center; margin: auto;width:90%;height:50vh" id="day_canvas" ></canvas>
        <div id ="option-buttons" visible="${this.currentSelectedBox !== -1}">
            <div id ="modify-button" class="day-event-button">Modify Event</div>
            <div id ="delete-button" class="day-event-button">Delete Event</div>
        </div>
      </section>
    `;
  }
  
  
  renderCanvas(sortedBoxCoords,dayViewClass) {
    
    var coordsRegistered = false;
    for (var i =0; i < sortedBoxCoords.length; i++) {
        if (sortedBoxCoords[i][0] + sortedBoxCoords[i][1] + sortedBoxCoords[i][2] + sortedBoxCoords[i][3] > 0) {
            coordsRegistered = true;
        }
        
    }
    
    if (this.pageChanged && coordsRegistered == false) {
        this.currentSelectedBox = -1;
    }
    
    
    
      var canvas = dayViewClass.shadowRoot.getElementById('day_canvas')
     
      var context = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1
      var bsr = context.webkitBackingStorePixelRatio ||
                      context.mozBackingStorePixelRatio ||
                      context.msBackingStorePixelRatio ||
                      context.oBackingStorePixelRatio ||
                      context.backingStorePixelRatio || 1;
      var pix_ratio = 2*dpr/bsr;
      canvas.width = canvas.clientWidth*pix_ratio;
      canvas.height = canvas.clientHeight*pix_ratio;
      canvas.style.width = canvas.clientWidth;
      canvas.style.width = canvas.clientHeight;
      var height = canvas.height*0.9
      var width = canvas.width*0.9
      var widthOffset = height*0.08
      var heightOffset = width*0.1
      var numEvents = Math.max(3,dayViewClass.markedDayEvents.length)
      var adjustedWidth = width - widthOffset*2
      var adjustedHeight = height - heightOffset*2
      var sections_height = adjustedHeight/numEvents
      
      var sections_height_number = Math.round(adjustedHeight/sections_height)
      var sections_width = adjustedWidth/(24)
      var sections_width_number = Math.round(adjustedWidth/sections_width)
      
      
      context.fontWeight = "600"
      context.fillStyle = 'rgba(80,80,80,1)'
      context.textAlign = "center";
      context.textBaseline = "middle"; 
      var isSelected = dayViewClass.currentSelectedBox > -1
      var selectedStart = isSelected ? parseInt(dayViewClass.sortedEvents[dayViewClass.currentSelectedBox].startHour) : 0
      var selectedEnd = isSelected ? parseInt(dayViewClass.sortedEvents[dayViewClass.currentSelectedBox].endHour) : 0
      
      for (var i =0; i < sections_width_number+1; i++) {
          context.beginPath()
          
          context.fillStyle = isSelected && i > selectedStart - 1 && i < selectedEnd + 2 ? 'rgba(80,80,80,1)':'rgba(180,180,180,1)';
          context.font =  "5vmin Lato";
          context.fontWeight = "300";
          context.fillText(String(hoursAMPM[i%24]), widthOffset + sections_width*i, (i%2 == 0 ? (height - heightOffset*0.5)*1.1 : heightOffset*0.5*1.1));
          context.stroke();
          context.beginPath();
          context.strokeStyle = isSelected && i > selectedStart - 1 && i < selectedEnd + 2 ? 'rgba(180,180,180,1)' : 'rgba(' + 220 + ',' + 220 + ',' + 220 + ',' + '1)';
          context.lineWidth = 2;
          context.setLineDash([5,5]);
          context.moveTo(widthOffset + sections_width*i, heightOffset*1.1);
          context.lineTo(widthOffset + sections_width*i, (height - heightOffset)*1.1);
          context.stroke();
      } 
      context.font =  "6vmin Lato";
      context.fontWeight = "300";
      
      CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
          x = Math.max(0,x)
          y = Math.max(0,y)
          w = Math.max(1,w)
          h = Math.max(1,h)
          r = Math.max(0,r)
          if (w < 2 * r) r = w / 2;
          if (h < 2 * r) r = h / 2;
          this.beginPath();
          this.moveTo(x+r, y);
          this.arcTo(x+w, y,   x+w, y+h, r);
          this.arcTo(x+w, y+h, x,   y+h, r);
          this.arcTo(x,   y+h, x,   y,   r);
          this.arcTo(x,   y,   x+w, y,   r);
          this.closePath();
          return this;
      }
      for (var i =0; i < dayViewClass.sortedEvents.length; i++) {
        var ii = i*1.1
        var coords = [widthOffset + calculatedXOffset-2,heightOffset*1 + ii*sections_height -2 ,calculatedWidth+4,sections_height-1]
        var isHover = i == dayViewClass.currentHoverBox
        var start_time = (parseInt(dayViewClass.sortedEvents[i].startMinute) + parseInt(dayViewClass.sortedEvents[i].startHour*60))
        var end_time = (parseInt(dayViewClass.sortedEvents[i].endMinute) + parseInt(dayViewClass.sortedEvents[i].endHour*60))
        var calculatedWidth = Math.round(adjustedWidth*(end_time-start_time)/(24*60))
        calculatedWidth = Math.max(calculatedWidth,width*0.005)
        var calculatedXOffset = Math.round(adjustedWidth*(start_time)/(24*60))
        
        
        var randomColors = dayViewClass.sortedEvents[i].colors
        var r1 = shadeColor(hslToRgb(randomColors[0]), i == dayViewClass.currentSelectedBox || isHover ? 20:0,i == dayViewClass.currentSelectedBox || isHover ? 1:0.6)
        var r2 = shadeColor(hslToRgb(randomColors[1]), i == dayViewClass.currentSelectedBox || isHover ? 20:0,i == dayViewClass.currentSelectedBox || isHover ? 1:0.6)
        
        var r3 = randomColors[2]
        var grd = context.createLinearGradient(widthOffset + calculatedXOffset,heightOffset+ ii*sections_height, widthOffset + calculatedXOffset,heightOffset*1 + ii*sections_height + calculatedWidth, heightOffset*1 + ii*sections_height + sections_height);
        grd.addColorStop(0, r1);
        grd.addColorStop(1,  r2);
       
        context.fillStyle = grd
        context.strokeStyle = grd
        context.shadowBlur = 0;
        context.shadowColor='rgba(120,120,120,0.6)';
        context.beginPath();
        context.lineWidth = (i == dayViewClass.currentSelectedBox || isHover) ? 4 : 2;
        context.setLineDash([5,5]);
        context.moveTo(widthOffset, heightOffset*1 + ii*sections_height + sections_height/2);
        context.lineTo(widthOffset + calculatedXOffset,heightOffset*1 + ii*sections_height + sections_height/2);
        context.stroke()
        context.beginPath();
        context.moveTo(widthOffset + calculatedXOffset + calculatedWidth, heightOffset*1 + ii*sections_height + sections_height/2);
        context.lineTo(width - widthOffset*0.98, heightOffset*1 + ii*sections_height + sections_height/2);
        context.stroke();
        context.beginPath();
        context.fillStyle = r3
        context.shadowBlur = 0;
        context.shadowColor='rgba(120,120,120,0.2)';
        context.fillStyle = 'white'
        context.shadowBlur = (isHover && i !== dayViewClass.currentSelectedBox) ? 0 : 30;
        context.strokeStyle = (isHover && i !== dayViewClass.currentSelectedBox) ? 'rgb(230,230,230)' : 'rgb(255,255,255)';
        context.lineWidth = 2;
        context.setLineDash([])
        var ra = context.roundRect(widthOffset + calculatedXOffset-2,heightOffset*1 + ii*sections_height -2 ,calculatedWidth+4,sections_height-1,5)
        ra.fill()
        ra.stroke()
        dayViewClass.sortedBoxCoords[i] = [widthOffset + calculatedXOffset-2,heightOffset*1 + ii*sections_height -2 ,calculatedWidth+4,sections_height-1]
        context.fillStyle = grd
        context.strokeStyle = r2
        context.shadowBlur = 0;
        context.shadowColor= r2
        context.lineWidth = 2;
        var r = context.roundRect(widthOffset + calculatedXOffset+4,heightOffset*1 + ii*sections_height+4,calculatedWidth-8,sections_height-12,5)
        r.stroke()
        r.fill()
        context.beginPath();
        context.shadowBlur = 0;
        context.shadowColor='rgba(120,120,120,0.2)';
        context.fillStyle = i == dayViewClass.currentSelectedBox || isHover ? 'rgb(80,80,80)' : 'rgb(200,200,200)';
        context.fontWeight = (i == dayViewClass.currentSelectedBox || isHover) ? '900':'300'
        context.font =  "7vmin Lato";
        context.textAlign = "left";
        var counter = 1
        while (context.measureText (this.sortedEvents[i].id.split("_")[0].trim()).width > widthOffset*0.5 + canvas.width*0.1) {
            context.font = String(7*(0.99**counter)) + "vmin Lato"
            counter +=1
        }
        context.fillText(this.sortedEvents[i].id.split("_")[0].trim(), width- widthOffset*0.7,heightOffset + (ii+0.5)*sections_height);
        
      }
      var MousePos = undefined;
      var rect = canvas.getBoundingClientRect();
      if (dayViewClass.addedEventListeners == 0) {
          
          dayViewClass.addedEventListeners = 1;
          canvas.addEventListener("click",function(evt) {var selectionMade = onClick(dayViewClass.sortedBoxCoords,MousePos,evt); dayViewClass.currentSelectedBox = selectionMade == -1 ? dayViewClass.currentSelectedBox : selectionMade; dayViewClass.renderCanvas(dayViewClass.sortedBoxCoords,dayViewClass);}, false);
          
          canvas.addEventListener('mousemove', function(evt) {MousePos = getMousePos(pix_ratio,rect,canvas, evt);  dayViewClass.currentHoverBox = getHover(dayViewClass.sortedBoxCoords,MousePos)}, false);
          
      }
      if (coordsRegistered == false && dayViewClass.sortedEvents.length > 0) {
          dayViewClass.renderCanvas(dayViewClass.sortedBoxCoords,dayViewClass);
      }
      
  }
  _deleteButtonPressed(evt) {
      if (confirm('Deleting event "' + String(this.sortedEvents[this.currentSelectedBox].id.split("_")[0].trim())+ '"') ) {
          this.dispatchEvent(new CustomEvent('delete-event',
            {
              detail: {
                trackedEvent: this.sortedEvents[this.currentSelectedBox]
          }
      }));
      this.currentSelectedBox = -1;
      }
   }
  _modifyButtonPressed(evt) {
      this.dispatchEvent(new CustomEvent('modify-event',
            {
              detail: {
                trackedEvent: this.sortedEvents[this.currentSelectedBox]
              }
      }));
      this.currentSelectedBox = -1;
  }
  
  firstUpdated() {
      this.shadowRoot.getElementById('delete-button').addEventListener("click",(evt) => {this._deleteButtonPressed(evt)},false)
      this.shadowRoot.getElementById('modify-button').addEventListener("click",(evt) => {this._modifyButtonPressed(evt)},false)
  }
  
  
  updated() {
      this.renderCanvas(this.sortedBoxCoords,this)
      
  }
  
  constructor() {
      super()
      this.currentSelectedBox = -1;
      this.addedEventListeners = 0;
      this.currentHoverBox = -1;
  }
  

_calendarArrowPressed(e) {
    this.currentSelectedBox = -1;
     var currentMarkedDate = new Date(this.markedYear + 1900, this.markedMonth, this.markedDay);
     var increment = e.detail.incrementType == "increment" ? 1 : -1;
     currentMarkedDate.setDate(currentMarkedDate.getDate() + increment)
     if (e.detail.actionType == "today") {
         currentMarkedDate = today
         this.dispatchEvent(new CustomEvent('day-marked',
            {
              detail: {
                markedDay: currentMarkedDate.getDate(),
                markedMonth: currentMarkedDate.getMonth(),
                markedYear: currentMarkedDate.getYear()
              }
            }));
     } else {
          this.dispatchEvent(new CustomEvent('day-marked',
          {
              detail: {
                markedDay: currentMarkedDate.getDate(),
                markedMonth: currentMarkedDate.getMonth(),
                markedYear: currentMarkedDate.getYear()
              }
          }));
     }
  }
}

window.customElements.define('day-view', Day);
