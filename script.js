const scriptURL = "https://script.google.com/macros/s/AKfycbwLv3iFXP2oyuYPVMVo7Y6LqVs3kjnQjV9He4kEiWJAgXAru2XkeLdGK2l3FZnn2mY79w/exec";

// Load lecturer and practicum dropdowns
fetch(scriptURL)
  .then(response => response.json())
  .then(data => {
    console.log("Dropdown data:", data);

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


// Auto-fill student name and practicum based on matric number
document.getElementById("noMatrik").addEventListener("blur", function() {
  const matricNo = this.value.trim();

  if (matricNo === "") return;

  fetch(`${scriptURL}?matricNo=${encodeURIComponent(matricNo)}`)
    .then(response => response.json())
    .then(data => {
      console.log("Student lookup result:", data);

      if (data.result === "success") {
        document.getElementById("namaPelajar").value = data.studentName;

        const practicumDropdown = document.getElementById("praktikum");
        const practicumValue = data.practicum;

        let optionExists = false;

        for (let option of practicumDropdown.options) {
          if (option.value === practicumValue) {
            optionExists = true;
            break;
          }
        }

        if (!optionExists && practicumValue) {
          const newOption = document.createElement("option");
          newOption.value = practicumValue;
          newOption.textContent = practicumValue;
          practicumDropdown.appendChild(newOption);
        }

        practicumDropdown.value = practicumValue;

        document.getElementById("message").innerText = "Nama pelajar dan praktikum dijumpai.";
      } else {
        document.getElementById("namaPelajar").value = "";
        document.getElementById("message").innerText = "No matrik tidak dijumpai.";
      }
    })
    .catch(error => {
      console.error("Student lookup error:", error);
      document.getElementById("message").innerText = "Ralat mencari nama pelajar.";
    });
});


// Submit attendance record
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
      console.log("Submission result:", result);
      document.getElementById("message").innerText = "Kehadiran berjaya dihantar!";
      document.getElementById("attendanceForm").reset();
    })
    .catch(error => {
      document.getElementById("message").innerText = "Ralat. Sila cuba lagi.";
      console.error("Submission error:", error);
    });
});
