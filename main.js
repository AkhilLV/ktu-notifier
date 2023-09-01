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

  console.log(filters);
  try {
    const response = await fetch(`${baseUrl}/signup`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
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
    alert(
      "Something went wrong. Maybe you already signed up?" +
        "\nMessage: " +
        err.message
    );
    console.log(err);
  }
};

form.addEventListener("submit", handleSubmit);

