const clientID = `V7oq2Lo6fXER-uhV11IBaw`;
const clientSecret = `47lKDTox7TCVqc33kv5K6M1WXNbBnqRPm7UP9cUnUyFTxrI7SG1SmChDb7xogPwg`;
let accessToken;
const urlCORS = `https://cors-anywhere.herokuapp.com/`;
//const urlCORS = 'https://cors-anywhere.herokuapp.com/';

const Yelp = {
  getAccessToken()
  {
    if(accessToken)
    {
      return new Promise(resolve => resolve(accessToken));
    }

    const urlYelp = `https://api.yelp.com/oauth2/token?grant_type=client_credentials&client_id=${clientID}&client_secret=${clientSecret}`;
    return fetch(urlCORS + urlYelp, {method: 'POST',})
      .then(response => response.json())
        .then(jsonResponse => accessToken = jsonResponse.access_token);
  },

  search(term, location, sortBy)
  {
    console.log(`Searching Yelp`);
    return Yelp.getAccessToken()
      .then(() =>
      {
        const urlYelp = `https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`;
        return fetch(urlCORS + urlYelp,
          {
            headers: {Authorization: `Bearer ${accessToken}`}
          });

      })
        .then(response => response.json())
          .then(jsonResponse =>
          {
            if(jsonResponse.businesses)
            {
              console.log(jsonResponse.businesses[0]);
              return jsonResponse.businesses.map(business =>
                {
                  return {
                    id: business.id,
                    imageSrc: business.image_url,
                    name: business.name,
                    address: business.location.address1,
                    city: business.location.city,
                    state: business.location.state,
                    zipCode: business.location.zip_code,
                    category: business.categories,
                    rating: business.rating,
                    reviewCount: business.review_count
                  };
                });
            }
          });
  }
};

export default Yelp;
