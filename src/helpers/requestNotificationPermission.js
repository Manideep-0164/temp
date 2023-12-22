import { getToken, messaging } from "../configs/firebase";

const requestPermission = async () => {
  console.log("Requesting Permission...");
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const response = await getToken(messaging, {
        vapidKey:
          "BIef0LW83zRZCP-lb6RROVcANwbLUcFRjx0DC2t09pnEn7tNqw6e1ktiK9gzzYtGUszh1weWVjMPX7FWfLWJpKw",
      });
      return response;
    }
  } catch (error) {
    console.log("Error getting permission/token:", error);
  }

  return "";
};

export { requestPermission };
