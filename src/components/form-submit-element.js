

import { LitElement, html, css } from 'lit-element';

class FormSubmitElement extends LitElement {
   
  static get properties() {
    return {
      
    }
  }
  
    _onClick(event) {
        
      this.dispatchEvent(new CustomEvent('form-submitted'));
    }
    
  static get styles() {
    return [
      css`
        
        .form-submit:hover {
            display: inline-block;
            width: 2.25vmin;
            height: 2.25vmin;
          border-radius: 6vmax;
              text-shadow: 0 0 1px rgb(100,230,100);
            box-shadow: 0 0 0.5vmax 0px rgba(0,0,0,0.1);
          animation: none;
            text-decoration: inherit;
            background: url("./images/submit.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 9vmin;
            -webkit-filter: grayscale(0%);
            filter: grayscale(0%);
            padding-left: 0;
            padding-right: 0;
            padding: 4.5vmin 4.5vmin;
            opacity: 1;
            float: right;
            margin-right: 10%;
            line-height: 6vmin;
        }
        .form-submit {   
            width: 2.25vmin;
            height: 2.25vmin;
            display: inline-block;
            margin: auto;
            float: right;
            text-align: center; 
            font-family: 'Lato';
            font-weight: 300;
            font-size: 4vmin;
            -webkit-font-smoothing: antialiased;
            
            
            border-radius: 6vmax;
            box-shadow: 0 0 0.5vmax 0px rgba(0,0,0,0.2);
            line-height: 9vmin;
            padding-left: 0;
            padding-right: 0;
            padding: 4.5vmin 4.5vmin;
            background: url("./images/submit.svg");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 9vmin;
            -webkit-filter: grayscale(60%);
            filter: grayscale(60%);
            opacity: 0.7;
            line-height: 6vmin;
            margin-right: 10%;
            
        }
      `
    ];
  }

  render() {
    return html`
    <div class="form-submit">
    </div>
    `;
  }

  constructor() {
    super();
    this.addEventListener('click', this._onClick);
    
  }


}

window.customElements.define('form-submit-element', FormSubmitElement);
