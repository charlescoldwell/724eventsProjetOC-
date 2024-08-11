import PropTypes from "prop-types";
import { createContext, useCallback, useContext, useEffect, useState, useMemo } from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

// create array of index/month/year from data.events json
const extractMonths = (events) =>
  events.map((event, index) => {
    const eventDate = new Date(event.date);
    return {
      index,
      month: eventDate.getMonth() + 1, // getMonth() is zero-based
      year: eventDate.getFullYear(),
    };
  });

// iterate over month/year while looking for latest year or current year then latest month
  const findLatestMonth = (months) =>
    months.reduce((latest, current) =>
      !latest ||
      (current.year > latest.year) ||
      (current.year === latest.year && current.month > latest.month)
        ? current
        : latest
    , null);
  
// finds the latest month by comparing events months with latest month then return index of said event
const getMostRecentEvent = (events) => {
  if (!events || events.length === 0) return null;
  
  const months = extractMonths(events);
  const latestMonth = findLatestMonth(months);
  
  if (!latestMonth) return null;

  return events[latestMonth.index];
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null); // state to store most recent event

  const getData = useCallback(async () => {
    try {
      const fetchedData = await api.loadData();
      setData(fetchedData);
      // actually fecthing most recent event from json
      setLast(getMostRecentEvent(fetchedData.events));
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]);

  // memo to stop re-render issues
  const contextValue = useMemo(() => ({ data, error, last }), [data, error, last]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
