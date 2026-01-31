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
