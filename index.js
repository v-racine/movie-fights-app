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
    onMovieSelect(movie, leftSummary, "left");
  },
});

createAutocomplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),

  onOptionSelect(movie) {
    const rightSummary = document.querySelector("#right-summary");
    onMovieSelect(movie, rightSummary, "right");
  },
});

let leftMovie;
let rightMovie;
//selecting movie details
const onMovieSelect = async (movie, summaryElement, side) => {
  const movieData = await fetchData({ i: movie.imdbID });
  summaryElement.innerHTML = movieTemplate(movieData);

  if (side === "left") {
    leftMovie = movieData;
  } else {
    rightMovie = movieData;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = +leftStat.dataset.value;
    const rightSideValue = +rightStat.dataset.value;

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else if (leftSideValue > rightSideValue) {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

//rendering movie details
const movieTemplate = (movieData) => {
  const dollars = parseInt(movieData.BoxOffice.replace(/[$,]/g, ""));
  const metascore = parseInt(movieData.Metascore);
  const imdbRating = parseFloat(movieData.imdbRating);
  const imdbVotes = parseInt(movieData.imdbVotes.replace(/,/g, ""));
  const awards = movieData.Awards.split(" ").reduce((acc, ele) => {
    const value = parseInt(ele);
    if (isNaN(value)) {
      return acc;
    } else {
      return acc + value;
    }
  }, 0);

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

    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieData.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>

    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieData.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>

    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieData.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>

    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieData.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>

    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieData.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
