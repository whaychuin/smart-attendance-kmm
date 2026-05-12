const scriptURL = "https://script.google.com/macros/s/AKfycbwLv3iFXP2oyuYPVMVo7Y6LqVs3kjnQjV9He4kEiWJAgXAru2XkeLdGK2l3FZnn2mY79w/exec";

fetch(scriptURL)
  .then(response => response.json())
  .then(data => {
    console.log(data);

    const lecturerDropdown = document.getElementById("pensyarah");
    const practicumDropdown = document.getElementById("praktikum");

    data.lecturers.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      lecturerDropdown.appendChild(option);
    });

    data.practicums.forEach(practicum => {
      const option = document.createElement("option");
      option.value = practicum;
      option.textContent = practicum;
      practicumDropdown.appendChild(option);
    });

  })
  .catch(error => {
    console.error("Dropdown loading error:", error);
  });

document.getElementById("attendanceForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const data = {
    date: document.getElementById("date").value,
    pensyarah: document.getElementById("pensyarah").value,
    mod: document.getElementById("mod").value,
    praktikum: document.getElementById("praktikum").value,
    noMatrik: document.getElementById("noMatrik").value,
    namaPelajar: document.getElementById("namaPelajar").value,
    status: document.getElementById("status").value,
    catatan: document.getElementById("catatan").value,
    kaedahSubmit: "Website"
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    document.getElementById("message").innerText = "Kehadiran berjaya dihantar!";
    document.getElementById("attendanceForm").reset();
  })
  .catch(error => {
    document.getElementById("message").innerText = "Ralat. Sila cuba lagi.";
    console.error("Error:", error);
  });
});
