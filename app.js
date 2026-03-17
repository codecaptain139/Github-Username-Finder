const inputValue = document.getElementById("username");
const searchBtn = document.getElementById("searchbtn");
const result = document.getElementById("result")


searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    let username = inputValue.value.trim();

    if(!username){
        result.innerText = "Please enter a username";
        return;
    }

    fetchUser(username);
})

function fetchUser(username){
    let userUrl = `https://api.github.com/users/${username}`;

    fetch(userUrl)
      .then(function(response){
        return response.json();
      })
      .then(function(data){
        result.innerHTML = "";

        let card = document.createElement('div');
        card.classList.add("user-card");

        
        if(data.message === "Not Found"){
            let error = document.createElement('p')
            error.innerText = "User not found";

            card.appendChild(error);
            result.appendChild(card);
        } else {
            let userName = document.createElement('h3');
            userName.innerText = data.name || data.login;

            let followers = document.createElement('p');
            followers.innerText = `Followers: ${data.followers}`;

            let userAvtar = document.createElement('img');
            userAvtar.src = data.avatar_url;

            let repoCount = document.createElement('p');
            repoCount.innerText = `Repos: ${data.public_repos}`;

            card.append(userName, followers, userAvtar, repoCount);
            result.appendChild(card);
        }
        

        console.log(data);
      })
}