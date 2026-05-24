const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Crop = require('./models/Crop');
const Fertilizer = require('./models/Fertilizer');
const Disease = require('./models/Disease');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

// Sample Crops Data
const crops = [
  {
    name: 'Wheat',
    scientificName: 'Triticum',
    description: 'Wheat is a cereal grain cultivated worldwide',
    season: 'Rabi',
    soilType: ['Loamy', 'Clay Loam'],
    temperature: { min: 15, max: 25 },
    rainfall: { min: 50, max: 100 },
    humidity: { min: 40, max: 70 },
    ph: { min: 6.0, max: 7.5 },
    nitrogen: { min: 40, max: 60 },
    phosphorus: { min: 20, max: 40 },
    potassium: { min: 20, max: 40 },
    growingPeriod: 120,
    yield: '3-4 tons/hectare',
  },
  {
    name: 'Rice',
    scientificName: 'Oryza sativa',
    description: 'Rice is the seed of the grass species Oryza sativa',
    season: 'Kharif',
    soilType: ['Clay', 'Clay Loam'],
    temperature: { min: 20, max: 35 },
    rainfall: { min: 100, max: 200 },
    humidity: { min: 70, max: 90 },
    ph: { min: 5.5, max: 7.0 },
    nitrogen: { min: 40, max: 80 },
    phosphorus: { min: 20, max: 40 },
    potassium: { min: 20, max: 60 },
    growingPeriod: 150,
    yield: '4-6 tons/hectare',
  },
  {
    name: 'Maize',
    scientificName: 'Zea mays',
    description: 'Maize is a cereal grain also known as corn',
    season: 'Kharif',
    soilType: ['Loamy', 'Sandy Loam'],
    temperature: { min: 20, max: 30 },
    rainfall: { min: 50, max: 100 },
    humidity: { min: 50, max: 80 },
    ph: { min: 5.8, max: 7.0 },
    nitrogen: { min: 60, max: 100 },
    phosphorus: { min: 30, max: 50 },
    potassium: { min: 30, max: 60 },
    growingPeriod: 100,
    yield: '5-8 tons/hectare',
  },
  {
    name: 'Cotton',
    scientificName: 'Gossypium',
    description: 'Cotton is a soft, fluffy staple fiber',
    season: 'Kharif',
    soilType: ['Black Soil', 'Loamy'],
    temperature: { min: 21, max: 30 },
    rainfall: { min: 50, max: 80 },
    humidity: { min: 50, max: 70 },
    ph: { min: 6.0, max: 8.0 },
    nitrogen: { min: 50, max: 80 },
    phosphorus: { min: 30, max: 50 },
    potassium: { min: 30, max: 50 },
    growingPeriod: 180,
    yield: '2-3 tons/hectare',
  },
  {
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    description: 'Sugarcane is a tall, perennial grass',
    season: 'All Season',
    soilType: ['Loamy', 'Clay Loam'],
    temperature: { min: 20, max: 35 },
    rainfall: { min: 100, max: 150 },
    humidity: { min: 60, max: 80 },
    ph: { min: 6.0, max: 7.5 },
    nitrogen: { min: 80, max: 120 },
    phosphorus: { min: 40, max: 60 },
    potassium: { min: 40, max: 80 },
    growingPeriod: 365,
    yield: '70-100 tons/hectare',
  },
];

// Sample Fertilizers Data
const fertilizers = [
  {
    name: 'Urea',
    type: 'Chemical',
    description: 'Urea is a nitrogen-rich fertilizer',
    nitrogen: 46,
    phosphorus: 0,
    potassium: 0,
    suitableCrops: ['Wheat', 'Rice', 'Maize', 'All'],
    applicationMethod: 'Top dressing',
    dosage: '50-100 kg/hectare',
    timing: 'During active growth phase',
    precautions: 'Avoid direct contact with seeds',
  },
  {
    name: 'DAP (Diammonium Phosphate)',
    type: 'Chemical',
    description: 'DAP provides both nitrogen and phosphorus',
    nitrogen: 18,
    phosphorus: 46,
    potassium: 0,
    suitableCrops: ['Wheat', 'Maize', 'Cotton', 'All'],
    applicationMethod: 'Basal application',
    dosage: '50-100 kg/hectare',
    timing: 'At sowing time',
    precautions: 'Store in dry place',
  },
  {
    name: 'NPK 10-26-26',
    type: 'Chemical',
    description: 'Balanced NPK fertilizer',
    nitrogen: 10,
    phosphorus: 26,
    potassium: 26,
    suitableCrops: ['Sugarcane', 'Cotton', 'All'],
    applicationMethod: 'Basal application',
    dosage: '100-150 kg/hectare',
    timing: 'At sowing time',
    precautions: 'Mix well with soil',
  },
  {
    name: 'Compost',
    type: 'Organic',
    description: 'Organic compost from farm waste',
    nitrogen: 2,
    phosphorus: 1,
    potassium: 1,
    suitableCrops: ['All'],
    applicationMethod: 'Soil incorporation',
    dosage: '5-10 tons/hectare',
    timing: 'Before sowing',
    precautions: 'Ensure proper composting',
  },
  {
    name: 'Vermicompost',
    type: 'Organic',
    description: 'Earthworm compost rich in nutrients',
    nitrogen: 3,
    phosphorus: 1.5,
    potassium: 1.5,
    suitableCrops: ['Vegetables', 'Fruits', 'All'],
    applicationMethod: 'Top dressing',
    dosage: '2-5 tons/hectare',
    timing: 'Throughout growing season',
    precautions: 'Keep moist',
  },
];

// Sample Diseases Data
const diseases = [
  {
    name: 'Leaf Rust',
    scientificName: 'Puccinia triticina',
    affectedCrops: ['Wheat'],
    symptoms: ['Orange-brown pustules on leaves', 'Yellowing of leaves', 'Reduced photosynthesis'],
    causes: 'Fungal infection',
    prevention: ['Use resistant varieties', 'Crop rotation', 'Proper spacing'],
    treatment: 'Apply fungicides like Propiconazole',
    severity: 'Medium',
  },
  {
    name: 'Blast Disease',
    scientificName: 'Magnaporthe oryzae',
    affectedCrops: ['Rice'],
    symptoms: ['Diamond-shaped lesions on leaves', 'Neck rot', 'White to gray centers'],
    causes: 'Fungal infection',
    prevention: ['Use resistant varieties', 'Avoid excess nitrogen', 'Proper water management'],
    treatment: 'Apply fungicides like Tricyclazole',
    severity: 'High',
  },
  {
    name: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    affectedCrops: ['Maize'],
    symptoms: ['Holes in leaves', 'Frass on plants', 'Damage to whorl'],
    causes: 'Pest infestation',
    prevention: ['Early planting', 'Crop rotation', 'Use pheromone traps'],
    treatment: 'Apply insecticides like Emamectin benzoate',
    severity: 'Critical',
  },
  {
    name: 'Bollworm',
    scientificName: 'Helicoverpa armigera',
    affectedCrops: ['Cotton'],
    symptoms: ['Damage to squares and bolls', 'Holes in flowers', 'Larvae feeding'],
    causes: 'Pest infestation',
    prevention: ['Use Bt cotton varieties', 'Destroy crop residues', 'Monitor fields regularly'],
    treatment: 'Apply insecticides like Spinosad',
    severity: 'High',
  },
  {
    name: 'Red Rot',
    scientificName: 'Colletotrichum falcatum',
    affectedCrops: ['Sugarcane'],
    symptoms: ['Red internal tissues', 'Wilted leaves', 'Stunted growth'],
    causes: 'Fungal infection',
    prevention: ['Use disease-free setts', 'Crop rotation', 'Proper drainage'],
    treatment: 'Apply fungicides and remove infected plants',
    severity: 'Critical',
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Crop.deleteMany();
    await Fertilizer.deleteMany();
    await Disease.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Insert sample data
    await Crop.insertMany(crops);
    console.log('✅ Crops seeded');

    await Fertilizer.insertMany(fertilizers);
    console.log('✅ Fertilizers seeded');

    await Disease.insertMany(diseases);
    console.log('✅ Diseases seeded');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@smartagritech.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890',
      location: 'India',
      farmSize: 100,
    });
    console.log('✅ Admin user created');

    // Create demo farmer
    const farmerUser = await User.create({
      name: 'John Farmer',
      email: 'farmer@smartagritech.com',
      password: 'farmer123',
      role: 'farmer',
      phone: '9876543210',
      location: 'Punjab',
      farmSize: 50,
    });
    console.log('✅ Demo farmer created');

    const products = [
      { name: 'Hybrid Wheat Seeds', description: 'High-yield disease-resistant wheat seeds for Rabi season.', price: 450, unit: 'per 5kg bag', category: 'seeds', stock: 120, image: '🌾', sellerName: 'Punjab Seed Hub', location: 'Punjab', rating: 4.7 },
      { name: 'Organic Vermicompost', description: 'Premium organic compost for soil health and moisture retention.', price: 320, unit: 'per 25kg bag', category: 'fertilizer', stock: 80, image: '🪱', sellerName: 'Green Earth Agro', location: 'Maharashtra', rating: 4.8 },
      { name: 'NPK 19:19:19 Fertilizer', description: 'Balanced NPK fertilizer for all crop growth stages.', price: 680, unit: 'per 50kg bag', category: 'fertilizer', stock: 95, image: '⚗️', sellerName: 'NutriFarm India', location: 'Gujarat', rating: 4.6 },
      { name: 'Neem Oil Pesticide', description: 'Natural neem-based pesticide — safe for organic farming.', price: 280, unit: 'per 1L bottle', category: 'pesticide', stock: 60, image: '🍃', sellerName: 'BioShield Agri', location: 'Karnataka', rating: 4.5 },
      { name: 'Drip Irrigation Kit', description: 'Complete drip kit for 1 acre — water-efficient smart farming.', price: 4500, unit: 'per kit', category: 'equipment', stock: 25, image: '💧', sellerName: 'AquaTech Solutions', location: 'Tamil Nadu', rating: 4.9 },
      { name: 'Power Sprayer 16L', description: 'Battery-assisted sprayer for fertilizers and pesticides.', price: 2200, unit: 'per unit', category: 'equipment', stock: 40, image: '🔫', sellerName: 'FarmEquip Pro', location: 'Haryana', rating: 4.4 },
      { name: 'Basmati Rice Seeds', description: 'Premium aromatic basmati seeds — export quality.', price: 520, unit: 'per 5kg bag', category: 'seeds', stock: 70, image: '🍚', sellerName: 'Himalaya Seeds', location: 'Uttarakhand', rating: 4.8 },
      { name: 'Garden Hoe & Tool Set', description: 'Stainless steel 5-piece hand tool set for field work.', price: 890, unit: 'per set', category: 'tools', stock: 55, image: '🔧', sellerName: 'Rural Tools Co.', location: 'Rajasthan', rating: 4.3 },
      { name: 'Trichoderma Bio-Fungicide', description: 'Biological fungicide for soil-borne disease control.', price: 350, unit: 'per 500g', category: 'pesticide', stock: 45, image: '🧪', sellerName: 'BioAgri Labs', location: 'Telangana', rating: 4.6 },
      { name: 'Tomato Hybrid Seeds', description: 'High-yield tomato seeds resistant to early blight.', price: 180, unit: 'per 100g pack', category: 'seeds', stock: 150, image: '🍅', sellerName: 'VeggieGrow Seeds', location: 'Andhra Pradesh', rating: 4.7 },
    ];
    await Product.insertMany(products);
    console.log('✅ Marketplace products seeded');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@smartagritech.com / admin123');
    console.log('Farmer: farmer@smartagritech.com / farmer123');

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
