

import { LitElement, html, css } from 'lit-element';

import {hoursAMPM, hoursShort,days, today} from '../util/dateutil.js';
import {shadeColor,hslToRgb} from '../util/color-util.js'

class DayElement extends LitElement {
   
  static get properties() {
    return {
      isCurrentDay: false,
      currentDay: {type: Number},
      weekNumber: {type: Number},
      dayIndex: {type: Number},
      dayOfMonth: {type: Number},
      markedDay: {type: Number},
      markedMonth: {type: Number},
      markedYear: {type: Number},
      
      selectedMonth: {type: Number},
      selectedYear: {type: Number},
      
      ownMonth: {type: Number},
      ownYear:{type: Number},
      
      dayEvents: {type: Array}
      
    }
  }
  
    _onClick(event) {
      if (parseInt(this.weekNumber) > 1) {
      this.dispatchEvent(new CustomEvent('day-marked',
      {
          detail: {
            markedDay: this.dayOfMonth,
            markedMonth: this.ownMonth,
            markedYear: this.ownYear
          }
      }));
    }
    }
  static get styles() {
    return [
      css`
  .day{
      background: rgb(255,255,255);
      display:inline-block;
      color: rgb(80,80,80);
      float: left;
      font-size: 3vmin;
      width: 12.8vmin;
      text-align: center;
      box-shadow: 0 0 0.1vmax 0px rgba(0,0,0,0.2);
      border-radius: 0.7vmin;
      
  }
  
  .day:not([weekNumber="1"]):not([isCurrentDay="true"]):not([isMarkedDay=true])[isOwnMonth="true"]:not([isFuture="true"]):hover {
      
      color: #484848;
      font-weight: 300;
      border: 0.3vmin dashed rgba(210,210,210);
      box-shadow: 0 0 0.1vmax 0px rgba(0,0,0,0.2);
  }
  
  .day:not([weekNumber="1"])[isOwnMonth="true"]:not([isFuture="true"]):hover {
      box-shadow: 0 0 0.1vmax 0px rgba(0,0,0,0.2);
  }
  
  .dayString {
    transform: translateY(2%);
  }
  
  .day[weekNumber="1"]{
      background: rgb(240,240,240);
      color: #484848;
      width: 12.8vmin;
      font-weight: bold;
      text-align:center;
      
      border: 0.3vmin solid rgb(240,240,240);
      border-bottom: 0.2vmin solid rgb(240,240,240);
      
  }
  .day:not([weekNumber="1"]):not([weekNumber="2"]):not([isCurrentDay="true"])[isOwnMonth="true"]{
      border: 0.3vmin solid rgba(255,255,255,1);
      
  }
  .day:not([weekNumber="1"]):not([isOwnMonth="true"]) {
      
      border: 0.3vmin solid rgba(250,250,250,1);
      box-shadow: 0 1 0.1vmax 0px rgba(0,0,0,0.2);
      background: rgb(250,250,250);
      color: rgb(220,220,220);
      float: center;
      width: 12.8vmin;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      
  }
  
  .day:not([weekNumber="1"]):not([isOwnMonth="true"]):not([isFuture="true"]):hover {
      
      border: 0.3vmin dashed rgba(210,210,210);
      box-shadow:  0 1 0.1vmax 0px rgba(0,0,0,0.2);
      background: rgb(250,250,250);
      color: rgb(200,200,200);
      float: center;
      width: 12.8vmin;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      
  }
  .day[weekNumber="2"]{
      font-size: 3vmin;
      width: 12.8vmin;
      border: 0.3vmin solid rgba(255,255,255,1);
      
  }
  .day[isFuture="true"][isOwnMonth="true"] {
      background: rgb(255,255,255);
      color: rgb(200,200,200);
      border: 0.3vmin solid rgba(255,255,255,1);
      box-shadow: 0 0 0.1vmax 0px rgba(0,0,0,0.1);
  }
  .day:not([isCurrentDay="true"])[isMarkedDay=true]:not([weekNumber="1"]):not([weekNumber="2"]){
      color: rgb(0,200,0);
      font-weight: 300;
      border: 0.3vmin dashed rgba(0,200,0,1);
      box-shadow: 0 0 0.1vmax 0px rgba(0,0,0,0.3);
      border-radius:  0.5vmax;
      
  }
  .day:not([isCurrentDay="true"])[isMarkedDay=true][weekNumber="2"]{
      color: rgb(0,200,0);
      font-weight: 300;
      border: 0.3vmin dashed rgba(0,200,0,1);
      box-shadow: 0 0 0.1vmax 0px rgba(0,0,0,0.3);
      border-radius:  0.5vmax;
      
  }
  
  
  .day[isCurrentDay="true"]{
      color:rgba(25,117,211);
      font-weight: 400;
      border: 0.3vmin dashed rgba(25,117,211,1);
      
      box-shadow: 0 0 0.1vmax 0px rgba(0,0,0,0.3);
      border-radius: 0.7vmin;
  }
  
  

  
     .day::empty::before {
      color: black;
      content: "Day";
    }
    
      `
    ];
  }

  render() {
    var isMarked = this.markedMonth == this.ownMonth && this.markedYear == this.ownYear && this.markedDay == this.dayOfMonth ? true : false
    var curDayHtml = html``
    var markedDayHtml = html``
    return html`
    <div 
    isMarkedDay="${isMarked}" 
    isCurrentDay="${this.isCurrentDay}" 
    weekNumber="${this.weekNumber}" 
    isOwnMonth="${this.ownMonth == this.selectedMonth}"
    isFuture="${new Date(this.ownYear + 1900,this.ownMonth,this.dayOfMonth) > today}"
    class="day" 
    id = "${this.dayIndex}">
      <div class="dayString">${this.weekNumber == "1" ? days[(this.dayIndex)%7] : String(this.dayOfMonth)}
      ${this.isCurrentDay == "true" ? curDayHtml : isMarked ? markedDayHtml : ""} </div>
      <canvas style="display:block;width:${this.weekNumber == "1" ? "1px": "100%"};height:${this.weekNumber == "1" ? "1px": "6vmin"};" 
      id = "canvas_${this.dayIndex}" ></canvas>
    </div>
    `;
  }
  
  updated() {
      if (this.dayIndex > 6) {
        this.renderCanvas()
      }
      
  }
  
  renderCanvas() {
      var canvasString = "canvas_" + String(this.dayIndex)
      
      var canvas = this.shadowRoot.getElementById(canvasString)
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
      canvas.style.display = "block"
      var height = canvas.height
      var width = canvas.width
      var widthOffset = Math.round(canvas.width*0.1)
      var heightOffset = Math.round(canvas.height*0.2)
      var numEvents = Math.max(3,this.dayEvents.length)
      const sortedEvents = this.dayEvents
          .map((item, index) => [parseInt(this.dayEvents[index].startMinute) + parseInt(this.dayEvents[index].startHour)*60, item])
          .sort(([count1], [count2]) => count2 - count1)
          .map(([, item]) => item)
      var orderedEvents = new Array(this.dayEvents.length)
      var adjustedWidth = width - widthOffset*2
      var adjustedHeight = height - heightOffset*2
      var sections_height = Math.round(adjustedHeight/numEvents)
      var sections_height_number = Math.round(adjustedHeight/sections_height)
      var sections_width = Math.round(adjustedWidth/(24))
      var sections_width_number = Math.round(adjustedWidth/sections_width)
      
      function onClick(e) {
      }
      
      context.fontWeight = "600"
      context.fillStyle = 'rgba(80,80,80,1)'
      context.textAlign = "center";
      context.textBaseline = "middle"; 
      if (this.dayEvents.length > 0) {
          for (var i =0; i < sections_width_number+1; i++) {
              context.beginPath()
              
              context.fillStyle = 'rgba(200,200,200,1)';
              context.beginPath();
              context.strokeStyle = 'rgba(' + 220 + ',' + 220 + ',' + 220 + ',' + '1)';
              context.lineWidth = 1;
              context.setLineDash([]);
              context.moveTo(widthOffset + sections_width*i, heightOffset*1.1);
              context.lineTo(widthOffset + sections_width*i, (height - heightOffset)*1.1);
              context.stroke();
          } 
      }
      context.font =  "6vmin Lato";
      context.fontWeight = "300";
      
      //canvas.addEventListener('mousemove', function(evt) {MousePos = getMousePos(canvas, evt);  }, false);
      canvas.addEventListener("click", onClick, false);
      context.font =  "100px Lato"
      context.fontWeight = "400"
      context.textAlign = "center";
      context.textBaseline = "middle"; 
      
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
      for (var i =0; i < sortedEvents.length; i++) {
        var ii = i*1.1
          
        var start_time = (parseInt(sortedEvents[i].startMinute) + parseInt(sortedEvents[i].startHour*60))
        var end_time = (parseInt(sortedEvents[i].endMinute) + parseInt(sortedEvents[i].endHour*60))
        var calculatedWidth = Math.round(adjustedWidth*(end_time-start_time)/(24*60))
        var calculatedXOffset = Math.round(adjustedWidth*(start_time)/(24*60))
        var randomColors = sortedEvents[i].colors
        var r1 = shadeColor(hslToRgb(randomColors[0]), 0,0.6)
        var r2 = shadeColor(hslToRgb(randomColors[1]),  0,0.6)
        context.strokeStyle = r1
        context.beginPath();
        context.lineWidth = 2;
        context.setLineDash([4,4]);
        context.moveTo(widthOffset, heightOffset*1 + ii*sections_height + sections_height/2);
        context.lineTo(widthOffset + calculatedXOffset,heightOffset*1 + ii*sections_height + sections_height/2);
        context.stroke();
        var grd = context.createLinearGradient(widthOffset + calculatedXOffset,heightOffset+ ii*sections_height, widthOffset + calculatedXOffset,heightOffset*1 + ii*sections_height + calculatedWidth, heightOffset*1 + ii*sections_height + sections_height);
        grd.addColorStop(0, r1);
        grd.addColorStop(1, r2);
        
        context.beginPath();
        context.shadowColor='rgba(120,120,120,0.2)';
        context.fillStyle = 'white'
        context.shadowBlur = 10;
        context.strokeStyle = 'rgb(255,255,255)';
        context.lineWidth = 2;
        context.setLineDash([])
        var ra = context.roundRect(widthOffset + calculatedXOffset-2,heightOffset*1 + ii*sections_height -2 ,calculatedWidth+4,sections_height+4,5)
        ra.fill()
        ra.stroke()
        context.beginPath()
        context.fillStyle = grd
        context.roundRect(widthOffset + calculatedXOffset,heightOffset*1 + ii*sections_height,calculatedWidth,sections_height,2).fill()
        
        context.beginPath();
        context.strokeStyle = r1
        context.lineWidth = 2;
        context.setLineDash([4,4]);
        context.moveTo(widthOffset + calculatedXOffset + calculatedWidth, heightOffset*1 + ii*sections_height + sections_height/2);
        context.lineTo(width - widthOffset, heightOffset*1 + ii*sections_height + sections_height/2);
        context.stroke();
        //context.fillText(sortedEvents[i].id.split("_")[0], widthOffset + calculatedXOffset + calculatedWidth/2,heightOffset + (i+0.5)*sections_height);
        
      }
      
  }

  constructor() {
    super();
    this.addEventListener('click', this._onClick);
    
  }


}

window.customElements.define('day-element', DayElement);
