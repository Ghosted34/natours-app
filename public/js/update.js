import axios from "axios";
import { showAlert } from "./alerts.js";

export const updateSettings = async (data, type) => {
  const urlType = type === "password" ? "password" : "me";

  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/users/update/${urlType}`,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} Updated`);
      window.setTimeout(() => {
        location.reload(true);
      }, 100);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
