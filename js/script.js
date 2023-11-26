// global variables
const username = "lee77carter"
const overview = document.querySelector(".overview");
const repoList = document.querySelector(".repo-list");
const selectRepos = document.querySelector(".repos");
const selectReposData = document.querySelector(".repo-data");
const backButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

// fetch user
const getUserData = async function () {
    const res = await fetch(`https://api.github.com/users/${username}`);
    const data = await res.json();
    displayUserInfo(data); // display user data
};
getUserData();

// fetch user data info
const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
        <figure>    
            <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Bio:</strong> ${data.bio}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div>
        `;
    overview.append(div);
    getRepos(username);
};

// fetch repos 
const getRepos = async function (username) {
    const showRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await showRepos.json();
    displayRepos(repoData);
};
// Display info about each repo
const displayRepos = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};
// event listener on click
repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
      const repoName = e.target.innerText;
      getRepoInfo(repoName);
    }
  });

// function that gets specific repo information
const getRepoInfo = async function (repoName) {
    const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();
    console.log(getRepoInfo);
    // get languages
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    // create language array
    const languages = [];
    for (const language in languageData) {
      languages.push(language);
    }
  
    displayRepoInfo(repoInfo, languages);  
};
// displays high level repo content
const displayRepoInfo = function (repoInfo, languages) {
    backButton.classList.remove("hide");
    selectReposData.innerHTML = "";
    selectReposData.classList.remove("hide");
    selectRepos.classList.add("hide");
    // styling repo output
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>Name: ${repoInfo.name}</h3>
      <p>Description: ${repoInfo.description}</p>
      <p>Default Branch: ${repoInfo.default_branch}</p>
      <p>Languages: ${languages.join(", ")}</p>
      <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    selectReposData.append(div);
  };

backButton.addEventListener("click", function () {
    selectRepos.classList.remove("hide");
    selectReposData.classList.add("hide");
    backButton.classList.add("hide");
});
backButton();

// search
filterInput.addEventListener("input", function (e) {
    const searchText = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const searchLowerCaseText = searchText.toLowerCase();
  
    for (const repo of repos) {
      const lowerCaseText = repo.innerText.toLowerCase();
      if (lowerCaseText.includes(searchLowerCaseText)) {
        repo.classList.remove("hide");
      } else {
        repo.classList.add("hide");
      }
    }
  });   