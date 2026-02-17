let postcodeData = [];

fetch("data/postcode.json")
  .then(res => res.json())
  .then(data => {
    postcodeData = data;
    console.log("📦 postcode loaded", postcodeData.length);
  });

/* =====================================================
   CONFIG
===================================================== */
const API_URL = "http://localhost:3000/api/missing-persons";

/* =====================================================
   DOM READY
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       HOME PAGE : SEARCH
    ========================= */
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {
        searchBtn.addEventListener("click", async () => {
            const month = document.getElementById("month").value;
            const keyword = document.getElementById("keyword").value;
            const list = document.getElementById("personList");

            list.innerHTML = "กำลังค้นหา...";

            try {
                const res = await fetch(`${API_URL}?month=${month}&name=${keyword}`);
                const data = await res.json();
                renderPersons(data);
            } catch {
                list.innerHTML = "<p>ไม่สามารถเชื่อมต่อ API ได้</p>";
            }
        });
    }

    /* =========================
       RENDER RESULT
    ========================= */
    function renderPersons(data) {
        const list = document.getElementById("personList");
        if (!list) return;

        list.innerHTML = "";

        if (!data || data.length === 0) {
            list.innerHTML = "<p class='text-center'>ไม่พบข้อมูล</p>";
            return;
        }

        data.forEach(p => {
            list.innerHTML += `
                <div class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${p.name}</h5>
                        <p class="card-text">หายวันที่ ${p.missing_date}</p>
                        <p class="card-text">อายุ ${p.age} ปี</p>
                        <p class="card-text">แจ้งความ ${p.police_station}</p>
                    </div>
                </div>
            `;
        });
    }

    /* =========================
       PROVINCE SELECT
    ========================= */
    const provinces = [
        "กรุงเทพมหานคร","กระบี่","กาญจนบุรี","กาฬสินธุ์","กำแพงเพชร",
        "ขอนแก่น","จันทบุรี","ฉะเชิงเทรา","ชลบุรี","ชัยนาท",
        "ชัยภูมิ","ชุมพร","เชียงราย","เชียงใหม่","ตรัง",
        "ตราด","ตาก","นครนายก","นครปฐม","นครพนม",
        "นครราชสีมา","นครศรีธรรมราช","นครสวรรค์","นนทบุรี",
        "นราธิวาส","น่าน","บึงกาฬ","บุรีรัมย์","ปทุมธานี",
        "ประจวบคีรีขันธ์","ปราจีนบุรี","ปัตตานี","พระนครศรีอยุธยา",
        "พะเยา","พังงา","พัทลุง","พิจิตร","พิษณุโลก",
        "เพชรบุรี","เพชรบูรณ์","แพร่","ภูเก็ต","มหาสารคาม",
        "มุกดาหาร","แม่ฮ่องสอน","ยโสธร","ยะลา","ร้อยเอ็ด",
        "ระนอง","ระยอง","ราชบุรี","ลพบุรี","ลำปาง",
        "ลำพูน","เลย","ศรีสะเกษ","สกลนคร","สงขลา",
        "สตูล","สมุทรปราการ","สมุทรสงคราม","สมุทรสาคร",
        "สระแก้ว","สระบุรี","สิงห์บุรี","สุโขทัย","สุพรรณบุรี",
        "สุราษฎร์ธานี","สุรินทร์","หนองคาย","หนองบัวลำภู",
        "อ่างทอง","อำนาจเจริญ","อุดรธานี","อุตรดิตถ์",
        "อุทัยธานี","อุบลราชธานี"
    ];

    const provinceSelect = document.getElementById("province");
    if (provinceSelect) {
        provinces.forEach(p => {
            const option = document.createElement("option");
            option.value = p;
            option.textContent = p;
            provinceSelect.appendChild(option);
        });
    }

    /* =========================
       PDF EXPORT
    ========================= */
    const pdfBtn = document.getElementById("pdfBtn");
    const reportForm = document.getElementById("reportForm");

    if (pdfBtn && reportForm) {
        pdfBtn.addEventListener("click", () => {

            const clone = reportForm.cloneNode(true);

            clone.querySelectorAll('input[type="file"]').forEach(i => i.remove());

            html2pdf()
                .set({
                    margin: 10,
                    filename: "แจ้งคนหาย.pdf",
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
                })
                .from(clone)
                .save();
        });
    }

        /* =========================
       POSTCODE AUTO FILL
    ========================= */
    const postcodeInput = document.getElementById("postcode");
const addressAuto = document.getElementById("addressAuto");

if (postcodeInput && addressAuto) {
    postcodeInput.addEventListener("input", () => {
        const code = postcodeInput.value.trim();

        if (code.length !== 5) {
            addressAuto.value = "";
            return;
        }

        // 🔍 ค้นหาจาก array
        const matches = postcodeData.filter(
            item => String(item.zipcode) === code
        );

        if (matches.length > 0) {
            const first = matches[0];
            addressAuto.value =
              `ตำบล${first.subdistrict} อำเภอ${first.district} จังหวัด${first.province}`;
        } else {
            addressAuto.value = "ไม่พบข้อมูลรหัสไปรษณีย์";
        }
    });
}

});