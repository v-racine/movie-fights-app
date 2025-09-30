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

//autocomplete with debouncer
const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const input = document.querySelector("input");
const onInput = debounce((e) => {
  fetchData({ s: e.target.value });
});
input.addEventListener("input", onInput);

// const main = async () => {
//   const searchResults = await fetchData({ s: "avengers" }); //"index" search
//   console.log("Search results:", searchResults);

//   const movieDetails = await fetchData({ i: "tt0848228" }); //"show" search
//   console.log("Movie details:", movieDetails);
// };

// main();
