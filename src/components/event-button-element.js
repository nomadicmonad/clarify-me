

import { LitElement, html, css } from 'lit-element';

class EventButton extends LitElement {
   
  static get properties() {
    return {
      enabled: {type: String}
    }
  }
  
    
  static get styles() {
    return [
      css`
      .event-button {
          z-index:300;
          border-radius: 6vmin;
          position: fixed;
          top: 2.5vmax;
          right: 7%;
          display:block;
          margin:auto;
          background: white;
          color: rgba(0,230,0,0.3);
          box-shadow: 0 0 0.5vmax 0px rgba(0,255,0,0.1);
          text-align: center;
          animation: anim 7s infinite;
          vertical-align:middle;
          font-size: 2.5vmin;
      }
      
        .event-button:hover{
          border-radius: 6vmax;
            animation:none;
            box-shadow:none;
          font-size: 2.5vmin;
        }
          
          
        .event-button a {
          border-radius: 6vmax;
            box-shadow: 0 0 0.5vmax 0px rgba(0,0,0,0.2);
            display: block;
            text-decoration: none;
            line-height: 10vmin;
            padding: 5vmin 5vmin;
            background: url("./images/new.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 10vmin;
            -webkit-filter: grayscale(60%);
            filter: grayscale(60%);
            opacity: 0.7;
          font-size: 2.5vmin;
        }
        .event-button a:hover {
          border-radius: 6vmax;
            
              text-shadow: 0 0 1px rgb(100,230,100);
            box-shadow: 0 0 0.5vmax 0px rgba(0,0,0,0.1);
          animation: none;
            text-decoration: inherit;
            background: url("./images/new.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 10vmin;
            -webkit-filter: grayscale(0%);
            filter: grayscale(0%);
            opacity: 1;
          font-size: 2.5vmin;
        }

    @-webkit-keyframes anim {
      0% {
        -webkit-box-shadow: 0 0 0.5vw 0px rgba(0,255,0,0.1);
      }
      30% {
          -webkit-box-shadow: 0 0 0.5vw 3vw rgba(100,255,100,0);
      }
      100% {
          -webkit-box-shadow: 0 0 0.5vw 0px rgba(100,255,100,0);
      }
    }
    @keyframes anim {
      0% {
        -moz-box-shadow:: 0 0 0 0px rgba(0,255,0,0.1);
        box-shadow: 0 0 0 0px rgba(0,255,0,0.1);
      }
      30% {
          -moz-box-shadow: 0 0 0 3vw rgba(100,255,100,0);
          box-shadow: 0 0 0 3vw rgba(100,255,100,0);
      }
      100% {
          -moz-box-shadow: 0 0 0.5vw 0px rgba(100,255,100,0);
          box-shadow: 0 0 0 0px rgba(100,255,100,0);
      }
    }
          `
    ];
  }

  render() {
    if (this.enabled == "true") {
    return html`
    <div class="event-button"><a href="/event-panel"></a></div>
    `;
    } else {return  html``;}
  }

  constructor() {
    super();
    
  }



}

window.customElements.define('event-button-element', EventButton);
