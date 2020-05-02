

import { LitElement, html, css } from 'lit-element';

class CalendarDropdownLink extends LitElement {
   
  static get properties() {
    return {
      itemTitle: {type: String},
      itemIndex: {type: Number}
      
    }
  }
  
  static get styles() {
    return [
      css`
      
    a {
      font-size: 5vmin; 
      float: none;
      color: #484848;;
      text-decoration: none;
      display: block;
      text-align: left;
      
    }

    a:hover {
      font-size: 5vmin; 
      background-color: rgb(120,120,120);
    }

    .
      `
    ];
  }

  render() {
   
   
    return html`
      <a class="calendar_dropdown_selection" onClick="{this.onClick}">${this.itemTitle}${html` &nbsp;`}</a>
    
    `;
  }
   firstUpdated() {
   }

  constructor() {
    super();
    this.addEventListener('click', this._onClick);
    
  }
  
  _onClick(event) {
      this.dispatchEvent(new CustomEvent('item-selected',
      {
          detail: {
            itemIndex: this.itemIndex
          }
      }));
    }


}

window.customElements.define('calendar-dropdown-link-element', CalendarDropdownLink);
