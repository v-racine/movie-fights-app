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
      // Throw an error to be caught by the catch block
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch data:", error);
    return null;
  }
};

const main = async () => {
  const searchResults = await fetchData({ s: "avengers" }); //"index" search
  console.log("Search results:", searchResults);

  const movieDetails = await fetchData({ i: "tt0848228" }); //"show" search
  console.log("Movie details:", movieDetails);
};

main();
