

import { LitElement, html, css } from 'lit-element';

class EventTimeDropdownLink extends LitElement {
   
  static get properties() {
    return {
      itemTitle: {type: String},
      itemIndex: {type: Number},
      start: {type: String}
      
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
      <a class="event-time-dropdown-selection" onClick="{this.onClick}">${this.itemTitle}${html` &nbsp;`}</a>
    
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
            itemIndex: this.itemIndex,
            start: this.start
          }
      }));
    }


}

window.customElements.define('event-time-dropdown-link-element', EventTimeDropdownLink);
