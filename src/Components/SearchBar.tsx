import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import "leaflet-geosearch/dist/geosearch.css";
import L from 'leaflet';


function SearchBar() {

    const provider = new OpenStreetMapProvider();

    // @ts-ignore
    const searchControl = new GeoSearchControl({
        provider: provider,
        autoComplete: true,
        autoCompleteDelay: 250,
        marker: {
            // optional: L.Marker    - default L.Icon.Default
            icon: new L.Icon.Default(),
            draggable: false,
          },
          maxMarkers: 1, // optional: number      - default 1
          retainZoomLevel: false, // optional: true|false  - default false
          animateZoom: true, // optional: true|false  - default true
          autoClose: false, // optional: true|false  - default false
          searchLabel: 'Enter address', // optional: string      - default 'Enter address'
          keepResult: false, // optional: true|false  - default false
          updateMap: true, // optional: true|false  - default true
    });

    const map = useMap();

    useEffect(() => {
        map.addControl(searchControl);
        return ():void => { map.removeControl(searchControl);}
    }, []);

    return null;
    };

export default SearchBar