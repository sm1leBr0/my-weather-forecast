import React, { useState, useEffect } from 'react'
import Weather from './Weather'

const url =
  'https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query='
const locationUrl =
  'https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?lattlong='

function App() {
  const [cityName, setCityName] = useState('')
  const [id, setId] = useState(null)
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  })

  // get info about user coordinates
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const response = await fetch(
          locationUrl + location.latitude + ',' + location.longitude
        )
        const data = await response.json()

        setCityName(data[0].title)
        setId(data[0].woeid)
      } catch (error) {
        console.log(error)
      }
    }
    if (location.latitude == null) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCoordinates)
      } else {
        console.log('error')
      }
    } else {
      fetchPosition()
    }
  }, [location])

  const getCoordinates = (position) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }

  // get info about woeid(id) of city based on cityName
  const fetchCities = async () => {
    try {
      const response = await fetch(url + cityName)
      const data = await response.json()
      setId(data[0].woeid)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchCities()
  }
  return (
    <div className='App'>
      <form onSubmit={handleSubmit}>
        <h2>Search City</h2>
        <input
          type='text'
          value={cityName}
          onChange={(e) => {
            setCityName(e.target.value)
          }}
        />
      </form>
      {id !== null && <Weather id={id} />}
    </div>
  )
}

export default App
