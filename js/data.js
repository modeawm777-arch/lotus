// ==========================================
// THAI MARKETPLACE - INITIAL MOCK DATA
// ==========================================

const INITIAL_CATEGORIES = [
  { id: "all", name: "ทั้งหมด", icon: "fa-solid fa-border-all", count: 12 },
  { id: "tech", name: "อุปกรณ์ไอที & มือถือ", icon: "fa-solid fa-laptop", count: 4 },
  { id: "fashion", name: "แฟชั่น & เสื้อผ้า", icon: "fa-solid fa-shirt", count: 3 },
  { id: "food", name: "อาหาร & ขนมของฝาก", icon: "fa-solid fa-utensils", count: 2 },
  { id: "home", name: "ของใช้ในบ้าน", icon: "fa-solid fa-couch", count: 2 },
  { id: "beauty", name: "ความงาม & สุขภาพ", icon: "fa-solid fa-wand-magic-sparkles", count: 1 }
];

const INITIAL_COUPONS = [
  { code: "WELCOME10", discountPercent: 10, minSpend: 200, desc: "ลดทันที 10% สำหรับลูกค้าใหม่" },
  { code: "FREESHIP", freeShipping: true, minSpend: 500, desc: "ส่งฟรีทั่วไทยเมื่อช้อปครบ 500.-" },
  { code: "SUPER50", discountAmount: 50, minSpend: 300, desc: "ส่วนลด 50 บาท เมื่อช้อปครบ 300.-" },
  { code: "PAYDAY20", discountPercent: 20, minSpend: 1000, desc: "ลดพิเศษ 20% ช้อปครบ 1,000.-" }
];

const INITIAL_PRODUCTS = [
  {
    id: "p1",
    name: "หูฟังไร้สาย Sony WH-1000XM5 ตัดเสียงรบกวนชั้นเลิศ",
    category: "tech",
    price: 11490,
    originalPrice: 13990,
    discount: 18,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 328,
    soldCount: 850,
    stock: 25,
    isFlashSale: true,
    isFreeShipping: true,
    seller: {
      name: "Sony Official Store",
      verified: true,
      rating: 4.9,
      location: "กรุงเทพมหานคร"
    },
    description: "สุดยอดหูฟังครอบหูไร้สายตัดเสียงรบกวนชั้นนำของวงการ ให้คุณภาพเสียงระดับ High-Resolution Audio แบตเตอรี่ใช้งานได้ยาวนานสูงสุด 30 ชั่วโมง พร้อมฟังก์ชัน Quick Charge ชาร์จ 3 นาที ใช้งานได้ 3 ชั่วโมง",
    specs: ["ระบบตัดเสียงรบกวน Industry-Leading Noise Cancellation", "ไดรเวอร์ 30 มม. ดีไซน์พิเศษ", "Bluetooth 5.2 รองรับ LDAC", "แบตเตอรี่นานถึง 30 ชม."],
    featured: true
  },
  {
    id: "p2",
    name: "คีย์บอร์ดกลไกไร้สาย Keychron K2 Pro Custom Mechanical",
    category: "tech",
    price: 3890,
    originalPrice: 4590,
    discount: 15,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 195,
    soldCount: 420,
    stock: 14,
    isFlashSale: true,
    isFreeShipping: true,
    seller: {
      name: "Keychron Thailand",
      verified: true,
      rating: 4.8,
      location: "นนทบุรี"
    },
    description: "คีย์บอร์ด Custom ไร้สาย รองรับ QMK/VIA ปรับแต่งปุ่มได้ตามใจชอบ สวิตช์ Hot-swappable เชื่อมต่อได้ 3 อุปกรณ์พร้อมกันผ่าน Bluetooth หรือใช้สาย Type-C",
    specs: ["Layout 75%", "Hot-Swappable Switch", "RGB Backlight 22 โหมด", "แบตเตอรี่ 4000 mAh"],
    featured: true
  },
  {
    id: "p3",
    name: "Smart Watch สมาร์ทวอทช์กันน้ำ วัดค่าสุขภาพแม่นยำ 24 ชม.",
    category: "tech",
    price: 1590,
    originalPrice: 2490,
    discount: 36,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewsCount: 512,
    soldCount: 1200,
    stock: 45,
    isFlashSale: true,
    isFreeShipping: false,
    seller: {
      name: "Gadget World",
      verified: false,
      rating: 4.7,
      location: "สมุทรปราการ"
    },
    description: "นาฬิกาอัจฉริยะหน้าจอ AMOLED คมชัด สว่างสู้แดด ตรวจวัดอัตราการเต้นของหัวใจ ออกซิเจนในเลือด SpO2 และการนอนหลับ กันน้ำลึก 5ATM โหมดออกกำลังกายกว่า 100 แบบ",
    specs: ["หน้าจอ AMOLED 1.43 นิ้ว", "กันน้ำ 5ATM", "วัด Heart Rate & SpO2", "แบตเตอรี่อึด 14 วัน"],
    featured: true
  },
  {
    id: "p4",
    name: "กล้อง Mirrorless Fujifilm X-T30 II เลนส์ Kit 15-45mm",
    category: "tech",
    price: 31900,
    originalPrice: 35900,
    discount: 11,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 88,
    soldCount: 150,
    stock: 8,
    isFlashSale: false,
    isFreeShipping: true,
    seller: {
      name: "Camera Mania Store",
      verified: true,
      rating: 4.9,
      location: "กรุงเทพมหานคร"
    },
    description: "กล้องสไตล์ Retro ขนาดกะทัดรัด น้ำหนักเบา ให้โทนสี Film Simulation อันเป็นเอกลักษณ์ของ Fujifilm วิดีโอ 4K โฟกัสรวดเร็วแม่นยำ พร้อมระบบจำใบหน้าและดวงตา",
    specs: ["เซนเซอร์ X-Trans CMOS 4 26.1MP", "ถ่ายวิดีโอ 4K/30p", "18 Film Simulation Modes", "น้ำหนักเพียง 378 กรัม"],
    featured: false
  },
  {
    id: "p5",
    name: "เสื้อแจ็คเก็ตยีนส์โอเวอร์ไซส์ สไตล์มินิมอล Streetwear",
    category: "fashion",
    price: 690,
    originalPrice: 1290,
    discount: 46,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 410,
    soldCount: 930,
    stock: 50,
    isFlashSale: true,
    isFreeShipping: true,
    seller: {
      name: "Urban Street BKK",
      verified: true,
      rating: 4.8,
      location: "กรุงเทพมหานคร"
    },
    description: "เสื้อยีนส์ฟอกนุ่ม ทรง Oversized ดีไซน์เกาหลี แมทช์ง่ายกับทุกลุค ใส่ได้ทั้งชายและหญิง เนื้อผ้ายีนส์เกรดพรีเมียม ระบายอากาศได้ดี ไม่ร้อน",
    specs: ["ผ้ายีนส์ 100% Cotton แท้", "ทรง Unisex ทรงหลวม Oversized", "กระดุมโลหะ แข็งแรงทนทาน", "มีกระเป๋าด้านใน 2 ช่อง"],
    featured: true
  },
  {
    id: "p6",
    name: "รองเท้าสนีกเกอร์สปอร์ต ลายคลีน ใส่วิ่ง/เที่ยว นุ่มสบายเท้า",
    category: "fashion",
    price: 1290,
    originalPrice: 1890,
    discount: 31,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewsCount: 620,
    soldCount: 1540,
    stock: 30,
    isFlashSale: false,
    isFreeShipping: true,
    seller: {
      name: "Step Forward Official",
      verified: true,
      rating: 4.9,
      location: "ปทุมธานี"
    },
    description: "รองเท้าผ้าใบสปอร์ตแฟชั่น พื้นรองเท้า CloudFoam รองรับแรงกระแทกได้อย่างยอดเยี่ยม นุ่มเด้งทุกก้าว ดีไซน์เท่ ทันสมัย ใส่เดินเที่ยวหรือวิ่งออกกำลังกายได้ทั้งวัน",
    specs: ["พื้น Cushioning Foam นุ่มพิเศษ", "ผ้าตาข่าย Mesh ไม่อับชื้น", "น้ำหนักเบาเพียง 230g", "พื้นยางกันลื่น Slip-Resistant"],
    featured: true
  },
  {
    id: "p7",
    name: "กระเป๋าเป้สะพายหลังกันน้ำ สไตล์ญี่ปุ่น ช่องใส่โน้ตบุ๊ก 15.6 นิ้ว",
    category: "fashion",
    price: 550,
    originalPrice: 890,
    discount: 38,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 230,
    soldCount: 780,
    stock: 20,
    isFlashSale: false,
    isFreeShipping: false,
    seller: {
      name: "Tokyo Bag Shop",
      verified: false,
      rating: 4.7,
      location: "เชียงใหม่"
    },
    description: "กระเป๋าเป้สะพายหลังดีไซน์มินิมอล ช่องเก็บของเยอะ จุของได้จุใจ ช่องบุนวมสำหรับ Laptop และพอร์ตชาร์จ USB ด้านข้าง ผ้า Oxford เคลือบสารกันละอองน้ำ",
    specs: ["ผ้า Oxford Waterproof กันน้ำ", "ช่องใส่ Laptop สูงสุด 15.6 นิ้ว", "น้ำหนักเบา สะพายไม่ปวดหลัง", "มีช่องลับกันขโมยด้านหลัง"],
    featured: false
  },
  {
    id: "p8",
    name: "ทุเรียนหมอนทองอบกรอบเกรดพรีเมียม ไซส์ใหญ่ 100g (3 ซอง)",
    category: "food",
    price: 320,
    originalPrice: 450,
    discount: 28,
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 840,
    soldCount: 3400,
    stock: 80,
    isFlashSale: true,
    isFreeShipping: true,
    seller: {
      name: "สวนผลไม้ป้าเพ็ญ จันทบุรี",
      verified: true,
      rating: 5.0,
      location: "จันทบุรี"
    },
    description: "ทุเรียนหมอนทองแท้ 100% คัดพิเศษจากสวนจันทบุรี อบกรอบด้วยระบบ Freeze-Dried คงคุณค่าทางสารอาหาร หอม หวาน กรอบ อร่อยเต็มคำ ไม่ใส่น้ำตาลและวัตถุกันเสีย",
    specs: ["ทุเรียนหมอนทองแท้ 100%", "อบแบบ Freeze Dried กรอบฟู", "ไม่ผสมแป้งและน้ำตาล", "มาตรฐาน อย. และ GMP"],
    featured: true
  },
  {
    id: "p9",
    name: "ชาไทยคั่วสด สูตรโบราณ หอมเข้มข้น กลมกล่อม (500g)",
    category: "food",
    price: 180,
    originalPrice: 250,
    discount: 28,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 310,
    soldCount: 1800,
    stock: 60,
    isFlashSale: false,
    isFreeShipping: false,
    seller: {
      name: "ไร่ชาดอยสะเก็ด",
      verified: true,
      rating: 4.9,
      location: "เชียงใหม่"
    },
    description: "ใบชาไทยคั่วบดสูตรพิเศษ หอมกลิ่นใบชาแท้ ผสมผสานอย่างลงตัว ชงได้ทั้งชานมเย็น ชาดำเย็น ชามะนาว สีสวยสดธรรมชาติ รสชาติเข้มข้นถูกใจคอชา",
    specs: ["ใบชาอัสสัมเกรดพิเศษ", "บรรจุถุงฟอยล์ซิปล็อค 500g", "ชงได้ทั้งถุงกรองและเครื่องชงกาแฟ", "อายุการเก็บรักษา 1 ปี"],
    featured: false
  },
  {
    id: "p10",
    name: "โคมไฟตั้งโต๊ะ LED ปรับแสง 3 ระดับ พร้อมแท่นชาร์จไร้สาย",
    category: "home",
    price: 490,
    originalPrice: 790,
    discount: 37,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewsCount: 165,
    soldCount: 620,
    stock: 35,
    isFlashSale: false,
    isFreeShipping: true,
    seller: {
      name: "Minimal Home Living",
      verified: true,
      rating: 4.8,
      location: "กรุงเทพมหานคร"
    },
    description: "โคมไฟอ่านหนังสือถนอมสายตา ปรับอุณหภูมิสีได้ 3 โหมด (Warm/Natural/Cool) ปรับระดับความสว่างด้วยระบบสัมผัส ฐานโคมไฟมีแท่นชาร์จ Wireless Fast Charge ในตัว",
    specs: ["แสงไฟถนอมสายตา ไร้แสงกระพริบ", "รองรับ Fast Wireless Charge 15W", "ปรับก้ม-เงยได้ 180 องศา", "พอร์ตจ่ายไฟ Type-C"],
    featured: false
  },
  {
    id: "p11",
    name: "เครื่องพ่นอโรมา Ultrasonic ความจุ 500ml พร้อมชุดน้ำมันหอมระเหย",
    category: "home",
    price: 399,
    originalPrice: 650,
    discount: 38,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 470,
    soldCount: 1980,
    stock: 40,
    isFlashSale: true,
    isFreeShipping: true,
    seller: {
      name: "Aroma Bliss Home",
      verified: true,
      rating: 4.9,
      location: "นครปฐม"
    },
    description: "เครื่องพ่นไอน้ำกระจายกลิ่นหอมอโรม่า ระบบคลื่นความถี่สูง ทำงานเงียบสนิท มีไฟ LED 7 สีสร้างบรรยากาศ ผ่อนคลายความเครียด ช่วยให้อากาศชุ่มชื้นและหลับสบายยิ่งขึ้น",
    specs: ["ความจุแท็งก์น้ำ 500 ml", "ตั้งเวลาปิดได้ 1H/3H/6H", "ไฟ LED 7 สี ปรับระดับความสว่างได้", "ระบบตัดไฟอัตโนมัติเมื่อน้ำหมด"],
    featured: true
  },
  {
    id: "p12",
    name: "เซรั่มไฮยาลูรอนเข้มข้น บำรุงผิวฉ่ำวาว อิ่มน้ำ กระจ่างใส 50ml",
    category: "beauty",
    price: 450,
    originalPrice: 790,
    discount: 43,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 920,
    soldCount: 4100,
    stock: 75,
    isFlashSale: true,
    isFreeShipping: true,
    seller: {
      name: "Glow & Shine Skincare",
      verified: true,
      rating: 4.9,
      location: "กรุงเทพมหานคร"
    },
    description: "เซรั่มเข้มข้นสูตร 8D Hyaluronic Acid ซึมลึกถึงผิวชั้นใน เติมความชุ่มชื้น ลดเลือนริ้วรอย ฟื้นฟูเกราะป้องกันผิวให้แข็งแรง ผิวดูฉ่ำวาว อิ่มฟู สุขภาพดี ปราศจากแอลกอฮอล์และน้ำหอม",
    specs: ["Hyaluronic Acid 8 โมเลกุล", "ปราศจากพาราเบน น้ำหอม แอลกอฮอล์", "ผ่านการทดสอบโดยแพทย์ผิวหนัง", "ขนาด 50 ml ใช้ได้นาน 2 เดือน"],
    featured: true
  }
];
