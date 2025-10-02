//generic autocomplete feature
const createAutocomplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  //autocomplete template
  root.innerHTML = `
  <label><b>Search</b></label>
  <input class="input" type="text" placeholder="Title" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
  <div id="target"></div>
`;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = debounce(async (e) => {
    const data = await fetchData({ s: e.target.value });
    const items = data && data.Search;
    if (!items) {
      dropdown.classList.remove("is-active");
      return;
    }

    resultsWrapper.innerHTML = "";

    dropdown.classList.add("is-active");

    for (let item of items) {
      const option = document.createElement("a");

      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);

      option.addEventListener("click", (e) => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });

      resultsWrapper.appendChild(option);
    }
  });

  input.addEventListener("input", onInput);

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
