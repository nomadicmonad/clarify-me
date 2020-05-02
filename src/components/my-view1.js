/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { installRouter } from 'pwa-helpers/router.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import './calendar-element.js';



class MyView1 extends connect(store)(PageViewElement) {
    
  static get properties() {
    return {
      currentDay: { type: Number },
      selectedDay: { type: Number, value: -1},
      trackingData: {type: Object}
      
    }
  }
  static get styles() {
    return [
      SharedStyles
    ];
  }

  render() {
    
    return html`
    
      <section>
        <h2>Calendar</h2>
       <calendar-element
       selectedDay="${this.selectedDay}"
       @day-selected="${(e) => this._daySelected(e)}">
       >Test</calendar-element>
      </section>
      
      

    `;
  }
  
   firstUpdated() {
  }
  
  _daySelected(e) {
      this.dispatchEvent(new CustomEvent('day-selected',
      {
          detail: {
            selectedDay: e.detail.selectedDay
          }
      }));
  }
}

window.customElements.define('my-view1', MyView1);
