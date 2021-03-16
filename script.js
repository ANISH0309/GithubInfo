var form = document.getElementById("myForm");

form.addEventListener("submit", (e) => {
	e.preventDefault();
	var search = document.getElementById("search").value;

	var originalUsername = search.split(" ").join("");

	fetch("https://api.github.com/users/" + originalUsername)
		.then((result) => result.json())
		.then((data) => {
			console.log(data.avatar_url);

			document.getElementById("avatar").innerHTML = `
				<img src="${data.avatar_url}">
				`;
		});
});
