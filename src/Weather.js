import React, { useState, useEffect } from 'react'

const url =
  'https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/'

const Weather = ({ id }) => {
  const [infoAboutWeather, setInfoAboutWeather] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [color, setColor] = useState('#00ffff')
  const [temp, setTemp] = useState(0)

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      try {
        const response = await fetch(url + id)
        const data = await response.json()
        setLoading(false)
        setInfoAboutWeather(data)
        setTemp(Math.round(data.consolidated_weather[0].the_temp))
        // console.log(data)
        colorChoice(Math.round(data.consolidated_weather[0].the_temp))
      } catch (error) {
        setLoading(false)
        setError(error)
      }
    }
    fetchWeather()
  }, [id])

  const mixColors = (colorB, colorA, percent) => {
    function d2h(d) {
      return d.toString(16)
    }
    function h2d(h) {
      return parseInt(h, 16)
    }

    let color = '#'

    for (let i = 0; i <= 5; i += 2) {
      let v1 = h2d(colorA.substr(i, 2)),
        v2 = h2d(colorB.substr(i, 2)),
        val = d2h(Math.floor(v2 + (v1 - v2) * (percent / 100.0)))
      while (val.length < 2) {
        val = '0' + val
      }
      color += val
    }
    setColor(color)
  }

  const colorChoice = (temp) => {
    temp = parseInt(temp)
    if (temp <= -10) {
      return setColor(`#00ffff`)
    }
    if (temp >= 30) {
      return setColor('#ff8c00')
    }
    let percent = 0
    if (temp > 10 && temp < 30) {
      percent = (temp - 10) * 5
      mixColors('fff700', 'ff8c00', percent)
    }
    if (temp > -10 && temp <= 10) {
      percent = (temp + 10) * 5
      mixColors('00ffff', 'fff700', percent)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  } else if (error) {
    return <div>Error: {error.message}</div>
  } else {
    document.body.style.backgroundColor = color
    return (
      <section>
        {typeof infoAboutWeather.consolidated_weather != 'undefined' ? (
          <div className='weather-container'>
            <h3>
              {infoAboutWeather.title},{' '}
              {infoAboutWeather.consolidated_weather[0].weather_state_name}
            </h3>
            <p>Current temperature: {temp}&deg;C</p>
            <p>
              Temperature from{' '}
              {infoAboutWeather.consolidated_weather[0].min_temp.toFixed(1)}
              &deg;C to{' '}
              {infoAboutWeather.consolidated_weather[0].max_temp.toFixed(1)}
              &deg;C
            </p>
            <p>
              Wind speed:{' '}
              {infoAboutWeather.consolidated_weather[0].wind_speed.toFixed(1)}
              mph
            </p>
            <img
              src={`https://www.metaweather.com/static/img/weather/png/64/${infoAboutWeather.consolidated_weather[0].weather_state_abbr}.png`}
              alt='weather_state_abbr'
            />
            <div className='slider'>
              <h4>Temperature Slider</h4>
              <input
                type='range'
                min='-50'
                max='50'
                value={temp}
                onChange={(e) => {
                  colorChoice(e.target.value)
                  setTemp(e.target.value)
                }}
              ></input>
            </div>
          </div>
        ) : (
          'No info'
        )}
      </section>
    )
  }
}

export default Weather
