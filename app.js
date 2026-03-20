let currentSearch = "";

const inputValue = document.getElementById("username");
const searchBtn = document.getElementById("searchbtn");
const result = document.getElementById("result")

 let timer;

inputValue.addEventListener('input', () => {
    let username = inputValue.value.trim();

    if(!username){
        result.innerHTML = "";
        return;
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
        currentSearch = username;
        result.innerText = "Loading...";
        searchBtn.disabled = true;

        fetchUser(username);
      }, 500);
  });


searchBtn.addEventListener('click', (event) => {
    event.preventDefault(); //to stop the form from reloading or refreshing.
    let username = inputValue.value.trim(); //use value to get the user typed data and use trim to remove leading and trailing white space.

    currentSearch = username;

    // Quick check if user doesn't type anything then there is no need to run the function.
    if(!username){
        result.innerText = "Please enter a username";
        return;
    }

    clearTimeout(timer);
    currentSearch = username;

    result.innerText = "Loading...";
    searchBtn.disabled = true; //Button Disabled.

    fetchUser(username);
});


function fetchUser(username){
    let userUrl = `https://api.github.com/users/${username}`; //Made a custon link from template literal string method.

    // searchBtn.disabled = true;

    fetch(userUrl) //this fetch data from the API
      .then(function(response){ //this .then catch the response from the API
        return response.json(); //use .json() because response data is not in a usable manner so this method convert this into usable data format.
      })

      .then(function(data){ //and then this .then catch the response 

        if(username !== currentSearch){
          return;
        }

        result.innerHTML = ""; //first clean the existing part from the result div.

        let card = document.createElement('div'); //make a div to store user info.
        card.classList.add("user-card"); //add class to easily give styling later.
        
        if(data.message === "Not Found"){ //When API not able to find the user then it shows Not Found.
            let error = document.createElement('p') //create para element when no user is exist.
            error.innerText = "User not found"; //and print the text innerText.

            card.appendChild(error); //and then append the error into card
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
        }

        result.appendChild(card);
        searchBtn.disabled = false; //Button Enabled.

        // console.log(data);
      })

      .catch(function (){
        result.innerText = "Something went wrong";
        // console.log("Something went wrong");
        searchBtn.disabled = false; //Button Enabled.
      });
}