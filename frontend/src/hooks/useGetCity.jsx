import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

function useGetCity() {
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  useEffect(() => {
    if (!navigator.geolocation) {
      dispatch(setCurrentCity("Bhopal")); // fallback
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          dispatch(setLocation({ lat: latitude, lon: longitude }));

          const result = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`,
          );

          const data = result?.data?.results?.[0];

          const city =
            data?.city || data?.county || data?.state_district || "Bhopal";

          dispatch(setCurrentCity(city));
          dispatch(setCurrentState(data?.state));
          dispatch(
            setCurrentAddress(data?.address_line2 || data?.address_line1),
          );
          dispatch(setAddress(data?.address_line2));
        } catch (error) {
          console.log("Geo API error:", error);
          dispatch(setCurrentCity("Bhopal")); // fallback
        }
      },
      () => {
        // user denied location
        dispatch(setCurrentCity("Bhopal")); // fallback
      },
    );
  }, []);
}

export default useGetCity;
