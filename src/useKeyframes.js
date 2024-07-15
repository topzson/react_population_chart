import { useState, useEffect } from "react";
import axios from "axios";
import csvParse from "csv-parse/lib/sync";

// Utility function to build a data finder
const buildFindData = (data) => {
  const dataByDateAndName = new Map();
  data.forEach((dataPoint) => {
    const { date, name } = dataPoint;
    if (!dataByDateAndName.get(date)) {
      dataByDateAndName.set(date, { [name]: dataPoint });
    } else {
      const nextGroup = {
        ...dataByDateAndName.get(date),
        [name]: dataPoint,
      };
      dataByDateAndName.set(date, nextGroup);
    }
  });
  const finder = ({ date, name }) => {
    try {
      return dataByDateAndName.get(date)[name];
    } catch (e) {
      return null;
    }
  };
  return finder;
};

// Utility function to make keyframes
const makeKeyframes = (data, numOfSlice) => {
  const findData = buildFindData(data);
  const nameSet = new Set(data.map(({ name }) => name));
  const nameList = [...nameSet];
  const dateSet = new Set(data.map(({ date }) => date));
  const dateList = [...dateSet];

  const frames = dateList.sort().map((date) => ({
    date,
    data: nameList.map((name) => {
      const dataPoint = findData({ date, name });
      return {
        ...dataPoint,
        value: dataPoint ? dataPoint.value : 0,
      };
    }),
  }));

  const keyframes = frames
    .reduce((result, frame, idx) => {
      const prev = frame;
      const next = idx !== frames.length - 1 ? frames[idx + 1] : null;
      if (!next) {
        result.push({ ...frame, date: new Date(frame.date) });
      } else {
        const prevTimestamp = new Date(prev.date).getTime();
        const nextTimestamp = new Date(next.date).getTime();
        const diff = nextTimestamp - prevTimestamp;
        for (let i = 0; i < numOfSlice; i++) {
          const sliceDate = new Date(prevTimestamp + (diff * i) / numOfSlice);
          const sliceData = frame.data.map(({ name, value, ...others }) => {
            const prevValue = value;
            const nextDataPoint = findData({ date: next.date, name });
            const nextValue = nextDataPoint ? nextDataPoint.value : 0;
            const sliceValue = prevValue + ((nextValue - prevValue) * i) / numOfSlice;
            return {
              name,
              value: sliceValue,
              ...others,
            };
          });
          result.push({
            date: sliceDate,
            data: sliceData,
          });
        }
      }
      return result;
    }, [])
    .map(({ date, data }) => {
      return {
        date,
        data: data.sort((a, b) => b.value - a.value),
      };
    });

  return keyframes;
};

// Custom hook to fetch data and create keyframes
const useKeyframes = (dataUrl, numOfSlice ,selectedRegions ) => {
  const [keyframes, setKeyframes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const response = await axios.get(dataUrl);
        let data = response.data.data;

        // Convert JSON data to required format
        const nextData = data.map(({ Name, Date, Catagory, Value ,Region ,Url }) => ({
          name: Name,
          date: Date,
          catagory: Catagory,
          value: Number(Value),
          region: Region,
          url: Url,
        }));
        if(selectedRegions.length > 0){
          const filterdata = nextData.filter(d => selectedRegions.length === 0 || selectedRegions.includes(d.region));
          const keyframes = makeKeyframes(filterdata, numOfSlice);
          setKeyframes(keyframes);
        }else{
          const keyframes = makeKeyframes(nextData, numOfSlice);
          setKeyframes(keyframes);
        }
        
        
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dataUrl, numOfSlice ,selectedRegions ]);

  return { keyframes, error };
};

export default useKeyframes;
