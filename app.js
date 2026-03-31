let currentSearch = ""; /*Current search is used to handle race condition. If a user search for 'virat' and immediately for 'rohit', both API calls simultaneously. If virat data arrives late then it could overwrite rohit's data. So by comparing currentSearch !== username we discard any responses that doesn't match the latest result.*/

const inputValue = document.getElementById("username");
const searchBtn = document.getElementById("searchbtn");
const result = document.getElementById("result");

// 🔹 Button click
searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    handleSearch();
});

// 🔹 Enter key
inputValue.addEventListener('keydown', (event) => {
    if(event.key === "Enter"){
        event.preventDefault();
        handleSearch();
    }
});

function handleSearch(){
    let username = inputValue.value.trim();

    /*This is Guard Clauses. When at the beginning of function we check for a condition and immediately return the function then it is called Guard Clause.*/
    if(!username){
        result.innerText = "Please enter a username";
        return;
    }

    currentSearch = username;

    result.innerText = "Loading...";
    searchBtn.disabled = true; /*Here we are enabling and disabling the button to stop the user from sending too many API request simultaneouly. This is called Debouncing User Input. */

    fetchUser(username);
}

// function fetchUser(username){
//     let userUrl = `https://api.github.com/users/${username}`;

//     fetch(userUrl)
//       .then(res => res.json())
//       .then(data => {

//         if(username !== currentSearch){
//           return;
//         }

//         result.innerHTML = "";

//         let card = document.createElement('div');
//         card.classList.add("user-card");

//         if(data.message === "Not Found"){
//             let error = document.createElement('p');
//             error.innerText = "User not found";
//             card.appendChild(error);
//             result.appendChild(card);
//             searchBtn.disabled = false;
//             return;
//         }

//         // USER UI
//         let userName = document.createElement('h3');
//         userName.innerText = data.name || data.login; /*This '||' is short circuit evaluation. */

//         let followers = document.createElement('p');
//         followers.innerText = `Followers: ${data.followers}`;

//         let userAvatar = document.createElement('img');
//         userAvatar.src = data.avatar_url;

//         let repoCount = document.createElement('p');
//         repoCount.innerText = `Repos: ${data.public_repos}`;

//         card.append(userName, followers, userAvatar, repoCount);

//         // REPO FETCH
//         let userRepo = `https://api.github.com/users/${username}/repos`;

//         fetch(userRepo)
//           .then(res => res.json())
//           .then(repoData => {

//             if(username !== currentSearch){
//               return;
//             }

//             let topRepo = repoData.sort((a, b) => b.stargazers_count - a.stargazers_count);
//             let top5Repo = topRepo.slice(0, 5);

//             let repoContainer = document.createElement('div');

//             if(top5Repo.length === 0){
//                 let noRepo = document.createElement('p');
//                 noRepo.innerText = "No repositories found";
//                 card.appendChild(noRepo);
//             } else {
//                 top5Repo.forEach(repo => {
//                     let repoItem = document.createElement('p');

//                     let link = document.createElement('a');
//                     link.href = repo.html_url;
//                     link.target = "_blank";
//                     link.rel = "noopener noreferrer";
//                     link.innerText = `${repo.name} ⭐ ${repo.stargazers_count}`;

//                     repoItem.appendChild(link);
//                     repoContainer.appendChild(repoItem);
//                 });

//                 card.appendChild(repoContainer);
//             }

//             result.appendChild(card);
//             searchBtn.disabled = false;
//           })
//           .catch(() => {
//             let repoFail = document.createElement('p');
//             repoFail.innerText = "Fail to load Repositories";
//             card.appendChild(repoFail);
//             searchBtn.disabled = false;
//           })
//       })
//       .catch(() => {
//         result.innerText = "Something went wrong";
//         searchBtn.disabled = false;
//       });
// }

async function fetchUser(username){
    let userUrl = `https://api.github.com/users/${username}`;

    try {
        let userRes = await fetch(userUrl);
        let data = await userRes.json();

        if(username !== currentSearch) return;

        result.innerHTML = "";

        let card = document.createElement('div');
        card.classList.add("user-card");

        if(data.message === "Not Found") {
            let error = document.createElement('p');
            error.innerText = "User not found";
            card.appendChild(error);
            result.appendChild(card);
            searchBtn.disabled = false;
            return;
        }

        let userName = document.createElement('h3');
        userName.innerText = data.name || data.login;

        let followers = document.createElement('p');
        followers.innerText = `Followers: ${data.followers}`;

        let userAvatar = document.createElement('img');
        userAvatar.src = data.avatar_url;

        let repoCount = document.createElement('p');
        repoCount.innerText = `Repos: ${data.public_repos}`;

        card.append(userName, followers, userAvatar, repoCount);

        //Repo fetch at the same level Nesting Over.
        let userRepo = `https://api.github.com/users/${username}/repos`;
        let repoRes = await fetch(userRepo);
        let repoData = await repoRes.json();

        if(username !== currentSearch) return;

        let topRepo = repoData.sort((a,b) => b.stargazers_count - a.stargazers_count);
        let top5Repo = topRepo.slice(0,5);

        let repoContainer = document.createElement('div');

        if(top5Repo.length === 0){
            let noRepo = document.createElement('p');
            noRepo.innerText = "No repo found";
            card.appendChild(repoContainer);
        } else {
            top5Repo.forEach(repo => {
                let repoItem = document.createElement('p');
                let link = document.createElement('a');
                link.href = repo.html_url;
                link.traget = "_blank";
                link.rel = "noopener noreferrer"
                link.innerText = `${repo.name} ⭐ ${repo.stargazers_count}`;
                repoItem.appendChild(link);
                repoContainer.appendChild(repoItem);
            });
            card.appendChild(repoContainer);
        }

        result.appendChild(card);
        searchBtn.disabled = false;

    } catch(error) {
        result.innerText = "Something went wrong";
        searchBtn.disabled = false;
    }
}