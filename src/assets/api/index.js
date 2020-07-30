import embassyData from '../data/Embassies_Consulates_Missions_Data.json';

export const fetchRegionData = (region) => {
    let output = Object.values(embassyData);
    let vals = [];
    let finalReturn = [];
    if (region) {
        for (let i = 0; i < output.length; i++) {
            let datum=output[i];
            vals.push(datum);
        }
        let returnInfo = Object.values(vals);
        for (let j = 0; j < returnInfo.length; j++){
            if (returnInfo[j].Bureau === region){
                finalReturn.push(returnInfo[j]);
            }
        }
        return finalReturn;
    }
    try {
        const response = embassyData;
        //console.log(response)
        return response;
    } catch (error) {

    }
}

export const fetchCountryData = (region) => {
    //let regionalFilter = embassyData.filter(country => )
    let output = Object.values(region);
    let vals=[];
    if (region) {
        let vals = [];
        let finalReturn = [];
        for (let i = 0; i < output.length; i++) {
            let datum=output[i];
            vals.push(datum);
        }
        const country = [];
        const map = new Map();
        for (const item of embassyData) {
            if(!map.has(item.Country)) {
                map.set(item.Country, true);
                country.push({
                    Country: item.Country
                });
            }
        }
        return country;
    }
    try {
            const response = embassyData;
            //console.log(response)
            return response;
            
        

    } catch (error) {

    }
}

export const fetchAllData = async () => {

    return embassyData;
    
}