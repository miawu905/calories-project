let currentPage = 'home';
let pages = [
  'home',
  'add-food'
];
let data = {
  currentDate: new Date(),
  foods: []
};

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

// init current date is today

const currentDatePicker = document.querySelector('#current-date');
const todayDate = new Date();

function renderFoodsOfTime(foods, time) {
  let foodsHtml = '';
  let carbsTotal = 0,
    fatTotal = 0,
    proteinTotal = 0,
    weightTotal = 0;
  for (let food of foods) {
    carbsTotal += food.nutrition.carbs * food.weight;
    fatTotal += food.nutrition.fat * food.weight;
    proteinTotal += food.nutrition.protein * food.weight;
    weightTotal += food.weight;
    foodsHtml += `
      <div class="mt-2">
          <h4>${food.name}</h4>
          <div class="row">
              <div class="text-secondary col-4 col-lg-2">
                  ${(food.nutrition.carbs * food.weight).toFixed(1)} kcal
              </div>
              <div class="text-secondary col-3 col-lg-2">
                  ${(food.nutrition.fat * food.weight).toFixed(1)} kcal
              </div>
              <div class="text-secondary col-3 col-lg-2">
                  ${(food.nutrition.protein * food.weight).toFixed(1)} kcal
              </div>
              <div class="text-secondary col-2 col-lg-2">
                  ${food.weight} g
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
              <div class="fw-bolder col-4 col-lg-2">
                 ${carbsTotal.toFixed(1)} kcal
              </div>
              <div class="fw-bolder col-3 col-lg-2">
                  ${fatTotal.toFixed(1)} kcal
              </div>
              <div class="fw-bolder col-3 col-lg-2">
                  ${proteinTotal.toFixed(1)} kcal
              </div>
              <div class="fw-bolder col-2 col-lg-2">
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
      totalProtein = 0;

  for (let food of foods) {
    totalCarbs += food.weight * food.nutrition.carbs;
    totalFat += food.weight * food.nutrition.fat;
    totalProtein += food.weight * food.nutrition.protein;
  }

  document.querySelector('#total-carbs-text').innerHTML = totalCarbs.toFixed(1) + 'g';
  document.querySelector('#total-fat-text').innerHTML = totalFat.toFixed(1) + 'g';
  document.querySelector('#total-protein-text').innerHTML += totalProtein.toFixed(1) + 'g';

  document.querySelector('#total-carbs-progress').style.width = totalCarbs * 100 / (totalCarbs + totalFat + totalProtein) + '%';
  document.querySelector('#total-fat-progress').style.width = totalFat * 100 / (totalCarbs + totalFat + totalProtein) + '%';
  document.querySelector('#total-protein-progress').style.width = totalProtein * 100 / (totalCarbs + totalFat + totalProtein) + '%';
}



// fetch foods of current date
async function fetchFoods() {
  const dateStr = todayDate.getFullYear() + '-' + (todayDate.getMonth() + 1) + '-' + todayDate.getDate();
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
