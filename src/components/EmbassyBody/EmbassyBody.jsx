import React from 'react';
import styles from './EmbassyBody.module.css';

const EmbassyBody = (data, region, country) => {
    if (region === '') {
        return <div></div>
    }
    else {

    let output = Object.values(data)[0];
    let vals = [];
    let finalReturn = [];
    if (region) {
        for (let i = 0; i < output.length; i++) {
            let datum=output[i];
            vals.push(datum);
        }
        
        let returnInfo = Object.values(vals);
        for (let j = 0; j < returnInfo.length; j++){
            if (returnInfo[j].Post === region){
                finalReturn.push(returnInfo[j]);
            }
        }
    }
    // console.log(data);
    // console.log(vals);
    // console.log(country);
    
    //var details = vals.map(function(summary,i)  {
        //return finalReturn;
    //};
    //{embassyData.map((embassyPost,i) => <option key={i} value={embassyPost.Post}>{embassyPost.Post}</option>)}
    var rere = vals.map(function(item,index) {
    return (
        <>
                {/* <div key={index}>Post: {item.Country.toString()}</div> */}
        </>
    )
    })

return rere;
}
}
export default EmbassyBody;