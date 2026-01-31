/**
 * RoutesDB - Database of Brazilian Routes
 * 
 * This module provides a collection of popular Brazilian routes with distances
 * and utility methods to query and manage route data.
 * 
 * Structure:
 * - routes: Array of route objects with origin, destination, and distanceKm
 * - Methods for finding distances and retrieving unique cities
 */

const RoutesDB = {
  /**
   * Array of route objects containing popular Brazilian routes
   * Each route has:
   * - origin: City name with state abbreviation (e.g., "São Paulo, SP")
   * - destination: City name with state abbreviation
   * - distanceKm: Actual distance in kilometers between cities
   */
  routes: [
    // Southeast Region - Major Capitals
    { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },
    { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },
    { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1148 },
    { origin: "Belo Horizonte, MG", destination: "Rio de Janeiro, RJ", distanceKm: 515 },
    { origin: "Belo Horizonte, MG", destination: "São Paulo, SP", distanceKm: 585 },
    { origin: "Belo Horizonte, MG", destination: "Brasília, DF", distanceKm: 738 },

    // Southeast Region - Regional Routes
    { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },
    { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 72 },
    { origin: "São Paulo, SP", destination: "Sorocaba, SP", distanceKm: 108 },
    { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },
    { origin: "Rio de Janeiro, RJ", destination: "Petrópolis, RJ", distanceKm: 68 },
    { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKm: 100 },
    { origin: "Belo Horizonte, MG", destination: "Betim, MG", distanceKm: 35 },
    { origin: "Campinas, SP", destination: "Ribeirão Preto, SP", distanceKm: 250 },

    // South Region - Major Routes
    { origin: "Curitiba, PR", destination: "São Paulo, SP", distanceKm: 408 },
    { origin: "Curitiba, PR", destination: "Rio de Janeiro, RJ", distanceKm: 835 },
    { origin: "Curitiba, PR", destination: "Porto Alegre, RS", distanceKm: 815 },
    { origin: "Porto Alegre, RS", destination: "Brasília, DF", distanceKm: 1825 },
    { origin: "Florianópolis, SC", destination: "Curitiba, PR", distanceKm: 505 },
    { origin: "Florianópolis, SC", destination: "Porto Alegre, RS", distanceKm: 685 },

    // Northeast Region - Major Routes
    { origin: "Salvador, BA", destination: "Brasília, DF", distanceKm: 1535 },
    { origin: "Salvador, BA", destination: "Recife, PE", distanceKm: 840 },
    { origin: "Salvador, BA", destination: "São Paulo, SP", distanceKm: 1938 },
    { origin: "Recife, PE", destination: "Fortaleza, CE", distanceKm: 785 },
    { origin: "Fortaleza, CE", destination: "Brasília, DF", distanceKm: 2149 },
    { origin: "Salvador, BA", destination: "Feira de Santana, BA", distanceKm: 109 },
    { origin: "Recife, PE", destination: "Caruaru, PE", distanceKm: 135 },

    // North Region - Major Routes
    { origin: "Manaus, AM", destination: "Brasília, DF", distanceKm: 2820 },
    { origin: "Manaus, AM", destination: "Belém, PA", distanceKm: 1800 },
    { origin: "Belém, PA", destination: "Brasília, DF", distanceKm: 2144 },
    { origin: "Palmas, TO", destination: "Brasília, DF", distanceKm: 970 },
    { origin: "Manaus, AM", destination: "Rio de Janeiro, RJ", distanceKm: 3220 },

    // Center-West Region - Regional Routes
    { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 209 },
    { origin: "Brasília, DF", destination: "Cuiabá, MT", distanceKm: 990 },
    { origin: "Goiânia, GO", destination: "Brasília, DF", distanceKm: 209 },
    { origin: "Campo Grande, MS", destination: "Brasília, DF", distanceKm: 1255 },

    // Cross-Region Connections
    { origin: "Curitiba, PR", destination: "Belo Horizonte, MG", distanceKm: 820 },
    { origin: "Porto Alegre, RS", destination: "Rio de Janeiro, RJ", distanceKm: 1460 },
    { origin: "Salvador, BA", destination: "Brasília, DF", distanceKm: 1535 },
    { origin: "Fortaleza, CE", destination: "Rio de Janeiro, RJ", distanceKm: 2761 },
  ],

  /**
   * Get all unique city names from the routes database
   * @returns {Array<string>} Sorted array of unique city names with states
   */
  getAllCities: function() {
    const cities = new Set();
    
    // Extract all cities from both origin and destination
    this.routes.forEach(route => {
      cities.add(route.origin);
      cities.add(route.destination);
    });
    
    // Convert to array and sort alphabetically
    return Array.from(cities).sort();
  },

  /**
   * Find the distance between two cities
   * Searches in both directions (A→B and B→A)
   * @param {string} origin - Origin city name (case-insensitive, whitespace-trimmed)
   * @param {string} destination - Destination city name (case-insensitive, whitespace-trimmed)
   * @returns {number|null} Distance in kilometers if found, null if route doesn't exist
   */
  findDistance: function(origin, destination) {
    // Normalize inputs: trim whitespace and convert to lowercase
    const normalizedOrigin = origin.trim().toLowerCase();
    const normalizedDestination = destination.trim().toLowerCase();
    
    // Search for the route in both directions
    const route = this.routes.find(r => 
      (r.origin.toLowerCase() === normalizedOrigin && r.destination.toLowerCase() === normalizedDestination) ||
      (r.origin.toLowerCase() === normalizedDestination && r.destination.toLowerCase() === normalizedOrigin)
    );
    
    // Return distance if found, null otherwise
    return route ? route.distanceKm : null;
  }
};
