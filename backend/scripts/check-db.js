const connectDB = require('../config/database');

(async () => {
  try {
    await connectDB();
    console.log('Connection test succeeded');
    process.exit(0);
  } catch (err) {
    console.error('Connection test failed:', err);
    process.exit(2);
  }
})();
