/**
 * UI - User Interface Manager
 * 
 * Handles all DOM manipulation, element rendering, formatting, and display logic.
 * Provides utility methods for common UI operations and methods for rendering
 * calculation results with proper formatting and styling.
 */

const UI = {
  /**
   * Format a number with thousands separator and decimal places
   * 
   * @param {number} number - Number to format
   * @param {number} decimals - Number of decimal places (default: 2)
   * @returns {string} Formatted number string (e.g., "1.234,56")
   */
  formatNumber: function(number, decimals = 2) {
    // Use toLocaleString with pt-BR locale for proper formatting
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  /**
   * Format a value as Brazilian currency
   * 
   * @param {number} value - Value to format in Brazilian Reals
   * @returns {string} Formatted currency string (e.g., "R$ 1.234,56")
   */
  formatCurrency: function(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  /**
   * Show an element by removing the 'hidden' class
   * 
   * @param {string} elementId - ID of the element to show
   */
  showElement: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove('hidden');
    } else {
      console.warn(`Element with id "${elementId}" not found`);
    }
  },

  /**
   * Hide an element by adding the 'hidden' class
   * 
   * @param {string} elementId - ID of the element to hide
   */
  hideElement: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('hidden');
    } else {
      console.warn(`Element with id "${elementId}" not found`);
    }
  },

  /**
   * Smoothly scroll to an element
   * 
   * @param {string} elementId - ID of the element to scroll to
   */
  scrollToElement: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Element with id "${elementId}" not found`);
    }
  },

  /**
   * Render the main results section with trip details and emissions
   * 
   * HTML structure:
   * - Results card with origin -> destination route
   * - Distance card showing trip distance
   * - Emission card showing CO2 in kg with leaf icon
   * - Transport mode card showing selected mode
   * - Savings card (if applicable, comparing to car baseline)
   * 
   * @param {Object} data - Result data object containing:
   *   - origin: string
   *   - destination: string
   *   - distance: number (km)
   *   - emission: number (kg CO2)
   *   - mode: string (transport mode key)
   *   - savings: Object { savedKg, percentage } (optional)
   * @returns {string} HTML string for results section
   */
  renderResults: function(data) {
    const modeInfo = CONFIG.TRANSPORT_MODES[data.mode];
    
    // Build savings card HTML (only show if mode is not car and savings exist)
    const savingsHTML = data.mode !== 'car' && data.savings
      ? `
        <div class="results__card results__card--savings">
          <div class="results__card-header">Economia de CO₂</div>
          <div class="results__card-body">
            <div class="results__stat">
              <span class="results__value" style="color: #10b981; font-weight: 700; font-size: 1.5rem;">
                ${this.formatNumber(data.savings.savedKg, 2)} kg
              </span>
              <span class="results__label">economizados</span>
            </div>
            <div class="results__stat">
              <span class="results__value" style="color: #10b981; font-weight: 700;">
                ${this.formatNumber(data.savings.percentage, 1)}%
              </span>
              <span class="results__label">menos que carro</span>
            </div>
          </div>
        </div>
      `
      : '';

    // Build complete results HTML
    return `
      <div class="results__container">
        <!-- Route Card -->
        <div class="results__card results__card--route">
          <div class="results__route">
            <span class="results__city">${data.origin}</span>
            <span class="results__arrow">→</span>
            <span class="results__city">${data.destination}</span>
          </div>
        </div>

        <!-- Distance Card -->
        <div class="results__card results__card--distance">
          <div class="results__card-header">Distância</div>
          <div class="results__card-body">
            <div class="results__stat">
              <span class="results__value" style="color: #0891b2;">${this.formatNumber(data.distance, 1)}</span>
              <span class="results__label">km</span>
            </div>
          </div>
        </div>

        <!-- Emission Card -->
        <div class="results__card results__card--emission">
          <div class="results__card-header">Emissão de CO₂</div>
          <div class="results__card-body">
            <div class="results__stat">
              <span class="results__value" style="color: #dc2626; font-weight: 700; font-size: 2rem;">
                🍃 ${this.formatNumber(data.emission, 2)}
              </span>
              <span class="results__label">kg CO₂</span>
            </div>
          </div>
        </div>

        <!-- Transport Mode Card -->
        <div class="results__card results__card--mode">
          <div class="results__card-header">Modo de Transporte</div>
          <div class="results__card-body">
            <div class="results__mode" style="color: ${modeInfo.color};">
              <span class="results__mode-icon" style="font-size: 2.5rem;">${modeInfo.icon}</span>
              <span class="results__mode-label">${modeInfo.label}</span>
            </div>
          </div>
        </div>

        ${savingsHTML}
      </div>
    `;
  },

  /**
   * Render comparison of all transport modes with emission analysis
   * 
   * HTML structure:
   * - Grid of comparison items, one per transport mode
   * - Each item shows mode icon, emission, percentage vs car
   * - Color-coded progress bar indicating emission intensity
   * - Selected mode highlighted with badge
   * - Tip box with helpful recommendation
   * 
   * @param {Array<Object>} modeArray - Array of mode objects from Calculator.calculateAllModes()
   * @param {string} selectedMode - Key of currently selected transport mode
   * @returns {string} HTML string for comparison section
   */
  renderComparison: function(modeArray, selectedMode) {
    // Find max emission for progress bar scaling
    const maxEmission = Math.max(...modeArray.map(m => m.emission));
    
    // Determine bar color based on percentage of max
    const getBarColor = (emission) => {
      const percentage = (emission / maxEmission) * 100;
      if (percentage <= 25) return '#10b981';      // Green
      if (percentage <= 75) return '#f59e0b';      // Yellow/Amber
      if (percentage <= 100) return '#f97316';     // Orange
      return '#ef4444';                             // Red
    };

    // Build comparison items HTML
    const itemsHTML = modeArray.map(mode => {
      const isSelected = mode.mode === selectedMode;
      const barColor = getBarColor(mode.emission);
      const barWidth = (mode.emission / maxEmission) * 100;

      return `
        <div class="comparison__item ${isSelected ? 'comparison__item--selected' : ''}">
          <div class="comparison__header">
            <div class="comparison__mode">
              <span class="comparison__icon">${mode.icon}</span>
              <span class="comparison__label">${mode.label}</span>
            </div>
            ${isSelected ? '<span class="comparison__badge">✓ Selecionado</span>' : ''}
          </div>

          <div class="comparison__stats">
            <div class="comparison__stat">
              <span class="comparison__value">${this.formatNumber(mode.emission, 2)}</span>
              <span class="comparison__unit">kg CO₂</span>
            </div>
            <div class="comparison__stat">
              <span class="comparison__value">${this.formatNumber(mode.percentageVsCar, 1)}</span>
              <span class="comparison__unit">% vs carro</span>
            </div>
          </div>

          <div class="comparison__bar-container">
            <div class="comparison__bar" style="
              width: ${barWidth}%;
              background-color: ${barColor};
              height: 8px;
              border-radius: 4px;
              transition: width 0.3s ease;
            "></div>
          </div>
        </div>
      `;
    }).join('');

    // Get recommendation based on lowest emission mode
    const bestMode = modeArray[0]; // First item is lowest emission (sorted in Calculator)
    const tipMessage = bestMode.mode === 'bicycle'
      ? '🚲 Bicicleta é a opção mais sustentável! Zero emissões de CO₂.'
      : bestMode.mode === 'bus'
      ? '🚌 Usar ônibus é uma ótima opção! Compartilhar transporte reduz emissões por pessoa.'
      : '⚠️ Considere usar transporte público ou bicicleta para reduzir emissões.';

    return `
      <div class="comparison__container">
        <div class="comparison__grid">
          ${itemsHTML}
        </div>

        <div class="comparison__tip" style="
          background-color: #f0fdf4;
          border-left: 4px solid #10b981;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-top: 1.5rem;
        ">
          <p style="color: #1f2937; font-size: 0.95rem;">
            <strong>💡 Dica:</strong> ${tipMessage}
          </p>
        </div>
      </div>
    `;
  },

  /**
   * Render carbon credits information and estimated offset price
   * 
   * HTML structure:
   * - Credits needed card (large prominent number)
   * - Estimated market price card (min-max range with average)
   * - Info box explaining what carbon credits are
   * - Call-to-action button for compensation (demo/non-functional)
   * 
   * @param {Object} creditsData - Object containing:
   *   - credits: number (amount of carbon credits)
   *   - price: Object { min, max, average } (in BRL)
   * @returns {string} HTML string for carbon credits section
   */
  renderCarbonoCredits: function(creditsData) {
    return `
      <div class="carbon-credits__container">
        <div class="carbon-credits__grid">
          <!-- Credits Card -->
          <div class="carbon-credits__card">
            <div class="carbon-credits__card-header">Créditos de Carbono Necessários</div>
            <div class="carbon-credits__card-body">
              <div class="carbon-credits__main-value">
                ${this.formatNumber(creditsData.credits, 4)}
              </div>
              <p class="carbon-credits__helper">
                1 crédito = 1.000 kg CO₂
              </p>
            </div>
          </div>

          <!-- Price Card -->
          <div class="carbon-credits__card">
            <div class="carbon-credits__card-header">Valor Estimado de Compensação</div>
            <div class="carbon-credits__card-body">
              <div class="carbon-credits__main-value" style="color: #059669;">
                ${this.formatCurrency(creditsData.price.average)}
              </div>
              <p class="carbon-credits__range">
                Variação: ${this.formatCurrency(creditsData.price.min)} - ${this.formatCurrency(creditsData.price.max)}
              </p>
            </div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="carbon-credits__info" style="
          background-color: #f0f9ff;
          border-left: 4px solid #0891b2;
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin-top: 1.5rem;
        ">
          <h3 style="color: #0c4a6e; margin-bottom: 0.75rem; font-size: 1rem;">
            ❓ O que são Créditos de Carbono?
          </h3>
          <p style="color: #1f2937; font-size: 0.9rem; line-height: 1.6;">
            Créditos de carbono são certificados que representam a redução ou remoção de uma tonelada 
            (1.000 kg) de CO₂ equivalente da atmosfera. Você pode compensar as emissões do seu transporte 
            apoiando projetos de energia renovável, reflorestamento ou outras iniciativas sustentáveis.
          </p>
        </div>

        <!-- Call-to-Action Button -->
        <button class="carbon-credits__cta" style="
          width: 100%;
          padding: 1rem;
          background-color: #10b981;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1.5rem;
          transition: all 0.3s ease;
        " onmouseover="this.style.backgroundColor='#059669'" onmouseout="this.style.backgroundColor='#10b981'">
          🛒 Compensar Emissões
        </button>
      </div>
    `;
  },

  /**
   * Show loading state on submit button
   * 
   * - Saves original button text in data attribute
   * - Disables button
   * - Shows spinner animation with "Calculando..." text
   * 
   * @param {HTMLElement} buttonElement - The submit button element
   */
  showLoading: function(buttonElement) {
    // Save original text for restoration later
    buttonElement.dataset.originalText = buttonElement.textContent;

    // Disable button
    buttonElement.disabled = true;

    // Show spinner and loading text
    buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
  },

  /**
   * Hide loading state and restore button to normal
   * 
   * - Enables button
   * - Restores original text from data attribute
   * 
   * @param {HTMLElement} buttonElement - The submit button element
   */
  hideLoading: function(buttonElement) {
    // Enable button
    buttonElement.disabled = false;

    // Restore original text from saved data attribute
    buttonElement.textContent = buttonElement.dataset.originalText || 'Calcular Emissão';
  }
};
