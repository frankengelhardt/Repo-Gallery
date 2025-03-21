// 1. HTML-Elemente & Variablen

//Auswahl der Elemente, die später mit den abgerufenen Daten befüllt werden
 
const overview = document.querySelector(".overview"); // Das Element, in dem die Benutzerdaten angezeigt werden
const username = "frankengelhardt"; // Der GitHub-Benutzername
const repoList = document.querySelector(".repo-list"); // Das Element, in dem die Repository-Liste angezeigt wird
const allReposContainer = document.querySelector(".repos"); // Das Container-Element für alle Repositories
const repoData = document.querySelector(".repo-data"); // Das Element, in dem die detaillierten Repository-Infos angezeigt werden
const viewReposButton = document.querySelector(".view-repos"); // Der Button, um die Repository-Liste erneut anzuzeigen
const filterInput = document.querySelector(".filter-repos"); // Das Eingabefeld für die Filterung der Repositories

// ===============================================================================================================

// 2. Benutzerdaten abrufen

//Asynchrone Funktion, um die Benutzerdaten von GitHub zu holen
 
const gitUserInfo = async function () {
  // Anfrage an die GitHub API, um die Benutzerdaten zu erhalten
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json(); // Umwandeln der Antwort in JSON-Format
  displayUserInfo(data); // Benutzerdaten anzeigen
};

gitUserInfo(); // Aufruf der Funktion, um die Benutzerdaten zu laden

// =============================================================================================

// 3. Benutzerdaten anzeigen

// Funktion, um die Benutzerdaten im HTML anzuzeigen
// @param {Object} data - Die Benutzerdaten, die von der GitHub API zurückgegeben wurden

const displayUserInfo = function (data) {
  const div = document.createElement("div"); // Erstellen eines neuen div-Elements für die Anzeige der Benutzerdaten
  div.classList.add("user-info"); // Hinzufügen einer CSS-Klasse "user-info" zum div-Element
  // Setzen des inneren HTML des divs mit den Benutzerdaten
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
  overview.append(div); // Anhängen des div-Elements an das "overview"-Element im HTML
  gitRepos(username); // Abrufen der Repository-Daten des Benutzers
};

// ===============================================================================================================

// 4. Repository-Daten abrufen

// Asynchrone Funktion, um die Repository-Daten von GitHub zu holen

const gitRepos = async function (username) {
  // Anfrage an die GitHub API, um die Repository-Daten zu erhalten
  const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await fetchRepos.json(); // Umwandeln der Antwort in JSON-Format
  displayRepos(repoData); // Repositories anzeigen
};

// ===============================================================================================================

// 5. Repositories anzeigen

// Funktion, um die Repository-Daten im HTML anzuzeigen 
// @param {Array} repos - Die Repositories, die von der GitHub API zurückgegeben wurden
 
const displayRepos = function (repos) {
	filterInput.classList.remove("hide");
  // Durchlaufen der Repository-Daten und Erstellen von Listenelementen für jedes Repository
  for (const repo of repos) {
    const repoItem = document.createElement("li"); // Erstellen eines neuen Listenelements (li)
    repoItem.classList.add("repo"); // Hinzufügen einer CSS-Klasse "repo" zum Listenelement
    repoItem.innerHTML = `<h3>${repo.name}</h3>`; // Setzen des inneren HTMLs des Listenelements mit dem Repository-Namen
    repoList.append(repoItem); // Anhängen des Listenelements an das "repo-list"-Element im HTML
  }
};

// Eventlistener, der auf einen Klick auf ein Repository reagiert und mehr Details dazu anzeigt

repoList.addEventListener("click", function (e) {
	if (e.target.matches("h3")) { // Wenn auf den Repository-Namen geklickt wurde
	const repoName = e.target.innerText; // Der Name des angeklickten Repositories
	getRepoInfo(repoName); // Aufruf der Funktion, um detaillierte Informationen zu diesem Repository zu laden
	}
});

// ===============================================================================================================

// 6. Repository auswählen und Details anzeigen
	
// Asynchrone Funktion, um detaillierte Repository-Informationen von GitHub zu holen
// @param {String} repoName - Der Name des angeklickten Repositories

const getRepoInfo = async function (repoName) {
	// Anfrage an die GitHub API, um detaillierte Informationen zum Repository zu erhalten
	const fetchInfo = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
	const repoInfo = await fetchInfo.json();
	// console.log(repoInfo); // Konsolenausgabe der Repository-Informationen (nur zur Debugging-Zwecken)
	
// Abrufen der Programmiersprachen, die in diesem Repository verwendet werden
const fetchLanguages = await fetch(repoInfo.languages_url);
const languageData = await fetchLanguages.json();

// Erstellen einer Liste von verwendeten Programmiersprachen
const languages = [];
for (const language in languageData) {
	languages.push(language);
}

// Zeigen der Repository-Details an
displayRepoInfo(repoInfo, languages);
};

// ===============================================================================================================

// 7. Repository-Details anzeigen

// Funktion, um die detaillierten Informationen zum Repository im HTML anzuzeigen
// @param {Object} repoInfo - Detaillierte Informationen des Repositories
// @param {Array} languages - Die Programmiersprachen, die im Repository verwendet werden

const displayRepoInfo = function (repoInfo, languages) {
	viewReposButton.classList.remove("hide"); // Anzeigen des Buttons, um alle Repositories wieder zu sehen
	repoData.innerHTML = ""; // Leeren des bisherigen Inhalts im repoData-Element
	repoData.classList.remove("hide"); // Entfernen der "hide"-Klasse, um das repoData-Element sichtbar zu machen
	allReposContainer.classList.add("hide"); // Verstecken des Containers für alle Repositories
	
// Erstellen eines neuen div-Elements für die Anzeige der Repository-Details
const div = document.createElement("div");
div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;
  // Anhängen des divs mit den Details an das repoData-Element
  repoData.append(div);
};

// ===============================================================================================================

// 8. Zurück zur Repository-Liste

// Eventlistener, der beim Klicken auf den "View Repos"-Button alle Repositories wieder anzeigt

viewReposButton.addEventListener("click", function () {
	allReposContainer.classList.remove("hide"); // Sichtbarmachen des Repositories-Containers
	repoData.classList.add("hide"); // Verstecken der Repository-Details
	viewReposButton.classList.add("hide"); // Verstecken des "View Repos"-Buttons
});

// ===============================================================================================================

// 9. Dynamische Repository-Suche

// Eventlistener, der auf Eingaben im Filterfeld reagiert und die Repositories dynamisch filtert
filterInput.addEventListener("input", function (e) {
	const searchText = e.target.value; // Der eingegebene Suchtext
	const repos = document.querySelectorAll(".repo"); // Alle Repository-Listenelemente
	const searchLowerText = searchText.toLowerCase();  // Umwandeln des Suchtexts in Kleinbuchstaben
	
// Durchlaufen aller Repositories und Anpassen der Sichtbarkeit je nach Suchtext
	for (const repo of repos) {
		const repoLowerText = repo.innerText.toLowerCase(); // Umwandeln des Repository-Namens in Kleinbuchstaben
		if (repoLowerText.includes(searchLowerText)) {  // Wenn der Repository-Name den Suchtext enthält
		repo.classList.remove("hide"); // Repository sichtbar machen
		} else {
			repo.classList.add("hide");  // Repository ausblenden
		}
	}
});

// ===============================================================================================================