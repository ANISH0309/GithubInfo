var submit_btn = document.getElementById("submit-btn");
var search = document.getElementById("search").value;
var timesClicked = 0;

$(submit_btn).click(function formSubmit(e) {
	timesClicked++;

	if (timesClicked > 1) {
		const reloadtButton = document.querySelector("#submit-btn");
		function reload() {
			reload = location.reload();
		}
		reloadButton.addEventListener("click", reload, false);
	} else {
		e.preventDefault();
		var search = document.getElementById("search").value;
		var originalUsername = search.split(" ").join("");
		var url = "https://api.github.com/users/" + originalUsername;

		fetch(url)
			.then((result) => result.json())
			.then((data) => {
				document.getElementById("avatar").innerHTML = `
				<img src="${data.avatar_url}">
				`;
			});

		fetch(url + "/followers?per_page=100")
			.then((result) => result.json())
			.then((data) => {
				document.getElementById("follower-heading").innerHTML = "Followers:";
				for (i = 0; i < data.length; i++) {
					const followers_list = document.querySelector("#followers-list");
					followers_list.classList.add("card-followers");

					const follower = document.createElement("li");
					follower.innerHTML = data[i].login;

					followers_list.append(follower);
				}
			});

		document.getElementById("repos-heading").innerHTML = "Repos:";
		fetch(url + "/repos?per_page=100")
			.then((result) => result.json())
			.then((data) => {
				var starcount = 0;
				var forkcount = 0;
				for (i = 0; i < data.length; i++) {
					const repos_container = document.querySelector("#repos-container");
					const repos_wrapper = document.createElement("div");

					const repos_para = document.createElement("ul");
					repos_para.className = "repos_para";
					repos_para.classList.add("card-repos");
					repos_wrapper.className = "repos_wrapper";

					const repo_name = document.createElement("li");
					repo_name.innerHTML = "<b>Name: </b>" + data[i].name;
					const repo_desc = document.createElement("li");
					repo_desc.innerHTML = "<b>Desc: </b>" + data[i].description;
					const repo_star_count = document.createElement("li");
					repo_star_count.innerHTML =
						"<b>Stars count: </b>" + data[i].stargazers_count;
					const repo_fork_count = document.createElement("li");
					repo_fork_count.innerHTML =
						"<b>Forks count: </b>" + data[i].forks_count;

					repos_para.appendChild(repo_name);
					repos_para.appendChild(repo_desc);
					repos_para.appendChild(repo_star_count);
					repos_para.appendChild(repo_fork_count);
					repos_wrapper.append(repos_para);
					repos_container.append(repos_wrapper);

					starcount = starcount + data[i].stargazers_count;
					forkcount = forkcount + data[i].forks_count;

					document.getElementById("languages-heading").innerHTML =
						"Languages Used";
					document.getElementById("starcount-heading").innerHTML =
						"Total Stars";
					document.getElementById("forkcount-heading").innerHTML =
						"Total Forks";
				}

				const starcount_wrapper = document.querySelector("#starcount-wrapper");
				starcount_wrapper.classList.add("starcount-card");
				starcount_wrapper.innerHTML = starcount;

				const forkcount_wrapper = document.querySelector("#forkcount-wrapper");
				forkcount_wrapper.classList.add("forkcount-card");
				forkcount_wrapper.innerHTML = forkcount;
			});

		document.getElementById("recent-act-heading").innerHTML = "Summary:";
		window.getLangStats = function getLangStats(repos) {
			var mapper = function (ent) {
					return ent.language;
				},
				reducer = function (stats, lang) {
					stats[lang] = (stats[lang] || 0) + 1;
					return stats;
				},
				langStats = repos.map(mapper).reduce(reducer, {});
			delete langStats["null"];
			return Object.keys(langStats).sort(function (a, b) {
				return langStats[b] - langStats[a];
			});
		};

		const languages = document.querySelector("#languages");
		languages.classList.add("languages-card");

		window.ghApiCallHandler = function (result) {
			if (Math.floor(result.meta.status / 100) == 2)
				languages.innerHTML = getLangStats(result.data).join(" >= ");
			else alert("Request failed with code " + result.meta.status);
		};

		window.ghApiCall = function (search) {
			var scrElm = document.createElement("script");
			scrElm.src =
				"https://api.github.com/users/" +
				encodeURI(search) +
				"/repos?callback=ghApiCallHandler&per_page=100";
			(document.head || document.getElementsByTagName("head")[0]).appendChild(
				scrElm
			);
		};
		ghApiCall(search);
	}
	document.getElementById("search").value = "";
});
