const movieURL = "http://www.omdbapi.com";
const apiKey = "cf6ab924";

const fetchData = async (params) => {
  try {
    const url = new URL(movieURL);
    url.search = new URLSearchParams({
      apikey: apiKey,
      ...params,
    });

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data); //temporary for dev
    return data;
  } catch (error) {
    console.error("Could not fetch data:", error);
    return null;
  }
};

//autocomplete template
const autocompleteRoot = document.querySelector(".autocomplete");
autocompleteRoot.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class="input" type="text" placeholder="Title" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
  <div id="target"></div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = debounce(async (e) => {
  const data = await fetchData({ s: e.target.value });
  const movies = data.Search;
  if (!movies) {
    dropdown.classList.remove("is-active");
    return;
  }

  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");

  for (let movie of movies) {
    const option = document.createElement("a");
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

    option.classList.add("dropdown-item");
    option.innerHTML = `
      <img src="${imgSrc}" />
      ${movie.Title}
    `;

    option.addEventListener("click", (e) => {
      dropdown.classList.remove("is-active");
      input.value = movie.Title;
      onMovieSelect(movie);
    });

    resultsWrapper.appendChild(option);
  }
});

input.addEventListener("input", onInput);

document.addEventListener("click", (e) => {
  if (!autocompleteRoot.contains(e.target)) {
    dropdown.classList.remove("is-active");
  }
});

const onMovieSelect = async (movie) => {
  const movieData = await fetchData({ i: movie.imdbID });
  console.log(movieData); //temporary for dev
};
