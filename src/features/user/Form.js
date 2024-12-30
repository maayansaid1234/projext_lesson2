import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import "./form.css";
import { fetchSuggestions } from "../address/nominatimApi";

const Form = ({setLocation}) => {

  const [isSelected, setIsSelected]=useState(false);
  // משתנה זה מטרתו  IS_SELECTED
  // לידע אם כבר נבחרה כתובת או לא
  // כיוון שהאינפוט של כתובת
  // משתנה גם על ידי הקלדה בו
  // וגם על ידי שאנחנו משנים אותו בקוד כאשר נבחרה כתובת
  // מהרשימה של האופציות
  // אלו 2 מקרים שונים שמטופלים אחרת
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null); // לאחסון הכתובת שנבחרה
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const save = (data) => {
    // נוסיף את הכתובת לשאר שדות הטופס
    // בתור אובייקט שמכיל שם, אורך, רוחב
    const formData = { 
      ...data, 
      address: selectedAddress ? {
        displayName: selectedAddress.displayName,
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude,
      } : null,
    };

    
    console.log("Form submitted with data:", formData);
  };

  
  useEffect(() => {
    // על מנת שלא יקרוס מרוב עומס קריאות לשרת ה
    // NOMINATIM API
    // אנחנו קוראים לשרת רק אחרי 300 מילי שניות שהוא הפסיק לכתוב
    // ורק בתנאי שהקליד לכל הפחות 2 תווים

   
   if(!isSelected){
    const delayDebounce = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const response = await fetchSuggestions(query);
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          const results = await response.json();
          setSuggestions(
            results.map((item) => ({
              displayName: item.display_name,
              latitude: item.lat,
              longitude: item.lon,
            }))
          );
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }

}
, [query]);

  return (
    <>
      <h1>טופס הרשמה</h1>
      <form onSubmit={handleSubmit(save)} noValidate>
        <input
          placeholder="שם משתמש"
          type="text"
          className="inputs"
          {...register("userName", {
            required: { value: true, message: "!שם משתמש הוא שדה חובה" },
            minLength: { value: 2, message: "!שם קצר מידי" },
            maxLength: { value: 8, message: "שם ארוך מידי!" },
          })}
        />
        {errors.userName && (
          <span className="error-message">{errors.userName.message}</span>
        )}

        <div>
          <input
            type="text"
            value={query}
            className="inputs"
            onChange={(e) =>{
             
               if(!isSelected)// אם לא נבחרה כתובת
            {
              setQuery(e.target.value)
            }
                
                 else{ // אם בחרו כתובת
                console.log("selected")
                setIsSelected(false)

                }
              } }
            placeholder="כתובת"
       
          />
          {loading && <p>טוען תוצאות...</p>}
          <ul style={{ listStyle: "none", padding: "0", margin: "10px 0" }}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setIsSelected(true);
                  setQuery(suggestion.displayName);
                  setSelectedAddress(suggestion); // עדכון הכתובת שנבחרה
                  setSuggestions([]);
                  const { latitude, longitude } = suggestion;
                  setLocation({ latitude, longitude });
                }}
               
                
                style={{
                  cursor: "pointer",
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {suggestion.displayName}
              </li>
            ))}
          </ul>
        </div>

        <input
          placeholder="טלפון"
          type="text"
          className="inputs"
          {...register("tel", {
            required: { value: true, message: "!טלפון שדה חובה" },
            minLength: { value: 9, message: "!טלפון קצר מידי" },
            maxLength: { value: 10, message: "טלפון ארוך מידי!" },
          })}
        />
        {errors.tel && (
          <span className="error-message">{errors.tel.message}</span>
        )}

        <input
          placeholder="אימייל"
          className="inputs"
          {...register("email", {
            required: { value: true, message: "!אימייל הוא שדה חובה" },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "!כתובת אימייל אינה תקינה",
            },
          })}
        />
        {errors.email && (
          <span className="error-message">{errors.email.message}</span>
        )}

        <div>
          <input
            id="internet"
            type="checkbox"
            className="inputs"
            {...register("internet")}
          />
          <label htmlFor="internet">? האם נדרש חיבור לאינטרנט</label>
        </div>

        <div>
          <input
            id="kitchen"
            type="checkbox"
            className="inputs"
            {...register("kitchen")}
          />
          <label htmlFor="kitchen">? האם נדרש מטבח</label>
        </div>

        <div>
          <input
            id="coffeMachine"
            type="checkbox"
            className="inputs"
            {...register("coffeMachine")}
          />
          <label htmlFor="coffeMachine">? האם נדרשת מכונת קפה</label>
        </div>

        <input
          type="number"
          placeholder="מספר חדרים"
          className="inputs"
          {...register("numOfRooms", {
            required: { value: true, message: "!מספר חדרים שדה חובה" },
            min: { value: 1, message: "!מספר חדרים קטן מידי" },
          })}
        />
        {errors.numOfRooms && (
          <span className="error-message">{errors.numOfRooms.message}</span>
        )}

        <input
          type="number"
          placeholder="? מהו המרחק שתהיה מוכן לזוז מכתובתך"
          className="inputs"
          {...register("distance", {
            required: { value: true, message: "!מרחק שדה חובה" },
          })}
        />
        {errors.distance && (
          <span className="error-message">{errors.distance.message}</span>
        )}

        <button type="submit">להרשמה</button>
      </form>
    </>
  );
};

export default Form;
