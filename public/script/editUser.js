// Get references to HTML elements
const editButton = document.getElementById("edit-button");
const saveButton = document.getElementById("save-button");
const inputs = document.querySelectorAll("input");

// Initialize input status
let isInputEnabled = false;

// Set initial style for Edit button
editButton.style.backgroundColor = "";

// Add event listener to Edit button
editButton.addEventListener("click", () => {
  isInputEnabled = !isInputEnabled; // Toggle input status
  inputs.forEach((input) => {
    input.disabled = !isInputEnabled; // Set disabled attribute based on input status
  });

  // Set text and style of Edit button
  editButton.textContent = isInputEnabled ? "Cancel" : "Edit";
  editButton.style.backgroundColor = isInputEnabled ? "#dc3545" : "";
  for (i = 0; i < inputs.length; i++) {
    inputs[i].style.color = isInputEnabled ? "#222" : "";
  };
});

// Add event listener to Save button
saveButton.addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  const data = { name, email, phone, address };

  fetch("/save-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
    })
    .catch((error) => {
      console.error(error);
    });
});
