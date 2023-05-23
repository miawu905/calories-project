let currentPage = 'home';
let pages = [
  'home',
  'add-food'
];

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
