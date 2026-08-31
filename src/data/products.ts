export type Product = {
  id: string; name: string; description: string; category: string; price: number; discount: number; stock: number; rating: number; reviewCount: number; image: string; brand: string; tags: string[]; popularity: number; createdAt: string
  specs?: Record<string, string>; pros?: string[]; cons?: string[]; aiScore?: number
}

const day = (n: number) => new Date(Date.now() - n * 86400000).toISOString()
const product = (id:string, name:string, category:string, price:number, brand:string, tags:string[], rating:number, discount:number, stock:number, description:string, specs:Record<string,string>, popularity=80) => ({
  id, name, category, price, brand, tags, rating, discount, stock, description, specs,
  pros: [tags[0] ? `Optimized for ${tags[0]}` : 'Well-balanced performance', `${rating}/5 customer rating`, discount ? `${discount}% launch saving` : 'Reliable everyday value'],
  cons: ['Limited stock availability', 'Premium features may be more than casual users need'],
  aiScore: Math.min(99, Math.round(rating * 16 + discount / 3 + popularity / 10)), reviewCount: Math.round(rating * popularity), popularity, createdAt: day(35 - (popularity % 35)), image: productImages[id] ?? "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=800&q=85"
})
const productImages: Record<string, string> = {
  // Laptops
  "codebook-14":
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=85",

  "vertex-15":
    "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=85",

  "airlite-13":
    "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=800&q=85",

  // Headphones
  "aurora-x1":
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85",

  "pulse-gaming":
    "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=85",

  "echo-buds":
    "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=85",

  // Smartphones
  "nova-phone":
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85",

  "orbit-one":
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=85",

  "pixelmax-9":
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=85",

  // Watches
  "orbit-watch":
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",

  "stride-watch":
    "https://images.unsplash.com/photo-1546868871-7041f2a55e4f?auto=format&fit=crop&w=800&q=85",

  // Camera / Tablet
  "lens-cam":
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=85",

  "nova-tablet":
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=85",

  // Beauty
  "glow-serum":
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85",

  "velvet-lip":
    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=85",

  "calm-mist":
    "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=85",

  // Fashion
  "flow-linen":
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85",

  "cloud-runner":
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85",

  "solstice-tote":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85",

  "fable-jacket":
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=85",

  // Home
  "arc-lamp":
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85",

  "hearth-cookware":
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=85",

  "loom-throw":
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=85",

  "brew-press":
    "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=800&q=85",

  // Sports
  "peak-pack":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a45?auto=format&fit=crop&w=800&q=85",

  "stride-mat":
    "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=85",

  // Accessories
  "terra-bottle":
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85",

  "volt-kettle":
    "https://images.unsplash.com/photo-1594213114663-d94db9b171c0?auto=format&fit=crop&w=800&q=85",

  "field-journal":
    "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=85",

  // Gaming
  "mechanical-keyboard":
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=85",

  "quest-controller":
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=85",
};

export const seedProducts: Product[] = [
  product('codebook-14','CodeBook Pro 14 Laptop','Laptops',64999,'Zenith',['coding','laptop','performance'],4.8,12,19,'A developer-focused 14-inch laptop with fast multitasking, a vivid display, and all-day battery. ',{'Performance':'Intel Core Ultra 5','RAM':'16GB','Storage':'512GB SSD','Display':'14-inch 2.8K','Battery':'14 hours','Warranty':'1 year'},98),
  product('vertex-15','Vertex Gaming Laptop 15','Gaming',79999,'Apex',['gaming','laptop','graphics'],4.7,15,11,'High-refresh gaming laptop built for competitive play, streaming, and creative work.',{'Performance':'RTX 4060','RAM':'16GB','Storage':'1TB SSD','Display':'15.6-inch 144Hz','Battery':'7 hours','Warranty':'2 years'},94),
  product('airlite-13','AirLite 13 Student Laptop','Laptops',46999,'Nimbus',['laptop','student','portable'],4.5,18,30,'Lightweight everyday laptop for classes, browsing, note-taking, and remote work.',{'Performance':'Ryzen 5','RAM':'8GB','Storage':'512GB SSD','Display':'13.3-inch FHD','Battery':'16 hours','Warranty':'1 year'},86),
  product('aurora-x1','Aurora X1 ANC Headphones','Headphones',12999,'Sonora',['wireless','audio','travel','noise canceling'],4.8,20,18,'Immersive adaptive noise canceling, 40-hour battery life, and clear calls for focused work or travel.',{'Battery':'40 hours','Audio':'40mm drivers','Connectivity':'Bluetooth 5.3','Warranty':'1 year'},98),
  product('pulse-gaming','PulseForge Gaming Headset','Headphones',6999,'Forge',['gaming','headphones','microphone'],4.6,10,33,'Low-latency wireless gaming headset with spatial audio and a detachable boom mic.',{'Battery':'32 hours','Audio':'Spatial 7.1','Connectivity':'2.4GHz + Bluetooth','Warranty':'1 year'},89),
  product('echo-buds','Echo Buds Air','Headphones',3999,'Sonora',['wireless','earbuds','fitness'],4.4,25,47,'Pocketable true wireless earbuds with punchy sound and an IPX5 workout-ready design.',{'Battery':'30 hours','Audio':'10mm drivers','Connectivity':'Bluetooth 5.3','Warranty':'1 year'},84),
  product('nova-phone','Nova S12 5G','Smartphones',29999,'Nova',['smartphone','camera','5g'],4.7,14,26,'A fast 5G phone with an all-day battery, smooth display, and versatile 50MP camera.',{'Camera':'50MP OIS','RAM':'8GB','Storage':'256GB','Display':'6.7-inch AMOLED','Battery':'5000mAh','Warranty':'1 year'},95),
  product('orbit-one','Orbit One 5G','Smartphones',24999,'Orbit',['smartphone','value','5g'],4.5,16,38,'Best-value 5G smartphone with a clean Android experience and strong battery life.',{'Camera':'64MP','RAM':'8GB','Storage':'128GB','Display':'6.6-inch 120Hz','Battery':'5100mAh','Warranty':'1 year'},90),
  product('pixelmax-9','PixelMax 9 Pro','Smartphones',58999,'PixelMax',['smartphone','camera','premium'],4.9,8,9,'Premium camera-first smartphone with a bright LTPO display and flagship-grade performance.',{'Camera':'50MP triple camera','RAM':'12GB','Storage':'256GB','Display':'6.8-inch LTPO','Battery':'4900mAh','Warranty':'2 years'},97),
  product('orbit-watch','Orbit Pro Smartwatch','Watches',15999,'Orbit',['wearable','fitness','gps','health'],4.7,12,24,'A lightweight health and fitness smartwatch with GPS, sleep insights, and a brilliant display.',{'Battery':'10 days','Display':'AMOLED','GPS':'Built in','Warranty':'1 year'},93),
  product('stride-watch','Stride Active Watch','Watches',7999,'Stride',['watch','fitness','running'],4.5,22,42,'Durable GPS running watch with workout coaching and recovery tracking.',{'Battery':'12 days','Display':'1.43-inch','GPS':'Built in','Warranty':'1 year'},82),
  product('lens-cam','LensCraft Mirrorless Camera','Electronics',74999,'LensCraft',['camera','photography','creator'],4.9,15,7,'24MP mirrorless camera with compact body, fast autofocus, and a versatile kit lens.',{'Camera':'24MP APS-C','Video':'4K 60fps','Battery':'480 shots','Warranty':'2 years'},90),
  product('nova-tablet','NovaSketch Creative Tablet','Electronics',34999,'Nova',['tablet','drawing','creator'],4.6,10,17,'Precision drawing tablet with textured display and an included pressure-sensitive stylus.',{'Display':'10.9-inch 2K','Storage':'256GB','Battery':'12 hours','Warranty':'1 year'},85),
  product('glow-serum','Glow Barrier Renewal Serum','Beauty',1499,'Mira Skin',['skincare','serum','hydration'],4.9,15,54,'Peptide and ceramide serum that supports a hydrated, radiant skin barrier.',{'Volume':'30ml','Skin type':'All skin types','Key ingredients':'Ceramides + peptides'},99),
  product('velvet-lip','Velvet Tint Lip Set','Beauty',999,'Luma',['makeup','lipstick','gift'],4.6,20,27,'Four buildable, long-wear shades with a comfortable satin finish.',{'Shades':'4','Finish':'Satin','Wear':'8 hours'},78),
  product('calm-mist','Calm Cloud Facial Mist','Beauty',799,'Mira Skin',['skincare','mist','sensitive'],4.5,10,67,'Refreshing botanical facial mist with aloe and niacinamide for midday hydration.',{'Volume':'100ml','Skin type':'Sensitive','Key ingredients':'Aloe + niacinamide'},67),
  product('flow-linen','Flow Linen Overshirt','Fashion',2499,'Northline',['men','linen','summer','casual'],4.6,25,31,'Breathable relaxed-fit linen cotton overshirt for effortless layering.',{'Material':'Linen cotton','Fit':'Relaxed','Care':'Machine wash'},81),
  product('cloud-runner','CloudRunner Sneakers','Fashion',5499,'AeroStep',['shoes','running','unisex','comfort'],4.7,18,42,'Responsive foam cushioning and breathable knit upper designed for everyday miles.',{'Material':'Knit mesh','Cushioning':'Responsive foam','Warranty':'6 months'},95),
  product('solstice-tote','Solstice Leather Tote','Fashion',6999,'Cove & Clay',['bag','leather','work','women'],4.8,10,12,'Structured leather tote with a padded laptop sleeve and magnetic closure.',{'Material':'Vegetable-tanned leather','Capacity':'16L','Warranty':'1 year'},86),
  product('fable-jacket','Fable Quilted Jacket','Fashion',4999,'Northline',['jacket','outerwear','recycled'],4.5,0,16,'Water-repellent quilted jacket with recycled insulation for cool commutes.',{'Material':'Recycled polyester','Fit':'Regular','Care':'Machine wash'},74),
  product('arc-lamp','Arc Table Lamp','Home',3999,'Haven House',['lighting','decor','living room'],4.7,22,13,'Dimmable sculptural lamp with a warm LED glow and brushed metal base.',{'Light':'Dimmable LED','Power':'12W','Warranty':'1 year'},84),
  product('hearth-cookware','Hearth Ceramic Cookware Set','Home',8999,'Hearth',['kitchen','cookware','ceramic'],4.8,18,8,'Nonstick ceramic cookware set with stay-cool handles and oven-safe construction.',{'Pieces':'7','Material':'Ceramic-coated aluminum','Warranty':'2 years'},92),
  product('loom-throw','Loom Woven Throw Blanket','Home',1999,'Haven House',['blanket','decor','cozy'],4.6,10,35,'Soft recycled-cotton throw with a textured fringe edge for sofa or bedside layering.',{'Material':'Recycled cotton','Size':'130 x 170cm','Care':'Machine wash'},72),
  product('brew-press','BrewPress Cold Brew Maker','Home',1299,'Hearth',['coffee','kitchen','cold brew'],4.5,20,41,'Easy-clean glass cold brew maker that produces smooth coffee concentrate overnight.',{'Capacity':'1L','Material':'Borosilicate glass','Warranty':'6 months'},70),
  product('peak-pack','PeakTrail Hiking Daypack','Sports',4499,'PeakTrail',['hiking','outdoor','backpack'],4.8,15,21,'24-litre weatherproof daypack with ventilated back panel and hydration sleeve.',{'Capacity':'24L','Material':'Ripstop nylon','Warranty':'1 year'},88),
  product('stride-mat','Stride Cork Yoga Mat','Sports',2199,'Stride',['yoga','fitness','eco'],4.7,0,28,'Naturally grippy cork surface over supportive rubber for studio sessions and home flow.',{'Thickness':'5mm','Material':'Cork + rubber','Warranty':'6 months'},76),
  product('terra-bottle','Terra Insulated Bottle','Accessories',1299,'PeakTrail',['hydration','outdoor','fitness'],4.7,10,79,'Double-wall stainless bottle keeps drinks cold for 24 hours or hot for 12.',{'Capacity':'750ml','Material':'Steel','Insulation':'24h cold'},89),
  product('volt-kettle','VoltGo Travel Kettle','Accessories',1899,'VoltGo',['travel','kitchen','coffee'],4.4,12,25,'Compact stainless steel kettle with dual-voltage support for tea and coffee anywhere.',{'Capacity':'500ml','Power':'600W','Warranty':'1 year'},65),
  product('field-journal','Field Notes Leather Journal','Accessories',899,'Paperlane',['journal','stationery','gift'],4.8,0,48,'Hand-bound dot-grid journal in soft leather with two ribbon markers and lay-flat pages.',{'Pages':'240','Paper':'100gsm','Cover':'Leather'},80),
  product('mechanical-keyboard','KeyForge Mechanical Keyboard','Gaming',5999,'Forge',['gaming','keyboard','coding'],4.7,17,22,'Hot-swappable mechanical keyboard with tactile switches and per-key RGB lighting.',{'Switches':'Tactile','Connection':'USB-C + Bluetooth','Battery':'70 hours','Warranty':'1 year'},91),
  product('quest-controller','Quest Wireless Controller','Gaming',3499,'Apex',['gaming','controller','wireless'],4.5,13,36,'Comfortable wireless controller with responsive triggers and multi-platform compatibility.',{'Connection':'Bluetooth + 2.4GHz','Battery':'35 hours','Warranty':'1 year'},79)
]
