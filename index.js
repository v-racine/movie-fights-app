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

//autocomplete
const input = document.querySelector("input");
const onInput = debounce(async (e) => {
  let movies = await fetchData({ s: e.target.value });
  if (movies) {
    for (let movie of movies) {
      const div = document.createElement("div");

      div.innerHTML = `
      <img src="${movie.Poster}" />
      <h1>${movie.Title}</h1>
    `;
      const target = document.querySelector("#target");
      target.appendChild(div);
    }
  } else {
    movies = [];
  }
});
input.addEventListener("input", onInput);
