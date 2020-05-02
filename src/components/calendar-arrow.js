

import { LitElement, html, css } from 'lit-element';
import { unsafeCSS } from 'lit-element/lib/css-tag.js';

class CalendarArrow extends LitElement {
   
  static get properties() {
    return {
      actionType: {type: String},
      incrementType: {type: String},
      colorType: {type: String},
      enabled: {type: String}
    }
  }
  
    _onClick(event) {
      if (this.enabled == "true") {
      this.dispatchEvent(new CustomEvent('calendar-arrow-pressed',
      {
          detail: {
            actionType: this.actionType,
            incrementType: this.incrementType,
          }
      }));
      }
    }
    
  static get styles() {
    return [
      css`
      i.arrow {font-size: 5vmin;}
      i.arrow {
      border:1px  solid #484848;
      border-width: 0 0.6vmin 0.6vmin 0;
      display: inline-block;
      padding: 1.5vmin;
    }
     i.arrow[enabled="true"] {
      border: 1px  solid #484848;
      border-width: 0 0.6vmin 0.6vmin 0;
      display: inline-block;
      padding: 1.5vmin;
    }
    .calendar-arrow-div:hover i.arrow[enabled="true"] {
      border: 1px  solid rgb(100,100,100);
      border-width: 0 0.6vmin 0.6vmin 0;
      display: inline-block;
      padding: 1.5vmin;
    }
    i.arrow[enabled="false"] {
      border: 1px  solid rgb(240,240,240);
      border-width: 0 0.6vmin 0.6vmin 0;
      display: inline-block;
      padding: 1.5vmin;
    
    }
    i.arrow[enabled="true"][today="true"][colorType="blue"] {
      border: 1px  solid rgb(25,117,211);
      border-width: 0 0.6vmin 0.6vmin 0;
      display: inline-block;
      padding: 1.5vmin;
    
    }
    i.arrow[enabled="true"][today="true"][colorType="red"] {
      border: 1px  solid rgb(255,0,0);
      border-width: 0 0.6vmin 0.6vmin 0;
      padding: 1.5vmin;
      display: inline-block;
    
    }
    .calendar-arrow-div {
        margin-left: 0.25%;
        margin-right: 0.25%;
       border: 1px solid white;
      display: inline-block;
      font-size: 5vmin;
    }
   .calendar-arrow-div:hover  i.arrow[enabled="true"][today="true"][colorType="blue"] {
      border: 1px  solid rgb(165,217,255);
      border-width: 0 0.6vmin 0.6vmin 0;
      padding: 1.5vmin;
      display: inline-block;
    
    }
    .calendar-arrow-div:hover i.arrow[enabled="true"][today="true"][colorType="red"] {
      border: 1px  solid rgb(255,200,200);
      border-width: 0 0.6vmin 0.6vmin 0;
      padding: 1.5vmin;
      display: inline-block;
    
    }
    
    .calendar-arrow-div[direction="left"] {
        float: left;
      display: inline-block;
       border:1px solid white;
    }
    .calendar-arrow-div[direction="right"] {
        float: right;
      display: inline-block;
       border:1px solid white;
    }
    

    i.arrow[enabled="false"][today="true"] {
      border: 1px solid rgb(240,240,240);
      border-width: 0 0.6vmin 0.6vmin 0;
      padding: 1.5vmin;
      display: inline-block;
    }
    

    .right {
      margin-left: 1vmin;
      margin-right: 2.3vmin;
      border-width: 0 0.6vmin 0.6vmin 0;
      transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
      display: inline-block;
    }

    .left {
      margin-left: 2.3vmin;
      margin-right: 1vmin;
      transform: rotate(135deg);
      border-width: 0 0.6vmin 0.6vmin 0;
      -webkit-transform: rotate(135deg);
      display: inline-block;
    }

    
    .calendar-arrow-div {
      display: inline-block;
      box-shadow: 0 0 0.8vmin 0px rgba(0,0,0,0.2);
      
       border-radius: 1vmin;
       line-height: 7vmin;
       border: 1px solid white;
    }
    
    .calendar-arrow-div[enabled="true"]:hover {
      display: inline-block;
      box-shadow:  0 0 0.8vmin 0px rgba(0,0,0,0.05);
      border: 1px solid rgb(240,240,240);
      border-radius: 1vmin;
       line-height: 7vmin;
    }
          `
    ];
  }

  render() {
    return html`
    <div class="calendar-arrow-div" enabled="${this.enabled}" direction="${this.incrementType == "increment" ? "right" : "left"}">
    <i class="arrow ${this.incrementType == "increment" ? "right" : "left"}" enabled="${this.enabled}" today="${this.actionType == "today"}" colorType="${this.colorType}"></i>
    </div>
    `;
  }

  constructor() {
    super();
    this.addEventListener('click', this._onClick);
    
  }


}

window.customElements.define('calendar-arrow-element', CalendarArrow);
