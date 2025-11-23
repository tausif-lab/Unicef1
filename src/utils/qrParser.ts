/*export const parseBinCategory = (qrText: string): string | null => {
  const binMapping: Record<string, string> = {
    'PET_BIN': 'Plastic_PET',
    'FLEXIBLE_BIN': 'Plastic_Flexible',
    'RIGID_BIN': 'Plastic_Rigid',
    'CUTLERY_BIN': 'Plastic_Cutlery',
    'METAL_BIN': 'Metal',
    'PAPER_BIN': 'Paper',
    'GLASS_BIN': 'Glass',
    'ORGANIC_BIN': 'Organic'
  };

  // Clean the QR text - remove whitespace, newlines, and convert to uppercase
  const normalized = qrText.trim().toUpperCase().replace(/[\n\r\s]/g, '');
  
  // Try direct match first
  if (binMapping[normalized]) {
    return binMapping[normalized];
  }
  
  // If QR contains a URL, try to extract the bin name from it
  if (normalized.includes('HTTP') || normalized.includes('WWW')) {
    // Try to find bin name in URL
    for (const binName of Object.keys(binMapping)) {
      if (normalized.includes(binName)) {
        return binMapping[binName];
      }
    }
  }
  
  // Try partial matching (if QR text contains the bin name anywhere)
  for (const [binName, category] of Object.entries(binMapping)) {
    if (normalized.includes(binName)) {
      return category;
    }
  }
  
  // Log for debugging
  console.log('QR Text received:', qrText);
  console.log('Normalized:', normalized);
  
  return null;
};

export const getCategoryDisplayName = (category: string): string => {
  return category.replace(/_/g, ' - '); // Changed to replace ALL underscores
};
*/

// Normalize and clean QR text for comparison
const normalizeText = (text: string): string => {
  return text
    .trim()                    // Remove leading/trailing whitespace
    .toUpperCase()             // Convert to uppercase
    .replace(/[\s\n\r\t]+/g, '') // Remove ALL whitespace including newlines
    .replace(/[^\w]/g, '');    // Remove special characters except underscore
};

export const parseBinCategory = (qrText: string): string | null => {
  const binMapping: Record<string, string> = {
    'PETBIN': 'Plastic_PET',
    'FLEXIBLEBIN': 'Plastic_Flexible',
    'RIGIDBIN': 'Plastic_Rigid',
    'CUTLERYBIN': 'Plastic_Cutlery',
    'METALBIN': 'Metal',
    'PAPERBIN': 'Paper',
    'GLASSBIN': 'Glass',
    'ORGANICBIN': 'Organic'
  };

  // Normalize the incoming QR text
  const normalized = normalizeText(qrText);
  
  console.log('========== QR PARSER DEBUG ==========');
  console.log('Raw QR text:', qrText);
  console.log('Normalized:', normalized);
  console.log('Length:', normalized.length);
  
  // Direct match after normalization
  if (binMapping[normalized]) {
    console.log('✓ Direct match found:', binMapping[normalized]);
    console.log('========== END PARSER DEBUG ==========');
    return binMapping[normalized];
  }
  
  // Partial matching - check if normalized text contains any bin name
  for (const [binName, category] of Object.entries(binMapping)) {
    if (normalized.includes(binName) || binName.includes(normalized)) {
      console.log('✓ Partial match found:', category);
      console.log('========== END PARSER DEBUG ==========');
      return category;
    }
  }
  
  // Try fuzzy matching for common variations
  const fuzzyMap: Record<string, string> = {
    'PET': 'Plastic_PET',
    'FLEXIBLE': 'Plastic_Flexible',
    'RIGID': 'Plastic_Rigid',
    'CUTLERY': 'Plastic_Cutlery',
    'METAL': 'Metal',
    'PAPER': 'Paper',
    'GLASS': 'Glass',
    'ORGANIC': 'Organic'
  };
  
  for (const [keyword, category] of Object.entries(fuzzyMap)) {
    if (normalized.includes(keyword)) {
      console.log('✓ Fuzzy match found:', category);
      console.log('========== END PARSER DEBUG ==========');
      return category;
    }
  }
  
  console.log('✗ No match found');
  console.log('Available bins:', Object.keys(binMapping));
  console.log('========== END PARSER DEBUG ==========');
  
  return null;
};

export const getCategoryDisplayName = (category: string): string => {
  return category.replace(/_/g, ' - ');
};
