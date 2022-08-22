import axios from "axios";
import { showAlert } from "./alerts.js";

export const bookTour = async (id) => {
  try {
    const stripe = Stripe(
      "pk_test_51LXe2DI3U5lmy7K0GYsbibG7n9ZPhfDCXfaqpAFmYAtuFj6lhZWS1ltqeZZYTjoUEOqOm7AqTrzTXXTGqD05oztQ003sjh9SpU"
    );

    // Get session from server
    const session = await axios({
      method: "GET",
      url: `/api/v1/bookings/checkout-session/${id}`,
    });

    console.log(session);
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
    location.assign(session.data.session.url);
    console.log("checkout");
  } catch (error) {
    console.log("error");
    console.log(error);
    showAlert("error", error);
  }
};
