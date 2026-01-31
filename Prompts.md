# Prompt para o Desenvolvimento da Calculadora de Emissão de CO2

## Iniciando o Projeto

### Primeiro Prompt

Create a semantic HTML5  structure for CO2 emissions calculator:

HEADER:

- Title with leaf emoji: " [emoji] Calculadora de Emissão de CO2"
- Subtitle explaning the purpose

MAIN FORM (id="calculador-form):

- Origin Input (id="origin") with datalist (id="cities-list") for autocomplete
- Destination Input (id="destination") sharing the same datalist
- Distance Input (id="distance", type="number", readonly) that will be auto-filed
- Checkbox (id="manual-distance") labeled "inserir distância manualmente"
- Transport mode selector with 4 radio buttons in a visual grid:
  - bicycle, car (checked), bus, truck
  - Each wrapped in label with emoji icon and text in Portuguese
  - Use name="transport" and values: bicycle, car, bus, truck
-Submit button with text "Calcular Emissão"

RESULTS SECTIONS (all hidden by default with class="hidden"):

- Section id="results" with empty div id="results-content"
- Section id="comparison" with empty div id="comparison-content"
-Section id="carbon-credits" with empty div id="carbon-credits-content"

FOOTER:

- Credits text: "Desenvolvido com [emoji heart] para a DIO | Projeto GitHub Copilot do Denny"

AT THE END OF BODY (in thiss order):

- Script tags loading JavaScript files in order:

``` html
<script src="js/routes-data.js"></script>
<script src="js/config.js"></script>
<script src="js/calculator.js"></script>
<script src="js/ui.js"></script>
<script src="js/app.js"></script>
```

REQUIREMENTS:

- Use BEM msning convention for classes
- include meta viewport for responsive design
- Link css/style.css in head
- The datalist should be empty initialy (will be populated by JavaScript)
- Add helper text below distance imput: "A distância será preenchida automaticamente"

### Segundo Prompt

Create a modern CSS file (css/style.css) with:

CSS CUSTOM PROPERTIES at :root level:

- Eco-friendly color palette:
  - --primary: #10b981, --secondary: #059669, --accent: #34d399
  - --text: #1f2937, --text-light: #6b7280, --bg: #f3f4f6, --white: #ffffff
- Spacing scale: --spacing-xs through --spacing-xl (0.5rem to 3rem)
- --radius: 0.5rem, --radius-lg: 1rem
- --shadow-sm, --shadow-md, --shadow-lg

BASE STYLE:

- Universal selector reset (margin, padding, box-sizing: border-box)
- Body with gradient background: linear-gradient(135deg, #d4fc79 0%, #96c6a1 100%)
-Body min-height: 100vh, font-family: system fonts
- Container class: max-width 1200px, centered with margin auto, padding

UTILITY CLASSES:

- .hidden {display:none !important}
- .section-title: large heading style

HEADER:

- White background, shadow, padding
- Title with primary color, 2rem font size
- Subtitle in gray, smaller font

FROM STYLING (.calculator class):

- White card background, rounded corners, shadow, padding
- Form groups with margin-bottom
- Labels: bold, display block, margin-bottom
- Text/number inputs: full width, padding, border with focus state (primary color border and shadow)
- Helper text: small, gray, below inputs

TRANSPORT MODE GRID:

- Container: display grid, 4 columns on desktop (2 on mobile), gap
- Hide actual radio inputs with: position absolute, opacity 0
- Style the label as clickable card:
  - Border, padding, rounded corners, cursor pointer, text-align center
  - Display flex column for icon (3rem emoji) and label text
  - Hover: lift with transform translateY(-2px) ND SHADOW
  - When input checked: primary border (2px), light primary background
  - Use adjacent sibling selector: input:checked + .card-class

CHECKBOX:

- Standard checkbox with label, margin-top

BUTTON:

- Full width, primary background, white text, padding, rounded
- Hover: secondary color, lift effect
- Disabled: gray background, not-allowed cursor

Add .spinner class for loading animation:

- inline-block, 40px circle, border with rotating top color
- @keyframes spin animation

RESPONSIVE:

- Use min-width: 768px media query for desktop adjustments
- Transport grid: 4 colummns on desktop, 2 on mobile (max-width: 767px)

### Terceiro Prompt

Create js/routes-data.js with a global object named RoutesDB containing:

A property 'routes' as an array of route objects with structure:

- origin: string (city name with state, e.g., "São Paulo, SP")
- destination: string (city name with state)
- distanceKm: number (actual distance between cities)

Include 30-40 popular Brazilian routes:

- Capital to capital connections (São Paulo - Rio de Janeiro: 430km, São Paulo - Brasília: 1015Km, Rio de Janeiro - Brasília: 1148Km, etc.)
- Major regional routes (São Paulo - Campinas: 95Km, Rio de Janeiro - Niterói: 13Km, Belo Horizonte - Ouro Preto: 100Km, etc.)
- Cover different regions of Brazil

Add these methods to RoutesDB object:

```javascript
getAllCities: function() {
// Return unique sorted array of all city names from routes
// Extract from both origin and destination
// Remove duplicates and sort alphabetically
}

findDistance: function(origin, destination) {
// Find route distance between two cities
// Search in both directions (origin-destination and destination-origin)
// Normalize input: trim whitespace and convert to lowercase for comparison
// Return distance in Km if found, null if not found
}
```

The entire file should define one global variable: RouteDB  
Add comments explaining the structure

### Quarto Prompt

Create js/config.js that defines a global CONFIG object with:

EMISSION_FACTORS object (kg CO2 per km):

- bicycle: 0
- car: 0.12
- bus: 0.089
- truck: 0.96

TRANSPORT_MODES object with metadata:

- For each mode (bicycle, car, bus, truck):

- label: Portuguese name (Bicicleta, Carro, Ônibus, Caminhão)
- icon: emoji (🚲, 🚗, 🚌, 🚚)
- color: hex color code for UI

CARBON_CREDIT object:

- KG_PER_CREDIT: 1000
- PRICE_MIN_BRL: 50
- PRICE_MAX_BRL: 150

Add a method to CONFIG called:

```javascript
populateDatalist: function() {
// Get cities list from RoutesDB.getAllCities()
// Get datalist element by id 'cities-list'
// Create option elements for each city
// Append to datalist
}
```

Also add:

```javascript
setupDistanceAutofill: function() {
// Get origin and destination input elements
// get distance input and manual checkbox
// Add 'change' event listeners to both origin and destination inputs
// On change:
//   - Get trimmed values from both inputs
//   - If both are filled, call RoutesDB.findDistance()
//   - If distance found:
//     - Fill distance input with value
//     - Make it readonly
//     - Show success message (change helper text color to green)
//   - If not found:
//     - Clear distance input
//     - Change helper text to suggest manual input
// Add 'change' listener to manual checkbox:
// - When checked: remove readonly from distance, allow manual entry
// - When unchecked: try to find route again
}
```

Everything should be in one global CONFIG object

### Quinto Prompt

Create js/calculator.js with a global Calculator object containing these methods:

```javascript
calculateEmission: function(distanceKm, TranspotMode) {
// Get emission factor from CONFIG_EMISSION_FACTORS using transportMode as key
// Calculate: distance * factor
// Return result rounded to 2 decimal places
}

calculateAllModes: function(distanceKm) {
// Create array to store results
// For each transport mode in CONFIG_EMISSION_FACTORS:
//   - Calculate emission for that mode
//   - Calculate car emission as baseline
//   - Calculate percentage vs var: (emissao/carEmission) * 100
//   - Push object to array: {mode:'car', emission: 12.5, precentageVsCar: 100}
// Sort array by emission (lowest first)
// Return array
}

calculateSavings: function(emission, baselineEmission) {
// Calculate saved kg: baseline - emission
// Calculate percentage: (saved/baseline) * 100
// Return object: {saveKg: 5.5, percentage: 45}
// Round numbers to 2 decimals
}

calculateCarbonCredits: function(emissionKg) {
// Divide emission by CONFIG_CARBON_CAREDIT.KG_PER_CREDIT
// Return rounded to 4 decimal places
}

estimateCreditPrice: function(credits) {
// Calculate min: credits * PRICE_MIN_BRL
// Calculate max: credits * PRICE_MAX_BRL
// Calculate average: (min + max) / 2
// Return object: { min: 50.5, max: 150.5, average: 100.5 }
// Round to 2 decimals
}
```

Add comments explainning each calculation  
The file defines one global variable: Calculator

### Sexto Prompt

Create js/ui.js with a global UI object containing:

UTILITY METHODS:

```javascript
formatNumber: function(number, decimals){
// Use toFixed() for decimals
// Add thousand separations using regex or toLocaleString('pt-BR')
// Return formatted string
}

formatCurrency: function(value) {
// Format as R$ with pt-BR locale
// Return 'R$ 1.234,56' format
}

showElement: function(elementId){
// Get element by ID
// Remove 'hidden' class
}

hideElement: function(elementId){
// Get element by ID
// Add 'hidden' class
}

scrollToElement: function(elementId){
// Get element by ID
// Use scrollIntoView with smooth behavior
}
```

RENDERING METHODS:

```javascript
renderResults: function(data){
// data object contains: origin, destination, distance, emission, mode, savings
// Get mode metadata from CONFIG.TRANSPORT_MODES
// Create HTML, string with template literals containing:
//   - Route card showing origin -> destination
//   - Distance card showing distance in km
//   - Emission card showing CO2 in kg with green leaf icon
//   - Transport card showing mode icon amd label
//   - If mode is not 'car' and savings exist: savings card showing kg saved and percentage
// Return complete HTML string
// Use div with class="results__card" for each card
// Use BEM naming for internal elements
}

renderComparison: function(modeArray, selectedMode) {
// ModesArray from Calculator.calculateAllModes()
// Create HTML string for each mode:
//   - Container div with class='comparison__item"
//   - If mode === selectedMode, add class='comparison__item--selectd'
//   - Header with mode icon, label, and emission stats
//   - If selected, add badge with "Selecionado" text
//   - Stats showing emission and percentage vs car
//   - Progress bar with width based on emission (use max emission for 100% reference)
//   - Color-code bar: green(0-25%), yellow (25-75%), orange(75-100%), red(> 100%)
// At the end, add tip box with helpful message
// Return complete HTML string
}

renderCarbonoCredits: function(creditsData) {
// creditsData contains: {credits, price: {min, max, average}}
// Create HTML with:
//   - Grid with 2 cards
//   - Card 1: Credits needed (large number), helper text "1 crédito =  1000 kg CO2"
//   - Card 2: Estimated price (average), range showing min-max
//   - info box explaining what carbon credits are
//   - Button "[emoji shop car] Compensar Emissões" (can be non-functional for demo)
// Return complete HTML string
// Use formatNumber and formatCurrency for values
}

showLoading: function(buttonElement) {
// Save original text in data attribute: buttonElement.dataset.originalText
// Disable buttom
// Change InnerHTML to show spinner and "Calculando..." text
// Spinner: "<span class='spinner'></span>Calculando..."
}

hideLoading: function(buttonElement){
// Enable button
// Restore original text from data atributte
}
```

All methods should be part of the global UI object  
Use clear comments explaining the HTML structure
