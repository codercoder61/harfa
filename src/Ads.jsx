import React, { useState, useEffect ,useRef} from "react";
import "./Ads.css"
import Header from './Header'
import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
function LocationMarker({ position, setPosition, setAddressInput }) {
  const map = useMap();

 const fetchAddress = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=79f59e686d9c4881b2478ba24e3b1416`
    );
    const data = await res.json();
    const result = data.results[0];
    if (result) {
      setAddressInput(result.formatted); // simple, readable address
    } else {
      setAddressInput("");
    }
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    setAddressInput("");
  }
};


  useMapEvents({
    click(e) {
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      setPosition({ lat, lng });
      fetchAddress(lat, lng); // update address input on map click
    },
  });

  return position ? (
    <Marker
      position={[position.lat, position.lng]}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          const lat = latlng.lat.toFixed(6);
          const lng = latlng.lng.toFixed(6);
          setPosition({ lat, lng });
          fetchAddress(lat, lng); // also update address on drag
        },
      }}
    />
  ) : null;
}

function FlyToLocation({ position }) {
  const map = useMap();
  if (position) {
    map.flyTo([position.lat, position.lng], 14);
  }
  return null;
}

const SelectLocationMap = ({ position, setPosition, addressInput, setAddressInput }) => {
  const [suggestions, setSuggestions] = useState([]);
  const timeoutRef = useRef(null);

  const handleInputChange = (e) => {
  const query = e.target.value;
  setAddressInput(query);

  if (timeoutRef.current) clearTimeout(timeoutRef.current);
  if (!query || query.length < 2) return setSuggestions([]); // <-- add minimum length check

  timeoutRef.current = setTimeout(async () => {
    try {
      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=79f59e686d9c4881b2478ba24e3b1416&limit=5`
      );
      const data = await res.json();
      setSuggestions(data.results);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  }, 400);
};


  const handleSuggestionClick = (place) => {
    const lat = parseFloat(place.geometry.lat).toFixed(6);
    const lng = parseFloat(place.geometry.lng).toFixed(6);
    setPosition({ lat, lng });
    setAddressInput(place.formatted);
    setSuggestions([]);
  };

  return (
    <>
      <div style={{ marginBottom: "1rem", position: "relative" }}>
        <input
          type="text"
          placeholder="Rechercher addresse..."
          value={addressInput}
          onChange={handleInputChange}
          style={{ padding: "8px", width: "100%", fontSize: "16px", border: "1px solid #ccc" }}
        />
        {suggestions.length > 0 && (
          <ul style={{
            listStyle: "none",
            margin: 0,
            padding: "8px",
            border: "1px solid #ddd",
            position: "absolute",
            backgroundColor: "white",
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 81000,
          }}>
            {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              style={{ padding: "6px", cursor: "pointer" }}
            >
              {item.formatted}
            </li>
          ))}
          </ul>
        )}
      </div>

      <MapContainer
        center={[31.63, -7.99]}
        zoom={6}
        scrollWheelZoom
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
  position={position}
  setPosition={setPosition}
  setAddressInput={setAddressInput}
/>

        <FlyToLocation position={position} />
      </MapContainer>

      {position && (
        <p style={{ marginTop: "1rem" }}>
          <strong>Latitude:</strong> {position.lat}, <strong>Longitude:</strong> {position.lng}
        </p>
      )}
    </>
  );
};

function Ads() {
	const [open, setOpen] = useState(true);
	  const [isMobile, setIsMobile] = useState(window.innerWidth < 400);
useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 400);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])
	useEffect(() => {
  document.body.style.overflow = open ? 'hidden' : 'auto';
}, [open]);

	const aside11 = useRef(null)

	const aside22 = useRef(null)
	const filt = useRef(null)
	const over = useRef(null)
  const handleRangeChange = (e)=>{
            setRange(e.target.value)
        }
            const [range,setRange] = useState(50)

  // Returns distance in kilometers
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}


    const [ads, setAds] = useState([]);

const handleFindNearby = (adsData) => {
  if (!position?.lat || !position?.lng) return;

  const userLat = Number(position.lat);
  const userLng = Number(position.lng);

  const filtered = adsData
    .map(item => {
      if (!item.user?.lattitude || !item.user?.longitude) return null;

      const adLat = Number(item.user.lattitude);
      const adLng = Number(item.user.longitude);
      
      const distance = getDistanceFromLatLonInKm(
        userLat,
        userLng,
        adLat,
        adLng
      );

      return { ...item, distance };
    })
    .filter(Boolean)
    .filter(item => item.distance <= range)
    .sort((a, b) => a.distance - b.distance);

  setAds(filtered);
};


    const [keyword, setKeyword] = useState("");
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const [type, setType] = useState(1);
    const [cateId, setCateId] = useState("");
  // Remove
  function getGlobalSubOrder(obj) {
  let count = 0;
  
  for (let e = 1; e <= 6; e++) {
    const subcats = labels[e];
    const keys = Object.keys(subcats).filter(k => k !== '0'); // ignore main
    if (e === obj.entreprise) {
      const idx = keys.indexOf(String(obj.sub));
      if (idx === -1) return -1; // sub not found
      return count + idx;
    }
    count += keys.length; // add all subcategories before current entreprise
  }
  return -1; // entreprise not found
}
    const sendData = async () => {
  const formData = new FormData();

  const token = JSON.parse(localStorage.getItem("token"));
  const order = getGlobalSubOrder(token) + 1;

  formData.append("label", order);
  formData.append("max", max);
  formData.append("min", min);
  formData.append("keyword", keyword);
  formData.append("type", type);
  formData.append("position", JSON.stringify(position));

  try {
    const res = await axios.post(
      "https://soc-net.info/harfa/filter.php",
      formData
    );

    // IMPORTANT: pass fresh dat
    handleFindNearby(res.data);
  } catch (error) {
    console.error(error);
  }
};


useEffect(() => {
  const fetchAds = async () => {
    const response = await axios.get("https://soc-net.info/harfa/getAds.php");
    setAds(response.data);
  };

  fetchAds();
}, []);

  const [selected, setSelected] = useState(null);
// example: { entreprise: 1, sub: 3 }

  const labels = {
  1: {
    0: "Emploi",
    1: "Centre d'appels",
    2: "Cadres",
    3: "Métiers IT",
    4: "Administratif",
    5: "Commercial",
    6: "Autres Emploi",
  },
  2: {
    0: "Services",
    1: "Femmes de ménage, Nounous",
    2: "Gardiennage et Sécurité",
    3: "Rénovation, Bricolage, Travaux de maison et jardin",
    4: "Chauffeur, Déménagement, Transport de marchandise",
    5: "Cuisinières, Serveur, Barman",
    6: "Coiffure et Esthétique",
    7: "Infirmier et Kinésithérapeute",
    8: "Services Informatique et réparation",
    9: "Services Administratif, Financier, Juridique",
    10: "Autres Services",
  },
  3: {
    0: "Stages, Cours et Formations",
    1: "Cours et Formations",
    2: "Stages",
    3: "Location de salle de formation",
  },
  4: {
    0: "Business et affaire commerciale",
  },
  5: {
    0: "Évènements",
    1: "Animation",
    2: "Traiteur",
    3: "Conférences",
    4: "Autres évènements",
  },
  6: {
    0: "Autre",
  },
};




// Clear all
  const [position, setPosition] = useState(null);
   const [addressInput, setAddressInput] = useState("");
    const [isHovered,setIsHovered] = useState(false)

    const [isMapVisible,setMapVisible] = useState(false)


    const [isEmploi,setIsEmploi] = useState(false)

    const [isServices,setIsServices] = useState(false)

    const [isStages,setIsStages] = useState(false)

    const [isEvents,setIsEvents] = useState(false)

    const [border,setBorder] = useState(false)
    const [border1,setBorder1] = useState(false)
    const [border2,setBorder2] = useState(false)
    const [aside1,setAside1] = useState(true)
    const [aside2,setAside2] = useState(false)


    const [token,setToken] = useState({})

 
    const [flag,setFlag] = useState(true)
    const styles1 = {
      height:"fit-content"
    };
    const styles2 = {
      height:"0px"
    }
    const isActive = (entreprise, sub) =>
  selected?.entreprise === entreprise && selected?.sub === sub;

    const handleClick = (data) => {
      // save object
        setSelected(data);

      localStorage.setItem("token", JSON.stringify(data));
      //className=g(JSON.parse(localStorage.getItem("token")).entreprise)
      //className=g(data)
      const token = JSON.parse(localStorage.getItem("token"));
      setToken(token)
    };

    const handleBack = ()=>{
      setAside1(true);
      setAside2(false)
    }

    const handleSubmit = (e)=>{
      e.preventDefault()
    }

    const setEmploi = ()=>{
        if(isEmploi){
          setIsEmploi(false)
        }else{
          setIsEmploi(true)
        }
        setIsServices(false)
        setIsStages(false)
        setIsEvents(false)
      
    }
    const setServices = ()=>{
     
        if(isServices){
                setIsServices(false)

        }else{
                setIsServices(true)

        }
      setIsEmploi(false)
      setIsStages(false)
      setIsEvents(false)
      
    }
    const setStages = ()=>{
      if(isStages){
                setIsStages(false)

        }else{
                setIsStages(true)

        }
      setIsEmploi(false)
      setIsServices(false)
      setIsEvents(false)
     
      
    }
    const setEvents = ()=>{
     if(isEvents){
                setIsEvents(false)

        }else{
                setIsEvents(true)

        }
      setIsEmploi(false)
      setIsServices(false)
      setIsStages(false)
    
    }

  return (<>
      <Header/>

    <div id='main'>

      {aside1 && <aside style={{
    display: open && !isMobile ? "flex": "none"
  }} ref={aside11} id='bn'>
        <h3 style={{margin:'10px 0'}}>Sélectionner la catégorie:</h3>
        <div style={{display:'flex',flexDirection:'column'}}>
          <div className={isActive(1, 0) ? "active-option" : ""}>
            <div
 onClick={()=>{handleClick({ entreprise: 1, sub: 0 });setEmploi()}}>
              <i className="fa-solid fa-suitcase"></i>
              <span>Emploi</span>
            </div>
            <i className="fa-solid fa-caret-down"></i>
          </div>
          {isEmploi && <div className="sub">
               <div className={isActive(1,1) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 1, sub: 1 })}>
                        <i className="fa-solid fa-headset"></i>

                  <span>Centre d'appels</span>
                </div>
                <div className={isActive(1,2) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 1, sub: 2 })}>
                  <i className="fa-solid fa-ring"></i>
                  <span>Cadres</span>
                </div>
                <div className={isActive(1,3) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 1, sub:3 })}>
                  <i className="fa-brands fa-affiliatetheme"></i>
                  <span>Métiers IT</span>
                </div>
                <div className={isActive(1,4) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 1, sub: 4 })}>
                  <i className="fa-brands fa-angellist"></i>
                  <span>Administratif</span>
                </div>
                <div className={isActive(1,5) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 1, sub: 5 })}>
                  <i className="fa-solid fa-angles-up"></i>
                  <span>Commercial</span>
                </div>
                <div className={isActive(1,6) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 1, sub: 6 })}>
                  <i className="fa-solid fa-apple-whole"></i>
                  <span>Autres Emploi</span>
                </div>
              </div>}
            </div>
             <div style={{display:'flex',flexDirection:'column'}}>
	<div className={isActive(2,0) ? "active-option" : ""}>
		<div onClick={()=>{setServices();handleClick({ entreprise: 2, sub: 0 })}} >
			<i className="fa-brands fa-servicestack"></i>
			<span>Services</span>
		</div>
		<i className="fa-solid fa-caret-down"></i>
	</div>
	{isServices && <div className="sub">
		<div className={isActive(2,1) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 2, sub: 1 })}>
      <i className="fa-solid fa-arrows-left-right"></i>
			<span>Femmes de ménage, Nounous</span>
		</div>
		<div className={isActive(2,2) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 2, sub: 2})}>
      <i className="fa-solid fa-at"></i>
			<span>Gardiennage et Sécurité</span>
		</div>
		 <div className={isActive(2,3) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 2, sub: 3 })}><i className="fa-brands fa-avianex"></i>
                <span>Rénovation, Bricolage, Travaux de maison et jardin</span>

              </div>
              <div className={isActive(2,4) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 2, sub: 4 })}><i className="fa-solid fa-bacterium"></i>
                <span>Chauffeur, Déménagement, Transport de marchandise</span>

              </div>
              <div className={isActive(2,5) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 2, sub: 5 })}><i className="fa-solid fa-bath"></i>
                <span>Cuisinières, Serveur, Barman</span>

              </div>
              <div className={isActive(2,6) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 2, sub: 6 })}>
                <i className="fa-solid fa-biohazard"></i>
                <span>Coiffure et Esthétique</span>

              </div>
              <div className={isActive(2,7) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 2, sub: 7 })}>
                <i className="fa-solid fa-bomb"></i>
                <span>Infirmier et Kinésithérapeute</span>

              </div>
              <div className={isActive(2,8) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 2, sub: 8 })}>
                <i className="fa-solid fa-bong"></i>
                <span>Services Informatique et réparation</span>

              </div>
              <div className={isActive(2,9) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 2, sub: 9 })}>
                <i className="fa-solid fa-bottle-droplet"></i>
                <span>Services Administratif, Financier, Juridique</span>

              </div>
              <div className={isActive(2,10) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 2, sub: 10 })}>
                <i className="fa-solid fa-braille"></i>
                <span>Autres Services</span>

              </div>
	</div>}
</div>
       <div style={{display:'flex',flexDirection:'column'}}>
	<div className={isActive(3,0) ? "active-option" : ""} onClick={()=>{setStages();handleClick({ entreprise: 3, sub: 0 })}}>
		<div>
			<i  className="fa-brands fa-servicestack"></i>
			<span>Stages, Cours et Formations</span>
		</div>
		<i className="fa-solid fa-caret-down"></i>
	</div>
	{isStages && <div className="sub">
		<div className={isActive(3,1) ? "active-option" : ""} onClick={()=>handleClick({ entreprise:3, sub: 1 })}>
      <i className="fa-solid fa-broom"></i>
			<span>Cours et Formations</span>
		</div>
		<div className={isActive(3,2) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 3, sub: 2 })}>
      <i className="fa-solid fa-bucket"></i>  
			<span>Stages</span>
		</div>
		 <div className={isActive(3,3) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 3, sub: 3 })}>
      <i className="fa-solid fa-building-wheat"></i>
                <span>Location de salle de formation</span>

              </div>
              
	</div>}
</div>
        <div className={isActive(4,0) ? "active-option other" : "other"} onClick={()=>handleClick({ entreprise: 4, sub: 0 })}>
          <i className="fa-solid fa-arrows-spin"></i>
          <span>Business et affaire commerciale</span>
        </div>
        <div style={{display:'flex',flexDirection:'column'}}>
	<div className={isActive(5,0) ? "active-option" : ""}>
		<div onClick={()=>{handleClick({ entreprise: 5, sub: 0 });setEvents()}}>
			<i className="fa-brands fa-servicestack"></i>
			<span>Évènements</span>
		</div>
		<i className="fa-solid fa-caret-down"></i>
	</div>
	{isEvents && <div className="sub">
		<div className={isActive(5,1) ? "active-option" : ""} onClick={()=>handleClick({ entreprise:5, sub: 1 })}>
      <i className="fa-solid fa-cable-car"></i>
			<span>Animation</span>
		</div>
		<div className={isActive(5,2) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 5, sub: 2 })}>
      <i className="fa-brands fa-bluesky"></i>
			<span>Traiteur</span>
		</div>
		 <div className={isActive(5,3) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 5, sub: 3 })}>
      <i className="fa-solid fa-box-tissue"></i>
                <span>Conférences</span>

              </div>
<div className={isActive(5,4) ? "active-option" : ""} onClick={()=>handleClick({ entreprise: 5, sub: 4 })}>
  <i className="fa-solid fa-briefcase"></i>
                <span>Autres évènements</span>

              </div>
              
	</div>}
</div>
        <div className={isActive(6,0) ? "active-option other" : "other"} onClick={()=>handleClick({ entreprise: 6, sub: 0})}>
          <i className="fa-solid fa-feather"></i>
          <span>Autre</span>
        </div>





<div style={{textAlign:'center',width:'100%',margin:"auto"}}>
<button onClick={()=>{setAside1(false);setAside2(true);}} style={{alignItems:'center',justifyContent:'center',backgroundColor:isHovered?"#2455cc":"#2E6BFF"}} onMouseLeave={()=>{setIsHovered(false)}} onMouseEnter={()=>{setIsHovered(true)}} className="conf">
          Confirmer
          {isHovered && <i className="fa-solid fa-caret-right"></i>}  
        </button></div>
      </aside>}
      {aside2 && <aside style={{
    display:  open &&& !isMobile ? "flex": "none"
  }} ref={aside22} id='op'>
        <span style={{cursor:'pointer',display:'inline-block',margin:'20px 0 10px 15px'}} onClick={handleBack}><i className="fa-solid fa-caret-left"></i> Retour</span>
        <form onSubmit={handleSubmit}>
            <div style={{border:border?'2px solid rgb(15, 119, 236)':'2px solid black',width:"90%",borderRadius:'20px',padding:'10px',margin:"10px 0 10px 10px"}}>
              <i style={{color:border?'rgb(15, 119, 236)':'black'}} className="fa-solid fa-magnifying-glass"></i>
              <input onBlur={()=>{setBorder(!border)}} onFocus={()=>{setBorder(!border)}} style={{marginLeft:'10px',border:"none",outline:"none"}} onChange={(e)=>setKeyword(e.target.value)} value={keyword} type="text" placeholder='Que recherchez-vous?'/>
            </div>
            <span style={{color:'gray',margin:'10px 0 10px 10px'}}>Catégorie</span> : <span style={{marginRight:'10px'}}>{token && labels[token.entreprise]?.[token.sub ?? 0]}</span><br/>
           

            <span style={{color:'gray',margin:'10px'}}>Choisir position géographique</span><br/>
            <button onClick={()=>{setMapVisible(true)}}className="conf2"><i className="fa-regular fa-map"></i> Ouvrir la carte</button><br/>
            <span style={{color:'gray',margin:'10px'}}>Salaire/Prix</span><br/>

            <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
              <div style={{borderBottomRightRadius:'12px',borderTopRightRadius:'12px',borderTopLeftRadius:'12px',borderBottomLeftRadius:'12px',padding:'10px',margin:'10px',border:border1?'2px solid rgb(15, 119, 236)':'2px solid black',width:"90%"}}>
                  <input min="0" onBlur={()=>{setBorder1(!border1)}} onFocus={()=>{setBorder1(!border1)}} style={{marginLeft:'10px',border:"none",outline:"none"}} type="number" onChange={(e)=>setMin(e.target.value)} value={min} placeholder='Min'/>
                  <span style={{color:border1?'rgb(15, 119, 236)':'black'}}>DH</span>
              </div>
              <div style={{borderBottomRightRadius:'12px',borderTopRightRadius:'12px',borderTopLeftRadius:'12px',borderBottomLeftRadius:'12px',padding:'10px',margin:'10px',border:border2?'2px solid rgb(15, 119, 236)':'2px solid black',width:"90%"}}>
                  <input min="0" onBlur={()=>{setBorder2(!border2)}} onFocus={()=>{setBorder2(!border2)}} style={{marginLeft:'10px',border:"none",outline:"none"}} type="number" onChange={(e)=>setMax(e.target.value)} value={max} placeholder='Max'/>
                  <span style={{color:border2?'rgb(15, 119, 236)':'black'}}>DH</span>
              </div>
            </div>



            <span style={{color:'gray',margin:'10px'}}>Type d'annonce</span><br/>
            <div style={{margin:'10px'}}>
              <span onClick={()=>setType(1)} style={{border:type===1?"1px solid rgb(15, 119, 236)":"",color:type===1?"rgb(15, 119, 236)":""}} className="type">Offre</span>
              <span onClick={()=>setType(2)} style={{border:type===2?"1px solid rgb(15, 119, 236)":"",color:type===2?"rgb(15, 119, 236)":"",margin:'10px'}} className="type">Demande</span>
            </div>
            <h5 style={{color:'gray',margin:'10px'}}>Service Range ({range} km)</h5>
                    <input style={{margin:'10px'}} value={range} onChange={handleRangeChange} type="range" min="0" max="100" className="slider" id="myRange"/>
            <div style={{textAlign:'center',width:'100%',margin:"auto"}}>
<button style={{alignItems:'center',justifyContent:'center',backgroundColor:isHovered?"#2455cc":"#2E6BFF"}} onMouseLeave={()=>{setIsHovered(false)}} onMouseEnter={()=>{setIsHovered(true)}} className="conf" onClick={sendData}>
          Confirmer
          {isHovered && <i className="fa-solid fa-caret-right"></i>}  
        </button></div>
        </form>
      </aside>}
      {isMapVisible && <div className='form'>
            <h1>Ajouter une addresse</h1>
            <i onClick={()=>{document.body.style.overflow='unset';setMapVisible(false)}} id='close1' className="fa-solid fa-xmark"></i>
            <h4 style={{marginBottom:'0px'}}>Ton addresse</h4>
      <div style={{ padding: "20px 0",width:'100%' }}>
      <SelectLocationMap
                position={position}
                setPosition={setPosition}
                addressInput={addressInput}
                setAddressInput={setAddressInput}
              /></div> <button onClick={()=>{setFlag(true);document.body.style.overflow='unset';setMapVisible(false)}} style={{cursor:'pointer',position:'absolute',right:'40px',bottom:'10px',backgroundColor:'#fb9300',border:'none',outline:'none',color:'white',padding:'10px 20px',borderRadius:'10px'}}>Enregistrer</button>    
        </div>}
      <main id="kala">
        <h1>{ads.length} {ads.length===1?"Annonce":"Annonces"}</h1>
  {ads.length === 0 ? (
    <p>No ads found.</p>
  ) : (
    <div id='kolo'>
      {ads.map(ad => (
        <div key={ad.id} className="ad">
          {/* If you have user info from PHP, replace this */}
          <div style={{display:'flex',alignItems:'center',marginBottom:'20px'}}>
            <img className='ko' src={ad.user.picture}/><span>{ad.user.name || 'Unknown User'}</span><span style={{color:'#999',marginLeft:'5px',fontSize:'0.8em'}}>+212 {ad.user.tel}</span>
          </div>  

          {ad.photo && (
            <img 
              src={ad.photo} 
              alt={ad.titre} 
              style={{ width: '250px', height: '200px' }}
            />
          )}

          <p style={{fontSize:'1.5em'}}>{ad.titre}</p>
          <p style={{color:'#999',fontSize:'0.8em'}}>{ad.description.length>70?ad.description.slice(0,70)+"...":ad.description}</p>
          <p style={{marginTop:'10px',fontSize:'1.3em',color:'#3aa4ff'}}>{ad.salaire_prix} DH</p>
        </div>
      ))}
      
      

    </div>
  )}
  
</main>

    {isMapVisible && <div className='overlay'></div>}
      
    </div>
<div
  ref={filt}
  id="bas"
  onClick={() => setOpen(!open)}
>
  <i id="fil" className="fa-solid fa-filter"></i>
</div>

<div
  className="overlay"
  style={{ display: open ? 'block' : 'none' }}
  onClick={() => setOpen(false)}
></div>

  </>
  )
}

export default Ads
