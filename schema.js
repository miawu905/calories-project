const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  nutrition: {
    carbs: Number,
    fat: Number,
    protein: Number
  },
  eatTime: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"]
  },
  eatDate: String
}, {
  timestamps: true
});

const FoodModel = mongoose.model('Food', FoodSchema);

module.exports = {
  FoodModel
}