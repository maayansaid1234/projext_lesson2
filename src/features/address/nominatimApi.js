export const  fetchSuggestions = async (address)=>{
return fetch(`https://nominatim.openstreetmap.org/search?q=${address} &format=json&limit=5`);
// נחזיר פרומיס- 
// קריאה ל 
//  NOMINATIM API
}