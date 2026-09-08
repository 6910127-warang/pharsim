# สถาปัตยกรรมเกม: นักศึกษาฝึกงานเภสัชกรรม (รพ.เชียงรายประชานุเคราะห์)

## 1. ภาพรวมเกม

**ประเภท:** Life-sim / Visual novel เชิงตัดสินใจ (decision-driven)
**เป้าหมาย:** ให้นักศึกษาฝึกงานเรียนรู้ระเบียบ ข้อตกลง และความเสี่ยงที่เคยเกิดขึ้นจริง ผ่านสถานการณ์จำลอง
**แพลตฟอร์ม:** Web (HTML/React) เพื่อแจกจ่ายง่าย เล่นผ่านเบราว์เซอร์ ไม่ต้องติดตั้ง

---

## 2. โครงสร้างข้อมูลหลัก (Data Model)

### 2.1 Player State
```json
{
  "playerName": "string",
  "day": 1,
  "shift": "morning | afternoon",
  "energy": 100,
  "stats": {
    "academicKnowledge": 50,
    "attentiveness": 50,
    "communication": 50,
    "professionalism": 50,
    "confidence": 50
  },
  "relationships": {
    "preceptor": 50,
    "nurseTeam": 50,
    "patients": 50
  },
  "flags": {},
  "log": []
}
```
- `flags` เก็บสถานะเชิง narrative เช่น `madeErrorDay3: true` เพื่อ unlock/ล็อก event ในอนาคต
- `log` เก็บบันทึกการตัดสินใจทั้งหมด ใช้ทำ report card ตอนจบ

### 2.2 Scenario/Event Schema
เป็นหัวใจของเกม ทุกสถานการณ์ (ทั้งระเบียบ, incident, จริยธรรม) ใช้โครงเดียวกัน:

```json
{
  "id": "evt_lasa_001",
  "category": "incident | regulation | ethics | onboarding",
  "title": "ยาหน้าตาคล้ายกัน (LASA)",
  "context": "รายละเอียดสถานการณ์ตั้งต้น...",
  "trigger": {
    "minDay": 3,
    "requiredFlags": [],
    "excludedFlags": ["evt_lasa_001_done"],
    "probability": 0.3
  },
  "choices": [
    {
      "id": "check_twice",
      "text": "ตรวจสอบชื่อยาซ้ำกับเภสัชกรพี่เลี้ยงก่อนจ่าย",
      "effects": { "stats": { "attentiveness": 10, "confidence": 5 }, "relationships": { "preceptor": 5 } },
      "feedback": "ถูกต้อง ตามระเบียบ SOP ข้อ... การตรวจสอบซ้ำช่วยลดความเสี่ยง LASA",
      "setFlags": ["evt_lasa_001_done"]
    },
    {
      "id": "dispense_directly",
      "text": "จ่ายยาไปเลยเพราะมั่นใจ",
      "effects": { "stats": { "attentiveness": -15 }, "relationships": { "preceptor": -10 } },
      "feedback": "เสี่ยงต่อการจ่ายผิด อ้างอิงรายงานอุบัติการณ์ปี... กรณีคล้ายกันเคยเกิดขึ้นจริง",
      "setFlags": ["evt_lasa_001_done", "hadNearMiss"]
    }
  ],
  "sourceRef": "รายงานอุบัติการณ์ #2023-XX (anonymized)"
}
```

**ทำไมออกแบบแบบนี้:** แยกเนื้อหา (data) ออกจาก engine (code) เด็ดขาด — นักศึกษา/อาจารย์ที่ไม่ใช่โปรแกรมเมอร์สามารถเพิ่ม/แก้ scenario ได้แค่แก้ไฟล์ JSON โดยไม่ต้องแตะโค้ด

---

## 3. ระบบหลักของเกม (Core Systems)

| ระบบ | หน้าที่ |
|---|---|
| **Time/Shift Engine** | เดินเวลาไปทีละผลัด, จำกัดจำนวน action ต่อวันตาม energy |
| **Event Selector** | เลือก event ที่ตรงเงื่อนไข (day, flags) มาแสดงในแต่ละผลัด |
| **Choice Resolver** | รับ choice ผู้เล่น → อัปเดต stats/relationships/flags → แสดง feedback |
| **Save/Load** | เก็บ state ลง localStorage/backend (ในระยะแรกใช้ localStorage พอ) |
| **Report Card Generator** | ตอนจบเกม สรุปผลตาม competency ที่แม็ปจาก stats |
| **Content Loader** | โหลด scenario ทั้งหมดจากไฟล์ JSON/ชุดข้อมูลแยกตามหมวด |

---

## 4. โครงสร้างโฟลเดอร์โปรเจกต์ (แนะนำ)

```
pharmacy-sim/
├── src/
│   ├── engine/
│   │   ├── timeEngine.js
│   │   ├── eventSelector.js
│   │   ├── choiceResolver.js
│   │   └── saveSystem.js
│   ├── data/
│   │   ├── scenarios/
│   │   │   ├── onboarding.json
│   │   │   ├── incidents.json
│   │   │   └── ethics.json
│   │   └── competencyMap.json
│   ├── components/
│   │   ├── ShiftScreen.jsx
│   │   ├── EventDialog.jsx
│   │   ├── StatPanel.jsx
│   │   └── ReportCard.jsx
│   ├── state/
│   │   └── gameState.js
│   └── App.jsx
└── README.md
```

---

## 5. ขั้นตอนถัดไปที่แนะนำ (สำหรับ Claude Code)

1. **Scaffold โปรเจกต์** — สร้างโครง React + state management ตามด้านบน
2. **สร้าง engine 4 ตัว** (time, selector, resolver, save) แบบ unit ทดสอบได้อิสระ
3. **ใส่ scenario ตัวอย่าง 3–5 เคส** (1 onboarding, 2 incident, 1 ethics) เพื่อทดสอบ loop ทั้งหมดว่าเดินได้จริง
4. **ต่อ UI** (ShiftScreen → EventDialog → feedback)
5. **ทำ Report Card** ท้ายเกม
6. ค่อยเพิ่มเนื้อหา scenario จริงจากระเบียบ/incident ที่มีอยู่ (แปลงเป็น JSON ตาม schema ข้อ 2.2)

> ข้อควรระวัง: ข้อมูล incident จริงควร **anonymized** (ไม่มีชื่อผู้ป่วย/บุคลากร/วันที่ระบุตัวตนได้) ก่อนใส่ในเกม เพื่อความเหมาะสมด้านจริยธรรมและความเป็นส่วนตัว
