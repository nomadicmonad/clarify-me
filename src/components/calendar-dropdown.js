

import { LitElement, html, css } from 'lit-element';


import './calendar-dropdown-link.js'

class CalendarDropdown extends LitElement {
   
  static get properties() {
    return {
      dropDownTitle: {type: String},
      selectedOptionIndex: {type: Number},
      selectionOptions: {type: Array},
      dropDownType: {type:String}
      
    }
  }
  
    _itemSelected(event) {
      this.dispatchEvent(new CustomEvent('calendar-dropdown-selected',
      {
          detail: {
            selectedOptionIndex: event.detail.itemIndex,
            selectedOption: this.selectionOptions[event.detail.itemIndex],
            dropdownType: this.dropDownType
          }
      }));
    }
    
  static get styles() {
    return [
      css`
      
      .dropdown {
          float: center;
      font-weight: bold;
          display: inline-block;
          font-size: 5vmin; 
      border-radius: 0.4vh;
      line-height: 7vmin;
      
        }

    .dropdown .dropbtn {
      font-weight: bold;
      font-size: 5vmin; 
      border: none;
      outline: none;
      color: #484848;
      background-color: inherit;
      font-family: inherit;
      margin: 0;
      line-height: 7vmin;
    }

    .navbar a:hover, .dropdown:hover .dropbtn {
      font-weight: bold;
      border-radius: 0.2vh;
      color: rgb(100,100,100);
      line-height: 7vmin;
    }

    .dropdown-content {
      font-size: 5vmin; 
      font-weight: bold;
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      box-shadow: 0px 1vh 2vh 0px rgba(0,0,0,0.2);
      z-index: 1;
      font-weight: 400;
      border-radius: 0.1vw;
      line-height: 7vmin;
    }

    .dropdown-content a {
      font-weight: bold;
      font-size: 5vmin; 
      float: none;
      color: #484848;
      text-decoration: none;
      display: block;
      text-align: left;
      line-height: 7vmin;
    }

    .dropdown-content a:hover {
      font-weight: bold;
      font-size: 2.5vmax 
      color: rgb(100,100,100);
      line-height: 7vmin;
    }

    .dropdown:hover .dropdown-content {
      color: rgb(100,100,100);
      font-weight: bold;
      font-size: 5vmin; 
      max-height: 30vh;
      overflow-y: auto;
      display: block;
      line-height: 7vmin;
    }
          
      `
    ];
  }

  render() {
    var htmlStringForLinks = []
    for (var i = 0; i < this.selectionOptions.length; i++) {
        htmlStringForLinks.push(html`<calendar-dropdown-link-element itemTitle="${this.selectionOptions[i]}" itemIndex="${i}" @item-selected="${(e) => this._itemSelected(e)}"></calendar-dropdown-link-element>`);
    }
    return html`
      <div class="dropdown">
          <button class="dropbtn">${this.dropDownTitle} 
          <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdown-content">
         ${htmlStringForLinks}
        </div>
    </div> 
    
    `;
  }
   firstUpdated() {
   }

  constructor() {
    super();
    
  }


}

window.customElements.define('calendar-dropdown-element', CalendarDropdown);
