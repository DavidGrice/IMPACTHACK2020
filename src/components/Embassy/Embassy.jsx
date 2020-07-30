import React, {useState} from 'react';
import { NativeSelect, FormControl} from '@material-ui/core';
import styles from './Embassy.module.css';

const Embassy = ({handleRegionChange, data}) =>{
    let output = Object.values(data);
    let vals = [];
    //let finalReturn = [];
    for (let i = 0; i < output.length; i++) {
        let datum=output[i];
        vals.push(datum);
    }
    //console.log(vals)
    const regional = [];
    const regionalMap = new Map();
    for (const item of vals) {
        if(!regionalMap.has(item.Bureau)) {
            regionalMap.set(item.Bureau, true);
            regional.push({
                Bureau: item.Bureau
            });
        }
    }

    const country = [];
    const countryMap = new Map();
    for (const item of vals) {
        if(!countryMap.has(item.Country)) {
            countryMap.set(item.Country, true);
            country.push({
                Country: item.Country
            });
        }
    }
    //console.log(vals)

      return (
        <div className={styles.formBox}>
            <h3 className={styles.formHeader}>Please choose a Region!</h3>
            <FormControl className={styles.formControl}>
                <NativeSelect defaultValue="" onChange={(e) => handleRegionChange(e.target.value)}>
                    <option></option>
                    {vals.map((region,i) => <option key={i} value={region.Bureau}>{region.Bureau}</option>)}
                </NativeSelect>
            </FormControl>
            {/* <FormControl className={styles.formControl}>
                <NativeSelect defaultValue="" onChange={(e) => handleCountryChange(e.target.value)}>
                    <option>All</option>
                    {country.map((embassyPost,i) => <option key={i} value={embassyPost.Country}>{embassyPost.Country}</option>)}
                </NativeSelect>
            </FormControl> */}
        </div>
      )
}

export default Embassy;