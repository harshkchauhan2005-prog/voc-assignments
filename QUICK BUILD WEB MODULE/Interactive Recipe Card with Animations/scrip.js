 document.getElementById("nameInput").addEventListener("input", e => 
      document.getElementById("namePreview").textContent = e.target.value || "Your Name");

    document.getElementById("emailInput").addEventListener("input", e => 
      document.getElementById("emailPreview").textContent = e.target.value || "your@email.com");

    document.getElementById("phoneInput").addEventListener("input", e => 
      document.getElementById("phonePreview").textContent = e.target.value || "+91 00000 00000");

    document.getElementById("summaryInput").addEventListener("input", e => 
      document.getElementById("summaryPreview").textContent = e.target.value || "Write something about yourself...");

    document.getElementById("educationInput").addEventListener("input", e => 
      document.getElementById("educationPreview").textContent = e.target.value || "Your education background here...");

    document.getElementById("skillsInput").addEventListener("input", e => 
      document.getElementById("skillsPreview").textContent = e.target.value || "List your skills here...");

    document.getElementById("experienceInput").addEventListener("input", e => 
      document.getElementById("experiencePreview").textContent = e.target.value || "Your work experience here...");