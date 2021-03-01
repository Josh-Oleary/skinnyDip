const mongoose = require('mongoose');
const holes = require('./seeds');
const Swimhole = require('../models/swimhole');


mongoose.connect('mongodb://localhost:27017/skinny-dip', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Swimhole.deleteMany({});
  for(let i = 0; i < 5; i++) {
      const hole = new Swimhole(
          {
          author: '6027d2a6c1614208c233238a',
          title: `${holes[i].title}`,
          price: `${holes[i].price}`,
          images: `${holes[i].image}`,
          description: `${holes[i].description}`,
          state: `${holes[i].state}`,
          lattitude: `${holes[i].lattitude}`,
          longititude: `${holes[i].longitude}`,
          type: `${holes[i].type}`,
        })
        await hole.save();
  }
}

    seedDB().then(() => {
        mongoose.connection.close()
    });