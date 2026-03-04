/**
 * data.js – StitchCraft shared data layer
 * All items stored in localStorage under key "stitchcraft_items"
 */

const DataService = (() => {
  const KEY = 'stitchcraft_items';

  const DEFAULT_ITEMS = [
    {
      id: 'item_001',
      name: 'Boho Crochet Handbag',
      category: 'Bags',
      price: 1299,
      description: 'Handcrafted boho-style crochet bag with wooden handles. Made from 100% cotton yarn in warm earth tones. Perfect for daily use or the beach.',
      moreInfo: 'This beautiful Boho Crochet Handbag is meticulously crafted over 15 hours using premium quality, soft 100% cotton yarn. The wooden handles are ethically sourced and polished for a comfortable grip. It features a spacious interior, perfect for carrying your daily essentials, a book, or even your current crochet project. The warm earth tones - beige, terracotta, and soft brown - make it a versatile accessory that complements any outfit. Dimensions: Approx 12" wide x 14" tall (excluding handles). Hand wash gently in cold water and lay flat to dry to maintain its shape and vibrant colors.',
      images: ['images/bag.png'],
      featured: true,
      badge: 'Best Seller'
    },
    {
      id: 'item_002',
      name: 'Granny Square Blanket',
      category: 'Home Decor',
      price: 2499,
      description: 'Cosy granny-square throw blanket in vibrant pastel and earth tones. Measures 120×150 cm. Great as a sofa throw, picnic blanket, or bedroom accent.',
      moreInfo: 'Wrap yourself in the nostalgia and warmth of our classic Granny Square Blanket. Each of the 48 individual squares is hand-crocheted with a unique mix of vibrant pastels and grounding earth tones, then seamlessly joined together. It is made from high-quality, durable acrylic yarn, making it both exceptionally soft and easy to care for (machine washable on a gentle cycle). Measuring 120 x 150 cm, it is the ideal size for snuggling on the sofa, adding a pop of color to the end of your bed, or taking along for a cozy picnic. A true heirloom piece that adds a touch of handmade charm to any room.',
      images: ['images/blanket.png'],
      featured: true,
      badge: 'New'
    },
    {
      id: 'item_003',
      name: 'Amigurumi Animal Set',
      category: 'Toys',
      price: 899,
      description: 'A set of adorable handmade amigurumi animals — bunny, bear, cat & dino — all crocheted in soft pastel yarn. Safe for children, makes the perfect gift.',
      moreInfo: 'Bring joy to a little one (or yourself!) with this charming set of four Amigurumi animals. The set includes a floppy-eared bunny, a cuddly bear, a playful cat, and a friendly dinosaur. Each animal is lovingly crocheted using ultra-soft, hypoallergenic baby yarn in soothing pastel shades. They are firmly stuffed with premium polyester fiberfill to hold their shape through years of hugs and play. The eyes are securely embroidered, ensuring they are completely safe for babies and toddlers with no small plastic parts. Average height per animal: 15-18 cm. A wonderful, heartfelt gift for baby showers, birthdays, or nursery decor.',
      images: ['images/amigurumi.png'],
      featured: true,
      badge: 'Fan Fav'
    },
    {
      id: 'item_004',
      name: 'Bucket Hat – Cream',
      category: 'Accessories',
      price: 699,
      description: 'Stylish handmade crochet bucket hat in cream white. Breathable and lightweight, perfect for summer. Fits most adult head sizes.',
      moreInfo: 'Elevate your summer style with this trendy, handmade crochet bucket hat. Designed in a timeless cream white, it pairs effortlessly with any outfit. The hat is crocheted using a breathable cotton-blend yarn, keeping your head cool and comfortable even on the hottest days. It features a slightly wavy brim that provides just the right amount of sun protection while maintaining a relaxed, casual look. The flexible design allows it to be easily folded and packed into your bag without losing its shape. Fits most standard adult head sizes (approx. 22-23 inch circumference). Hand wash and air dry recommended.',
      images: ['images/hat.png'],
      featured: false,
      badge: ''
    },
    {
      id: 'item_005',
      name: 'Crochet Flowers Bouquet',
      category: 'Home Decor',
      price: 549,
      description: 'A beautiful arrangement of handmade crochet flowers in assorted colours. Lasts forever unlike real flowers — the perfect everlasting gift.',
      moreInfo: 'Say it with flowers that never fade. This exquisite Crochet Flowers Bouquet is a stunning piece of lasting decor. The bouquet features an assortment of blooming roses, delicate daisies, and lush greenery, all painstakingly crocheted to capture the beauty of nature. The stems are reinforced with flexible wire, allowing you to arrange and bend them to cascade perfectly from your favorite vase. Unlike real flowers, these require no water or sunlight and will remain vibrant year after year. An unforgettable gift for anniversaries, Mother\'s Day, Valentine\'s Day, or just to brighten someone\'s desk.',
      images: ['images/hero.png'],
      featured: false,
      badge: 'Gift Idea'
    },
    {
      id: 'item_006',
      name: 'Mini Amigurumi Bunny',
      category: 'Toys',
      price: 449,
      description: 'A sweet little crochet bunny in soft pink yarn with a tiny bow. Approximately 12 cm tall. A lovely keepsake gift for kids and adults alike.',
      moreInfo: 'Meet your new pocket-sized companion! This miniature Amigurumi bunny is overflowing with cuteness. Crocheted in a delicate soft pink, it features long, floppy ears, a sweet embroidered face, and a tiny contrasting bow around its neck. Standing at approximately 12 cm tall, it is the perfect size to tuck into a gift basket, sit on a desk, or carry along on adventures. Made with super soft, baby-safe yarn and filled with squishy polyester stuffing. It’s hard to look at this little bunny without smiling!',
      images: ['images/amigurumi.png'],
      featured: false,
      badge: ''
    }
  ];

  // In-memory cache for synchronous category/featured rendering 
  // until we fetch the real data.
  let itemsCache = [];

  async function getAll() {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (!res.ok) throw new Error('Failed to fetch data');
      const items = await res.json();

      // Seed DEFAULT_ITEMS if DB is totally empty
      if (items.length === 0) {
        console.log('Database empty. Seeding defaults...');
        for (let item of DEFAULT_ITEMS) {
          await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        }
        return await getAll();
      }

      itemsCache = items;
      return items;
    } catch (err) {
      console.error(err);
      return DEFAULT_ITEMS;
    }
  }

  async function addItem(item) {
    const newItem = { ...item, id: 'item_' + Date.now() };
    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    return await res.json();
  }

  async function updateItem(id, data) {
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  }

  async function deleteItem(id) {
    await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
  }

  async function getById(id) {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  // Categories uses the local cache so UI doesn't have to await it explicitly 
  // if not needed, although it's safer to build categories AFTER getAll()
  function getCategories() {
    const cats = new Set(['Bags', 'Home Decor', 'Toys', 'Accessories', 'Clothing', 'Keychain', 'Bouquet']);
    itemsCache.forEach(i => cats.add(i.category));
    return Array.from(cats);
  }

  function getFeatured() {
    return itemsCache.filter(i => i.featured);
  }

  function getItems() {
    return itemsCache;
  }

  return { getAll, addItem, updateItem, deleteItem, getById, getCategories, getFeatured, getItems };
})();
