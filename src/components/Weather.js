import axios from "axios";
import React, { useEffect, useState } from "react";
import img from "../assets/warmBg.jpg";
import { Button } from "@mui/material";

const Weather = () => {
  const [weather, setWeather] = useState({
    city: "sikar",
    min: "26.12",
    max: "26.12",
    humidity: "17",
    feels_like: "26.12",
    pressure: "1014",
    windSpeed: "3.69",
    iconCode: "icon",
    imageStatus: "sunny",
    temp: "16.4",
  });
  const [imageSrc, setImageSrc] = useState(img);
  const [inpVal, setInpVal] = useState("");
  const [cityList, setCityList] = useState([]);
  const [tempName, setTempName] = useState("Fahrenheit");
  const [tempChar, setTempChar] = useState("C");

  const fectchAPI = async (city, units = "metric") => {
    try {
      const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${"f069e4e95dfd4ee0ac8f31d6016fde57"}`;
      await axios
        .get(URL)
        .then((data) => {
          console.log(data.data);
          const weather = data.data;
          setWeather({
            city: weather.name,
            min: weather.main.temp_min,
            max: weather.main.temp_max,
            humidity: weather.main.humidity,
            feels_like: weather.main.feels_like,
            pressure: weather.main.pressure,
            windSpeed: weather.wind.speed,
            iconCode: weather.weather[0].icon || "01d",
            imageStatus: weather.weather[0].description,
            imageSrc: img,
            temp: weather.main.temp,
          });

          setCityList((prevCityList) => {
            if (!prevCityList.includes(inpVal)) {
              return [...prevCityList, inpVal];
            } else {
              return prevCityList;
            }
          });
        })
        .catch((err) => {
          console.log(err);
          return alert("Please Enter Right City Name");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const imageAPI = async (imgStatus) => {
    const image_API_KEY = "ssPGVWe1dRtFyeoBv3xzJVz4ucyecC72-ZuW-0gtBDw";
    const query = imgStatus;
    const randomImageURL = `https://api.unsplash.com/search/photos`;
    await axios
      .get(randomImageURL, {
        params: {
          query: query,
          client_id: image_API_KEY,
        },
      })
      .then((data) => {
        const image = data.data.results[0].urls.full;
        setImageSrc(image);
      })
      .catch((error) => setImageSrc(img));
  };

  useEffect(() => {
    fectchAPI("Sikar");
  }, []);

  const handleForm = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (cityname) => {
    if (!cityname) {
      return alert("Please Enter City Name");
    }
    await fectchAPI(cityname, "metric");
    await imageAPI(weather.imageStatus);
    setInpVal("");
  };

  const handletemp = async () => {
    if (cityList.length === 1) {
      console.log(tempName);
      if (tempName === "Fahrenheit") {
        setTempChar("F");
        await fectchAPI("Sikar", "imperial");
      } else {
        await fectchAPI("Sikar", "metric");
        setTempChar("C");
      }
    } else {
      console.log(cityList[cityList.length - 1]);
      if (tempName === "Fahrenheit") {
        setTempChar("F");
        await fectchAPI(cityList[cityList.length - 1], "imperial");
      } else {
        await fectchAPI(cityList[cityList.length - 1], "metric");
        setTempChar("C");
      }
    }
    setTempName((temp) => {
      return temp === "Celsius" ? "Fahrenheit" : "Celsius";
    });
  };

  return (
    <div
      className="w-[100%] flex justify-center py-5 text-white"
      style={{
        backgroundImage: `url("${imageSrc || img}")`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        minHeight: "100vh",
      }}
    >
      <div className="responsive-box">
        <form onSubmit={handleForm} className="black-box">
          <div className="flex items-stretch">
            <input
              type="text"
              placeholder="Enter City Name"
              value={inpVal}
              onChange={(e) => setInpVal(e.target.value)}
              list="cityname"
            />
            {cityList.length ? (
              <datalist id="cityname">
                {cityList.map((cityname, idx) => (
                  <option key={idx} value={cityname}>
                    {cityname}
                  </option>
                ))}
              </datalist>
            ) : (
              ""
            )}

            <Button
              variant="outlined"
              type="submit"
              onClick={(e) => handleSubmit(inpVal)}
              sx={{
                color: "white",
                border: "1px solid white",
                borderLeft: "none",
                borderTopLeftRadius: "0",
                borderBottomLeftRadius: "0",
              }}
              style={{
                paddingRight: "25px",
                fontWeight: "bolder",
                fontFamily: "cursive",
              }}
            >
              Check
            </Button>
          </div>

          <Button
            variant="contained"
            onClick={handletemp}
            sx={{
              color: "white",
              border: "1px solid white",
              bgcolor: "gray",
            }}
            style={{
              padding: "8px 0",
              fontWeight: "bolder",
              fontFamily: "cursive",
              width: "9rem",
            }}
          >
            <b>&deg;</b> <span>{tempName}</span>
          </Button>
        </form>
        <div className="black-box ">
          <h1 className="font-serif font-bold text-2xl">{weather.city}</h1>
          <div>
            <img
              src={`https://openweathermap.org/img/wn/${weather.iconCode}@2x.png`}
              alt="weater image"
            />
          </div>
          <h2 className="text-2xl">
            {weather.temp} &nbsp;
            <b>&deg;</b>
            <span className="align-sub">{tempChar}</span>
          </h2>
        </div>
        <div className="detail-box ">
          <div className="black-box">
            <p> Min</p>
            <h3>
              {weather.min} <b>&deg;</b>
              <span>{tempChar}</span>
            </h3>
          </div>
          <div className="black-box">
            <p> Max</p>
            <h3>
              {weather.max} <b>&deg;</b>
              <span>{tempChar}</span>
            </h3>
          </div>
          <div className="black-box">
            <p> Feel Like</p>
            <h3>
              {weather.feels_like} <b>&deg;</b>
              <span>{tempChar}</span>
            </h3>
          </div>
          <div className="black-box">
            <p> Pressure</p>
            <h3>
              {weather.pressure} <span>hpa</span>
            </h3>
          </div>
          <div className="black-box">
            <p>Humidity </p>
            <h3>
              {weather.humidity} <span>%</span>
            </h3>
          </div>
          <div className="black-box">
            <p> Wind Speed</p>
            <h3>
              {weather.windSpeed} <span>m/h</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
