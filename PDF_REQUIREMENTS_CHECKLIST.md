# Internship brief — implementation and submission checklist

## Core requirements implemented in the project
- [x] Front-end-only React + Vite project; no backend or database
- [x] Local mock JSON data, app state, and optional localStorage persistence
- [x] Mock Admin / Doctor / Receptionist sign-in
- [x] Role-specific navigation and page-access checks (demo-only client-side protection)
- [x] Dashboard summary cards and activity chart
- [x] Patients: search, status filter, pagination, add, edit, delete, detail view
- [x] Doctors: directory, specialization filter, availability, add, edit, delete
- [x] Appointments: book, reschedule, cancel, Pending / Confirmed / Completed status
- [x] Billing: create/edit/delete invoices, Paid / Unpaid, printable invoice
- [x] Dark mode
- [x] Appointment calendar view
- [x] CSV export and browser Print / Save as PDF actions
- [x] Ward / bed availability tracker
- [x] Unit tests with Vitest
- [x] Responsive layouts and accessible action titles / labels

## Must verify on the actual machine before submission
- [ ] Run `npm install`
- [ ] Run `npm test` and confirm all tests pass
- [ ] Run `npm run build` and fix any environment-specific errors
- [ ] Open the site at desktop and mobile widths; test every button and form
- [ ] Run Lighthouse Accessibility in Chrome and reach the brief's 90+ target

## External submission work (requires the intern's own accounts/actions)
- [ ] Create a GitHub repository and push this project
- [ ] Follow the brief's feature-branch / pull-request workflow; do not commit directly to main
- [ ] Deploy the repository on Vercel and verify the live URL and refresh navigation
- [ ] Add final screenshots and setup details to README if UI changes
- [ ] Record the required 3–5 minute demo or prepare a live walkthrough
- [ ] Write a short list of future improvements

## Safety and scope
Only fictional data is included. This is a learning demo, not a real medical system. There is no secure authentication, server-side authorization, backend, or database. Never enter real patient records or sensitive information.
