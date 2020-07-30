import React, {Component} from 'react';

import {Globe, Timeline, Embassy, EmbassyBody} from './components';
import styles from './App.module.css';
import { fetchRegionData, fetchCountryData, fetchAllData } from './assets/api';
import embassyData from './assets/data/Embassies_Consulates_Missions_Data.json';

class App extends Component {
    state = {
      data: {},
      region: '',
      showGlobe: true,
      country: ''
  }

  componentDidMount() {
      const fetchedRegionData = fetchRegionData();
      this.setState({ data: fetchedRegionData});
  }

  handleRegionChange = (region) => {
      const fetchedRegionData = fetchRegionData(region);
      this.setState({data: fetchedRegionData, region: region})
  }

  handleCountryChange = (country) => {
      const fetchedCountryData = fetchCountryData(country);
      //console.log(fetchedCountryData)
      this.setState({data: fetchedCountryData, country: country})
  }
  render() {
    const { data, region, showGlobe=true, country } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.embassyDataContainer}>
          <Embassy data={data} handleRegionChange={this.handleRegionChange}/>
          <EmbassyBody data={data} />
        </div>
        <button onClick={() => 
          this.setState(state=> ({showGlobe: !state.showGlobe}))
        }>
          {showGlobe?"Timeline":"Globe"}
        </button>
        {showGlobe && <Globe data={data} region={region} country={country}/>}
        {showGlobe && <Timeline />}
      </div>
    );
  }
}

export default App;