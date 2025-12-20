import React,{useState,useRef} from 'react'
import "./Publier.css"
import ImageUpload from './ImageUpload';
import Header from './Header'
import axios from "axios";
import { useNavigate } from "react-router-dom";

import CategorySelect from "./CategorySelect"
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
function Publier() {
      const navigate = useNavigate();

    const [flag,setFlag] = useState(false)
   const sendData = async () => {
  if (images.length === 0) {
    return alert("Please select images");
  }
  if (!categoryId) {
    return alert("Please select category");
  }
  if(!phone)
  {
    return alert('Please enter phone number')
  }
  if(!price)
  {
    return alert('Please enter price/salary')
  }
  if(!title)
  {
    return alert('Please enter title')
  }
  if(!desc)
  {
    return alert('Please enter description')
  }
  if(!position)
  {
    return alert('Please enter position')
  }

  const user = JSON.parse(localStorage.getItem("user"));

  const formData = new FormData();

  // Append text fields
  formData.append("phone", phone);
  formData.append("price", price);
  formData.append("title", title);
  formData.append("desc", desc);
  formData.append("type", type);
  formData.append('position', JSON.stringify(position)); // <-- JSON.stringify obligatoire
  formData.append("address", addressInput);
  formData.append("id_user", user?.id);
  formData.append("cate_id", categoryId);

  // Append images
  images.forEach((image) => {
    formData.append("images[]", image);
  });

  try {
    const res = await axios.post(
      "https://soc-net.info/harfa/add_pub.php",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    navigate("/");
  } catch (error) {
    console.error(error);
  }
};




  const [categoryId, setCategoryId] = useState(null);
    const [images, setImages] = useState([]);
 const handleImagesChange = (files) => {
    setImages(files);
    //className=g("Images from child:", files);
  };
const handleCategoryChange = (id) => {
    setCategoryId(id);
    //className=g("Category ID from child:", id);
  };
    const isValidPhone = /^(\+212|0)[5-7][0-9]{8}$/;
  const [phone, setPhone] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState(1);

        const [isMapVisible,setMapVisible] = useState(false)
      const [position, setPosition] = useState(null);
    const [addressInput, setAddressInput] = useState("");
  return (
    <>
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
              /></div> <button onClick={()=>{setFlag(true);document.body.style.overflow='unset';setMapVisible(false)}} id='enre'>Enregistrer</button>    
        </div>}
    {isMapVisible && <div className='overlayy'></div>}
      <Header/>
      <div id='fafa'>
        <div id='first' style={{flex:4}}>
            <h1>Qu'annoncez-vous aujourd'hui ?</h1><br/>
            <p>Grâce à ces informations les acheteurs peuvent trouver votre annonce plus facilement</p><br/>
            
            <CategorySelect
                value={categoryId}
                onCategoryChange={setCategoryId}
                />

            <br/>

        

             <div style={{display:'flex',alignItems:'center'}}><img src="/adtype.svg"/><span>Type d'annonce :</span></div>
            <div style={{margin:'15px 0'}}>
              <span onClick={()=>setType(1)} style={{color:type===1?'rgb(15, 119, 236)':'',border:type===1?'1px solid rgb(15, 119, 236)':''}} className="type">Offre</span>
              <span onClick={()=>setType(2)} style={{color:type===2?'rgb(15, 119, 236)':'',border:type===2?'1px solid rgb(15, 119, 236)':'',margin:'10px'}} className="type">Demande</span>
            </div>
             <div style={{display:'flex',alignItems:'center'}}><img src="/location.svg"/><h2>Votre Adresse</h2></div>
            <button onClick={()=>{setMapVisible(true)}} className="conf3"><i className="fa-regular fa-map"></i> Ouvrir la carte</button><br/>
            {flag && <p>
                Latitude : {position.lat} <br/>Longitude : {position.lng}<br/> Adresse : {addressInput}    
            </p>}<br/>
            <h2>Vos coordonnées</h2>
            <span>Les acheteurs peuvent vous contacter directement sur votre numéro de téléphone.</span>
            <div style={{marginTop:"10px",display:'flex',alignItems:'center'}}><img src="/adparam_phone.svg"/><span style={{color:'red'}}>*</span><span>Numéro de téléphone :</span></div>
            <input value={phone}
  onChange={(e) => setPhone(e.target.value)}
  autoComplete="tel"
 inputMode="numeric" required type="tel" placeholder='Numéro de téléphone'/>


  <div style={{marginTop:"10px",display:'flex',alignItems:'center'}}><img src="/adparam_price.svg"/><span>Salaire/Prix :</span></div>
            <input value={price}
  onChange={(e) => setPrice(e.target.value)}
  autoComplete="tel"
 inputMode="numeric" required type="tel" placeholder='0'/>


  <div style={{marginTop:"10px",display:'flex',alignItems:'center'}}><img src="/adparam_title.svg"/><span style={{color:'red'}}>*</span><span>Titre de l'annonce :</span></div>
            <input value={title}
  onChange={(e) => setTitle(e.target.value)}
  autoComplete="tel"
 inputMode="numeric" required type="tel" placeholder="Titre de l'annonce"/>


  <div style={{marginTop:"10px",display:'flex',alignItems:'center'}}><img src="/adparam_description.svg"/><span style={{color:'red'}}>*</span><span>Texte de l'annonce :</span></div>
            <textarea value={desc}
  onChange={(e) => setDesc(e.target.value)}
  autoComplete="tel"
 inputMode="numeric" required type="tel"></textarea>
    <h2>Photos de l'annonce</h2>
   <ImageUpload images={images} onImagesChange={handleImagesChange}/>

<div style={{ display: "flex", gap: 10 , flexWrap:'wrap',marginBottom:'10px'}}>
        {images.map((img, index) => (
          <img
            key={index}
            src={URL.createObjectURL(img)}
            alt=""
            className="images"
          />
        ))}
      </div>

        </div>
        <div id='com'>
            <h2>Comment définir mon annonce</h2>
            <p>Choisir la bonne catégorie lors de l'insertion d'une annonce peut aider à augmenter la visibilité, la pertinence et l'efficacité, et éviter tout potentiel refus.<br/><br/>
Il est important d'inclure une adresse postale claire et précise pour que les clients potentiels puissent facilement vous trouver.<br/><br/>
Assurez-vous d'inclure un numéro de téléphone auquel les clients potentiels peuvent vous joindre
<br/><br/>Gardez vos coordonnées à jour.</p><br/>
<h2>Comment décrire mon annonce</h2>
<p>Choisir la marque et le modèle est important car cela fournit aux acheteurs potentiels des informations spécifiques sur l'article que vous vendez. Cela aide également à attirer le public cible qui recherche cette marque ou ce modèle spécifique.</p><br/>
<p>Un titre doit être accrocheur et concis, il doit donner une idée claire de ce que le produit est et à quoi il sert.</p><br/>
<p>La description doit fournir plus d'informations sur le produit, telles que ses caractéristiques, son état et son âge, ainsi que toute autre information qui pourrait être pertinente.</p><br/>
<p>Fournir un prix et des informations détaillées sur l'article peut aider à attirer le public cible, construire la confiance avec les acheteurs potentiels et les aider à prendre une décision informée sur l'achat de l'article.</p><br/>
<h2>Comment joindre la photo et la vidéo sur mon annonce.</h2>
<p>Fournir de bonnes photos du produit est également important, cela peut aider à donner à l'acheteur potentiel une idée claire de l'état et de l'apparence du produit.</p>
        </div>
      </div>
      <footer>
        <button onClick={sendData}>Déposer</button> 
      </footer>
    </>
  )
}

export default Publier
