import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Debounce function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler); // Cleanup on value change
  }, [value, delay]);

  return debouncedValue;
};

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  // State for loading, error, and debounced query
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const debouncedQuery = useDebounce(searchedQuery, 500); // Debouncing input

  useEffect(() => {
    if (!debouncedQuery) return; // Skip fetch if no search query

    const fetchAllJobs = async () => {
      setLoading(true);
      setError(null); // Reset any previous error

      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${debouncedQuery}`, { withCredentials: true });

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        } else {
          setError('No jobs found for the given search query.');
        }
      } catch (error) {
        console.error(error); // Log error for debugging
        setError('An error occurred while fetching the jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, [debouncedQuery, dispatch]);

  return { loading, error };
};

export default useGetAllJobs;
