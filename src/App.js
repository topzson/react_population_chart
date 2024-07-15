import React, { useState ,useEffect } from "react";
import RacingBarChart from "./RacingBarChart";
import useKeyframes from "./useKeyframes";
import useWindowSize from "./useWindowSize";

const dataUrl = process.env.REACT_APP_API_URL;
const numOfBars = 12;
const numOfSlice = 10;
const chartMargin = {
  top: 30,
  right: 10,
  bottom: 30,
  left: 10,
};

function App() {
  const { width: windowWidth } = useWindowSize();
  const chartWidth = windowWidth - 64;
  const chartHeight = 600;
  const [selectedRegions, setSelectedRegions] = useState([]);
  const { keyframes } = useKeyframes(dataUrl, numOfSlice ,selectedRegions);
  const chartRef = React.useRef();

  
  const handleReplay = () => {
    chartRef.current.replay();
  }
  const handleStart = () => {
    chartRef.current.start();
  }
  const handleStop = () => {
    chartRef.current.stop();
  }
  const playing = chartRef.current ? chartRef.current.playing : false;
  const [_, forceUpdate] = useState();

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedRegions((prev) =>
      checked ? [...prev, value] : prev.filter((region) => region !== value)
    );
  };



  return (
    <div style={{ margin: "0 2em" }}>
      <h1>Population Growth per country, 1950 to 2021</h1>
      <div style={{ paddingTop: "1em"}}>
      
      <label htmlFor="region" style={{fontSize: "1.3em"}}>Region:</label>
        <input type="checkbox" id="region1" value="Asia" onChange={handleCheckboxChange} ></input><label htmlFor="asia"> Asia</label>
        <input type="checkbox" id="region2" value="Europe" onChange={handleCheckboxChange} ></input><label htmlFor="europe"> Europe</label>
        <input type="checkbox" id="region3" value="Africa" onChange={handleCheckboxChange} ></input><label htmlFor="africa"> Africa</label>
        <input type="checkbox" id="region4" value="Oceania" onChange={handleCheckboxChange} ></input><label htmlFor="oceania"> Oceania</label>
        <input type="checkbox" id="region5" value="Americas" onChange={handleCheckboxChange} ></input><label htmlFor="americas"> Americas</label>
        {keyframes.length > 0 && (
          <RacingBarChart
            keyframes={keyframes}
            numOfBars={numOfBars}
            width={chartWidth}
            height={chartHeight}
            margin={chartMargin}
            onStart={() => forceUpdate(true)}
            onStop={() => forceUpdate(false)}
            ref={chartRef}
          />
        )}
      </div>
      <button onClick={handleReplay}>Replay</button>
        <button onClick={playing ? handleStop : handleStart}>
          { playing ? 'stop' : 'start' }
        </button>
  
    </div>
  );
}

export default App;
