let submitBtn = document.getElementById("submit-btn");
let section = document.getElementById("country-info");
let sectionNeigh = document.getElementById("bordering-countries");


submitBtn.addEventListener("click", async ()=>{
    let countryName = document.getElementById("country-name").value;
    if(countryName){
        let data = await getCountryData(countryName);
        if(data.status === 404){
            alert("Country not found");
            section.innerHTML = "";
            let errorP = document.createElement("p");
            errorP.innerText = "Country not found";
            errorP.style.color = "red";
            section.appendChild(errorP);
            return;
        }else{
            createCountryInfo(data);
        }
        let neighbours = await getNeighbours(data);
        if(Object.keys(neighbours).length === 0){
            sectionNeigh.innerHTML = "";
            let noNeighbours = document.createElement("h2");
            noNeighbours.innerText = "No bordering countries";
            noNeighbours.style.color = "red";
            section.appendChild(noNeighbours);
            return;
        }else{
            creteNeighbours(neighbours);
        }

    }else{
        alert("Please enter a country name");
        section.innerHTML = "";
        let errorP = document.createElement("p");
        errorP.innerText = "Please enter a country name";
        errorP.style.color = "red";
        section.appendChild(errorP);
    }
});

async function getCountryData(countryName) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const data = await response.json();
    if(data.status === 404){
        return data;
    }else{

        const countryData = {
            name: data[0].name.common,
            capital: data[0].capital ? data[0].capital[0] : 'N/A',
            population: data[0].population,
            region: data[0].region,
            flag: data[0].flags.png,
            borders: data[0].borders? data[0].borders : []
        };
        return countryData;
    }

}

function createCountryInfo(countryData) {
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
    if(codes.length === 0){
        return {};
    }
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
    
    sectionNeigh.innerHTML = "";
    let h1 = document.createElement("h1");
    h1.innerText = `Bordering Countries`;
    sectionNeigh.appendChild(h1);
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
    sectionNeigh.appendChild(ul);



}
