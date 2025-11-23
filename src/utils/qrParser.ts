export const parseBinCategory = (qrText: string): string | null => {
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

