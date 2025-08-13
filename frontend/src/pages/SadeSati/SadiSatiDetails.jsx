import { getUserDetails } from "../../api/user";
import { getSadeSatiDetails } from "../../api/SadeSati";
import {
  fetchLocationData,
  formateDate,
} from "../../utilityFunction/FetchLocationData";
import { toast, ToastContainer } from "react-toastify";

export const handleSadeSatiDetails = async (
  user,
  setSadeSatiDetails,
  setIsLoadingSadesati,
  setLoadingSadesatiDetails
) => {
  setLoadingSadesatiDetails(false);

  try {
    const storedData = localStorage.getItem("sadeSatiDetails");

    if (storedData) {
      setSadeSatiDetails(JSON.parse(storedData));
      setIsLoadingSadesati(false);
      return;
    } else {
      const userData = await getUserDetails(user._id);

      if (!userData) {
        toast.error("No user data found. Please complete your profile.");
        setIsLoadingSadesati(false);
        return;
      }

      if (!userData.user.placeOfBirth) {
        toast.error("Birth place not found. Please update your profile.");
        setIsLoadingSadesati(false);
        return;
      }

      const locationData = await fetchLocationData(userData.user.placeOfBirth);

      if (
        !locationData ||
        typeof locationData.latitude === "undefined" ||
        typeof locationData.longitude === "undefined" ||
        typeof locationData.gmtOffset === "undefined"
      ) {
        console.error("Invalid location data structure:", locationData);
        toast.error(
          "Could not fetch complete location data for birth place. Please check your birth place format."
        );
        setIsLoadingSadesati(false);
        return;
      }

      const apiParams = {
        dob: formateDate(userData.user.dob),
        timeOfBirth: userData.user.timeOfBirth,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        gmtOffset: locationData.gmtOffset,
      };

      //console.log("API Parameters:", apiParams);

      const sadesatiResponse = await getSadeSatiDetails(user._id, apiParams);

      if (sadesatiResponse && sadesatiResponse.success) {
        setSadeSatiDetails(sadesatiResponse);
        localStorage.setItem(
          "sadeSatiDetails",
          JSON.stringify(sadesatiResponse)
        );
        toast.success("Fetching Sade Sati Details........", {
          position: "top-right",
          autoClose: 2000,
        });
        setIsLoadingSadesati(false);
      }
    }
  } catch (err) {
    console.error("Error fetching Sade Sati report:", err);
    toast.error("Failed to fetch Sade Sati details. Please try again later.");
    setIsLoadingSadesati(false);
  } finally {
    setLoadingSadesatiDetails(false);
  }
  <ToastContainer />;
};
