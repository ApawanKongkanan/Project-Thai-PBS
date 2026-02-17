/*************************
 * LOAD POSTCODE DATA
 *************************/
let postcodeData = [];

fetch("../data/postcode.json")
  .then(res => res.json())
  .then(data => {
    postcodeData = data;
    console.log("📦 postcode loaded:", postcodeData.length);
  })
  .catch(err => {
    console.error("❌ โหลด postcode ไม่ได้", err);
  });

/*************************
 * STEP CONTROL
 *************************/
let currentStep = 1;
const totalSteps = 5;

function showStep(step) {
  document.querySelectorAll(".step")
    .forEach(s => s.classList.remove("active"));

  document
    .querySelector(`[data-step="${step}"]`)
    .classList.add("active");

  document.getElementById("stepNumber").innerText = step;

  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  // 🔹 ปุ่มย้อนกลับ
  if (step === 1) {
    prevBtn.style.visibility = "hidden";
  } else {
    prevBtn.style.visibility = "visible";
  }

  // 🔹 ปุ่มถัดไป / ยืนยัน
  if (step === totalSteps) {
    nextBtn.innerText = "ยืนยันข้อมูล";
    nextBtn.classList.remove("btn-primary");
    nextBtn.classList.add("btn-success");
  } else {
    nextBtn.innerText = "ถัดไป";
    nextBtn.classList.remove("btn-success");
    nextBtn.classList.add("btn-primary");
  }
}

function nextStep() {
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
  } else {
    alert("✅ ส่งข้อมูลเรียบร้อย (demo)");
    // future: POST to backend
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

/*************************
 * POSTCODE AUTO FILL
 *************************/
document.addEventListener("DOMContentLoaded", () => {

  const postcodeInput = document.getElementById("postcode");
  const addressAuto = document.getElementById("addressAuto");

  if (!postcodeInput || !addressAuto) return;

  postcodeInput.addEventListener("input", () => {
    const code = postcodeInput.value.trim();

    if (code.length !== 5 || postcodeData.length === 0) {
      addressAuto.value = "";
      return;
    }

    const match = postcodeData.find(
      item => String(item.zipcode) === code
    );

    if (match) {
      addressAuto.value =
        `ตำบล${match.subdistrict} อำเภอ${match.district} จังหวัด${match.province}`;
    } else {
      addressAuto.value = "ไม่พบข้อมูลรหัสไปรษณีย์";
    }
  });

  // ⭐ สำคัญมาก: แสดง Step แรก
  showStep(currentStep);
});