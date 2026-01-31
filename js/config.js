/**
 * CONFIG - Global Configuration Object
 * 
 * Contains emission factors, transport mode metadata, carbon credit settings,
 * and initialization methods for the CO2 calculator application.
 */

const CONFIG = {
  /**
   * Emission factors in kg CO2 per kilometer
   * Based on average emissions for each transport mode in Brazil
   */
  EMISSION_FACTORS: {
    bicycle: 0,           // Zero emissions
    car: 0.12,            // Car: ~120g CO2/km
    bus: 0.089,           // Bus: ~89g CO2/km (shared transport)
    truck: 0.96           // Truck: ~960g CO2/km
  },

  /**
   * Transport mode metadata for UI display and categorization
   * Each mode includes label, icon, and brand color
   */
  TRANSPORT_MODES: {
    bicycle: {
      label: "Bicicleta",
      icon: "🚲",
      color: "#3b82f6"    // Blue
    },
    car: {
      label: "Carro",
      icon: "🚗",
      color: "#ef4444"    // Red
    },
    bus: {
      label: "Ônibus",
      icon: "🚌",
      color: "#f59e0b"    // Amber
    },
    truck: {
      label: "Caminhão",
      icon: "🚚",
      color: "#6366f1"    // Indigo
    }
  },

  /**
   * Carbon credit configuration
   * Used for calculating carbon offset information
   */
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,      // 1 credit = 1000 kg CO2
    PRICE_MIN_BRL: 50,         // Minimum price in Brazilian Reals
    PRICE_MAX_BRL: 150         // Maximum price in Brazilian Reals
  },

  /**
   * Populate the cities datalist from RoutesDB
   * Creates option elements for autocomplete functionality
   */
  populateDatalist: function() {
    // Get the datalist element
    const datalist = document.getElementById('cities-list');
    
    if (!datalist) {
      console.error('Datalist element with id "cities-list" not found');
      return;
    }

    // Clear existing options
    datalist.innerHTML = '';

    // Get all unique cities from RoutesDB
    const cities = RoutesDB.getAllCities();

    // Create and append option elements for each city
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      datalist.appendChild(option);
    });

    console.log(`Datalist populated with ${cities.length} cities`);
  },

  /**
   * Setup automatic distance autofill based on origin and destination
   * Listens for changes in origin/destination inputs and manual-distance checkbox
   */
  setupDistanceAutofill: function() {
    // Get form elements
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    const distanceInput = document.getElementById('distance');
    const manualDistanceCheckbox = document.getElementById('manual-distance');
    const helperText = document.querySelector('.calculadora__helper');

    if (!originInput || !destinationInput || !distanceInput || !manualDistanceCheckbox || !helperText) {
      console.error('Required form elements for distance autofill not found');
      return;
    }

    /**
     * Internal function to attempt automatic distance population
     */
    const attemptAutofill = () => {
      const origin = originInput.value.trim();
      const destination = destinationInput.value.trim();

      // Only proceed if both fields are filled
      if (!origin || !destination) {
        distanceInput.value = '';
        distanceInput.readOnly = true;
        helperText.textContent = 'A distância será preenchida automaticamente';
        helperText.style.color = '#6b7280'; // Reset to gray
        return;
      }

      // Try to find distance in RoutesDB
      const distance = RoutesDB.findDistance(origin, destination);

      if (distance !== null) {
        // Distance found - populate and make readonly
        distanceInput.value = distance;
        distanceInput.readOnly = true;
        helperText.textContent = '✓ Distância encontrada automaticamente';
        helperText.style.color = '#10b981'; // Green for success
      } else {
        // Distance not found - clear and offer manual entry
        distanceInput.value = '';
        distanceInput.readOnly = true;
        helperText.textContent = '⚠ Rota não encontrada. Marque "inserir distância manualmente" para prosseguir';
        helperText.style.color = '#f59e0b'; // Amber for warning
      }
    };

    /**
     * Handler for origin/destination input changes
     */
    const handleLocationChange = () => {
      // If manual distance is NOT checked, attempt autofill
      if (!manualDistanceCheckbox.checked) {
        attemptAutofill();
      }
    };

    /**
     * Handler for manual distance checkbox change
     */
    const handleManualDistanceToggle = () => {
      if (manualDistanceCheckbox.checked) {
        // Enable manual entry
        distanceInput.readOnly = false;
        distanceInput.value = '';
        helperText.textContent = 'Digite a distância manualmente em quilômetros';
        helperText.style.color = '#6b7280'; // Reset to gray
        distanceInput.focus();
      } else {
        // Attempt autofill when unchecked
        attemptAutofill();
      }
    };

    // Add event listeners
    originInput.addEventListener('change', handleLocationChange);
    destinationInput.addEventListener('change', handleLocationChange);
    manualDistanceCheckbox.addEventListener('change', handleManualDistanceToggle);

    console.log('Distance autofill setup complete');
  }
};
