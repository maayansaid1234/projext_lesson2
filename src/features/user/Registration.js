import Form from './Form';
import MapComponent from '../address/Map';
import "./registration.css"
import React, { useState, useEffect } from "react";

const Registration = () => {
    let [location, setLocation]=useState(null);

      useEffect(() => {

        // בקשת מיקום המשתמש
        // נעזרתי מעט בגיפיטי
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          (error) => {
            console.log(error)
          }
        );
      }, []);
    
      // שתי הקומפוננטות תלויות במשתנה LOCATION
      // שאנו מגדירים כאן בקומפוננטת האב
      // כאשר בטופס משתנה הכתובת
      // מפעיל את הפונקציה
      // SETLOCATION
// וכך משתנה אצל קומפוננטת המפה
    return (
        <div className="container">
        
            <div id="form"><Form setLocation={setLocation} /></div>  
            <div id="map"> <MapComponent location={location}/></div>      
        </div>
    );
}

export default Registration;


