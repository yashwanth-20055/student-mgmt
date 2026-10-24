const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/students')
  .then(() => console.log('Mongo connected'))
  .catch(e => console.error('Mongo error:', e.message));

app.listen(3000, () => console.log('Listening on 3000'));