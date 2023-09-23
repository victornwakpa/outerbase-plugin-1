// Define privileges for this plugin.
var privileges = [
    'cellValue',      // Privilege to access cellValue
    'configuration',  // Privilege to access configuration
]

// Create a template for the plugin cell's HTML structure.
var templateCell_$PLUGIN_ID = document.createElement('template')
templateCell_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        display: flex;
        align-items: center;
        padding: 0 8px;
    }
    input {
        display:none;
    }

    input:focus {
        outline: none;
    }
</style>

<div id="container">
</div>
`;

// Define the configuration class for the plugin.
class OuterbasePluginConfig_$PLUGIN_ID {
    constructor(object) {
        // No custom properties needed in this plugin configuration.
    }
}

// Define the main plugin cell class.
class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges;  // Observe the defined privileges
    }


    trueSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15a84f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>';
    
    falseSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e76f51" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>';
    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

        // Create a shadow DOM for encapsulation.
        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateCell_$PLUGIN_ID.content.cloneNode(true))
    }

    // Lifecycle callback when the element is connected to the DOM.
    connectedCallback() {
        // Parse the configuration object from the `configuration` attribute
        // and store it in the `config` property.
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(
            JSON.parse(this.getAttribute('configuration'))
        )

        this.render()
    }

    render(){

        //get container        
        const containerEl = this.shadow.getElementById("container");

        //cell value
        const cellValue = this.getAttribute('cellValue');

        //parsedCellValue 
        const parsedCellValue = cellValue === null ? null : this.booleanParser(cellValue);

        //render cellValue at time;
        this.renderTrueFalseSvg(parsedCellValue, containerEl);

        //update on click
        containerEl.addEventListener('click', (event)=>{
            console.log(containerEl.innerHTML === '')
            if(containerEl.innerHTML === ''){
                this.renderTrueFalseSvg(!parsedCellValue, containerEl);
            }else{
                //TODO TABLE DATA UPDATE VALUE 

                //SHORTCUT FOR NOW UI CHANGE ONLY NOT VALUE 
                containerEl.innerHTML === this.trueSVG ? containerEl.innerHTML = this.falseSVG : containerEl.innerHTML = this.trueSVG;
                
            }

        })

    }


    renderTrueFalseSvg(cellValue, htmlElement){
        cellValue ? htmlElement.innerHTML = this.trueSVG : (cellValue == null) ? htmlElement.innerHTML = 'NULL' : htmlElement.innerHTML = this.falseSVG;
    }   

    //converting any string, number, null or undefined to boolean
    booleanParser(value){
        if (typeof value === 'boolean') {
            return value;
          }
        
          if (typeof value === 'string') {
            value = value.trim().toLowerCase();
            return !(value === 'false' || value === 'no' || value === 'off' || value === '' || value === ' ' || value === '0');
          }
        
          return Boolean(value);
    }

    // Custom method to call a custom event.
    callCustomEvent(data) {
        const event = new CustomEvent('custom-change', {
            detail: data,
            bubbles: true,  // If you want the event to bubble up through the DOM
            composed: true  // Allows the event to pass through shadow DOM boundaries
        });

        this.dispatchEvent(event);
    }
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
