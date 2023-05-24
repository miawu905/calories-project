let currentPage = 'home';
let pages = [
  'home',
  'add-food'
];
let data = {
  currentDate: new Date()
};

function renderPage() {
  pages.forEach(page => {
    if (document.querySelector(`#${page}`)) {
      document.querySelector(`#${page}`).classList.add('d-none');
    }
  });
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
      eatDate,
      eatTime
    })
  })
    .then(res => {
      if (res.status === 201) {
        alert("Add food successfully!")
      }
    })
})
