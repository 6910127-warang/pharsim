# นักศึกษาฝึกงานเภสัชกรรม (รพ.เชียงรายประชานุเคราะห์)

Life-sim / visual novel เชิงตัดสินใจ สอนระเบียบ ข้อตกลง และความเสี่ยงที่เคยเกิดขึ้นจริง
ผ่านสถานการณ์จำลองสำหรับนักศึกษาฝึกงานเภสัชกรรม ดูรายละเอียดสถาปัตยกรรมเต็มได้ที่
[`pharmacy-internship-sim-architecture.md`](./pharmacy-internship-sim-architecture.md)

## เริ่มต้นใช้งาน

```bash
npm install
npm run dev
```

## โครงสร้างโปรเจกต์

```
src/
├── engine/            # ตรรกะเกม แยกจาก UI ทดสอบได้อิสระ
│   ├── timeEngine.js      # เดินเวลา (วัน/เวร), จัดการพลังงาน
│   ├── eventSelector.js   # เลือก event ตามเงื่อนไข day/flags/probability
│   ├── choiceResolver.js  # อัปเดต stats/relationships/flags จาก choice
│   └── saveSystem.js      # save/load ผ่าน localStorage
├── data/
│   ├── scenarios/         # เนื้อหาเกมทั้งหมดเป็น JSON (onboarding, regulations, incidents, ethics)
│   └── competencyMap.json # แม็ป stat -> ชื่อสมรรถนะ/คำอธิบาย สำหรับ Report Card
├── components/
│   ├── ShiftScreen.jsx    # หน้าจอหลักระหว่างเล่น (StatPanel + EventDialog)
│   ├── EventDialog.jsx    # แสดงสถานการณ์ + ตัวเลือก + feedback
│   ├── StatPanel.jsx      # แสดง stats/relationships/energy
│   └── ReportCard.jsx     # สรุปผลท้ายเกม
├── state/
│   └── gameState.js       # โครงสร้าง player state เริ่มต้น
└── App.jsx                # ประกอบ game loop ทั้งหมดเข้าด้วยกัน
```

## เพิ่มสถานการณ์ใหม่

เพิ่มไฟล์ JSON ใน `src/data/scenarios/` ตาม schema ในเอกสารสถาปัตยกรรม ข้อ 2.2
แล้ว import เข้าไปรวมกับ scenario อื่น ๆ ใน `src/App.jsx` — ไม่ต้องแก้โค้ด engine หรือ component

> ข้อควรระวัง: ข้อมูล incident จริงควร anonymized (ไม่มีชื่อผู้ป่วย/บุคลากร/วันที่ระบุตัวตนได้)
> ก่อนใส่ในเกม เพื่อความเหมาะสมด้านจริยธรรมและความเป็นส่วนตัว
