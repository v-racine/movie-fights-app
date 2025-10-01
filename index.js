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

//autocomplete
const input = document.querySelector("input");
const onInput = debounce((e) => {
  fetchData({ s: e.target.value });
});
input.addEventListener("input", onInput);
