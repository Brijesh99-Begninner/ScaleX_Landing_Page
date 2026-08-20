(function () {
  "use strict";
  var form = document.getElementById("contactForm");
  var confirmation = document.getElementById("contactConfirmation");
  var back = document.getElementById("confirmationBack");
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  function setError(field, message) {
    var error = document.getElementById("contact-" + field.name + "-error");
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message || "";
  }
  function validate(field) {
    var value = field.value.trim(), message = "";
    if (!value) message = "This field is required.";
    else if (field.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = "Enter a valid work email address.";
    else if (field.name === "phone" && !/^[0-9+()\s-]{7,20}$/.test(value)) message = "Enter a valid phone number.";
    else if ((field.name === "name" || field.name === "business") && value.length < 2) message = "Please enter at least two characters.";
    else if (field.name === "message" && value.length < 10) message = "Please share a little more about your expansion plans.";
    setError(field, message); return !message;
  }
  function closeConfirmation() { confirmation.hidden = true; form.querySelector("input").focus(); }
  if (!form || !confirmation || !back) return;
  form.querySelectorAll("input, textarea").forEach(function (field) {
    field.addEventListener("blur", function () { validate(field); });
    field.addEventListener("input", function () { validate(field); });
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var valid = true;
    form.querySelectorAll("input, textarea").forEach(function (field) { if (!validate(field)) valid = false; });
    if (!valid) { form.querySelector('[aria-invalid="true"]').focus(); return; }
    form.reset(); confirmation.hidden = false; back.focus();
  });
  back.addEventListener("click", closeConfirmation);
  document.addEventListener("keydown", function (event) { if (event.key === "Escape" && !confirmation.hidden) closeConfirmation(); });
})();
