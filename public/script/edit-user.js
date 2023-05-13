const editButton = document.getElementById("edit-button");
const cancelButton = document.createElement("button");
const saveButton = document.createElement("button");
const inputs = document.querySelectorAll(".user-info");

// Fungsi untuk menampilkan tombol save dan cancel serta menghilangkan tombol edit
function showButtons() {
  cancelButton.textContent = "Cancel";
  saveButton.textContent = "Save";
  cancelButton.addEventListener("click", function() {
    inputs.forEach(input => {
      input.disabled = true;
      input.style.color = "grey";
    });
    hideButtons();
  });
  saveButton.addEventListener("click", function() {
    inputs.forEach(input => {
      input.disabled = true;
      input.style.color = "grey";
    });
    hideButtons();
  });
  cancelButton.style.backgroundColor = "#dc3545";
  saveButton.style.backgroundColor = "#198754";
  editButton.style.display = "none";
  editButton.removeEventListener("click", showButtons);
  const parentDiv = editButton.parentNode;
  parentDiv.appendChild(cancelButton);
  parentDiv.appendChild(saveButton);
}

// Fungsi untuk menyembunyikan tombol save dan cancel serta menampilkan tombol edit
function hideButtons() {
  cancelButton.removeEventListener("click", hideButtons);
  saveButton.removeEventListener("click", saveChanges);
  editButton.style.display = "block";
  editButton.addEventListener("click", enableInputs);
  const parentDiv = editButton.parentNode;
  parentDiv.removeChild(cancelButton);
  parentDiv.removeChild(saveButton);
}

// Fungsi untuk menyimpan perubahan yang telah dilakukan dan kembali ke tampilan awal
function saveChanges() {
  inputs.forEach(input => {
    input.disabled = true;
    input.style.color = "grey";
  });

  hideButtons();
}



// Fungsi untuk mengaktifkan input dan menampilkan tombol save dan cancel ketika tombol edit diklik
function enableInputs() {
  inputs.forEach(input => {
    input.disabled = false;
    input.style.color = "black";
  });
  showButtons();
}

editButton.addEventListener("click", enableInputs);

