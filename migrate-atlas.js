const mongoose = require('mongoose');
const Product = require('./models/Product');

const LOCAL_URI = 'mongodb://localhost:27017/crochetnook';
const ATLAS_URI = 'mongodb+srv://purvikanghan15_db_user:qUS8xJtXHiFoeB8E@crochetnook.tm2pbkh.mongodb.net/crochetnook?retryWrites=true&w=majority&appName=crochetnook';

async function migrate() {
    console.log('Starting data migration...');

    // 1. Connect to local database
    const localDb = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('Connected to local DB');

    // Create a model bound to the local database
    const LocalProduct = localDb.model('Product', Product.schema);
    const localProducts = await LocalProduct.find().lean();
    console.log(`Found ${localProducts.length} products in local DB.`);

    // 2. Connect to Atlas database
    const atlasDb = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('Connected to Atlas DB');

    // Create a model bound to the Atlas database
    const AtlasProduct = atlasDb.model('Product', Product.schema);

    // 3. Insert into Atlas
    if (localProducts.length > 0) {
        // Clean up __v and _id before inserting to avoid conflicts/validation issues if they exist
        const productsToInsert = localProducts.map(p => {
            const newP = { ...p };
            delete newP._id;
            delete newP.__v;
            return newP;
        });

        // Clear existing data in Atlas to prevent duplicates during testing
        await AtlasProduct.deleteMany({});
        console.log('Cleared existing Atlas data.');

        await AtlasProduct.insertMany(productsToInsert);
        console.log('Successfully migrated data to Atlas! ✅');
    } else {
        console.log('Local DB is empty. Nothing to migrate.');
    }

    // 4. Close connections
    await localDb.close();
    await atlasDb.close();
    console.log('Connections closed. Migration script finished.');
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
