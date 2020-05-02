

import { LitElement, html, css } from 'lit-element';

class DayElement extends LitElement {
  static get properties() {
    return {
      currentDay: { type: Number },
      selectedDay: { type: Number },
      isFirstWeek: {type: Number},
      dayNumber: {type: Number},
      dayOfMonth: {type: Number}
    }
  }

  static get styles() {
    return [
      css`
        span {
          width: 20px;
          display: inline-block;
          text-align: center;
          font-weight: bold;
        }
      `
    ];
  }

  render() {
    return html`
      <div>
      ${weeks }
      </div>
    `;
  }

  constructor() {
    super();
    this.currentDay = 15;
    this.selectedDay = 11;
  }


}

window.customElements.define('day-element', DayElement);
