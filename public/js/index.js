import "@babel/polyfill";
import { auth, logout } from "./login.js";
import { displayMap } from "./mapBox.js";
import { updateSettings } from "./update.js";
import { bookTour } from "./stripe.js";

const authForm = document.getElementById("auth-form");
const mapBox = document.getElementById("map");
const logoutBtn = document.querySelector(".nav__el--logout");
const updateData = document.querySelector(".form-user-data");
const updatePassword = document.querySelector(".form-user-password");
const bookBtn = document.querySelector("#book-tour");

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (authForm) {
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const { url } = e.target.dataset;

    const form = new FormData();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!url) {
      return auth({ email, password }, url);
    }
    form.append("email", email);
    form.append("password", password);

    const name = document.querySelector("#name").value;
    const passwordConfirm = document.querySelector("#passwordConfirm").value;
    const photo = document.querySelector("#photo").files[0];

    form.append("name", name);
    form.append("passwordConfirm", passwordConfirm);
    form.append("photo", photo);

    auth(form, url);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (updateData) {
  updateData.addEventListener("submit", (e) => {
    e.preventDefault();

    const form = new FormData();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const photo = document.querySelector("#photo").files[0];
    form.append("name", name);
    form.append("email", email);
    form.append("photo", photo);
    updateSettings(form, "data");
  });
}

if (updatePassword) {
  updatePassword.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector("#save-passwd").innerHTML = "Updating...";
    const password = document.querySelector("#password-current").value;
    const newPassword = document.querySelector("#password").value;
    const newPasswordConfirm =
      document.querySelector("#password-confirm").value;

    await updateSettings(
      { password, newPassword, newPasswordConfirm },
      "password"
    );

    document.querySelector("#save-passwd").innerHTML = "Save Password";
    document.querySelector("#password-current").value =
      document.querySelector("#password").value =
      document.querySelector("#password-confirm").value =
        "";
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";

    const { id } = e.target.dataset;

    bookTour(id);
  });
}
