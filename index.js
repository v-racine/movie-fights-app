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
    console.log(data.Search); //temporary for dev
    return data.Search;
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
  const movies = await fetchData({ s: e.target.value });
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

    resultsWrapper.appendChild(option);
  }
});

input.addEventListener("input", onInput);

document.addEventListener("click", (e) => {
  if (!autocompleteRoot.contains(e.target)) {
    dropdown.classList.remove("is-active");
  }
});
