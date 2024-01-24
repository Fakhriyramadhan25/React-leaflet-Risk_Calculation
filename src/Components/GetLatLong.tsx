import { useState } from "react";
import { Marker, Popup, useMapEvents  } from "react-leaflet";

export const GetLatLong = () => {
    const [position, setPosition] = useState<any[]>([]);
 
    const map = useMapEvents({
        click(e) {
            setPosition(prev=>[...prev, e.latlng]);
        },
  
    });
  
    return (
        <>
        {position && 
            position.map((data)=>
                <Marker position={data} key={data}>
                    <Popup>
                        hi there
                    </Popup>
                </Marker>
            )
        }
        </>

    )
    
  }
  