import * as React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import MapboxCircle from 'mapbox-gl-circle'
import './Map.css'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || ''

const LS_LAST_SEARCH = 'last-search'

const initMap = (mapContainer: HTMLDivElement, searchBox: HTMLDivElement) => {
  const map = new mapboxgl.Map({
    container: mapContainer,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [3, 46],
    zoom: 5,
  })

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    language: 'fr-FR',
    countries: 'fr',
    mapboxgl: mapboxgl,
    zoom: 14,
    placeholder: 'Saisis une adresse pour tracer le rayon de 1km',
  })
  searchBox.innerHTML = ''
  searchBox.appendChild(geocoder.onAdd(map))

  geocoder.on('result', ({ result }: any) => {
    window.localStorage.setItem(LS_LAST_SEARCH, result.place_name)

    // 1km
    const circle = new MapboxCircle(result.center, 1000, {
      strokeColor: '#4668F2',
      strokeWeight: 1,
      fillColor: '#4668F2',
      fillOpacity: 0.1,
    })
    circle.addTo(map)

    // 20km
    const circle2 = new MapboxCircle(result.center, 20000, {
      strokeColor: '#4668F2',
      strokeWeight: 2,
      fillOpacity: 0,
    })
    circle2.addTo(map)
  })

  const lastSearch = window.localStorage.getItem(LS_LAST_SEARCH)
  if (lastSearch) {
    geocoder.query(lastSearch)
  }

  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  )

  return map
}

const Map = () => {
  const mapContainer = React.useRef<HTMLDivElement | null>(null)
  const searchBox = React.useRef<HTMLDivElement | null>(null)

  React.useEffect((): any => {
    if (mapContainer.current && searchBox.current) {
      const map = initMap(mapContainer.current, searchBox.current)
      return () => map.remove()
    }
    return null
  }, [])

  return (
    <div>
      <div id="map" ref={mapContainer} />
      <div id="search-box" ref={searchBox} />
      <div id="credits">
        <span>
          Fait avec ❤️ par <a href="https://valentin-hervieu.fr">Valentin</a> (
          <a href="https://github.com/ValentinH/confines">code source</a>)
        </span>
      </div>
    </div>
  )
}

export default Map
