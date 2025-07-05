function normalize(value, min, max) {
  if (min === max) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function calculateScores(userPrefs = {}, neighborhoods = []) {
  // Default to 0.5 if sliders not provided
  const { 
    safety = 0.5, 
    amenities = 0.5, 
    cost = 0.5,
    transit = 0.5 // New optional parameter
  } = userPrefs;

  if (!neighborhoods.length) return [];

  // Calculate dynamic weights based on slider positions
  const totalWeight = safety + amenities + cost + transit;
  const weights = {
    safety: safety / totalWeight * 0.4,
    amenities: amenities / totalWeight * 0.35,
    cost: cost / totalWeight * 0.25,
    transit: transit / totalWeight * 0.2
  };

  // Get all metric ranges
  const metrics = {
    crimeRates: neighborhoods.map(n => n.crimeRate),
    amenities: neighborhoods.map(n => n.amenities),
    priceIndices: neighborhoods.map(n => n.priceIndex),
    transitScores: neighborhoods.map(n => n.transitScore || 50) // Default if missing
  };

  // Calculate bounds with fallbacks
  const bounds = {
    crime: {
      min: Math.min(...metrics.crimeRates),
      max: Math.max(...metrics.crimeRates)
    },
    amenities: {
      min: 0,
      max: Math.max(1, ...metrics.amenities) // Ensure never 0
    },
    price: {
      min: Math.min(...metrics.priceIndices),
      max: Math.max(...metrics.priceIndices)
    },
    transit: {
      min: Math.min(...metrics.transitScores),
      max: Math.max(...metrics.transitScores)
    }
  };

  return neighborhoods.map(hood => {
    // Calculate normalized scores (0-1)
    const scores = {
      safety: 1 - normalize(hood.crimeRate, bounds.crime.min, bounds.crime.max),
      amenities: normalize(hood.amenities, bounds.amenities.min, bounds.amenities.max),
      affordability: 1 - normalize(hood.priceIndex, bounds.price.min, bounds.price.max),
      transit: normalize(hood.transitScore || 50, bounds.transit.min, bounds.transit.max)
    };

    // Apply exponential sensitivity to slider values
    const sliderImpact = {
      safety: Math.pow(safety, 3),
      amenities: Math.pow(amenities, 2),
      cost: Math.pow(cost, 3),
      transit: Math.pow(transit, 2)
    };

    // Calculate weighted composite score
    const compositeScore = (
      scores.safety * sliderImpact.safety * weights.safety +
      scores.amenities * sliderImpact.amenities * weights.amenities +
      scores.affordability * sliderImpact.cost * weights.cost +
      scores.transit * sliderImpact.transit * weights.transit
    ) * 100; // Convert to percentage

    return {
      ...hood,
      matchScore: Math.round(compositeScore),
      scoreDetails: { // For debugging
        safety: Math.round(scores.safety * 100),
        amenities: Math.round(scores.amenities * 100),
        affordability: Math.round(scores.affordability * 100),
        transit: Math.round(scores.transit * 100),
        weights: weights
      }
    };
  })
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 5); // Return top 5 matches
}

module.exports = { calculateScores };