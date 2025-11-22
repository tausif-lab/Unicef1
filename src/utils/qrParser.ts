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

  const normalized = qrText.trim().toUpperCase();
  return binMapping[normalized] || null;
};

export const getCategoryDisplayName = (category: string): string => {
  return category.replace('_', ' - ');
};