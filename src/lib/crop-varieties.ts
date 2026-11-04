export interface CropVarietyGroup {
  category: string;
  crops: string[];
  varieties: string[];
}

export const CROP_VARIETIES_BY_CATEGORY: CropVarietyGroup[] = [
  {
    category: 'Rose Varieties',
    crops: ['Rose'],
    varieties: [
      'Arka Savi',
      'Five Star',
      'Rubistar',
      'Vanish',
      'Yellow Gold',
      'Merabull',
      'Button Rose',
      'Dutch Rose',
    ],
  },
  {
    category: 'Chrysanthemum & Flower Varieties',
    crops: ['Chrysanthemum', 'Marigold', 'Flower crops'],
    varieties: [
      'Keerthi',
      'Arka Swarna',
      'CO-1',
      'CO-2',
      'Cent Yellow',
      'Local Commercial Hybrids',
    ],
  },
  {
    category: 'Grapes Varieties',
    crops: ['Grapes'],
    varieties: [
      'Bangalore Blue',
      'Dilkhush',
      'Anab-e-Shahi',
      'Sharad Seedless',
    ],
  },
  {
    category: 'Pomegranate Varieties',
    crops: ['Pomegranate'],
    varieties: [
      'Bhagwa',
      'Super bhagva',
      'Sollapur Lal',
    ],
  },
  {
    category: 'Tomato & Commercial Hybrid Varieties',
    crops: ['Tomato', 'Vegetable crops'],
    varieties: [
      'Abhinav',
      '618',
      'Arka Rakshak',
      'Other Commercial Hybrids',
    ],
  },
];

export const ALL_CROP_VARIETIES: string[] = CROP_VARIETIES_BY_CATEGORY.flatMap(
  (group) => group.varieties
);
