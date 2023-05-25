const express = require("express");
const mongoose = require("mongoose");
const superagent = require("superagent");
const {FoodModel} = require("./schema");
const API_KEY = 'C96VKZyVRh5BUH5QlwD7uQ==cTZBVsYUNO0m81JQ';
mongoose.connect("mongodb+srv://qwer1234:qwer1234@cluster0.xa6fp.mongodb.net/foods")

const fetchFoodNutrition = async (foodName) => {
  const res = await superagent
    .get(`https://api.calorieninjas.com/v1/nutrition?query=${foodName}`)
    .set('X-Api-Key', API_KEY)
    .set('accept', 'json');

  const resText = res.text;
  const data = JSON.parse(resText);
  if (data && data.items && data.items[0]) {
    return data.items[0];
  }
  return null;
}


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(express.json());


app.get('/api/foods/:date', async (req, res) => {
  try {
    const {date} = req.params;
    const foods = await FoodModel.find({
      eatDate: date
    });
    res.status(200).json(foods);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.post('/api/add-food', async (req, res) => {
  try {
    const {name, weight, eatTime, eatDate} = req.body;
    const nutrition = await fetchFoodNutrition(name);
    if (!nutrition) {
      return res.status(404).send("Not found this food nutrition");
    }
    const carbs = nutrition.carbohydrates_total_g;
    const fat = nutrition.fat_total_g;
    const protein = nutrition.protein_g;
    await FoodModel.create({
      name: name,
      weight: Number(weight),
      nutrition: {
        carbs,
        fat,
        protein
      },
      eatTime,
      eatDate
    });
    res.status(201).send();
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
})


app.listen(PORT, () => {
  console.log(`The application set up at port ${PORT}`);
})

