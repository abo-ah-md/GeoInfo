'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const CountryName = "America";
const geocodeApiKey= `443657607896349579471x89614`;


const getPosition = ()=>{
//promisifying the function 
return new Promise((resolve,regect)=>{

    navigator.geolocation.getCurrentPosition(resolve)
    })
    
}

//////
/*

const whereAmIPromises  = function () {

getPosition()
.then(data => fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${data[0]}&longitude=${data[1]}&localityLanguage=en`))
.then(res => res.json())
 .then(data =>  getJSON(`https://restcountries.com/v3.1/name/
 ${data.countryName}`,`cuntry is not found`))
 .then(result=> { 
 renderingCuntry(result[0]);

 countriesContainer.style.opacity= 1;
 })
}

*/
///////////////////////////////////////

//

const whereAmIAsync = async function () {
try{
const geoLocation =await getPosition();

const res =await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?
latitude=${geoLocation[0]}&
longitude=${geoLocation[1]}&
localityLanguage=en`);

const data =await res.json();

const result = await getJSON(`https://restcountries.com/v3.1/name/
 ${data.countryName}`,`cuntry is not found`);

 renderingCuntry(result[0]);

 countriesContainer.style.opacity= 1;
 btn.removeEventListener("click",whereAmIAsync)

}catch(err){console.error(err.msg);}
}


const renderError = (msg)=>{
countriesContainer.insertAdjacentText("afterbegin",msg);
}

//rendering result in the UI
const renderingCuntry = (data,className="")=>{

//currency 
const currency = Object.keys(data.currencies);
const currencyName = Object.keys(data.currencies[currency[0]]);
const currencyData =data.currencies[currency[0]][currencyName[0]]

//populaition 
const population = (+data.population/1000000).toFixed(1);


//languages
const lang = Object.keys(data.languages);
const languageName = data.languages[lang[0]];

//region 
const region =data.region;

//cuntryName
const cuntryName = data.name.common;

//CuntryFlag
const cuntryFlag = data.flags.png


//adding the result to the interface
const html =`
<article class="country ${className}">
    <img class="country__img" src="${cuntryFlag}" />
    <div class="country__data">
        <h3 class="country__name">${cuntryName}</h3>
        <h4 class="country__region">${region}</h4>
        <p class="country__row"><span>👫</span>${population}M people</p>
        <p class="country__row"><span>🗣️</span>${languageName}</p>
        <p class="country__row"><span>💰</span>${currencyData}</p>
    </div>
</article>
`;
countriesContainer.insertAdjacentHTML(`beforeend`,html);
}




/*
//HTTP request using XML
const getCountryData =  function  (CountryName){


    const request = new XMLHttpRequest();
    request.open("GET",`https://restcountries.com/v3.1/name/${CountryName}`);
request.send();


//Waiting for the response to start the callback function
request.addEventListener("load",function(){

//first ajax call 
const  [data] = JSON.parse(this.responseText);

renderingCuntry(data);

const borders =  data.borders;

console.log(borders);
//Gaurd clause
if (!borders) return;

borders.forEach(border => {
    const request1 = new XMLHttpRequest();
    request1.open("GET",`https://restcountries.com/v3.1/alpha/${border}`);
request1.send();

request1.addEventListener("load",function(){

    //first ajax call 
    const  [data] = JSON.parse(this.responseText);
    
    renderingCuntry(data,"neighbour");

})

});
//second AJAX call


});

}

 getCountryData(CountryName);

 */



//fetch Method

//making a function for fetching data
const getJSON = (url,errorMsg="something went wrong")=>{
 //sending the request using fetch
  return fetch(url)

 //handling the promise and converting to object;
 .then(response => {

if (!response.ok) {
    throw new Error(`${errorMsg} ${response.status}`)
     }
return response.json()

 })
}

const getCuntryData = function (cuntryName) {

getJSON(`https://restcountries.com/v3.1/name/${cuntryName}`,`cuntry is not found`)

//taking the result of handled promise and rendering the result
.then(result=> { 

//rendering the first fetch to UI
renderingCuntry(result[0]);

//returning the borders arraay to the next fetch methods
const borders = result[0].borders;
   
return borders
})
//making another fetch for each border using promise chaining
.then(borders =>{
    if (typeof(borders) !== "object" || borders === {})
    throw new Error("no border cuntry was found");

    borders.forEach(
    border => {
    getJSON(`https://restcountries.com/v3.1/alpha/${border}`,`cuntry is not found`)

    .then(border=>  renderingCuntry(border[0],"neighbour"))
        })
})

    .catch(error => renderError(error.message))

    .finally(()=> countriesContainer.style.opacity=1);
    
};


/////////////////////////////////////////////////////////////////////
;
btn.addEventListener("click",whereAmIAsync);


