# CarePoint — Hospital Management System

A beginner-friendly **front-end-only** hospital management internship project built with React + Vite. It follows the supplied internship brief: no backend, no database, and fictional local mock data only.

## Included modules
- Mock sign-in with Admin, Doctor, and Receptionist roles and role-specific page access (client-side demonstration only).
- Protected page navigation: unavailable pages are hidden and direct page changes are checked in the app.
- Dashboard cards, activity chart, and upcoming appointments.
- Patients: search, status filter, pagination, add/edit/delete, patient detail preview, and CSV export.
- Doctors: search, specialization filter, availability toggle, add/edit/delete, and CSV export.
- Appointments: book, reschedule, cancel, Pending/Confirmed/Completed status, monthly calendar view, CSV export, and print.
- Billing: create/edit/delete invoices, Paid/Unpaid status, printable invoice, and CSV export.
- Settings: editable hospital name, contact email, phone, and page-size preference.
- Ward and bed availability tracker with ward filter and fictional patient assignment.
- Light/dark theme, responsive layout, and accessible labels/tooltips for controls.
- LocalStorage persistence for demo records and preferences.

## Technology
React 18, Vite, Recharts, Lucide React, CSS, localStorage, Vitest.

## Run locally
1. Install Node.js LTS.
2. Extract the ZIP and open the `hospital-management` folder in VS Code.
3. Open Terminal in VS Code and run:

```bash
npm install
npm run dev
```

4. Open the local URL printed in the terminal (normally `http://localhost:5173`).

## Verify before submission
```bash
npm test
npm run build
```

For accessibility, run Lighthouse in Chrome DevTools on the production preview and address any reported issues. The requested 90+ accessibility score is a target to verify in the actual browser; it is not pre-certified by this repository.

## Git and Vercel
- Create a feature branch for each task, commit small changes with clear messages, and open pull requests for review. Do not commit directly to `main`.
- Push the repository to GitHub, import it into Vercel, use `npm run build` and `dist` as the output directory. `vercel.json` includes the SPA refresh rewrite.

## Suggested 3–5 minute demo
1. Sign in using each role and demonstrate which pages each role can access.
2. Show dashboard and its sample chart.
3. Add, search, edit, paginate, and delete a fictional patient.
4. Add a doctor and toggle availability.
5. Book and reschedule an appointment, change its status, and open Calendar.
6. Create an invoice, change its payment status, print it, and export CSV.
7. Show Settings, Ward & Beds, dark mode, and mobile layout.

## Important safety and scope notes
- Use only fictional patient information. Never enter real patient records or sensitive medical information.
- This is not a real hospital system. There is no backend, database, secure authentication, or server-side authorization.
- Role-based navigation is a learning/demo feature and can be bypassed by a technically skilled browser user. It must not be used to protect real patient data.
- Data is stored only in the current browser's localStorage and is not synchronized across devices.
- The Lighthouse accessibility score must be measured after running the app in a browser.

## Suggested folder structure
- `src/App.jsx` — application shell and screens
- `src/features/` — feature modules (extension point)
- `src/data/` — local mock data (extension point)
- `src/lib/permissions.js` — role and table helpers
- `src/styles.css` — responsive styling
- `tests/` — unit tests
