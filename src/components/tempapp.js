import React from "react";
import Country from "country-data"
import { useState,useEffect } from "react";
import { FaThermometer,FaTemperatureHigh,FaTemperatureLow } from "react-icons/fa";
import { FcCurrencyExchange } from "react-icons/fc";
import { BsFillCloudHazeFill,BsCloudsFill,BsFillCloudRainFill,BsFillCloudLightningRainFill } from "react-icons/bs"
import { WiHumidity } from "react-icons/wi";
import { TiWeatherSunny } from "react-icons/ti"
import getAllInfoByISO from "iso-country-currency";
// import 'bootstrap/dist/css/bootstrap.css';
import ReactRain from 'react-rain-animation'
import "react-rain-animation/lib/style.css";
import Clouds from "./clouds";
//import Sky from "./sky";
import './temp_app.css';

const Tempapp = () => {
    const[city,setCity] = useState(null);
    const[data,setData] = useState(null);
    const[search,setSearch] = useState('Mumbai');
    const[weather,setWeather] = useState('');
    const[country,setCountry] = useState('');
    const[currency,setCurrency]=useState();
    const[capital,setCapital] = useState('');
    const[des,setDes]=useState('');
    const[cur_in,setCur_in] = useState('');
    const[wind_speed,setWind_Speed]=useState();
    const[cury,setCury] = useState(null);
    const[continent,setContinent]=useState("")
    const[id,setId]=useState('')
    useEffect(()=>{
            const fetchApi = async()=>{
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=678f1fb6ee5e0f43c563d7876d93ab81`;
            const response = await fetch(url);
            const res_json = await response.json();
            setData(res_json.name);
            setCity(res_json.main);
            var code = res_json.sys.country;
            var cur=getAllInfoByISO.getAllInfoByISO(code).currency;
            const ex_url=`https://v6.exchangerate-api.com/v6/87adb80ec8303114c7ad2c8e/latest/${cur}`;
            const resp_exchange = await fetch(ex_url);
            const r_json_ex = await resp_exchange.json();
            const url_capital=`https://restcountries.com/v3.1/name/${Country.countries[res_json.sys.country].name}`;
            const res_cap = await fetch(url_capital);
            const js_cap = await res_cap.json();

            for(var i=0; i<js_cap.length;i++)
            {
              if(js_cap[i].name.common===Country.countries[res_json.sys.country].name)
              {
                setCapital(js_cap[i].capital[0]);
                setContinent(js_cap[i].continents[0]);
              }
            }
            setCur_in(r_json_ex.conversion_rates.INR);
            setWeather(res_json.weather[0].main);
            setDes(res_json.weather[0].description);
            setCountry(Country.countries[res_json.sys.country].name);
            setCurrency(r_json_ex.conversion_rates.USD);
            setWind_Speed(res_json.wind.speed);
            setCury(BsFillCloudHazeFill);
            
            console.log(continent);
            //console.log(r_json_ex.conversion_rates.INR);
        }
        fetchApi();
    },[search])
    return (
    <div className="container">
      <div id="main" style={{color: 'black'}}>
      
        <div className="box">
          <div className="input">
            <input
              type="search"
              className="form-control"
              placeholder="City Name"
              onChange={(event) => {setSearch(event.target.value)}}
            />
          </div>
        </div>
        <br/>
        {!city ? (
        <h1> No Data Found </h1>
        ) : (
          
         <div className="info">
          {(() => {
            if (weather ==  "Clouds") {
              return (
                <Clouds style={{color:'black', background: 'white'}} />
              )
            } else if (weather === "Haze") {
              return (
                <></>
              )
            } else if(weather == "Rain"){
              return (
                <><Clouds style={{color:'white'}} />
                <ReactRain
                numDrops="200"
                /></>
              )
            }
            else if(weather == "Clear"){
              return (
                <></>
              )
            }
            else if(weather == "Thunderstorm"){
              return (
                <><Clouds style={{color:'white'}} />
                <ReactRain
                numDrops="200"
                /></>
              )
            }
            else if(weather == "Drizzle"){
              return (
                <><Clouds style={{color:'white'}} />
                <ReactRain
                numDrops="50"
                /></>
              )
            }
            else
            {
              return(<></>)
            }
            
        })()}
        <br/>
           <h2 className="location">
             <i className="fa-solid fa-street-view"></i>
             {data}, {capital}, {country}
           </h2>
           <h3 className="weather">
             Weather: {(() => {
            if (weather ==  "Clouds") {
              return (
                <BsCloudsFill/>
              )
            } else if (weather === "Haze") {
              return (
                <BsFillCloudHazeFill/>
              )
            } else if(weather == "Rain"){
              return (
                <BsFillCloudRainFill/>
              )
            }
            else if(weather == "Clear"){
              return (
                <TiWeatherSunny />
              )
            }
            else if(weather == "Thunderstorm"){
              return (
                <BsFillCloudLightningRainFill />
              )
            }
            })()}{weather}, {des}
           </h3>
           <br/>
           <h3 className="temp_hum_wind">Temperature: <FaThermometer/>{city.temp}°C || Humidity:<WiHumidity/> {city.humidity}% || Wind Speed : <i className="fa-solid fa-wind"></i> {wind_speed}Km/h</h3>
           <h3 className="temp_min_max">Min : <FaTemperatureLow/>{city.temp_min}°C | Max : <FaTemperatureHigh/>{city.temp_max}°C</h3>
           <div>
            <br/>
            <br/>
            <h3>Exchange rate currency with respect to USD: <FcCurrencyExchange /> {currency}</h3>
            <h3>Exchange rate currency with respect to India: <FcCurrencyExchange /> {cur_in}</h3>
           </div>
         </div>)}
      </div>
    </div>
  );
};
export default Tempapp;
