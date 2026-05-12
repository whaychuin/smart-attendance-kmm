const scriptURL = "https://script.google.com/macros/s/AKfycbwLv3iFXP2oyuYPVMVo7Y6LqVs3kjnQjV9He4kEiWJAgXAru2XkeLdGK2l3FZnn2mY79w/exec";

document.addEventListener("DOMContentLoaded", function () {

  // Load lecturer and practicum dropdowns
  fetch(scriptURL)
    .then(response => response.json())
    .then(data => {
      console.log("Dropdown data:", data);

      const lecturerDropdown = document.getElementById("pensyarah");
      const practicumDropdown = document.getElementById("praktikum");

      if (data.lecturers) {
        data.lecturers.forEach(name => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          lecturerDropdown.appendChild(option);
        });
      }

      if (data.practicums) {
        data.practicums.forEach(practicum => {
          const option = document.createElement("option");
          option.value = practicum;
          option.textContent = practicum;
          practicumDropdown.appendChild(option);
        });
      }
    })
    .catch(error => {
      console.error("Dropdown loading error:", error);
    });


  // Load whole class student list
  document.getElementById("loadStudentsBtn").addEventListener("click", function () {
    const practicum = document.getElementById("praktikum").value;
    const container = document.getElementById("studentListContainer");

    if (!practicum) {
      container.innerHTML = "<p>Sila pilih praktikum terlebih dahulu.</p>";
      return;
    }

    container.innerHTML = "<p>Memuatkan senarai pelajar...</p>";

    fetch(`${scriptURL}?practicum=${encodeURIComponent(practicum)}`)
      .then(response => response.json())
      .then(data => {
        console.log("Class list result:", data);

        if (data.result === "success" && data.students.length > 0) {
          let html = `<div class="section-title">Senarai Pelajar ${practicum}</div>`;

          data.students.forEach(student => {
            html += `
              <div class="student-card">
                <strong>${student.studentName}</strong><br>
                <small>${student.matricNo}</small>

                <select class="attendanceStatus" data-matric="${student.matricNo}" data-name="${student.studentName}">
                  <option>Hadir</option>
                  <option>Tidak Hadir</option>
                  <option>Lewat</option>
                  <option>MC</option>
                  <option>Urusan Rasmi</option>
                </select>
              </div>
            `;
          });

          html += `<button type="button" id="submitClassBtn">Hantar Kehadiran Satu Kelas</button>`;
          container.innerHTML = html;

        } else {
          container.innerHTML = "<p>Tiada pelajar dijumpai untuk praktikum ini.</p>";
        }
      })
      .catch(error => {
        console.error("Load students error:", error);
        container.innerHTML = "<p>Ralat memuatkan senarai pelajar.</p>";
      });
  });


  // Auto-fill student name and practicum
  document.getElementById("noMatrik").addEventListener("blur", function () {
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


  // Submit single attendance record
  document.getElementById("attendanceForm").addEventListener("submit", function (e) {
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

});
