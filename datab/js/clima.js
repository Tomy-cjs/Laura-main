const fetch = require('node-fetch')

const climaDl = async (query) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=548b8266f19038cfd1f6d6f007d8bc58&units=metric&lang=pt_br`)
    const res = await response.json()
    const hasil = []
    const lugar = res.name
    const continente = res.sys.country
    const clima = res.weather[0].description
    const temperatura = res.main.temp + "°C"
    const temperatura_minima = res.main.temp_min + "°C"
    const temperatura_max = res.main.temp_max + "°C"
    const visibilidade = res.visibility
    const umidade = res.main.humidity + "%"
    const vento = res.wind.speed + "km/h"
hasil.push({ lugar, continente, clima, temperatura, temperatura_minima, temperatura_max, visibilidade, umidade, vento })
return hasil
}

module.exports = { climaDl }