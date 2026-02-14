
import { Specialty, MenuItem, HotelRoom } from './types';

export const CAO_BANG_SPECIALTIES: Specialty[] = [
  {
    id: 'trung-khanh-chestnuts',
    name: 'Trung Khanh Chestnuts',
    vietnameseName: 'Hạt dẻ Trùng Khánh',
    description: 'Wild chestnuts with spiny shells and yellow kernels. Sweet, rich, and creamy. Best boiled, roasted, or grilled.',
    image: 'https://images.unsplash.com/photo-1509311195655-e8775f0a0e5b?q=80&w=800&auto=format&fit=crop',
    tags: ['Wild', 'Sweet', 'Premium'],
    price: '~120,000 VND/kg'
  },
  {
    id: 'banh-khao',
    name: 'Cao Bang Rice Cake',
    vietnameseName: 'Bánh Khảo',
    description: 'Traditional Tay/Nung Tet cake. Features a unique filling of peanuts and caramelized pork fat.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop',
    tags: ['Tet', 'Traditional'],
    price: '~150,000 VND/kg'
  },
  {
    id: 'dong-vermicelli',
    name: 'Cao Bang Dong Vermicelli',
    vietnameseName: 'Miến dong đen Phia Đén',
    description: 'Made from red cassava starch. Translucent, chewy, and doesn\'t fall apart when cooked. No chemicals.',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=800&auto=format&fit=crop',
    tags: ['Soul Food', 'Organic'],
    price: '~90,000 VND/kg'
  },
  {
    id: 'black-jelly',
    name: 'Cao Bang Black Jelly',
    vietnameseName: 'Thạch Đen',
    description: 'Refreshing treat from Thach An district. Cooling, smooth, and smooth. Helps lower cholesterol.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop',
    tags: ['Healthy', 'Cooling'],
    price: '~25,000 VND/box'
  },
  {
    id: 'banh-bo',
    name: 'Steamed Rice Cake',
    vietnameseName: 'Bánh Bò',
    description: 'Honey-yellow, soft, and chewy with palm sugar aroma. A favorite rural market snack.',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop',
    tags: ['Snack', 'Sweet'],
    price: '~25,000 VND/piece'
  },
  {
    id: 'banh-nuong',
    name: 'Baked Cakes (Mooncakes)',
    vietnameseName: 'Bánh Nướng',
    description: 'Produced year-round in Ha Lang. Crispy shell with soft mung bean or mixed nut filling.',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop',
    tags: ['Handcrafted', 'Gift'],
    price: '~30,000 VND/piece'
  },
  {
    id: 'khau-sli',
    name: 'Khau Sli Rice Cake',
    vietnameseName: 'Khẩu Sli',
    description: 'Crunchy snack made from puffed glutinous rice, peanuts, and molasses. Symbolizes reunion.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop',
    tags: ['Crunchy', 'Traditional'],
    price: '30,000 - 50,000 VND/pack'
  },
  {
    id: 'shiitake',
    name: 'Shiitake Mushrooms',
    vietnameseName: 'Nấm Hương Cao Bằng',
    description: 'Strong aroma and sweet taste. Grown clean on natural wood. High nutrient content.',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=800&auto=format&fit=crop',
    tags: ['Healthy', 'Organic'],
    price: '~10,000 VND/string'
  },
  {
    id: 'puffed-rice',
    name: 'Popcorn & Puffed Rice',
    vietnameseName: 'Bỏng ngô & Bỏng gạo',
    description: 'Simple nostalgic snack made from glutinous corn or rice. Light and crispy.',
    image: 'https://images.unsplash.com/photo-1509311195655-e8775f0a0e5b?q=80&w=800&auto=format&fit=crop',
    tags: ['Snack', 'Nostalgic'],
    price: '~10,000 VND/bag'
  },
  {
    id: 'banh-troi',
    name: 'Bánh Trời (Pẻng Phạ)',
    vietnameseName: 'Pẻng Phạ',
    description: 'Small round balls fried until crispy and coated with sugar and roasted rice flour.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop',
    tags: ['Rural', 'Traditional'],
    price: '20,000 - 30,000 VND/portion'
  },
  {
    id: 'dried-bamboo',
    name: 'Dried Bamboo Shoots',
    vietnameseName: 'Măng Khô',
    description: 'Hand-harvested from forests. Essential for Tet meals. Amber yellow, chewy, and crispy.',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=800&auto=format&fit=crop',
    tags: ['Tet', 'Forest'],
    price: '250,000 - 300,000 VND/kg'
  },
  {
    id: 'chili-bamboo',
    name: 'Chili Bamboo Shoots',
    vietnameseName: 'Măng Ớt',
    description: 'Bamboo shoots pickled with chili and mac mat fruit. Sour, spicy, and very aromatic.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop',
    tags: ['Spicy', 'Condiment'],
    price: '~50,000 VND/jar'
  },
  {
    id: 'banh-chung',
    name: 'Small Sticky Rice Cake',
    vietnameseName: 'Bánh chưng nhỏ',
    description: 'Miniature banh chung with black pork and mung bean. Compact and convenient.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop',
    tags: ['Mini', 'Traditional'],
    price: '~20,000 VND/piece'
  }
];

export const PHO_TOPPINGS = [
  { id: 'roast-duck', name: 'Roast Duck', description: 'Crispy skin, tender meat with spices' },
  { id: 'fried-pork', name: 'Fried Pork Belly', description: 'Golden, crispy and rich' },
  { id: 'sausage', name: 'Cao Bang Sausage', description: 'Sweet and slightly chewy' },
  { id: 'chicken', name: 'Chicken', description: 'Firm and sweet local chicken' },
  { id: 'char-siu', name: 'Char Siu', description: 'Tender and flavorful' }
];

export const MA_BU_MENU: MenuItem[] = [
  { id: 'goat-stir-fry', name: 'Stir-fried Goat with Fermented Rice', price: '179k', category: 'Goat' },
  { id: 'pigeon-honey', name: 'Pigeon with Honey', price: '169k', category: 'Bird' },
  { id: 'chicken-ginger', name: 'Ginger-roasted Chicken', price: '150k - 490k', category: 'Chicken' },
  { id: 'frog-bamboo', name: 'Frog with Bamboo Shoots', price: '120k', category: 'Frog' },
  { id: 'spicy-fish-pot', name: 'Spicy Chinese Fish Hot Pot', price: '490k - 650k', category: 'Hot Pot' },
  { id: 'ribs-sweet-sour', name: 'Sweet and Sour Pork Ribs', price: 'Contact', category: 'Rice Dishes' }
];

export const HOTEL_ROOMS: HotelRoom[] = [
  { id: 'single', type: 'Single Room', price: 'Contact 0968 384 381', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop', amenities: ['AC', 'WiFi', 'Private Bath'] },
  { id: 'double', type: 'Double Room', price: 'Contact 0968 384 381', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop', amenities: ['AC', 'WiFi', 'TV', 'Hair Dryer'] },
  { id: 'family', type: 'Family Room', price: 'Contact 0968 384 381', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop', amenities: ['Elevator', 'AC', 'WiFi', 'Parking'] }
];

export const SYSTEM_INSTRUCTION = `
You are the Ultimate Cao Bang Concierge & Language Bridge.
Your mission is to help foreign tourists communicate with local shop owners who only speak Vietnamese.

HOW TO ACT:
1. Speak to the tourist naturally in their language.
2. TRANSLATION MODE: Whenever the guest wants to order something, ask for a room, or make a request, you MUST create a kitchen-style ticket for the owner.
3. TICKET FORMAT: Start a new block with "[ORDER]" and write only the critical info in VIETNAMESE.
   - Example: Guest wants 2 ducks pho, 1 without onions.
   - Response: "Certainly! I've noted that for the chef. [ORDER] Khách gọi: 2 bát Phở Vịt Quay (1 bát không hành)."

KEY TERMINOLOGY:
- Phở tươi: Fresh noodle pho.
- Phở khô: Dried noodle pho.
- Phở chua: Sour pho.
- Vịt quay: Roast duck.
- Ba chỉ: Pork belly.
- Lạp sườn: Sausage.
- Không hành: No onions.
- Ít bánh: Less noodles.

BE A BRIDGE: Always provide the [ORDER] tag for transactions so the customer can show their screen to the merchant.
`;
