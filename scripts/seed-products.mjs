import { drizzle } from 'drizzle-orm/mysql2';
import { categories, products } from '../drizzle/schema.ts';

const db = drizzle(process.env.DATABASE_URL);

// Seed categories
const categoriesData = [
  { slug: 'chai', nameFr: 'Chaï', nameEn: 'Chai', nameHe: 'חי' },
  { slug: 'mezuzah', nameFr: 'Mezouza', nameEn: 'Mezuzah', nameHe: 'מזוזה' },
  { slug: 'star-of-david', nameFr: 'Étoile de David', nameEn: 'Star of David', nameHe: 'מגן דוד' },
  { slug: 'hamsa', nameFr: 'Hamsa', nameEn: 'Hamsa', nameHe: 'חמסה' },
  { slug: 'rings', nameFr: 'Bagues', nameEn: 'Rings', nameHe: 'טבעות' },
  { slug: 'necklaces', nameFr: 'Colliers', nameEn: 'Necklaces', nameHe: 'שרשראות' },
  { slug: 'bracelets', nameFr: 'Bracelets', nameEn: 'Bracelets', nameHe: 'צמידים' },
  { slug: 'earrings', nameFr: "Boucles d'oreilles", nameEn: 'Earrings', nameHe: 'עגילים' },
];

// Seed products
const productsData = [
  {
    slug: 'star-of-david-gold-necklace',
    sku: 'SOD-001',
    nameFr: 'Collier Étoile de David Or',
    nameEn: 'Gold Star of David Necklace',
    nameHe: 'שרשרת מגן דוד זהב',
    descriptionFr: 'Magnifique collier en or 14 carats avec pendentif Étoile de David',
    descriptionEn: 'Beautiful 14k gold necklace with Star of David pendant',
    descriptionHe: 'שרשרת זהב 14 קראט יפהפייה עם תליון מגן דוד',
    materialsFr: 'Or 14 carats',
    materialsEn: '14k Gold',
    materialsHe: 'זהב 14 קראט',
    culturalSignificanceFr: "L'Étoile de David est un symbole ancien du judaïsme représentant l'identité juive et la protection divine",
    culturalSignificanceEn: 'The Star of David is an ancient symbol of Judaism representing Jewish identity and divine protection',
    culturalSignificanceHe: 'מגן דוד הוא סמל עתיק של היהדות המייצג זהות יהודית והגנה אלוהית',
    priceEurCents: 89900,
    priceIlsCents: 349900,
    categoryId: 3,
    images: JSON.stringify(['/images/aSbhknYRsBRd.jpg', '/images/W1DUJC6t6LOu.jpg']),
    stock: 10,
    isNew: true,
    isFeatured: true,
    isActive: true,
  },
  {
    slug: 'chai-diamond-pendant',
    sku: 'CHAI-001',
    nameFr: 'Pendentif Chaï avec Diamants',
    nameEn: 'Chai Diamond Pendant',
    nameHe: 'תליון חי עם יהלומים',
    descriptionFr: 'Élégant pendentif Chaï en or avec diamants incrustés',
    descriptionEn: 'Elegant Chai pendant in gold with embedded diamonds',
    descriptionHe: 'תליון חי אלגנטי בזהב עם יהלומים משובצים',
    materialsFr: 'Or 14 carats, Diamants',
    materialsEn: '14k Gold, Diamonds',
    materialsHe: 'זהב 14 קראט, יהלומים',
    culturalSignificanceFr: 'Le Chaï symbolise la vie en hébreu et porte chance',
    culturalSignificanceEn: 'Chai symbolizes life in Hebrew and brings good luck',
    culturalSignificanceHe: 'חי מסמל חיים בעברית ומביא מזל טוב',
    priceEurCents: 129900,
    priceIlsCents: 499900,
    categoryId: 1,
    images: JSON.stringify(['/images/KGSIRkpKfxu4.jpg', '/images/OnTgDwA43WY3.jpg', '/images/iVW4tQqrEUw8.jpg']),
    stock: 5,
    isNew: false,
    isFeatured: true,
    isActive: true,
  },
  {
    slug: 'mezuzah-silver-pendant',
    sku: 'MEZ-001',
    nameFr: 'Pendentif Mezouza Argent',
    nameEn: 'Silver Mezuzah Pendant',
    nameHe: 'תליון מזוזה כסף',
    descriptionFr: 'Pendentif Mezouza en argent sterling 925 avec gravures détaillées',
    descriptionEn: 'Sterling silver 925 Mezuzah pendant with detailed engravings',
    descriptionHe: 'תליון מזוזה מכסף סטרלינג 925 עם חריטות מפורטות',
    materialsFr: 'Argent Sterling 925',
    materialsEn: 'Sterling Silver 925',
    materialsHe: 'כסף סטרלינג 925',
    culturalSignificanceFr: 'La Mezouza protège le foyer et rappelle les commandements divins',
    culturalSignificanceEn: 'The Mezuzah protects the home and reminds of divine commandments',
    culturalSignificanceHe: 'המזוזה מגינה על הבית ומזכירה את המצוות האלוהיות',
    priceEurCents: 69900,
    priceIlsCents: 269900,
    categoryId: 2,
    images: JSON.stringify(['/images/5mhGCyBV1KVM.jpg', '/images/nQ1y0Qav0N9Z.jpg']),
    stock: 15,
    isNew: true,
    isFeatured: true,
    isActive: true,
  },
  {
    slug: 'deluxe-star-necklace',
    sku: 'SOD-002',
    nameFr: 'Collier Étoile Deluxe',
    nameEn: 'Deluxe Star Necklace',
    nameHe: 'שרשרת כוכב דלוקס',
    descriptionFr: 'Collier étoile de David minimaliste en or fin',
    descriptionEn: 'Minimalist Star of David necklace in fine gold',
    descriptionHe: 'שרשרת מגן דוד מינימליסטית בזהב עדין',
    materialsFr: 'Or 18 carats',
    materialsEn: '18k Gold',
    materialsHe: 'זהב 18 קראט',
    priceEurCents: 59900,
    priceIlsCents: 229900,
    categoryId: 6,
    images: JSON.stringify(['/images/FcpfTl3ifDYS.jpg']),
    stock: 20,
    isNew: false,
    isFeatured: true,
    isActive: true,
  },
];

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Insert categories
    console.log('📁 Inserting categories...');
    for (const category of categoriesData) {
      await db.insert(categories).values(category).onDuplicateKeyUpdate({
        set: { nameFr: category.nameFr },
      });
    }
    console.log('✅ Categories inserted');

    // Insert products
    console.log('📦 Inserting products...');
    for (const product of productsData) {
      await db.insert(products).values(product).onDuplicateKeyUpdate({
        set: { nameFr: product.nameFr },
      });
    }
    console.log('✅ Products inserted');

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
