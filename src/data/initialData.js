// Initial curated beauty catalog and configuration tailored for Chiclayo & Peru
export const INITIAL_PRODUCTS = [
  {
    id: "prod-001",
    name: "Sérum Iluminador Niacinamida 10% + Zinc",
    subtitle: "Piel radiante y poros minimizados",
    category: "Skincare",
    keywords: ["niacinamida", "zinc", "manchas", "poros", "acne", "oleo", "grasa", "brillo", "iluminador", "skincare", "suero", "antimanchas"],
    price: 36.90,
    originalPrice: 45.00,
    memberDiscountPercent: 15, // 15% de descuento solo para usuarios registrados
    stock: 24,
    isBestseller: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 42,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Fórmula sedosa ultra ligera diseñada para climas cálidos como el norte peruano. Equilibra la producción de sebo, atenúa manchas post-acné y aporta un brillo saludable natural sin sensación grasa.",
    benefits: [
      "Control de brillo durante todo el día",
      "Textura aqua-gel de rápida absorción",
      "Ideal para clima de Chiclayo y costa norte",
      "Sin alcohol ni fragancias sintéticas"
    ],
    volume: "30 ml",
    sizes: [
      { name: "30 ml", price: 36.90, stock: 24 },
      { name: "50 ml", price: 49.90, stock: 12 }
    ],
    usage: "Aplicar 3 a 4 gotas sobre el rostro limpio antes de la crema hidratante, mañana y noche."
  },
  {
    id: "prod-002",
    name: "Lip Peptide Glaze - Aceite Labial Nutritivo",
    subtitle: "Efecto espejo con péptidos voluminizadores",
    category: "Labios",
    keywords: ["labios", "lip", "gloss", "peptidos", "volumen", "hidratacion", "brillo labial", "aceite labial", "karite", "boca", "reparador"],
    price: 24.50,
    originalPrice: 32.00,
    memberDiscountPercent: 10, // 10% de descuento solo para usuarios registrados
    stock: 18,
    isBestseller: true,
    isNew: false,
    rating: 5.0,
    reviewsCount: 68,
    shades: [
      { name: "01 Rosé Nude", hex: "#D98E82" },
      { name: "02 Berry Velvet", hex: "#9E3D48" },
      { name: "03 Peach Glaze", hex: "#E89B7B" }
    ],
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Tratamiento hidratante con acabado ultra brillante sin ser pegajoso. Formulado con péptidos y manteca de karité para unos labios visiblemente más rellenos y suaves.",
    benefits: [
      "Acabado glass-skin reflectante",
      "Hidratación continua por 12 horas",
      "Aroma suave a vainilla y frutos rojos",
      "No se pega al cabello"
    ],
    volume: "10 ml",
    usage: "Desliza sobre los labios desnudos para un toque fresco o sobre tu labial favorito para dimensión extra."
  },
  {
    id: "prod-003",
    name: "Bálsamo Limpiador Calmante con Flor de Camelia",
    subtitle: "Doble limpieza sin irritación",
    category: "Skincare",
    keywords: ["balsamo", "desmaquillante", "doble limpieza", "camelia", "centella", "limpieza facial", "sensible", "cleanser", "maquillaje"],
    price: 42.00,
    originalPrice: 52.00,
    stock: 15,
    isBestseller: false,
    isNew: true,
    rating: 4.8,
    reviewsCount: 29,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Transforma su textura de bálsamo untuoso a leche ligera al contacto con el agua. Remueve maquillaje a prueba de agua y protector solar sin dejar residuos ni ardor en los ojos.",
    benefits: [
      "Doble limpieza suave para todo tipo de piel",
      "Extracto botánico de flor de camelia y centella asiática",
      "Apto para ojos sensibles y piel reactiva"
    ],
    volume: "80 g",
    usage: "Masajea una pequeña cantidad sobre piel seca y aclara con agua tibia."
  },
  {
    id: "prod-004",
    name: "Tinte Velvet Multiuso Mejillas & Labios",
    subtitle: "Rubor natural efecto segunda piel",
    category: "Rostro",
    keywords: ["rubor", "blush", "tinte", "labial", "mejillas", "color", "velvet", "mate", "maquillaje", "terracota", "social"],
    price: 28.00,
    originalPrice: 35.00,
    stock: 22,
    isBestseller: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 54,
    shades: [
      { name: "Petal Dust", hex: "#C76D6D" },
      { name: "Terracotta Chiclayo", hex: "#BD5741" },
      { name: "Mauve Sunset", hex: "#8A4958" }
    ],
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Fórmula de acabado semimate difuminable con los dedos. Aporta un rubor saludable que dura todo el día, resiste el sudor y no reseca la piel.",
    benefits: [
      "Pigmentación construible modulable",
      "Textura soufflé aterciopelada",
      "2 en 1: sirve como rubor y tinte labial"
    ],
    volume: "6.5 g",
    usage: "Aplica dos puntitos en las mejillas y difumina con toques suaves usando las yemas de tus dedos."
  },
  {
    id: "prod-005",
    name: "Protector Solar Invisible Aqua Gel SPF 50+ PA++++",
    subtitle: "Toque seco y cero rastro blanco",
    category: "Protección Solar",
    keywords: ["bloqueador", "protector solar", "fps", "spf", "sol", "verano", "aqua gel", "toque seco", "uv", "playa", "invisible"],
    price: 39.90,
    originalPrice: 49.00,
    memberDiscountPercent: 20, // 20% de descuento solo para usuarios registrados
    stock: 30,
    isBestseller: true,
    isNew: true,
    rating: 5.0,
    reviewsCount: 88,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "El imprescindible para el sol de Chiclayo y la costa. Filtros fotosensibles modernos con sensación ultraligera como agua. No comedogénico, no pica los ojos y es perfecto antes del maquillaje.",
    benefits: [
      "FPS 50+ con protección UVA/UVB de amplio espectro",
      "Resistente a la humedad y calor del norte",
      "Terminación mate sedosa",
      "Reef safe y sin parabenos"
    ],
    volume: "50 ml",
    sizes: [
      { name: "50 ml", price: 39.90, stock: 30 },
      { name: "100 ml (Maxi)", price: 68.00, stock: 15 }
    ],
    usage: "Aplica dos líneas sobre tus dedos y distribuye uniformemente 15 minutos antes de la exposición solar."
  },
  {
    id: "prod-006",
    name: "Mini Rodillo & Guasha Cuarzo Rosa Natural",
    subtitle: "Drenaje linfático y masaje facial relajante",
    category: "Accesorios",
    keywords: ["guasha", "gua sha", "rodillo", "roller", "cuarzo", "cuarzo rosa", "masaje facial", "antiedad", "lifting", "ojeras", "drenaje"],
    price: 29.90,
    originalPrice: 39.00,
    memberDiscountPercent: 25, // 25% de descuento solo para usuarios registrados
    stock: 12,
    isBestseller: false,
    isNew: false,
    rating: 4.7,
    reviewsCount: 19,
    images: [
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Piedra de cuarzo rosa 100% auténtica pulida a mano. Estimula la circulación, desinflama ojeras por la mañana y favorece la absorción profunda de tus aceites y sérums.",
    benefits: [
      "Sensación fría calmante inmediata",
      "Esculpe contornos de mandíbula y pómulos",
      "Incluye bolsita protectora de terciopelo"
    ],
    volume: "Set 2 piezas",
    usage: "Guárdalo en la nevera 10 minutos antes de usar para un efecto lifting descongestionante."
  },
  {
    id: "prod-007",
    name: "Máscara de Pestañas Longitud Tubing Resistente",
    subtitle: "Alargamiento extremo que se retira solo con agua tibia",
    category: "Ojos",
    keywords: ["rimel", "mascara", "pestanas", "tubing", "alargador", "waterproof", "ojos", "mirada", "volumen", "pestañol"],
    price: 32.00,
    originalPrice: 40.00,
    stock: 16,
    isBestseller: false,
    isNew: true,
    rating: 4.8,
    reviewsCount: 23,
    images: [
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Tecnología tubular japonesa que envuelve cada pestaña en micro-polímeros individuales. No mancha, no se corre con el calor ni genera ojos de panda, y se desmaquilla suavemente sin dañar tus pestañas.",
    benefits: [
      "Cero manchas ni grumos",
      "Cepillo cónico de precisión para pestañas inferiores",
      "Fórmula enriquecida con provitamina B5"
    ],
    volume: "8 ml",
    usage: "Aplica en zigzag desde la raíz hacia las puntas para máxima definición."
  },
  {
    id: "prod-008",
    name: "Bruma Hidratante de Rosas Silvestres & Ácido Hialurónico",
    subtitle: "Fijador de maquillaje y frescura instantánea",
    category: "Skincare",
    keywords: ["bruma", "mist", "rosas", "tonico", "fijador", "acido hialuronico", "hidratante", "frescura", "glow", "spray facial"],
    price: 26.90,
    originalPrice: 34.00,
    stock: 20,
    isBestseller: false,
    isNew: false,
    rating: 4.9,
    reviewsCount: 31,
    images: [
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Rocío microfino que revitaliza la piel apagada a cualquier hora del día. Fija el maquillaje evitando que se cuartee y devuelve la jugosidad natural con un exquisito aroma botánico.",
    benefits: [
      "Atomizador de dispersión en nube ultra suave",
      "Hidrata y calma tras la exposición al sol",
      "Tamaño ideal para cartera o bolso de mano"
    ],
    volume: "100 ml",
    usage: "Rocía a 20 cm del rostro con los ojos cerrados antes o después del maquillaje."
  }
];

export const INITIAL_SERVICES = [
  {
    id: "srv-001",
    name: "Balayage Signature & Morena Iluminada",
    category: "Colorimetría",
    duration: "3 - 4 horas",
    priceFrom: 180.00,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    description: "Técnica francesa personalizada con degradé sutil y esfumado de raíz. Logra luminosidad multidimensional que no requiere retoques mensuales frecuentes.",
    includes: ["Diagnóstico capilar previo", "Decoloración protectora plex", "Matización tonal personalizada", "Brushing de ondas glam"]
  },
  {
    id: "srv-002",
    name: "Alisado Orgánico & Bótox Reconstructor",
    category: "Tratamientos",
    duration: "2.5 - 3 horas",
    priceFrom: 140.00,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    description: "Fórmula libre de formol con aminoácidos y aceite de argán. Elimina 100% el frizz rebelde causado por la humedad costera, aportando brillo espejo.",
    includes: ["Lavado purificante", "Sellado térmico sellador", "Mascarilla de nutrición profunda", "Corte de puntas secas"]
  },
  {
    id: "srv-003",
    name: "Maquillaje Social & Novia Glam",
    category: "Make Up",
    duration: "1.5 horas",
    priceFrom: 95.00,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    description: "Técnica de piel blindada a prueba de calor y sudor. Realce de mirada con pestañas punto a punto y labios terciopelo de larga duración.",
    includes: ["Preparación facial con skincare de alta gama", "Pestañas postizas premium", "Sellado fijador 18 horas"]
  },
  {
    id: "srv-004",
    name: "Peinado de Fiesta & Ondas al Agua",
    category: "Peinados",
    duration: "1 hora",
    priceFrom: 70.00,
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80",
    description: "Recogidos bohemios, semirecogidos románticos u ondas estilo Hollywood estructuradas y resistentes a la brisa de la costa.",
    includes: ["Texturizado capilar", "Fijación flexible sin efecto acartonado", "Colocación de accesorios o tocados"]
  },
  {
    id: "srv-005",
    name: "Manicure Rusa & Soft Gel / Acrílicas",
    category: "Uñas & Spa",
    duration: "1.5 - 2 horas",
    priceFrom: 65.00,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
    description: "Limpieza profunda de cutículas con torno para un acabado milimétrico y duradero de más de 25 días. Diseños nail art elegantes y minimalistas.",
    includes: ["Esmaltado en gel premium", "Exfoliación hidratante con aceites esenciales", "Masaje relajante de manos"]
  },
  {
    id: "srv-006",
    name: "Terapia Capilar Hidra-Shock con Ácido Hialurónico",
    category: "Tratamientos",
    duration: "1 hora",
    priceFrom: 75.00,
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=800&q=80",
    description: "Inyección de hidratación y colágeno para hebras resecas por el sol y la sal marina. Devuelve la elasticidad y movimiento al instante.",
    includes: ["Vapor ozonizado", "Cauterización molecular", "Secado y finalizado modelado"]
  }
];

export const INITIAL_COMPARISON_CASES = [
  {
    id: 'balayage',
    title: 'Balayage Miel & Morena Iluminada',
    serviceCategory: 'Colorimetría de Alta Gama',
    duration: '3.5 a 4.5 horas',
    beforeLabel: 'Antes: Tono plano y sin luz',
    beforeDesc: 'Base castaña apagada, desgaste solar disparejo y falta de luminosidad.',
    afterLabel: 'Después: Luz y movimiento',
    afterDesc: 'Degradé tridimensional en tono caramelo miel, brillo gloss y nutrición con Plex.',
    beforeImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
    stat: '100% Sin maltratar la fibra'
  },
  {
    id: 'alisado',
    title: 'Alisado Orgánico Cero Formol',
    serviceCategory: 'Tratamiento Disciplinante',
    duration: '2.5 a 3.5 horas',
    beforeLabel: 'Antes: Frizz y ondas rebeldes',
    beforeDesc: 'Volumen incontrolable por la humedad, ondas quebradizas y sin caída.',
    afterLabel: 'Después: Lacio espejo impecable',
    afterDesc: 'Efecto seda ultra lacio, hebras selladas y resistencia total a la humedad.',
    beforeImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    stat: 'Durabilidad de 4 a 6 meses'
  },
  {
    id: 'botox',
    title: 'Bótox Capilar & Reestructuración',
    serviceCategory: 'Terapia Intensiva',
    duration: '1.5 a 2 horas',
    beforeLabel: 'Antes: Puntas abiertas y opacidad',
    beforeDesc: 'Cabello desvitalizado por calor excesivo, textura áspera y pérdida de queratina.',
    afterLabel: 'Después: Blindaje gloss y suavidad',
    afterDesc: 'Cutículas completamente compactadas, reflejos de luz de alto impacto y tacto aterciopelado.',
    beforeImage: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80',
    stat: 'Recuperación capilar visible'
  }
];

export const INITIAL_SETTINGS = {
  storeName: "Salón & Estilo",
  brandSubtitle: "Salón de Belleza Miluska Vidaurre",
  tagline: "Un espacio íntimo y exclusivo en Chiclayo. Especialistas en colorimetría personalizada, transformaciones balayage, alisados orgánicos libres de formol y maquillaje social.",
  logoUrl: "", // Optional custom logo image URL, fallback to elegant monogram
  logoShape: "square", // 'square' | 'circle'
  adminPassword: "salon&estilo2620",
  originCity: "Chiclayo",
  originRegion: "Chiclayo, Lambayeque - Perú",
  salonAddress: "Chiclayo & Pimentel",
  whatsappContact: "51920731163",
  yapePhone: "920 731 163",
  yapeOwner: "Miluska Vidaurre - Salón & Estilo",
  yapeQrImage: "",
  facebookUrl: "https://www.facebook.com/miluskavidaurresalon",
  tiktokUrl: "https://www.tiktok.com/@miluskavidaurre",
  instagramUrl: "https://www.instagram.com/miluskavidaurre/",
  youtubeUrl: "https://www.youtube.com/@miluskavidaurre",
  mercadopagoEnabled: true,
  mercadopagoMode: "production", // 'production' | 'sandbox'
  mercadopagoEnvironment: "production",
  mercadopagoProdPublicKey: "APP_USR-13a221c8-9c7d-4951-b6f9-2117ad9c0fe2",
  mercadopagoProdAccessToken: "APP_USR-8245507252071832-100820-761e878046dc5e1f91d0a8a4d24dbbfb-3748175215",
  mercadopagoSandboxPublicKey: "APP_USR-c8761713-be48-461d-90a7-49e87b9248b0",
  mercadopagoSandboxAccessToken: "APP_USR-1698660474440895-100820-343f7ab0d40bb94c7a5aa68e730cbe91-3751350252",

  productsBannerText: "📦 ENVÍOS A NIVEL NACIONAL (Shalom a todo el Perú) • Express < 2h en Chiclayo y alrededores • Citas Salón: 920 731 163",
  shippingOptions: [
    {
      id: "salon_pickup",
      title: "Retiro en Salón de Belleza (Gratis)",
      price: 0.00,
      deliveryTime: "Inmediato en horario de atención",
      description: "Visítanos en nuestro salón y recoge tu pedido sin costo de envío",
      badge: "S/ 0.00"
    },
    {
      id: "chiclayo_express",
      title: "Express Chiclayo & Alrededores (< 2 horas)",
      price: 6.00,
      deliveryTime: "Menos de 2 horas",
      description: "Chiclayo Centro, Santa Victoria, La Victoria, JLO y balnearios",
      badge: "Express VIP"
    },
    {
      id: "shalom_peru",
      title: "Shalom Agencia (Nacional)",
      price: 9.00,
      deliveryTime: "24 a 48 horas",
      description: "Recojo seguro en cualquier agencia Shalom de tu ciudad",
      badge: "Económico"
    }
  ],
  memberDiscountBenefitText: "Promociones y descuentos exclusivos en productos seleccionados",

  // 9. SECCIÓN DESTACADA: SALUD CAPILAR & HONESTIDAD PROFESIONAL
  healthSectionTag: "Salud Capilar & Honestidad Profesional",
  healthSectionTitle: "Tu cabello es único: consulta siempre con los expertos",
  healthSectionDescription: "Cada fibra tiene una historia y resistencia diferente. Realizamos un diagnóstico presencial y test de mecha personalizado antes de cualquier cambio para garantizar tu seguridad y un acabado impecable.",
  healthSectionBadge1: "Test de mecha sin costo",
  healthSectionBadge2: "Atención personalizada 1 a 1",
  healthSectionButtonText: "Consultar con los Expertos en WhatsApp",
  healthSectionWhatsappMsg: "Hola Miluska, deseo consultar con los expertos de Salón&Estilo para un diagnóstico y asesoría de mi cabello.",
  healthSectionImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=700&q=80",
  healthSectionImageAspect: "auto",
  healthSectionImageZoom: 100,
  healthSectionImagePos: "center",
  healthSectionAuthor: "Miluska Vidaurre • Estilista Principal",
  healthSectionQuote: "«La belleza real comienza cuidando tu salud capilar».",

  // APRENDE CONMIGO - ÁREA DE CAPACITACIONES & EDUCACIÓN
  academyEnabled: true,
  academyHeroTag: "Aprende Conmigo • Capacitación Especializada",
  academyHeroTitle: "Educación Real en Belleza: Técnica, Práctica & Convenios Oficiales",
  academyHeroSubtitle: "No creemos en clases multitudinarias donde apenas observas de lejos. En nuestro espacio íntimo aprendes haciendo con grupos reducidos de máximo 4 a 6 alumnas, práctica en modelos reales, certificado de Salón & Estilo y convenio oficial con CETPRO del Estado para tramitar tu título como Auxiliar Técnico a Nombre de la Nación.",
  academyWhatsappMsg: "Hola Miluska, deseo solicitar información detallada sobre las capacitaciones de Aprende Conmigo en Salón&Estilo.",
  academyCetproName: "Convenio Educativo con CETPRO del Estado",
  academyCetproBadge: "Título a Nombre de la Nación",
  academyCetproDesc: "Nuestras alumnas convalidan sus horas de formación práctica para gestionar en el CETPRO estatal su certificación oficial como Auxiliar Técnico a Nombre de la Nación.",
  academyInternshipBadge: "Prácticas en Salones Aliados",
  academyInternshipDesc: "Convenios con centros de belleza y salones reconocidos de la región para horas de práctica con clientas reales y acelerar tu inserción laboral."
};

export const INITIAL_ORDERS = [
  {
    id: "AB-CHIC-1042",
    createdAt: "2026-09-24T10:15:00",
    customer: {
      name: "Camila Santisteban",
      dni: "74892134",
      phone: "974112233",
      email: "camila.santi@gmail.com",
      address: "Av. Santa Victoria 412, Dpto 301",
      city: "Chiclayo",
      district: "Santa Victoria",
      notes: "Timbre 301, dejar en recepción si no contesto."
    },
    items: [
      { id: "prod-001", name: "Sérum Iluminador Niacinamida 10%", price: 36.90, quantity: 1 },
      { id: "prod-002", name: "Lip Peptide Glaze (01 Rosé)", price: 24.50, quantity: 2 }
    ],
    subtotal: 85.90,
    shippingMethod: { id: "chiclayo_express", title: "Motorizado Express Chiclayo (< 2 horas)", price: 6.00 },
    total: 91.90,
    paymentMethod: "yape", // 'yape' | 'card' | 'cash' | 'bank_transfer'
    paymentStatus: "pagado", // 'pendiente' | 'pagado' | 'en_camino' | 'entregado' | 'cancelado'
    paymentProof: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "AB-TRU-1041",
    createdAt: "2026-09-23T18:40:00",
    customer: {
      name: "Luciana Farfán",
      dni: "45891203",
      phone: "944556677",
      email: "lufarfan@hotmail.com",
      address: "Agencia Shalom Trujillo Centro",
      city: "Trujillo",
      district: "La Libertad",
      notes: "Recojo en agencia Shalom."
    },
    items: [
      { id: "prod-005", name: "Protector Solar Invisible SPF 50+", price: 39.90, quantity: 1 }
    ],
    subtotal: 39.90,
    shippingMethod: { id: "shalom_peru", title: "Shalom Agencia (Resto de Perú)", price: 9.00 },
    total: 48.90,
    paymentMethod: "mercadopago",
    paymentStatus: "en_camino",
    paymentProof: null
  }
];

export const INITIAL_REGISTERED_USERS = [
  {
    id: "usr-001",
    name: "Camila Santisteban",
    email: "camila.santi@gmail.com",
    phone: "974112233",
    role: "vip",
    discountPercent: 10,
    registeredAt: "2026-09-10T14:20:00Z",
    ordersCount: 2
  },
  {
    id: "usr-002",
    name: "Luciana Farfán",
    email: "lufarfan@hotmail.com",
    phone: "944556677",
    role: "vip",
    discountPercent: 10,
    registeredAt: "2026-09-18T19:00:00Z",
    ordersCount: 1
  },
  {
    id: "usr-003",
    name: "Valeria Montero",
    email: "valeria.montero@gmail.com",
    phone: "956321487",
    role: "member",
    discountPercent: 10,
    registeredAt: "2026-09-28T11:45:00Z",
    ordersCount: 0
  }
];

// ============================================================================
// APRENDE CONMIGO - CAPACITACIONES, CURSOS & CONVENIOS ESTRATÉGICOS
// ============================================================================

export const INITIAL_COURSES = [
  {
    id: "curso-001",
    title: "Especialización Profesional en Colorimetría & Balayage Signature",
    subtitle: "Domina fondos de decoloración, formulación de tintes y degradados sin marcas",
    category: "Colorimetría Avanzada",
    startDate: "Lunes 10 de Noviembre",
    schedule: "Lunes y Miércoles: 3:00 PM a 7:00 PM",
    duration: "4 semanas (32 horas prácticas)",
    mode: "Presencial • Grupos Reducidos (Máx. 5 alumnas)",
    price: 580.00,
    discountPrice: 520.00,
    maxSpots: 5,
    availableSpots: 2,
    status: "abierto", // 'abierto' | 'proximo' | 'agotado'
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
    description: "Una formación intensiva diseñada para estilistas que desean elevar su técnica y para quienes quieren iniciarse con fundamentos sólidos. En lugar de fórmulas repetitivas, aprenderás a pensar como colorista: diagnosticar la resistencia de la hebra, calcular fondos con precisión milimétrica y dominar los montajes de Balayage más solicitados en Chiclayo (Morena Iluminada, Miel Caramelo y Babylights de alta densidad).",
    syllabus: [
      "Módulo 1: Química capilar, escala del pH y diagnóstico con test de mecha real.",
      "Módulo 2: Círculo cromático, reflejos primarios/secundarios y neutralización de cobrizos indeseados.",
      "Módulo 3: Técnicas de aclaración limpia, cuidado de la hebra con aditivos Plex y control de calor.",
      "Módulo 4: Técnicas de Balayage Signature: Cardado, empapelado libre, difuminado de raíz y contorno facial.",
      "Módulo 5: Matizadores gloss, emulsiones ácidas y sellado de cutículas de larga duración.",
      "Módulo 6: Práctica completa sobre modelo real con supervisión directa 1 a 1.",
      "Módulo 7: Fotografía de resultados con iluminación de salón y fijación de tarifas rentables."
    ],
    includes: [
      "Manual físico de Colorimetría y fórmulas exclusivas de Salón & Estilo",
      "Todos los productos y decolorantes para las prácticas en clase",
      "Modelo asignada para la evaluación final en vivo",
      "Certificado de Especialización emitido por Salón & Estilo",
      "Convalidación de horas para trámite de Título como Auxiliar Técnico en CETPRO del Estado",
      "Acceso preferente para prácticas supervisadas en salones de belleza aliados"
    ],
    requirements: "Ganas de aprender y puntualidad. No se requiere experiencia previa en coloración avanzada."
  },
  {
    id: "curso-002",
    title: "Masterclass de Alisados Orgánicos, Bótox Espejo & Salud Capilar",
    subtitle: "Aprende a transformar cabellos con frizz en hebras ultra lacias con fórmulas 0% formol",
    category: "Tratamientos & Alisados",
    startDate: "Sábado 22 y Domingo 23 de Noviembre",
    schedule: "Sábado y Domingo: 9:00 AM a 2:30 PM",
    duration: "2 jornadas intensivas (11 horas)",
    mode: "Presencial Intensivo • Taller 100% Práctico",
    price: 380.00,
    discountPrice: 340.00,
    maxSpots: 6,
    availableSpots: 3,
    status: "abierto",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
    description: "El clima húmedo de Chiclayo y la costa norte hace que los alisados sean uno de los servicios más rentables y demandados en el salón. En este taller intensivo dominarás los protocolos de alisado orgánico ácido, blindaje capilar y reposición de masa con Bótox Capilar. Aprenderás a planchar a la temperatura exacta según el estado del cabello para no quemar la fibra y lograr un lacio con caída natural y brillo espejo duradero.",
    syllabus: [
      "Módulo 1: Tipos de alisados: Diferencias entre ácidos orgánicos, taninoplastia y químicos tradicionales.",
      "Módulo 2: Protocolo de lavado preparador, secado y técnica de aplicación milimétrica por mechón.",
      "Módulo 3: Termoactivación profesional: Presión, velocidad y calibración térmica de la plancha.",
      "Módulo 4: Bótox capilar & cauterización: Cuándo alisar y cuándo restaurar primero.",
      "Módulo 5: Enjuague final en cabina, secado solo con aire de secadora (sin cepillo) para demostrar el resultado.",
      "Módulo 6: Recomendaciones de mantenimiento post-alisado para vender a tu clienta."
    ],
    includes: [
      "Insumos de alisado orgánico de grado profesional para la práctica",
      "Guía de temperaturas por tipo y grosor de fibra capilar",
      "Práctica supervisada paso a paso sobre modelo real",
      "Certificado de Capacitación emitido por Salón & Estilo",
      "Asesoría continua por WhatsApp para tus primeras clientas"
    ],
    requirements: "Abierto a principiantes, asistentes de salón y estilistas que buscan actualizarse."
  },
  {
    id: "curso-003",
    title: "Especialización en Maquillaje Social & Piel Blindada Anti-Humedad",
    subtitle: "Técnicas de preparación cutánea resistente al calor, lágrimas y eventos sociales de gala",
    category: "Maquillaje Profesional",
    startDate: "Martes 18 de Noviembre",
    schedule: "Martes y Jueves: 9:30 AM a 1:30 PM",
    duration: "3 semanas (24 horas prácticas)",
    mode: "Presencial • Grupos de 4 alumnas",
    price: 460.00,
    discountPrice: 410.00,
    maxSpots: 4,
    availableSpots: 1,
    status: "abierto",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    description: "Diseñado especialmente para dominar el maquillaje social duradero en el clima del norte. Aprenderás a construir una piel blindada sin aspecto acartonado, correcciones morfológicas, diseño de ojos sociales de alto impacto y colocación de pestañas para quinceañeras, novias y graduadas.",
    syllabus: [
      "Módulo 1: Biotipos cutáneos, limpieza profunda y preparación química de piel anti-grasa.",
      "Módulo 2: Piel blindada: Sellado de bases, polvos micro-pulverizados y fijación a prueba de agua.",
      "Módulo 3: Visagismo: Corrección de manchas, ojeras oscuras, contorno cremoso y rubor glow.",
      "Módulo 4: Técnicas de ojos: Ahumado glam, foxy eyes, corte de cuenca y delineado de precisión.",
      "Módulo 5: Cejas orgánicas y aplicación de pestañas punto a punto y enteras.",
      "Módulo 6: Maquillaje de Novia y fotografía para portafolio profesional en redes."
    ],
    includes: [
      "Uso de paletas y productos del atelier durante las sesiones",
      "Facecharts impresos para diseño previo",
      "Certificado emitido por Salón & Estilo",
      "Oportunidad de apoyar en fechas de alta demanda de novias y eventos"
    ],
    requirements: "Traer set básico de brochas personales. Los cosméticos de práctica se facilitan en el taller."
  },
  {
    id: "curso-004",
    title: "Iniciación Práctica en Peluquería & Estilismo de Salón",
    subtitle: "Cortes comerciales femeninos, brushing pulido, ondas con calor y bioseguridad",
    category: "Peluquería Integral",
    startDate: "Viernes 28 de Noviembre",
    schedule: "Viernes y Sábados: 3:30 PM a 7:30 PM",
    duration: "6 semanas (48 horas prácticas)",
    mode: "Presencial • Formación Modular Continua",
    price: 690.00,
    discountPrice: 620.00,
    maxSpots: 6,
    availableSpots: 4,
    status: "proximo",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80",
    description: "El cimiento indispensable para quien desea trabajar en un salón de belleza de prestigio o montar su propio negocio. Aprenderás desde la ergonomía en tijera y ángulo de corte, pasando por los peinados con secadora y plancha más demandados, hasta el protocolo de lavado capilar relajante.",
    syllabus: [
      "Módulo 1: Herramientas de peluquería, bioseguridad, desinfección y ergonomía postural.",
      "Módulo 2: Geometría de cortes femeninos: Corte recto sólido, corte en V, capas suaves y desvanecido.",
      "Módulo 3: Flequillos en tendencia: Cortina (curtain bangs), degrafilado y despunte de mantenimiento.",
      "Módulo 4: Lavado profesional en lavacabezas, masaje capilar y aplicación de mascarillas de rescate.",
      "Módulo 5: Técnicas de brushing: Alisado con secadora, volumen en raíz y movimiento de puntas.",
      "Módulo 6: Ondas glam con plancha y tenaza, fijadores flexibles y acabado de pasarela.",
      "Módulo 7: Rotación y pasantía práctica en salones de belleza asociados."
    ],
    includes: [
      "Práctica en cabezales sintéticos y modelos vivientes",
      "Certificado de Aptitud Profesional emitido por Salón & Estilo",
      "Convalidación directa de horas para titulación como Auxiliar Técnico ante CETPRO del Estado",
      "Pasantía coordinada en centros de belleza aliados de la red"
    ],
    requirements: "Abierto a todo público con vocación por la belleza, sin límite de edad."
  }
];

export const INITIAL_ACADEMY_PARTNERSHIPS = [
  {
    id: "convenio-cetpro",
    name: "Convenio Oficial CETPRO del Estado",
    institutionType: "cetpro", // 'cetpro' | 'salon'
    badge: "Certificación a Nombre de la Nación",
    location: "Gestión Oficial para Egresadas de Chiclayo & Lambayeque",
    highlight: "Título Oficial de Auxiliar Técnico",
    description: "Gracias a nuestro marco de cooperación interinstitucional con un Centro de Educación Técnico-Productiva (CETPRO) estatal, nuestras alumnas pueden convalidar las horas teórico-prácticas cursadas en Salón & Estilo para gestionar y obtener en dicho centro su certificación oficial a Nombre de la Nación como 'Auxiliares Técnicos'. Este respaldo legal complementa tu formación y te abre puertas en instituciones formales.",
    benefits: [
      "Convalidación formal de horas cronológicas de capacitación",
      "Acompañamiento en el trámite y portafolio de evidencias ante el CETPRO",
      "Validez nacional reconocida para tu currículum técnico profesional",
      "Doble reconocimiento: Certificado de Especialización Salón & Estilo + Título CETPRO del Estado"
    ],
    contactInfo: "Consultas de convalidación: vía coordinación de Salón & Estilo"
  },
  {
    id: "salon-aliado-01",
    name: "Salón & Estilo - Sede Atelier Miluska Vidaurre",
    institutionType: "salon",
    badge: "Sede Principal de Capacitación",
    location: "Chiclayo Centro, Lambayeque",
    highlight: "Práctica en Mesa Real",
    description: "Nuestro propio espacio físico adaptado para que cada alumna aprenda a lado de Miluska Vidaurre con clientas reales y casos complejos de salón.",
    benefits: [
      "Entorno íntimo y personalizado (máximo 4 a 6 alumnas por turno)",
      "Uso de equipamiento, aparatología y productos de alta gama",
      "Casos reales de corrección de color y transformaciones capilares"
    ],
    contactInfo: "WhatsApp: 920 731 163"
  },
  {
    id: "salon-aliado-02",
    name: "Studio & Spa Santa Victoria (Salón Aliado)",
    institutionType: "salon",
    badge: "Red de Prácticas Preprofesionales",
    location: "Urb. Santa Victoria, Chiclayo",
    highlight: "Prácticas Supervisadas",
    description: "Salón de belleza aliado donde nuestras egresadas más destacadas realizan pasantías prácticas supervisadas, ganando experiencia con clientela exigente y afianzando la velocidad y seguridad en sus servicios.",
    benefits: [
      "Prácticas en servicios de color, peinado social y tratamientos",
      "Inserción en bolsa laboral según desempeño y vacantes",
      "Certificado de horas de práctica preprofesional"
    ],
    contactInfo: "Convenio activo coordinado por Salón & Estilo"
  },
  {
    id: "salon-aliado-03",
    name: "Centro de Estética & Glamour Pimentel (Salón Aliado)",
    institutionType: "salon",
    badge: "Red de Prácticas Preprofesionales",
    location: "Balneario de Pimentel, Lambayeque",
    highlight: "Prácticas de Alisados & Cuidado Capilar",
    description: "Centro especializado con el que mantenemos alianza de intercambio para que las alumnas roten en servicios de alisados orgánicos, cepillado exprés y tratamientos reconstructivos.",
    benefits: [
      "Contacto con clientas de eventos sociales y novias",
      "Entrenamiento en atención al cliente de alta fidelización",
      "Oportunidad de empleo temporal o permanente para graduadas"
    ],
    contactInfo: "Convenio activo coordinado por Salón & Estilo"
  }
];

