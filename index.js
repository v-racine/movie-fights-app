const movieURL = "http://www.omdbapi.com";
const apiKey = "/?apikey=cf6ab924&";
const search = "s=avengers";
const movieId = "i=tt0848228";

const fetchData = async () => {
  const response = await fetch(movieURL + apiKey + movieId);
  const data = await response.json();
  console.log(data);
};

fetchData();
