// const API_KEY = "67587a68d9e432db423bb896d387c780" ;

// async function fetchWeartherdetails() {
//     // let latitude = ;
//     // let longitude = ;
//     try {
//         let city = "goa";

//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
//         const data = await response.json();
//         console.log("Weather data :-> " , data);

//         let newPara = document.createElement('p');
//         newPara.textContent = `${data?.main?.temp.toFixed(2)} ℃`

//         document.body.appendChild(newPara);

//     }

//     catch(err){
//         //
//     }

    
// }

// // 67587a68d9e432db423bb896d387c780

const userTab = document.querySelector("[data-userWeather]");

const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");

// initial variables

let currentTab = userTab;
const API_KEY = "67587a68d9e432db423bb896d387c780";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        // current tab bg colour switching

        if(!searchForm.classList.contains("active")) {
            // if search form container invisible,make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        }

        else {
            // make your weather visible
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now since in weather, get coordinates from local storage
            getfromSessionStorage();

        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

// check if coordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // local coordinate not found !
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grant cont. invisible
    grantAccessContainer.classList.remove("active");
    // make laoder visible
    loadingScreen.classList.add("active");
    
    //API call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        // hw
    }

}

function renderWeatherInfo (weatherInfo){
    // firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");

    const countryIcon = document.querySelector("[data-countryIcon]");

    const desc = document.querySelector("[data-weatherDesc]");

    const weatherIcon = document.querySelector("[data-weatherIcon]");

    const temp = document.querySelector("[data-temp]");

    const windspeed = document.querySelector("[data-windspeed]");

    const humidity = document.querySelector("[data-humidity]");

    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values from weatherInfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;

    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText = weatherInfo?.weather?.[0]?.description;

    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText = weatherInfo?.main?.temp;

    windspeed.innerText = weatherInfo?.wind?.speed;  
    
    humidity.innerText = weatherInfo?.main?.humidity;

    cloudiness.innerText = weatherInfo?.clouds?.all;


}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        // hw - show alert 
    }
}

function showPosition(position){

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName =searchInput.value;

    if(cityName === "")
        return;
    else    
        fetchSearchWeatherInfo(cityName) ;
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        // hw
    }

}