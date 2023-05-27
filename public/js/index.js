let currentPage = 'home';
let pages = [
  'home',
  'add-food'
];
let data = {
  currentDate: new Date(),
  foods: []
};

// init current date is today

const currentDatePicker = document.querySelector('#current-date');
let todayDate = new Date();

function renderPage() {
  pages.forEach(page => {
    if (document.querySelector(`#${page}`)) {
      document.querySelector(`#${page}`).classList.add('d-none');
    }
  });
  if (currentPage === pages[0]) {
    fetchFoods()
  }
  document.querySelector(`#${currentPage}`).classList.remove('d-none');
}

renderPage();


function goToPage(page) {
  window.location.href = '#' + page;
}

function goBack() {
  history.back();
}


function handleRoute() {
  const newHash = window.location.hash;
  const route = newHash.slice(1);
  if (!route) {
    currentPage = 'home';
    renderPage();
  } else {
    currentPage = route;
    renderPage();
  }
}

window.addEventListener('hashchange', function () {
  handleRoute();
}, false);

handleRoute();

function handleDeleteFood(id) {
  const confirm = window.confirm("Do you really want to delete it?");
  if (confirm) {
    fetch(`/api/foods/${id}`, {
      method: 'DELETE'
    }).then(() => {
      fetchFoods();
    })
  }

}

function handleUpdate(id) {
  const newWeight = window.prompt("Please enter a new weight");
  if (isNaN(Number(newWeight)) || Number(newWeight) === 0) {
    return alert("Sorry, you must enter a valid number!");
  }
  const weight = Number(newWeight);
  fetch(`/api/foods/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      weight: weight
    })
  }).then(() => {
    fetchFoods();
  })
}

function renderFoodsOfTime(foods, time) {
  let foodsHtml = '';
  let carbsTotal = 0,
    fatTotal = 0,
    proteinTotal = 0,
    weightTotal = 0;
  for (let food of foods) {
    carbsTotal += food.nutrition.carbs * food.weight / 100;
    fatTotal += food.nutrition.fat * food.weight / 100;
    proteinTotal += food.nutrition.protein * food.weight / 100;
    weightTotal += food.weight;
    foodsHtml += `
      <div class="mt-2">
          <h4>${food.name}</h4>
          <div class="row">
              <div class="text-secondary col-2 col-lg-1">
                  ${(food.nutrition.carbs * food.weight / 100).toFixed(1)} g
              </div>
              <div class="text-secondary col-2 col-lg-1">
                  ${(food.nutrition.fat * food.weight / 100).toFixed(1)} g
              </div>
              <div class="text-secondary col-2 col-lg-1">
                  ${(food.nutrition.protein * food.weight / 100).toFixed(1)} g
              </div>
              <div class="text-secondary col-2 col-lg-1">
                  ${food.weight} g
              </div>
              <div class="col-1 col-lg-2">
                <button onclick="handleUpdate('${food._id}')" class="btn btn-info">Update</button>
                <button onclick="handleDeleteFood('${food._id}')" class="btn btn-danger">Delete</button>
              </div>
          </div>
        </div>
    `;
  }

  document.querySelector(`#${time}`)
    .innerHTML = `
      <div>
          <h2>${time[0].toUpperCase()}${time.slice(1)}</h2>
          <div class="row">
              <div class="fw-bolder col-2 col-lg-1">
                 ${carbsTotal.toFixed(1)} g
              </div>
              <div class="fw-bolder col-2 col-lg-1">
                  ${fatTotal.toFixed(1)} g
              </div>
              <div class="fw-bolder col-2 col-lg-1">
                  ${proteinTotal.toFixed(1)} g
              </div>
              <div class="fw-bolder col-2 col-lg-1">
                  ${weightTotal.toFixed(1)} g
              </div>
          </div>
      </div>
      ${foodsHtml}
    `;
}


// render foods
function renderFoods() {
  const foods = data.foods;
  const breakfast = [];
  const lunch = [];
  const dinner = [];
  for (let food of foods) {
    if (food.eatTime === 'Breakfast') {
      breakfast.push(food);
    } else if (food.eatTime === 'Lunch') {
      lunch.push(food);
    } else {
      dinner.push(food);
    }
  }
  renderFoodsOfTime(breakfast, 'breakfast');
  renderFoodsOfTime(lunch, 'lunch');
  renderFoodsOfTime(dinner, 'dinner');

  let totalCarbs = 0,
      totalFat = 0,
      totalProtein = 0,
      total = 0;

  for (let food of foods) {
    totalCarbs += food.weight * food.nutrition.carbs / 100;
    totalFat += food.weight * food.nutrition.fat / 100;
    totalProtein += food.weight * food.nutrition.protein / 100;
  }

  document.querySelector('#total-carbs-text').innerHTML = totalCarbs.toFixed(1) + 'g';
  document.querySelector('#total-fat-text').innerHTML = totalFat.toFixed(1) + 'g';
  document.querySelector('#total-protein-text').innerHTML = totalProtein.toFixed(1) + 'g';


  total = totalCarbs + totalFat + totalProtein;
  if (total === 0) {
    total = 1;
  }
  document.querySelector('#total-carbs-progress').style.width = totalCarbs * 100 / total + '%';
  document.querySelector('#total-fat-progress').style.width = totalFat * 100 / total + '%';
  document.querySelector('#total-protein-progress').style.width = totalProtein * 100 / total + '%';

  const totalCalories = totalCarbs * 4 + totalFat * 9 + totalProtein * 4;
  document.querySelector('#total').innerHTML = totalCalories + ' kcal';
}



// fetch foods of current date
async function fetchFoods() {
  const dateStr = data.currentDate.getFullYear() + '-' + (data.currentDate.getMonth() + 1) + '-' + data.currentDate.getDate();
  const res = await fetch(`/api/foods/${dateStr}`);
  const foods = await res.json();
  data.foods = foods;

  renderFoods();
}
fetchFoods();

const getTwoNumbers = (n) => {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

currentDatePicker.value = `${todayDate.getFullYear()}-${getTwoNumbers(todayDate.getMonth() + 1)}-${getTwoNumbers(todayDate.getDate())}`;
currentDatePicker.addEventListener('change', function (e) {
  data.currentDate = new Date(currentDatePicker.value);

  fetchFoods();
})
// handle add food submit
const foodForm = document.querySelector('#food-form');
foodForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = e.target.elements['name'].value;
  const weight = e.target.elements['weight'].value;
  const eatTime = e.target.elements['food-time'].value;
  const eatDate = data.currentDate;
  fetch(`/api/add-food`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      weight: Number(weight),
      eatDate: eatDate.getFullYear() + '-' + (eatDate.getMonth() + 1) + '-' + eatDate.getDate(),
      eatTime
    })
  })
    .then(res => {
      if (res.status === 201) {
        alert("Add food successfully!")
      }
      if (res.status === 404) {
        alert("Not found this food")
      }
    })
})
