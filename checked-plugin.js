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
    <input type="text" id="input" oninput="checkInput()">
    <div id="result"></div>
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

        // Set the default value based on input
        this.shadow.querySelector('#input').value = this.getAttribute('cellvalue')

        // Retrieve input and result elements
        var boolInput = this.shadow.getElementById("input");
        var resultElement = this.shadow.getElementById("result");

        // Trim and convert input to lowercase
        var inputValue = boolInput.value.trim().toLowerCase();

        // Define SVG icons for true and false input
        var trueSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15a84f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>';

        var falseSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e76f51" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>';

        if (inputValue === "true") {
            // Display a circle SVG for true input
            resultElement.innerHTML = trueSVG;
        } else if (inputValue === "false") {
            // Display a square SVG for false input
            resultElement.innerHTML = falseSVG;
        } else {
            resultElement.innerHTML = ""; // Clear the result if the input is invalid
        }
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
