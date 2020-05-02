

import { html, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';


// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class Settings extends PageViewElement {
  static get properties() {
    return {
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
      
      #settings-section {padding: 0; line-height: 5vmin;}
        #settings_title {display:inline-block; width: 70%; text-align: center; line-height: 7vmin;}
        #settings_title_heading {font-size: 4.5vmin;
    margin-bottom: 1%;
    
        width: 42%;
        padding-right:1%;
    }
        
      `
    ];
  }

  render() {
    return html`
       <section id="settings-section">
      <h2 id ="settings_title_heading">
        
        <div id="settings_title">Settings</div>
        </h2>
        
      </section>
    `;
  }


}

window.customElements.define('settings-view', Settings);
