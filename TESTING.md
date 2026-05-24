# Smart AgriTech — Manual Testing Documentation

Use this table in your project report and presentation slide **“Testing & Validation”**.

## Test environment

| Item | Value |
|------|-------|
| OS | Windows 10/11 |
| Browser | Chrome / Edge (latest) |
| Backend | Node.js, Express — `http://localhost:5000` |
| Frontend | React (Vite) — `http://localhost:3000` |
| Database | MongoDB Atlas |
| APIs | Gemini, OpenWeather |

## Functional test cases

| ID | Module | Test steps | Expected result | Status |
|----|--------|------------|-----------------|--------|
| T1 | Health API | GET `/api/health` | `status: OK`, `database: connected` | ☐ |
| T2 | Registration | Register new farmer with valid data | User created, redirect/login works | ☐ |
| T3 | Login | Login farmer / admin | JWT issued, correct dashboard shown | ☐ |
| T4 | Crop AI | Enter valid NPK + climate, submit | Crop list returned, saved in history | ☐ |
| T5 | Fertilizer AI | Crop + soil + NPK, submit | Fertilizer plan returned | ☐ |
| T6 | Weather | Search city (e.g. Delhi) | Current + forecast + farming tips | ☐ |
| T7 | Disease | Upload JPG &lt; 5 MB | Disease result, confidence, print report | ☐ |
| T8 | History | Open My History after T4–T7 | Past recommendations listed | ☐ |
| T9 | Marketplace | Browse, add to cart, place COD order | Order appears in My Orders | ☐ |
| T10 | Admin stats | Login admin, view Overview | Charts and user counts load | ☐ |
| T11 | Admin leads | Open Leads, expand row | Input data + AI output visible | ☐ |
| T12 | Admin orders | Change order status | Status updates in farmer view | ☐ |
| T13 | Contact | Submit contact form | Message in Admin Messages tab | ☐ |
| T14 | Security | Access `/api/admin/stats` without token | 401 Unauthorized | ☐ |
| T15 | Validation | Crop form with invalid pH | 400 validation error message | ☐ |

## Non-functional checks

| ID | Type | Test | Expected | Status |
|----|------|------|----------|--------|
| NF1 | Performance | Crop recommendation response time | &lt; 15 s on college network | ☐ |
| NF2 | Usability | Navigate all sidebar links as farmer | No broken routes | ☐ |
| NF3 | Security | Wrong password login | Error message, no token | ☐ |
| NF4 | Reliability | Restart server, reload app | Data persists in Atlas | ☐ |

## Screenshot checklist (for PPT backup)

1. Landing page with live stats  
2. Crop recommendation result  
3. Disease detection with confidence bar  
4. Weather forecast cards  
5. Marketplace product grid  
6. Order placed + timeline  
7. Admin dashboard charts  
8. Admin Leads expanded row  

## Notes for examiners

- AI modules require active `GEMINI_API_KEY` and internet.  
- Disease module can fall back to reference catalog if Gemini is unavailable.  
- Automated unit tests (Jest/Supertest) are planned as future enhancement.
