const express = require("express");
const router = express.Router();
const { sql, dbConfig } = require("../config/db");

// POST /api/missing-persons
router.post("/", async (req, res) => {

  try {

    const {
      report_type,
      missing_reason,
      priority,
      reporter_name,
      contact_address,
      province,
      phone_number,
      inform_channels,
      contact_channel,
      issue_topic,
      detail,
      birth_date,
      birth_time
    } = req.body;

    const pool = await sql.connect(dbConfig);

    let formattedTime = null;

    if (birth_time && /^\d{2}:\d{2}$/.test(birth_time)) {
      const [hours, minutes] = birth_time.split(":");
      formattedTime = new Date(1970, 0, 1, hours, minutes, 0);
    }

    await pool.request()
      .input("report_type", sql.NVarChar, report_type)
      .input("missing_reason", sql.NVarChar, missing_reason)
      .input("priority", sql.NVarChar, priority)
      .input("reporter_name", sql.NVarChar, reporter_name)
      .input("contact_address", sql.NVarChar, contact_address)
      .input("province", sql.NVarChar, province)
      .input("phone_number", sql.NVarChar, phone_number)
      .input("inform_channels", sql.NVarChar, inform_channels)
      .input("contact_channel", sql.NVarChar, contact_channel)
      .input("issue_topic", sql.NVarChar, issue_topic)
      .input("detail", sql.NVarChar, detail)
      .input("birth_date", sql.Date, birth_date || null)
      .input("birth_time", sql.Time, formattedTime)
      .query(`
        INSERT INTO MissingCase
        (
          report_type,
          missing_reason,
          priority,
          reporter_name,
          contact_address,
          province,
          phone_number,
          inform_channels,
          contact_channel,
          issue_topic,
          detail,
          birth_date,
          birth_time
        )
        VALUES
        (
          @report_type,
          @missing_reason,
          @priority,
          @reporter_name,
          @contact_address,
          @province,
          @phone_number,
          @inform_channels,
          @contact_channel,
          @issue_topic,
          @detail,
          @birth_date,
          @birth_time
        )
      `);

    res.status(201).json({
      message: "บันทึกข้อมูลสำเร็จ"
    });

  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({
      message: "เกิดข้อผิดพลาด",
      error: err.message
    });
  }

});

module.exports = router;