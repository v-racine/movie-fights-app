const movieURL = "http://www.omdbapi.com";
const apiKey = "cf6ab924";

//generic fetch for movie api
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
    return data;
  } catch (error) {
    console.error("Could not fetch data:", error);
    return null;
  }
};

//autocomplete widget base
const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
  },

  inputValue(movie) {
    return movie.Title;
  },

  fetchData: fetchData,

  fetchDataParams(inputValue) {
    return { s: inputValue };
  },

  parseData(data) {
    return data.Search;
  },
};

//generate two autocomplete widgets on page
createAutocomplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),

  onOptionSelect(movie) {
    const leftSummary = document.querySelector("#left-summary");
    onMovieSelect(movie, leftSummary);
  },
});

createAutocomplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),

  onOptionSelect(movie) {
    const rightSummary = document.querySelector("#right-summary");
    onMovieSelect(movie, rightSummary);
  },
});

//selecting movie details
const onMovieSelect = async (movie, summaryElement) => {
  const movieData = await fetchData({ i: movie.imdbID });
  summaryElement.innerHTML = movieTemplate(movieData);
};

//rendering movie details
const movieTemplate = (movieData) => {
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieData.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieData.Title}</h1>
          <h4>${movieData.Genre}</h4>
          <p>${movieData.Plot}</p>
        </div>
      </div>
    </article>

    <article class="notification is-primary">
      <p class="title">${movieData.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>

    <article class="notification is-primary">
      <p class="title">${movieData.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>

    <article class="notification is-primary">
      <p class="title">${movieData.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>

    <article class="notification is-primary">
      <p class="title">${movieData.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>

    <article class="notification is-primary">
      <p class="title">${movieData.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
