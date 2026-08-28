/** Static option lists & mock content for the Catalyst prototype. */

export const identityOptions = [
  'Alaskan Native',
  'American Indian',
  'Black',
  'Indian',
  'Latinx / Hispanic',
  'Pacific Islander',
  'South Asian',
  'White',
  'Prefer not to say',
];

export const styleOptions = [
  { key: 'oldschool', label: 'Old school' },
  { key: 'quirky', label: 'Quirky' },
  { key: 'retro', label: 'Retro' },
  { key: 'basics', label: 'Basics Gal' },
  { key: 'street', label: 'Streetwear' },
  { key: 'minimal', label: 'Minimalist' },
];

export const thriftingGoals = [
  'Find one of a kind vintage pieces',
  'Find a costume',
  'Sell my clothes',
  'Meet thrifty people',
  'Rent my clothes',
];

export const sizeOptions = {
  tops: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  outerwear: ['XS', 'S', 'M', 'L', 'XL'],
  pants: ['24', '26', '28', '30', '32', '34'],
  shoes: ['5', '6', '7', '8', '9', '10', '11'],
};

export const brands = [
  'Zara',
  'Levi’s',
  'Ba&sh',
  'Reformation',
  'Nike',
  'Ganni',
  'Aritzia',
  'Madewell',
  'COS',
  'Everlane',
  'Patagonia',
  'Uniqlo',
];

export const itemCategories = [
  'Tops',
  'Blouses',
  'Dresses',
  'Pants',
  'Sweaters',
  'Coats / Jackets',
  'Shoes',
  'Bags',
  'Accessories',
];

export const itemConditions = ['New with tags', 'Like new', 'Gently used', 'Well loved'];
export const itemColors = ['Black', 'White', 'Beige', 'Blue', 'Green', 'Red', 'Pink', 'Brown'];
export const itemMaterials = ['Cotton', 'Wool', 'Denim', 'Silk', 'Linen', 'Leather', 'Polyester'];

export interface Thrifter {
  handle: string;
  bio: string;
  match: number;
}

export const thrifters: Thrifter[] = [
  { handle: '@beautybymonamary', bio: 'makeup & skincare • licensed cosmetologist', match: 92 },
  { handle: '@vintagevaultsf', bio: 'curated 90s denim & tees', match: 88 },
  { handle: '@thriftwithtara', bio: 'sustainable style • she/her', match: 81 },
  { handle: '@retro.rosa', bio: 'one-of-a-kind finds daily', match: 76 },
  { handle: '@coastalcloset', bio: 'linen • neutrals • slow fashion', match: 64 },
];

export const channels = [
  { name: '#vintagedenim', desc: 'All things worn-in blue jeans & jackets' },
  { name: '#sustainablestyle', desc: 'Slow fashion tips & swaps' },
  { name: '#sneakerheads', desc: 'Rare kicks, trades & fits' },
  { name: '#beautybuffs', desc: 'Makeup, skincare & self-care' },
  { name: '#sfthrifters', desc: 'Local meetups in the Bay Area' },
];

export interface ClosetItem {
  id: string;
  brand: string;
  name: string;
  price: number;
  size: string;
  category: string;
  color?: string;
  condition?: string;
  material?: string;
  tags?: string[];
  forRent?: boolean;
}

export const closetItems: ClosetItem[] = [
  { id: '1', brand: 'Ba&sh', name: 'Vintage Fall Coat', price: 75, size: 'S', category: 'Coats / Jackets', color: 'Brown', condition: 'Gently used', material: 'Wool', tags: ['Vintage', 'Cozy', 'Fall'] },
  { id: '2', brand: 'Levi’s', name: '501 Cropped Jean', price: 42, size: '27', category: 'Pants', color: 'Blue', condition: 'Like new', material: 'Denim', tags: ['Denim', '90s'] },
  { id: '3', brand: 'Reformation', name: 'Floral Baby Tee', price: 28, size: 'S', category: 'Blouses', color: 'Pink', condition: 'Like new', material: 'Cotton', tags: ['Y2K', 'Cute'] },
  { id: '4', brand: 'COS', name: 'Boxy Grey Tee', price: 18, size: 'M', category: 'Tops', color: 'Grey', condition: 'Gently used', material: 'Cotton', tags: ['Basics'] },
  { id: '5', brand: 'Ganni', name: 'Ruffle Midi Dress', price: 95, size: 'M', category: 'Dresses', color: 'Green', condition: 'New with tags', material: 'Silk', tags: ['Party', 'Statement'] },
  { id: '6', brand: 'Aritzia', name: 'Wool Blend Blazer', price: 60, size: 'S', category: 'Coats / Jackets', color: 'Beige', condition: 'Like new', material: 'Wool', tags: ['Workwear'] },
  { id: '7', brand: 'Madewell', name: 'Linen Shirt Dress', price: 48, size: 'S', category: 'Dresses', color: 'White', condition: 'Gently used', material: 'Linen', tags: ['Summer'], forRent: true },
  { id: '8', brand: 'Nike', name: 'Vintage Windbreaker', price: 35, size: 'L', category: 'Coats / Jackets', color: 'Blue', condition: 'Well loved', material: 'Polyester', tags: ['Sporty'], forRent: true },
];

export interface Order {
  id: string;
  brand: string;
  product: string;
  amount: number;
  date: string;
  status: string;
  orderNo: string;
  counterparty: string;
}

export const sales: Order[] = [
  { id: 's1', brand: 'Ba&sh', product: 'Vintage Fall Coat', amount: 120, date: 'Jan 12, 2022', status: 'Completed', orderNo: '4SGTJF5453', counterparty: 'Talkingheads@96' },
  { id: 's2', brand: 'Levi’s', product: '501 Cropped Jean', amount: 65, date: 'Jan 12, 2022', status: 'In-progress', orderNo: 'TBD678TGC', counterparty: 'Dancingtulip@26' },
];

export const purchases: Order[] = [
  { id: 'p1', brand: 'Ganni', product: 'Ruffle Midi Dress', amount: 36, date: 'Jan 12, 2022', status: 'Shipped', orderNo: '4SGTJF5453', counterparty: 'zaracastillo@26' },
  { id: 'p2', brand: 'Aritzia', product: 'Wool Blend Blazer', amount: 65, date: 'Jan 12, 2022', status: 'Processing', orderNo: 'TBD', counterparty: 'maincharacter_45' },
];

export interface Trade {
  id: string;
  give: string;
  giveBrand: string;
  get: string;
  getBrand: string;
  date: string;
  status: string;
  orderNo: string;
  with: string;
}

export const trades: Trade[] = [
  { id: 't1', give: 'Boxy Grey Tee', giveBrand: 'COS', get: 'Floral Baby Tee', getBrand: 'Reformation', date: 'Jan 12, 2022', status: 'Completed', orderNo: '4SGTJF5453', with: 'zaracastillo@26' },
];

export const cities = ['San Francisco, CA', 'New York, NY', 'Los Angeles, CA', 'Austin, TX', 'Chicago, IL'];
export const regions = ['United States', 'Canada', 'United Kingdom', 'Australia'];
export const states = ['California', 'New York', 'Texas', 'Illinois', 'Washington'];
