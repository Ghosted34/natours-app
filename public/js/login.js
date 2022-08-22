import axios from "axios";
import { showAlert } from "./alerts.js";

export const auth = async (data, type) => {
  const urlType = type === "true" ? "signup" : "signin";

  try {
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:3000/api/v1/users/${urlType}`,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `Welcome`);
      window.setTimeout(() => {
        location.assign("/");
      }, 100);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/api/v1/users/logout",
    });

    if (res.data.status === "success") {
      showAlert("success", `Goodbye`);
      location.assign("/");
    }
  } catch (error) {
    showAlert("error", "Error logging out. Try again.");
  }
};
