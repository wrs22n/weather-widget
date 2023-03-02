const inputCity = document.getElementById("cityInput");
const currentCityName = document.querySelector(".currentCity");
const form = document.querySelector("form");
const nextDayWeek = document.querySelectorAll(".day__week");
const nextDayWeather = document.querySelectorAll(".weather__image");
const nextDayDescription = document.querySelectorAll(".weather__next__day p");
const nextDayMinTemp = document.querySelectorAll(".weather__next__temp-min");
const nextDayMaxTemp = document.querySelectorAll(".weather__next__temp-max");
const currentDayWeather = document.querySelector(".weather__current__temp");
const currentDayWeatherFeel = document.querySelector(
    ".weather__current__temp-feel"
);
const currentDayDescription = document.querySelector(
    ".weather__current__description"
);
const currentDayCity = document.querySelector(".weather__current__city");

function getDayOfWeek(date) {
    const arr = ["SUN", "MON", "THE", "WED", "THU", "FRI", "SAT"];
    const todaysDate = new Date(date).getDay();
    return arr[todaysDate];
}

function cityTodayWeather(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5580d32aeeb4cd13f002ec4664031d1c`;
    fetch(currentWeatherUrl)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
            currentCityName.textContent = `Selected: ${data.name}, ${data.sys.country}`;
            currentDayWeather.innerHTML =
                Math.round(data["main"]["temp"] - 273) + "&degC";
            currentDayWeatherFeel.innerHTML =
                "Feels like " +
                Math.round(data["main"]["feels_like"] - 273) +
                "&degC";
            currentDayDescription.textContent =
                data["weather"][0]["description"];
            currentDayCity.textContent = `${data.name}, ${data.sys.country}`;
            document.querySelector(
                ".weather__current__img"
            ).innerHTML = `<img src=https://openweathermap.org/img/wn/${data["weather"][0]["icon"]}@2x.png>`;
        });
}

function cityNextWeather(city) {
    const nextWeatherUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=496295e49f0a5f6dca2a88aa4281ced3&units=metric`;
    fetch(nextWeatherUrl)
        .then((resp) => resp.json())
        .then((data) => {
            for (let j = 0; j < 4; j++) { //**** */
                const date = new Date(data.list[0]["dt_txt"]); // today's date
                let nextDay = new Date(date.setDate(date.getDate() + j + 1)); // creating 4 dates in order after today's date
                let tempMin = Infinity;
                let tempMax = -Infinity;
                for (let i = 0; i < data.list.length - 1; i++) {
                    let currentDate = new Date(data.list[i]["dt_txt"]); //creating date for each element in the list
                    if (currentDate.getDate() === nextDay.getDate()) {  // checking if day(current list item) of the month equals tomorrow's day of the month
                        if (tempMin > data.list[i]["main"]["temp_min"]) {  // finding tempMin in cuurent day
                            tempMin = data.list[i]["main"]["temp_min"];
                        }
                        if (tempMax < data.list[i]["main"]["temp_max"]) {  // finding tempMax in cuurent day
                            tempMax = data.list[i]["main"]["temp_max"];
                        }
                        nextDayMinTemp[j].innerHTML =
                            Math.round(tempMin) + "&degC"; // setting tempMin
                        nextDayMaxTemp[j].innerHTML =
                            Math.round(tempMax) + "&degC"; //setting tempMax
                        nextDayWeek[j].textContent = getDayOfWeek(   // setting day of the week
                            data.list[i]["dt_txt"]
                        );
                        nextDayWeather[
                            j
                        ].innerHTML = `<img src=https://openweathermap.org/img/wn/${data.list[i]["weather"][0]["icon"]}@2x.png>`; // setting img
                        nextDayDescription[j].textContent =
                            data.list[i]["weather"][0]["description"]; //setting  description
                    }
                }
            }
        })
        .catch((error) => console.log(error));
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const currentCity = inputCity.value;
    cityNextWeather(currentCity);
    cityTodayWeather(currentCity);
});

cityTodayWeather("Kyiv");
cityNextWeather("Kyiv");