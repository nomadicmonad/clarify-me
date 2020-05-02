

import { LitElement, html, css } from 'lit-element';

import '@polymer/paper-input/paper-input.js';
class EventPanelInput extends LitElement {
   
  static get properties() {
    return {
      eventName: {type:String}
      
    }
  }
  
    
    _onChanged(event) {
      this.eventName = event.target.value
      this.dispatchEvent(new CustomEvent('input-changed',
      {
          detail: {
            inputText: this.eventName
          }
      }));
 }
    
  static get styles() {
    return [
      css`
      
      
      .events {
            display: inline-block;
            padding-left: 3%;
            text-align: center; 
            width:50%;
            height: 6vmin;
            font-family: 'Lato';
            font-weight: 400;
            font-size: vmin;
            -webkit-font-smoothing: antialiased;
            --paper-input-container-input: {
          font-size: 6vmin;
        };
       }
}
      `
    ];
  }

  render() {
    
    return html`
      <paper-input id="papervents" class="papervents" @change=${e => this._onChanged(e)}  value="${this.eventName}"></paper-input>

    
    `;
  }
   firstUpdated() {
   }

  constructor() {
    super();
    
  }


}

window.customElements.define('event-panel-input-element', EventPanelInput);
