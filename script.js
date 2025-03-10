let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", async ()=>{
    let countryName = document.getElementById("country-name").value;
    if(countryName){
        let data = await getCountryData(countryName);
        createCountryInfo(data);
        let neighbours = await getNeighbours(data);
        creteNeighbours(neighbours);

    }else{
        alert("Please enter a country name");
    }
});

async function getCountryData(countryName) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const data = await response.json();

    const countryData = {
        name: data[0].name.common,
        capital: data[0].capital ? data[0].capital[0] : 'N/A',
        population: data[0].population,
        region: data[0].region,
        flag: data[0].flags.png,
        borders: data[0].borders
    };

    return countryData;
}

function createCountryInfo(countryData) {
    let section = document.getElementById("country-info");
    section.innerHTML = "";
    let h1 = document.createElement("h1");
    h1.innerText = `${countryData.name}`;
    section.appendChild(h1);
    let capital = document.createElement("p");
    capital.innerText = `Capital: ${countryData.capital}`;
    section.appendChild(capital);
    let population = document.createElement("p");
    population.innerText = `Population: ${countryData.population}`;
    section.appendChild(population);
    let region = document.createElement("p");
    region.innerText = `Region: ${countryData.region}`;
    section.appendChild(region);
    let flagImg = document.createElement("img");
    flagImg.src = countryData.flag;
    section.appendChild(flagImg);
}


async function getNeighbours(countryData){
    let codes = countryData.borders;
    let neighbours = {};
    for(let code of codes){
        let response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        let data = await response.json();
        neighbours[code] = {
            name: data[0].name.common,
            flag: data[0].flags.png
        };
    }
    return neighbours;
}

function creteNeighbours(neighbours){
    let section = document.getElementById("bordering-countries");
    section.innerHTML = "";
    let h1 = document.createElement("h1");
    h1.innerText = `Bordering Countries`;
    section.appendChild(h1);
    let ul = document.createElement("ul");
    ul.classList.add("list");
    for(let neighbour in neighbours){
        let neighbourLi = document.createElement("li");
        neighbourLi.classList.add("list-item");
        neighbourLi.innerText = neighbours[neighbour].name;
        let img = document.createElement("img");
        img.src = neighbours[neighbour].flag;
        neighbourLi.appendChild(img);
        ul.appendChild(neighbourLi);
    }
    section.appendChild(ul);



}
