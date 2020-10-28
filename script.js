'use strict'
const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const PHOTOS_NUMBER = 20
const HOUR = 12

let time_h = document.querySelector('.time-h'),
    time_d = document.querySelector('.time-d'),
    greeting = document.querySelector(".greeting-phrase"),
    username = document.querySelector(".username"),
    focus = document.querySelector(".focus"),
    btn_photos = document.querySelector(".btn-photos"),
    btn_ok_photo = document.querySelector(".btn-ok-photo"),
    btn_cancel_photo = document.querySelector(".btn-cancel-photo"),
    quote = document.querySelector('.quote'),
    btn_quote = document.querySelector('.btn_quote'),
    btn_ok_weather = document.querySelector('.btn-ok-weather'),
    btn_weather_icon = document.querySelector('.weather-icon'),
    city = document.querySelector('.city')


let wallpaperIndex = -1
let photos = []

function showTime() {
    let today = new Date()
    let month = today.getMonth() // 9 (start from 0)
    let day = today.getDate()  // 22
    let dayName = today.getDay()
    let hour = today.getHours()
    let min = today.getMinutes()
    let sec = today.getSeconds();

    hour = HOUR

    time_h.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
    time_d.innerHTML = `${getDayName(dayName)}<span>,</span>${(day)}<span> </span>${getMonth(month)}`;

    if (document.activeElement !== document.getElementById("username")) {
        getUserName()
    }
    if (document.activeElement !== document.getElementById("focus")) {
        getFocus()
    }

    if (document.activeElement !== document.getElementById("city")) {
        getCity()
    }

    if (min === 0 && sec === 0) {
        setWallpaper()
    }

    setTimeout(showTime, 1000);
}

function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function getDayName(day) {
    return DAY[day]
}

function getMonth(mon) {
    return MONTH[mon]
}

function getUserName() {
    if (localStorage.getItem('username') === null) {
        username.textContent = '[Enter Name]'
    } else {
        username.textContent = localStorage.getItem('username')
    }
}

function setUserName(e = "keypress") {
    if (e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem('username', e.target.innerText)
            username.blur()//???
        }
    } else {
        username.textContent = e.target.innerText
    }
}

function setEmptyName(e) {
    username.textContent = ""
    username.style.minWidth = "100px"
    username.style.position = "fixed"
}

function getFocus() {
    if (localStorage.getItem('focus') === null) {
        focus.textContent = '[Enter Focus]'
    } else {
        focus.textContent = localStorage.getItem('focus')
    }
}

function setFocus(e = "keypress") {
    if (e.type === 'keypress') {
        if (e.which === 13 || e.keyCode == 13) {
            localStorage.setItem('focus', e.target.innerText)
            focus.blur()
        }
    } else {
        focus.textContent = e.target.innerText
    }
}

function setEmptyFocus(e) {
    focus.textContent = ""
    focus.style.minWidth = "100px"
}
//position: absolute | fixed | relative | static | inherit


// PHOTOS

/**
 * generate random photos list
 */
function generateDayPhotos() {
    let morning = "./assets/images/morning/",
        day = "./assets/images/day/",
        evening = "./assets/images/evening/",
        night = "./assets/images/night/"
    let timeslot = [morning, day, evening, night]

    for (let i = 0; i < 4; i++) {
        let randStartNum = Math.ceil(Math.random() * PHOTOS_NUMBER) + 1
        for (let j = randStartNum; j < randStartNum + 6; j++) {
            let index = j !== PHOTOS_NUMBER ? j % PHOTOS_NUMBER : 20
            photos.push(timeslot[i] + addZero(index) + ".jpg")
        }
    }
}

btn_photos.addEventListener("click", function (e) {
    let modal = document.getElementById("modal-window-photos");
    wallpaperIndex = -1
    fillModalWindowWithPhotos()
    modal.style.display = "block"

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
})

function fillModalWindowWithPhotos() {
    let photos_list = document.querySelector(".photos-card")
    let photoCard = ""
    for (let i = 0; i < photos.length; i++) {
        photoCard += "<div class='photo-card'><img class='background-wallpaper' id='" + i + "' src='" + photos[i] + "'></div>"
    }
    photos_list.innerHTML = photoCard
    let background_wallpaper = document.querySelectorAll(".background-wallpaper")

    for (let i = 0; i < background_wallpaper.length; i++) {
        let wallpaper = background_wallpaper[i]
        wallpaper.addEventListener('click', function (e) {
            wallpaperIndex = e.target.id
            changeBackgroundWallpaper(wallpaperIndex)
            changePhotosOrder(wallpaperIndex)
            document.getElementById("modal-window-photos").style.display = "none";
        })
    }
}

btn_ok_photo.addEventListener("click", function () {
    if (wallpaperIndex !== -1) {
        changeBackgroundWallpaper(wallpaperIndex)
        changePhotosOrder(wallpaperIndex)
        document.getElementById("modal-window-photos").style.display = "none";
    } else
        alert("Choose image or click cancel")
})

function changeBackgroundWallpaper(wallpaperIndex) {
    document.body.style.backgroundImage = `url(${photos[wallpaperIndex]})`;
}

function changePhotosOrder(wallpaperIndex) {
    let temp = []
    for (let i = wallpaperIndex; i < photos.length; i++) temp.push(photos[i])
    for (let i = 0; i < wallpaperIndex; i++) temp.push(photos[i])
    photos = temp
}

function setWallpaper() {
    let today = new Date()
    let hour = today.getHours()
    let min = today.getMinutes()
    let sec = today.getSeconds()

    hour = HOUR

    // утро 6:00-12:00,
    if (hour >= 6 && hour < 12) {
        greeting.textContent = 'Good Morning, ';
        document.body.style.color = 'white';
    }
    // день 12:00-18:00,
    if (hour >= 12 && hour < 18) {
        document.body.style.backgroundImage =
            "url('./assets/images/day/')";
        greeting.textContent = 'Good Afternoon, ';
        document.body.style.color = 'white';
    }
    // вечер 18:00-24:00,
    if (hour >= 18 && hour <= 23) {
        document.body.style.backgroundImage =
            "url('https://i.ibb.co/3mThcXc/afternoon.jpg')";
        greeting.textContent = 'Good Evening, ';
        document.body.style.color = 'white';
    }
    // ночь 24:00-6:00.
    if (hour >= 0 && hour < 6) {
        document.body.style.backgroundImage =
            "url('https://i.ibb.co/924T2Wv/night.jpg')";
        greeting.textContent = 'Good Evening, ';
        document.body.style.color = 'white';
    }

    document.body.style.backgroundImage = `url(${photos[hour]})`;
}

btn_cancel_photo.addEventListener("click", function () {
    document.getElementById("modal-window-photos").style.display = "none";
})


// QUOTES

// https://type.fit/api/quotes - список цитат   [
//   {
//     "text": "Genius is one percent inspiration and ninety-nine percent perspiration.",
//     "author": "Thomas Edison"
//   },
//https://api.adviceslip.com/advice - рандомно одну цитату
// {"slip": { "id": 60, "advice": "Fail. Fail again. Fail better."}}

//todo del comment
btn_quote.addEventListener("click", function () {
    getQuote()
})

async function getQuote() {
    const url = `https://type.fit/api/quotes`;
    const res = await fetch(url)
    const data = await res.json()
    quote.textContent = data.slip.advice
    console.log(quote.textContent)

}

// WEATHER
btn_weather_icon.addEventListener('click', function () {
    let modal = document.getElementById("modal-window-weather")
    modal.style.display = "block"

    showWeather()


    window.onclick = function (event) {
        if (event.target == modal)
            modal.style.display = "none"
    }
})

function getCity() {
    if (localStorage.getItem('city') === null) {
        city.textContent = '[Enter City]'
    } else {
        city.textContent = localStorage.getItem('city')
    }
}

function setCity(e) {
    if (e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem('city', e.target.innerText)
            city.blur()
        } else {
            city.textContent = e.target.innerText
        }
    }
}

function setEmptyCity(e) {
    city.textContent = ""
    city.style.minWidth = "64px"
// city.style.position = "absolute"
}

function showWeather() {
    if (localStorage.getItem('city') === null) {
        alert("Enter city")
    } else {
        let city = localStorage.getItem('city')
        // console.log(data.main.temp)
        // console.log(data.main.humidity)
        // console.log(data.wind.speed)
        getWeather(city)
    }
}

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&appid=d3a63f3214889816d993cf9d381c1414&units=metric`
    const res = await fetch(url);

    try {
        const data = await res.json();
        // console.log(data)
        // console.log(data.weather)

        let weather_block = document.querySelector(".weather-block")
        let card = "<div class='weather-card'>"
        card += "<img src='./assets/icons/temp.png' width='50px' height='50px'>"
        card += "<h1>" + city + "</h1>"
        card += "<h3 >Temperature ::  " + data.main.temp + "</h3>"
        card += "<h3 >Humidity ::  " + data.main.humidity + "</h3>"
        card += "<h3 >Winter Speed :: " + data.wind.speed + "</h3>"
        card += "</div>"
        weather_block.innerHTML = card
    }catch (e){
        let weather_block = document.querySelector(".weather-block")
        let card = "<div class='weather-card'>"
        card += "<img src='./assets/icons/temp.png' width='50px' height='50px'>"
        card += "<h1>" + "You Enter incorrect city; try again" + "</h1>"
        weather_block.innerHTML = card
    }

}


btn_ok_weather.addEventListener('click', function () {
    let modal = document.getElementById("modal-window-weather")
    modal.style.display = "none"
})


username.addEventListener("keypress", setUserName)
username.addEventListener("click", setEmptyName)
focus.addEventListener("keypress", setFocus)
focus.addEventListener("click", setEmptyFocus)
city.addEventListener('keypress', setCity)
city.addEventListener('click', setEmptyCity)

showTime()
getUserName()
getFocus()
getCity()
generateDayPhotos()
setWallpaper()
//todo del comment
// getQuote()
console.log(photos)
