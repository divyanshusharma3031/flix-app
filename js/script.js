// Lecture-138 : Page Router and Active link

import APIKEY from "./test.js";

// React ya baaki kisi framework mai built in hota hai Router lekin pure js mai hame sab kuch banana padega
// import APIKEY from "./apikey";
const state = {
  path: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
};

function highlightActiveLink() {
  const li = document.querySelectorAll(".nav-link");
  li.forEach((link) => {
    if (link.getAttribute("href") === state.path) {
      link.classList.add("active");
    }
  });
}

function ShowAlert(message, className) {
  const alert = document.createElement("div");
  alert.classList.add("alert", className);
  alert.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

function init() {
  const path = state.path;
  switch (path) {
    case "/":
    case "/index.html":
      displayPopularMovies();
      displaySlider();
      console.log("home");
      break;
    case "/shows.html":
      displayPopularTV();
      console.log("shows");
      break;
    case "/movie-details.html":
      displayMovieDetails();
      console.log("Movie details");
      break;
    case "/tv-details.html":
      displayShowDetails();
      console.log("Tv details");
      break;
    case "/search.html":
      Search();
      console.log("Search");
      break;
  }
  highlightActiveLink();
}

function Spinner() {
  document.querySelector(".spinner").classList.toggle("show");
}

async function fetchAPIData(endpoint) {
  Spinner();
  const API = APIKEY;
  const url = "https://api.themoviedb.org/3/";
  const response = await fetch(
    `${url}${endpoint}?api_key=${API}&language=en-US`
  );
  const data = await response.json();
  Spinner();
  return data;
}

async function searchAPIData() {
  Spinner();
  const API = APIKEY;
  const url = "https://api.themoviedb.org/3/";
  const response = await fetch(
    `${url}search/${state.search.type}?api_key=${API}&language=en-US&query=${state.search.term}&page=${state.search.page}`
  );
  const data = await response.json();
  Spinner();
  return data;
}

async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
    <a href="movie-details.html?id=${result.id}">
      <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="Movie Title" />
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${result.vote_average} / 10
    </h4>`;
    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Display Popular Movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");
  console.log(results);
  const popular_movies = document.getElementById("popular-movies");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          ${
            movie.poster_path
              ? `<img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          class="card-img-top"
          alt="Movie Title"
        />`
              : `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="Movie Title"
      />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>
        `;
    popular_movies.appendChild(div);
  });
}

async function displayPopularTV() {
  const { results } = await fetchAPIData("tv/popular");
  console.log(results);
  const popular_tv = document.getElementById("popular-shows");
  results.forEach((tv) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <a href="tv-details.html?id=${tv.id}">
          ${
            tv.poster_path
              ? `<img
          src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
          class="card-img-top"
          alt="Movie Title"
        />`
              : `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="Movie Title"
      />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${tv.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${tv.first_air_date}</small>
          </p>
        </div>
        `;
    popular_tv.appendChild(div);
  });
}

function addCommas(number) {
  number = number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return number;
}
// Display Background Image

function displayBackGroundImage(type, path) {
  const overlay = document.createElement("div");

  overlay.style.background = `url(https://image.tmdb.org/t/p/original/${path})`;
  overlay.style.backgroundSize = "cover";
  overlay.style.backgroundPosition = "center";
  overlay.style.backgroundRepeat = "no-repeat";
  overlay.style.height = "100vh";
  overlay.style.width = "100vw";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.zIndex = "-1";
  overlay.style.opacity = "0.1";
  if (type == "movie") {
    document.querySelector("#movie-details").appendChild(overlay);
  } else {
    document.querySelector("#show-details").appendChild(overlay);
  }
}

// Display Show Details
async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];

  const show = await fetchAPIData(`tv/${showId}`);

  // Overlay for background image
  displayBackGroundImage("tv", show.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `
    <div class="details-top">
    <div>
    ${
      show.poster_path
        ? `<img
      src="https://image.tmdb.org/t/p/w500${show.poster_path}"
      class="card-img-top"
      alt="${show.name}"
    />`
        : `<img
    src="../images/no-image.jpg"
    class="card-img-top"
    alt="${show.name}"
  />`
    }
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
      <p>
        ${show.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
      </ul>
      <a href="${
        show.homepage
      }" target="_blank" class="btn">Visit show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number of Episodes:</span> ${
        show.number_of_episodes
      }</li>
      <li><span class="text-secondary">Last Episode To Air:</span> ${
        show.last_episode_to_air.name
      }</li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">
      ${show.production_companies
        .map((company) => `<span>${company.name}</span>`)
        .join(", ")}
    </div>
  </div>
    `;

  document.querySelector("#show-details").appendChild(div);
}
// Display Movie Details

async function displayMovieDetails() {
  const id = location.search.split("=")[1];
  const movie = await fetchAPIData(`movie/${id}`);
  console.log(movie);
  displayBackGroundImage("movie", movie.backdrop_path);
  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
    <div>
    ${
      movie.poster_path
        ? `<img
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      class="card-img-top"
      alt=${movie.title}
    />`
        : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt=${movie.title}
  />`
    }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
        ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
       ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
      </ul>
      <a href=${
        movie.home_page
      } target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommas(
        movie.budget
      )}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommas(
        movie.revenue
      )}</li>
      <li><span class="text-secondary">Runtime:</span> ${
        movie.runtime
      } minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">
    ${movie.production_companies
      .map((company) => {
        return `<span>${company.name}</span>`;
      })
      .join(" ")}
    </div>
  </div>`;
  document.querySelector("#movie-details").appendChild(div);
}

// Display Pagination

function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `<div class="pagination">
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">${state.search.page} of ${state.search.totalPages}</div>
</div>`;
  document.querySelector('#pagination').appendChild(div);

  // Disable prev button if page 1
  if(state.search.page===1)
  {
    document.querySelector('#prev').disabled=true;
  }
  if(state.search.page===state.search.totalPages)
  {
    document.querySelector("#next").disabled=true;
  }

  document.querySelector("#next").addEventListener('click',async ()=>{
    state.search.page++;
    const { results, total_pages, page, total_results } = await searchAPIData();
    displaySearchResults(results);
  })
  document.querySelector("#prev").addEventListener('click',async ()=>{
    state.search.page--;
    const { results, total_pages, page, total_results } = await searchAPIData();
    displaySearchResults(results);
  })
}

// Search Movies/shows

function displaySearchResults(results) {
  document.querySelector("#search-results").innerHTML='';
  document.querySelector("#search-results-heading").innerHTML='';
  document.querySelector("#pagination").innerHTML='';
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <a href="${state.search.type}-details.html?id=${movie.id}">
          ${
            movie.poster_path
              ? `<img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          class="card-img-top"
          alt="Movie Title"
        />`
              : `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="Movie Title"
      />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${
            state.search.type === "movie" ? movie.title : movie.name
          }</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${
              state.search.type === "movie"
                ? movie.release_date
                : movie.first_air_date
            }</small>
          </p>
        </div>
        `;
    document.querySelector("#search-results-heading").innerHTML = `<h2>
        ${results.length} of ${state.search.totalResults}
        </h2>`;
    document.querySelector("#search-results").appendChild(div);
  });
  displayPagination();
}

async function Search() {
  const queryString = location.search; //? ke baad ka saara data
  const url_params = new URLSearchParams(queryString); //parameters ko seperate kardega simply
  state.search.type = url_params.get("type");
  state.search.term = url_params.get("search-term");
  if (state.search.term !== "" && state.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();
    state.search.page = page;
    state.search.totalPages = total_pages;
    state.search.totalResults = total_results;
    console.log(results);
    if (results.length === 0) {
      ShowAlert("No Result Found", "error");
      return;
    }

    displaySearchResults(results);
  } else {
    ShowAlert("Please enter search term", "error");
  }
}

document.addEventListener("DOMContentLoaded", init);
