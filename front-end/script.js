/* =====================================================
   CONFIG
===================================================== */
const API_URL = "http://localhost:3000/api/missing-persons";

/* =====================================================
   HOME PAGE : SEARCH & DISPLAY RESULT
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {
        searchBtn.addEventListener("click", async () => {
            const month = document.getElementById("month").value;
            const keyword = document.getElementById("keyword").value;
            const list = document.getElementById("personList");
    
            list.innerHTML = "กำลังค้นหา...";
    
            try {
                const res = await fetch(`${API_URL}?month=${month}&keyword=${keyword}`);
                const data = await res.json();
                renderPersons(data);
            } catch {
                list.innerHTML = "<p>ไม่สามารถเชื่อมต่อ API ได้</p>";
            }
        });
    }

    /* =====================================================
       RENDER SEARCH RESULT
    ===================================================== */
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

    /* =====================================================
       PROVINCES (REPORT PAGE)
    ===================================================== */
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

/* =====================================================
   PDF EXPORT (REPORT PAGE)
===================================================== */


    const pdfBtn = document.getElementById("pdfBtn");
    const reportForm = document.getElementById("reportForm");

    if (!pdfBtn || !reportForm) return;

    pdfBtn.addEventListener("click", () => {

        // clone form เพื่อไม่ยุ่งกับของจริง
        const clone = reportForm.cloneNode(true);

        // ลบ input file (html2pdf ไม่รองรับ)
        const fileInputs = clone.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.remove());

        const opt = {
            margin: 10,
            filename: "แจ้งคนหาย.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            }
        };

        html2pdf()
            .set(opt)
            .from(clone)
            .save();
    });




  const form = document.getElementById("reportForm");

    if (form) {
    form.addEventListener("submit", async function (e) {

    e.preventDefault(); // ป้องกันหน้ารีเฟรช

    // ดึงค่าจาก input แต่ละตัว
    const data = {
      report_type: form.report_type.value,
      missing_reason: form.missing_reason.value,
      priority: form.priority.value,
      reporter_name: form.reporter_name.value,
      contact_address: form.contact_address.value,
      province: form.province.value,
      phone_number: form.phone_number.value,
      inform_channels: form.inform_channels.value,
      contact_channel: form.contact_channel.value,
      issue_topic: form.issue_topic.value,
      detail: form.detail.value,
      birth_date: form.birth_date?.value || null,
      birth_time: form.birth_time?.value || null
    };

    console.log("ส่งข้อมูล:", data); // ดูใน console

    try {
      const response = await fetch("http://localhost:3000/api/missing-persons", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(data) // แปลง object → JSON
      });

      const result = await response.json();

      if (response.ok) {
        alert("บันทึกข้อมูลสำเร็จ ✅");
        form.reset(); // เคลียร์ฟอร์ม
      } else {
        alert("เกิดข้อผิดพลาด ❌");
        console.error(result);
      }

    } catch (error) {
      console.error("Error:", error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }

  });

  }

});