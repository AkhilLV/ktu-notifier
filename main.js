const baseUrl = "http://localhost:3000";

// DOM
const emailInput = document.querySelector("#email");
const filtersInput = document.querySelector("#filters");
const commonFilters = document.querySelectorAll("input[type='checkbox']");

const form = document.querySelector("form");

const handleSubmit = async (e) => {
  e.preventDefault();

  if (emailInput.value === "") {
    alert("Please fill in all fields");
    return;
  }

  let filters = filtersInput.value.split(",");

  filters = filters.map((filter) => filter.trim());
  filters = filters.filter((filter) => filter !== "");

  commonFilters.forEach((filter) => {
    if (filter.checked) {
      filters.push(filter.value);
    }
  });

  try {
    const response = await fetch(`${baseUrl}/signup`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value,
        filters,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert("You will get mails!");
  } catch (err) {
    console.log("In the catch block");
    alert("Something went wrong." + "\nMessage: " + err.message);
    console.log(err);
  }
};

form.addEventListener("submit", handleSubmit);
