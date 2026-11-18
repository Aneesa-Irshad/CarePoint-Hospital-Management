import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, CalendarDays, ClipboardList, CreditCard, LayoutDashboard,
  LogOut, Menu, Moon, Plus, Search, Settings, Stethoscope, Sun, Users, X,
  Bell, MoreHorizontal, Pencil, Trash2, Eye, Printer, Download, CheckCircle2,
  Clock3, XCircle, HeartPulse, BedDouble, FileText, Filter, ArrowUpRight,  Save, ShieldCheck
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Bar, BarChart
} from 'recharts';

import mockData from './data/mockData.json';
import { ROLE_PAGES } from './lib/permissions.js';

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
const seedPatients = mockData.patients;
const seedDoctors = mockData.doctors;
const seedAppointments = mockData.appointments.map(a=>({...a,date:today}));
const seedInvoices = mockData.invoices.map(i=>({...i,date:today}));
const initial = (key, fallback) => {
  try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : fallback; }
  catch { return fallback; }
};
const money = n => `Rs. ${Number(n || 0).toLocaleString('en-PK')}`;
const nav = [
  ['Dashboard', LayoutDashboard], ['Patients', Users], ['Doctors', Stethoscope],
  ['Appointments', CalendarDays], ['Billing', CreditCard], ['Ward & Beds', BedDouble], ['Calendar', CalendarDays]
];

function App() {
  const [user, setUser] = useState(() => initial('hms_user', null));
  const [page, setPage] = useState('Dashboard');
  const [patients, setPatients] = useState(() => initial('hms_patients', seedPatients));
  const [doctors, setDoctors] = useState(() => initial('hms_doctors', seedDoctors));
  console.log("Doctors in App:", doctors);
  const [appointments, setAppointments] = useState(() => initial('hms_appointments', seedAppointments));
  const [invoices, setInvoices] = useState(() => initial('hms_invoices', seedInvoices));
  const [dark, setDark] = useState(() => initial('hms_dark', false));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [settings, setSettings] = useState(() => initial('hms_settings', {hospitalName:'CarePoint Hospital', contactEmail:'admin@carepoint.demo', phone:'021-0000000', pageSize:5}));
  const [beds, setBeds] = useState(() => initial('hms_beds', Array.from({length:12},(_,i)=>({id:`B-${String(i+1).padStart(3,'0')}`,ward:i<4?'General':i<8?'Private':'ICU',status:i%4===0?'Occupied':'Available',patient:i%4===0?seedPatients[(i/4|0)%seedPatients.length].name:''}))));

  useEffect(() => { localStorage.setItem('hms_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('hms_doctors', JSON.stringify(doctors)); }, [doctors]);
  useEffect(() => { localStorage.setItem('hms_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('hms_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('hms_dark', JSON.stringify(dark)); }, [dark]);
  useEffect(() => { localStorage.setItem('hms_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('hms_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('hms_beds', JSON.stringify(beds)); }, [beds]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = message => setToast(message);
  const logout = () => { setUser(null); setPage('Dashboard'); };
  const addOrEdit = (type, item) => setModal({ type, item: item || null });
  const saveRecord = (type, record) => {
    const setters = { patients: setPatients, doctors: setDoctors, appointments: setAppointments, invoices: setInvoices };
    const current = { patients, doctors, appointments, invoices }[type];
    const exists = current.some(x => x.id === record.id);
    setters[type](exists ? current.map(x => x.id === record.id ? record : x) : [record, ...current]);
    setModal(null); notify(exists ? 'Record updated successfully.' : 'Record added successfully.');
  };
  const allowedPages = user ? [...(ROLE_PAGES[user.role] || []), 'Patient Details'] : [];
  useEffect(()=>{ if(user && !allowedPages.includes(page)) setPage('Dashboard'); },[page,user?.role]);
  const goPage = next => { if (allowedPages.includes(next) || next === 'Ward & Beds' && user?.role === 'Admin') setPage(next); else notify('Your selected role does not have permission to open this page.'); };
  const removeRecord = (type, id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    const setters = { patients: setPatients, doctors: setDoctors, appointments: setAppointments, invoices: setInvoices };
    const current = { patients, doctors, appointments, invoices }[type];
    setters[type](current.filter(x => x.id !== id)); notify('Record deleted.');
  };
  if (!user) return <Login onLogin={u => { setUser(u); setPage('Dashboard'); }} />;
  return <div className={dark ? 'app dark' : 'app'}>
    <aside className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
      <div className="brand"><div className="brand-icon"><HeartPulse size={22}/></div><div><b>CarePoint</b><small>HOSPITAL SYSTEM</small></div><button className="mobile-close" onClick={() => setSidebarOpen(false)}><X/></button></div>
      <div className="side-label">WORKSPACE</div>
      <nav>{nav.filter(([name])=>allowedPages.includes(name) || (name==='Ward & Beds' && user.role==='Admin')).map(([name, Icon]) => <button key={name} className={`nav-item ${page === name ? 'active' : ''}`} onClick={() => {goPage(name);setSidebarOpen(false);}}><Icon size={18}/><span>{name}</span>{name === 'Appointments' && <i>{appointments.length}</i>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Activity size={18}/></div><b>Need assistance?</b><p>Contact your system administrator for support.</p></div>{user.role==='Admin' && <button className={`nav-item ${page==='Settings'?'active':''}`} onClick={() => {setPage('Settings');setSidebarOpen(false);}}><Settings size={18}/>Settings</button>}</div>
      <div className="sidebar-foot">© 2026 CarePoint Hospital</div>
    </aside>
    {sidebarOpen && <div className="scrim" onClick={() => setSidebarOpen(false)} />}
    <main className="main">
      <header className="topbar"><div className="top-left"><button className="menu-btn" onClick={() => setSidebarOpen(true)}><Menu/></button><div><div className="crumb">Pages <span>/</span> {page}</div><h1>{page}</h1></div></div><div className="top-actions"><div className="date-chip"><CalendarDays size={15}/>{new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</div><button className="icon-btn" onClick={() => setDark(!dark)} title="Toggle theme">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button><button className="icon-btn notification" onClick={() => notify('You are all caught up!')} title="Notifications"><Bell size={18}/><em/></button><div className="profile"><div className="avatar">{user.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div><b>{user.name}</b><small>{user.role}</small></div></div><button className="icon-btn logout" onClick={logout} title="Logout"><LogOut size={18}/></button></div></header>
      <section className="content">
        {page === 'Dashboard' && <Dashboard patients={patients} doctors={doctors} appointments={appointments} invoices={invoices} setPage={setPage}/>}
        {page === 'Patients' && <Patients patients={patients} pageSize={settings.pageSize} onAdd={() => addOrEdit('patients')} onEdit={p => addOrEdit('patients',p)} onDelete={id => removeRecord('patients',id)} onView={p=>{setSelectedPatient(p);setPage('Patient Details')}}/>}
        {page === 'Patient Details' && selectedPatient && <PatientDetails patient={patients.find(p=>p.id===selectedPatient.id)||selectedPatient} onBack={()=>setPage('Patients')} onEdit={()=>addOrEdit('patients',selectedPatient)}/>}
        {page === 'Doctors' && <Doctors doctors={doctors} onAdd={() => addOrEdit('doctors')} onEdit={d => addOrEdit('doctors',d)} onDelete={id => removeRecord('doctors',id)} onToggle={d => saveRecord('doctors',{...d,available:!d.available})}/>}
        {page === 'Appointments' && <Appointments appointments={appointments} onAdd={() => addOrEdit('appointments')} onEdit={a => addOrEdit('appointments',a)} onDelete={id => removeRecord('appointments',id)} onStatus={(a,status)=>saveRecord('appointments',{...a,status})}/>}
        {page === 'Billing' && <Billing invoices={invoices} onAdd={() => addOrEdit('invoices')} onEdit={i => addOrEdit('invoices',i)} onDelete={id => removeRecord('invoices',id)} onStatus={(i,status)=>saveRecord('invoices',{...i,status})}/>}
        {page === 'Settings' && <SettingsPage settings={settings} onSave={setSettings} notify={notify}/>}
        {page === 'Ward & Beds' && <WardBeds beds={beds} setBeds={setBeds} patients={patients}/>}
        {page === 'Calendar' && <CalendarPage appointments={appointments}/>}
      </section>
      <footer className="footer">{settings.hospitalName} Management System <span>Front-end internship project · Demo data only</span></footer>
    </main>
    {modal && <RecordModal modal={modal} patients={patients} doctors={doctors} onClose={() => setModal(null)} onSave={record => saveRecord(modal.type,record)}/>}
    {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
  </div>;
}

function exportCSV(filename, rows) {
  if (!rows.length) { window.alert('There are no records to export.'); return; }
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(','), ...rows.map(row=>keys.map(k=>`"${String(row[k]??'').replaceAll('"','""')}"`).join(','))].join('\n');
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}
function SettingsPage({settings,onSave,notify}) {
  const [form,setForm]=useState(settings);
  return <><PageHeading eyebrow="PREFERENCES" title="Settings" description="Manage basic hospital details and display preferences."/><div className="panel settings-panel"><h3>Hospital information</h3><p className="muted">These details are stored locally in this browser for the demo.</p><div className="form-grid"><div className="field"><label>Hospital name</label><input value={form.hospitalName} onChange={e=>setForm({...form,hospitalName:e.target.value})}/></div><div className="field"><label>Contact email</label><input type="email" value={form.contactEmail} onChange={e=>setForm({...form,contactEmail:e.target.value})}/></div><div className="field"><label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div><div className="field"><label>Rows per page</label><select value={form.pageSize} onChange={e=>setForm({...form,pageSize:Number(e.target.value)})}><option value="5">5</option><option value="10">10</option><option value="20">20</option></select></div></div><div className="modal-actions"><button className="primary" onClick={()=>{onSave(form);notify('Settings saved successfully.')}}><Save size={15}/> Save settings</button></div></div><div className="panel settings-panel"><h3>Demo safety</h3><p className="muted">CarePoint is a front-end training project. Use fictional patient information only. Do not enter real medical records or sensitive data.</p><div className="permission-note"><ShieldCheck size={18}/> Role access is a client-side demonstration, not secure authentication.</div></div></>;
}
function WardBeds({beds,setBeds,patients}) {
  const [ward,setWard]=useState('All'); const wards=['All',...new Set(beds.map(b=>b.ward))]; const shown=beds.filter(b=>ward==='All'||b.ward===ward);
  return <><PageHeading eyebrow="FACILITY MANAGEMENT" title="Ward & Bed Tracker" description="View bed availability and assign fictional patients to beds."/><div className="billing-summary"><div className="bill-stat"><span>Total beds</span><b>{beds.length}</b><BedDouble/></div><div className="bill-stat"><span>Available</span><b>{beds.filter(b=>b.status==='Available').length}</b><CheckCircle2/></div><div className="bill-stat"><span>Occupied</span><b>{beds.filter(b=>b.status==='Occupied').length}</b><Users/></div></div><div className="toolbar standalone"><select className="select-control" value={ward} onChange={e=>setWard(e.target.value)}>{wards.map(w=><option key={w}>{w}</option>)}</select><span className="result-count">{shown.length} beds</span></div><div className="bed-grid">{shown.map(b=><div className="panel bed-card" key={b.id}><div><b>{b.id}</b><span className="muted">{b.ward} Ward</span></div><Status value={b.status}/><div className="muted">{b.patient||'No patient assigned'}</div><select className="select-control" value={b.status==='Occupied'?b.patient:'Available'} onChange={e=>setBeds(old=>old.map(x=>x.id===b.id?{...x,status:e.target.value==='Available'?'Available':'Occupied',patient:e.target.value==='Available'?'':e.target.value}:x))}><option value="Available">Mark available</option>{patients.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>)}</div></>;
}
function CalendarPage({appointments}) {
  const [month,setMonth]=useState(new Date().toISOString().slice(0,7)); const monthRows=appointments.filter(a=>a.date?.startsWith(month)).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  return <><PageHeading eyebrow="SCHEDULE OVERVIEW" title="Appointment Calendar" description="Calendar-style monthly appointment overview."/><div className="panel"><div className="panel-head"><div><h3>Monthly schedule</h3><p>{monthRows.length} appointments in selected month</p></div><input className="select-control" type="month" value={month} onChange={e=>setMonth(e.target.value)}/></div><div className="calendar-list">{monthRows.map(a=><div className="calendar-event" key={a.id}><div className="calendar-date"><b>{new Date(`${a.date}T00:00:00`).getDate()}</b><small>{new Date(`${a.date}T00:00:00`).toLocaleDateString('en',{month:'short'})}</small></div><div><b>{a.patient}</b><p>{a.doctor} · {a.time} · {a.reason}</p></div><Status value={a.status}/></div>)}{!monthRows.length&&<Empty text="No appointments in this month."/>}</div></div></>;
}

function Login({onLogin}) {
  const [role,setRole] = useState('Admin');
  const [name,setName] = useState('Aneesa Malik');
  const [error,setError] = useState('');
  return <div className="login-screen"><div className="login-art"><div className="login-brand"><div className="brand-icon"><HeartPulse size={24}/></div><b>CarePoint</b></div><div className="art-copy"><span className="eyebrow">SMARTER HEALTHCARE MANAGEMENT</span><h1>Care that connects.<br/><i>Systems that work.</i></h1><p>A simple workspace to coordinate patients, doctors, appointments and billing.</p><div className="art-stats"><div><b>01</b><span>One connected<br/>workspace</span></div><div><b>02</b><span>Simple daily<br/>operations</span></div></div></div><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-cross">+</div></div><div className="login-panel"><div className="login-box"><div className="login-mobile-brand"><div className="brand-icon"><HeartPulse/></div><b>CarePoint</b></div><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p className="muted">Enter your details to access the hospital workspace.</p><form onSubmit={e=>{e.preventDefault();if(!name.trim()){setError('Please enter your name.');return;}onLogin({name:name.trim(),role});}}><label>Your name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" required/><label>Choose your role</label><div className="role-options">{['Admin','Doctor','Receptionist'].map(r=><button type="button" key={r} className={role===r?'role-selected':''} onClick={()=>setRole(r)}>{r}</button>)}</div>{error&&<p className="error">{error}</p>}<button className="primary full" type="submit">Sign in <ArrowUpRight size={17}/></button></form><div className="demo-note"><span className="dot"/> Demo login — no password required</div><p className="login-legal">By continuing, you are using a front-end demonstration with fictional data only.</p></div></div></div>;
}

function PageHeading({eyebrow,title,description,action,actionText}) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>{action&&<button className="primary" onClick={action}><Plus size={17}/>{actionText}</button>}</div>;
}
function StatCard({title,value,change,Icon,tone}) {
  return <div className="stat-card"><div className="stat-top"><span>{title}</span><div className={`stat-icon ${tone}`}><Icon size={19}/></div></div><div className="stat-value">{value}</div><div className="stat-foot"><span className="trend"><ArrowUpRight size={14}/>{change}</span><span>from demo records</span></div></div>;
}
function Dashboard({patients,doctors,appointments,invoices,setPage}) {
  const todayCount=appointments.filter(a=>a.date===today).length;
  const revenue=invoices.filter(i=>i.status==='Paid').reduce((s,i)=>s+Number(i.amount),0);
  const chart=[{month:'Jan',patients:22,appointments:30},{month:'Feb',patients:34,appointments:42},{month:'Mar',patients:29,appointments:38},{month:'Apr',patients:48,appointments:55},{month:'May',patients:42,appointments:50},{month:'Jun',patients:62,appointments:68}];
  const upcoming=appointments.slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,4);
  return <><div className="welcome-strip"><div><span className="eyebrow">OVERVIEW</span><h2>Good day! <span>👋</span></h2><p>Here’s what’s happening at your hospital today.</p></div><div className="welcome-mark"><HeartPulse size={34}/></div></div><div className="stats-grid"><StatCard title="Total patients" value={patients.length} change="+12.5%" Icon={Users} tone="blue"/><StatCard title="Total doctors" value={doctors.length} change="+4.2%" Icon={Stethoscope} tone="purple"/><StatCard title="Appointments today" value={todayCount} change="+8.1%" Icon={CalendarDays} tone="orange"/><StatCard title="Collected revenue" value={money(revenue)} change="+10.4%" Icon={CreditCard} tone="green"/></div><div className="dashboard-grid"><div className="panel chart-panel"><div className="panel-head"><div><h3>Hospital activity</h3><p>Patients and appointments · Sample monthly data</p></div><span className="period-pill">Last 6 months</span></div><div className="chart-legend"><span><i className="legend-blue"/> Patients</span><span><i className="legend-purple"/> Appointments</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chart} margin={{top:10,right:10,left:-18,bottom:0}}><defs><linearGradient id="patientFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f8df7" stopOpacity={.22}/><stop offset="95%" stopColor="#4f8df7" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="var(--line)"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'var(--muted)',fontSize:11}}/><YAxis axisLine={false} tickLine={false} tick={{fill:'var(--muted)',fontSize:11}}/><Tooltip contentStyle={{background:'var(--panel)',border:'1px solid var(--line)',borderRadius:12,color:'var(--text)'}}/><Area type="monotone" dataKey="patients" stroke="#4f8df7" strokeWidth={2.5} fill="url(#patientFill)"/><Area type="monotone" dataKey="appointments" stroke="#9b82e9" strokeWidth={2.5} fill="transparent"/></AreaChart></ResponsiveContainer></div></div><div className="panel quick-panel"><div className="panel-head"><div><h3>Quick actions</h3><p>Common tasks</p></div></div><div className="quick-list"><button onClick={()=>setPage('Patients')}><span className="quick-icon blue"><Users/></span><span><b>Manage patients</b><small>View and update patient records</small></span><ArrowUpRight size={16}/></button><button onClick={()=>setPage('Appointments')}><span className="quick-icon orange"><CalendarDays/></span><span><b>Book appointment</b><small>Schedule a patient visit</small></span><ArrowUpRight size={16}/></button><button onClick={()=>setPage('Billing')}><span className="quick-icon green"><CreditCard/></span><span><b>Create invoice</b><small>Prepare a new bill</small></span><ArrowUpRight size={16}/></button></div></div></div><div className="panel table-panel"><div className="panel-head"><div><h3>Upcoming appointments</h3><p>Latest scheduled patient visits</p></div><button className="text-button" onClick={()=>setPage('Appointments')}>View all <ArrowUpRight size={15}/></button></div><div className="table-scroll"><table><thead><tr><th>Patient</th><th>Doctor</th><th>Date & time</th><th>Reason</th><th>Status</th></tr></thead><tbody>{upcoming.map(a=><tr key={a.id}><td><b>{a.patient}</b><small className="cell-sub">{a.id}</small></td><td>{a.doctor}</td><td>{a.date}<small className="cell-sub">{a.time}</small></td><td>{a.reason}</td><td><Status value={a.status}/></td></tr>)}</tbody></table>{!upcoming.length&&<Empty text="No appointments yet."/>}</div></div></>;
}
function Status({value}) { return <span className={`status ${String(value).toLowerCase()}`}>{value}</span>; }
function Empty({text}) { return <div className="empty"><ClipboardList size={25}/><p>{text}</p></div>; }
function Toolbar({search,setSearch,placeholder,children}) { return <div className="toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={placeholder}/></div>{children}</div>; }

function Patients({patients,pageSize=5,onAdd,onEdit,onDelete,onView}) {
  const [search,setSearch]=useState(''),[filter,setFilter]=useState('All'),[page,setPage]=useState(1);
  const filtered=patients.filter(p=>(`${p.name} ${p.id} ${p.phone} ${p.condition}`.toLowerCase().includes(search.toLowerCase()))&&(filter==='All'||p.status===filter));
  const pages=Math.max(1,Math.ceil(filtered.length/pageSize)),shown=filtered.slice((page-1)*pageSize,page*pageSize);
  useEffect(()=>setPage(1),[search,filter]);
  return <><PageHeading eyebrow="PATIENT DIRECTORY" title="Patients" description="Manage patient information and keep records up to date." action={onAdd} actionText="Add patient"/><div className="panel table-panel"><Toolbar search={search} setSearch={setSearch} placeholder="Search by name, ID, phone..."><select className="select-control" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Active</option><option>Inactive</option></select><button className="secondary export-btn" onClick={()=>exportCSV('patients.csv',filtered)}><Download size={14}/> Export CSV</button><button className="secondary export-btn" onClick={()=>window.print()}><Printer size={14}/> Print / PDF</button><span className="result-count">{filtered.length} records</span></Toolbar><div className="table-scroll"><table><thead><tr><th>Patient</th><th>Patient ID</th><th>Age / Gender</th><th>Phone</th><th>Condition</th><th>Status</th><th>Actions</th></tr></thead><tbody>{shown.map(p=><tr key={p.id}><td><div className="person-cell"><div className="mini-avatar">{p.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div><b>{p.name}</b><small className="cell-sub">{p.email}</small></div></div></td><td>{p.id}</td><td>{p.age} / {p.gender}</td><td>{p.phone}</td><td>{p.condition}</td><td><Status value={p.status}/></td><td><div className="row-actions"><button title="View details" onClick={()=>onView(p)}><Eye size={16}/></button><button title="Edit" onClick={()=>onEdit(p)}><Pencil size={16}/></button><button title="Delete" onClick={()=>onDelete(p.id)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table>{!shown.length&&<Empty text="No patients match your search."/>}</div><Pagination page={page} pages={pages} setPage={setPage}/></div></>;
}
function PatientDetails({patient,onBack,onEdit}) {
  return <><PageHeading eyebrow="PATIENT RECORD" title="Patient details" description="Review this fictional patient record." action={onBack} actionText="Back to patients"/><div className="panel settings-panel"><div className="person-cell"><div className="mini-avatar">{patient.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div><h3>{patient.name}</h3><span className="muted">{patient.id}</span></div><div style={{marginLeft:'auto'}}><Status value={patient.status}/></div></div><div className="detail-grid">{[['Age',patient.age],['Gender',patient.gender],['Phone',patient.phone],['Email',patient.email||'Not provided'],['Condition',patient.condition],['Record status',patient.status]].map(([label,value])=><div className="detail-item" key={label}><small>{label}</small><b>{value}</b></div>)}</div><div className="modal-actions"><button className="secondary" onClick={onBack}>Back</button><button className="primary" onClick={onEdit}><Pencil size={14}/> Edit patient</button></div></div></>;
}

function Pagination({page,pages,setPage}) { return <div className="pagination"><span>Page {page} of {pages}</span><div><button disabled={page===1} onClick={()=>setPage(page-1)}>Previous</button><button disabled={page===pages} onClick={()=>setPage(page+1)}>Next</button></div></div>; }

function Doctors({doctors,onAdd,onEdit,onDelete,onToggle}) {
  const [search,setSearch]=useState(''),[specialty,setSpecialty]=useState('All');
  const specs=[...new Set(doctors.map(d=>d.specialty))];
  const filtered=doctors.filter(d=>(`${d.name} ${d.id} ${d.specialty}`.toLowerCase().includes(search.toLowerCase()))&&(specialty==='All'||d.specialty===specialty));
  return <><PageHeading eyebrow="MEDICAL TEAM" title="Doctors" description="View doctors, their specializations and availability." action={onAdd} actionText="Add doctor"/><div className="toolbar standalone"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search doctors..."/></div><select className="select-control" value={specialty} onChange={e=>setSpecialty(e.target.value)}><option>All</option>{specs.map(s=><option key={s}>{s}</option>)}</select><button className="secondary export-btn" onClick={()=>exportCSV('doctors.csv',filtered)}><Download size={14}/> Export CSV</button><button className="secondary export-btn" onClick={()=>window.print()}><Printer size={14}/> Print / PDF</button><span className="result-count">{filtered.length} doctors</span></div><div className="doctor-grid">{filtered.map(d=><div className="doctor-card" key={d.id}><div className="doctor-top"><div className="doctor-avatar"><Stethoscope size={23}/></div><button className="more-btn" onClick={()=>onEdit(d)}><Pencil size={16}/></button></div><h3>{d.name}</h3><p className="doctor-specialty">{d.specialty}</p><div className="doctor-meta"><span><Clock3 size={15}/>{d.experience} experience</span><span><Users size={15}/>{d.phone}</span></div><div className="doctor-bottom"><Status value={d.available?'Available':'Unavailable'}/><div className="row-actions"><button title="Toggle availability" onClick={()=>onToggle(d)}><Activity size={16}/></button><button title="Delete" onClick={()=>onDelete(d.id)}><Trash2 size={16}/></button></div></div></div>)}</div>{!filtered.length&&<Empty text="No doctors found."/>}</>;
}
function Appointments({appointments,onAdd,onEdit,onDelete,onStatus}) {
  const [search,setSearch]=useState(''),[filter,setFilter]=useState('All');
  const filtered=appointments.filter(a=>(`${a.patient} ${a.doctor} ${a.id}`.toLowerCase().includes(search.toLowerCase()))&&(filter==='All'||a.status===filter));
  return <><PageHeading eyebrow="SCHEDULE & VISITS" title="Appointments" description="Book, reschedule and track patient appointments." action={onAdd} actionText="Book appointment"/><div className="panel table-panel"><Toolbar search={search} setSearch={setSearch} placeholder="Search patient, doctor or ID..."><select className="select-control" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Pending</option><option>Confirmed</option><option>Completed</option></select><button className="secondary export-btn" onClick={()=>exportCSV('appointments.csv',filtered)}><Download size={14}/> Export CSV</button><button className="secondary export-btn" onClick={()=>window.print()}><Printer size={14}/> Print</button><span className="result-count">{filtered.length} appointments</span></Toolbar><div className="table-scroll"><table><thead><tr><th>Appointment ID</th><th>Patient</th><th>Doctor</th><th>Date & time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filtered.map(a=><tr key={a.id}><td><b>{a.id}</b></td><td>{a.patient}</td><td>{a.doctor}</td><td>{a.date}<small className="cell-sub">{a.time}</small></td><td>{a.reason}</td><td><select className="status-select" value={a.status} onChange={e=>onStatus(a,e.target.value)}><option>Pending</option><option>Confirmed</option><option>Completed</option></select></td><td><div className="row-actions"><button title="Reschedule / edit" onClick={()=>onEdit(a)}><Pencil size={16}/></button><button title="Cancel appointment" onClick={()=>onDelete(a.id)}><XCircle size={16}/></button></div></td></tr>)}</tbody></table>{!filtered.length&&<Empty text="No appointments found."/>}</div></div></>;
}
function Billing({invoices,onAdd,onEdit,onDelete,onStatus}) {
  const [search,setSearch]=useState(''),[filter,setFilter]=useState('All');
  const total=invoices.reduce((s,i)=>s+Number(i.amount),0),paid=invoices.filter(i=>i.status==='Paid').reduce((s,i)=>s+Number(i.amount),0);
  const filtered=invoices.filter(i=>(`${i.id} ${i.patient} ${i.service}`.toLowerCase().includes(search.toLowerCase()))&&(filter==='All'||i.status===filter));
  return <><PageHeading eyebrow="FINANCE & INVOICES" title="Billing" description="Create invoices and keep track of paid and unpaid bills." action={onAdd} actionText="Create invoice"/><div className="billing-summary"><div className="bill-stat"><span>Total invoiced</span><b>{money(total)}</b><FileText size={20}/></div><div className="bill-stat"><span>Collected</span><b>{money(paid)}</b><CheckCircle2 size={20}/></div><div className="bill-stat"><span>Outstanding</span><b>{money(total-paid)}</b><Clock3 size={20}/></div></div><div className="panel table-panel"><Toolbar search={search} setSearch={setSearch} placeholder="Search invoice or patient..."><select className="select-control" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Paid</option><option>Unpaid</option></select><button className="secondary export-btn" onClick={()=>exportCSV('invoices.csv',filtered)}><Download size={14}/> Export CSV</button><button className="secondary export-btn" onClick={()=>window.print()}><Printer size={14}/> Print / PDF</button><span className="result-count">{filtered.length} invoices</span></Toolbar><div className="table-scroll"><table><thead><tr><th>Invoice ID</th><th>Patient</th><th>Date</th><th>Service</th><th>Amount</th><th>Payment status</th><th>Actions</th></tr></thead><tbody>{filtered.map(i=><tr key={i.id}><td><b>{i.id}</b></td><td>{i.patient}</td><td>{i.date}</td><td>{i.service}</td><td><b>{money(i.amount)}</b></td><td><select className="status-select" value={i.status} onChange={e=>onStatus(i,e.target.value)}><option>Paid</option><option>Unpaid</option></select></td><td><div className="row-actions"><button title="Print invoice" onClick={()=>printInvoice(i)}><Printer size={16}/></button><button title="Edit" onClick={()=>onEdit(i)}><Pencil size={16}/></button><button title="Delete" onClick={()=>onDelete(i.id)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table>{!filtered.length&&<Empty text="No invoices found."/>}</div></div></>;
}
function printInvoice(i) {
  const w=window.open('','_blank','width=700,height=700');
  if(!w){alert('Please allow pop-ups to print the invoice.');return;}
  w.document.write(`<html><head><title>${i.id}</title><style>body{font-family:Arial;padding:40px;color:#182235}h1{color:#2868ce}hr{border:0;border-top:1px solid #ddd;margin:25px 0}.row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #eee}.total{font-size:22px;font-weight:bold}</style></head><body><h1>CarePoint Hospital</h1><p>Hospital Management System</p><hr/><h2>INVOICE</h2><div class="row"><span>Invoice ID</span><b>${i.id}</b></div><div class="row"><span>Patient</span><b>${i.patient}</b></div><div class="row"><span>Date</span><b>${i.date}</b></div><div class="row"><span>Service</span><b>${i.service}</b></div><div class="row total"><span>Amount</span><b>Rs. ${Number(i.amount).toLocaleString('en-PK')}</b></div><div class="row"><span>Status</span><b>${i.status}</b></div><p style="margin-top:45px">Thank you.</p><script>window.onload=()=>window.print()<\/script></body></html>`);
  w.document.close();
}
function RecordModal({modal,patients=[],doctors=[],onClose,onSave}) {
  const {type,item}=modal;
  const configs={
    patients:{title:'Patient',fields:[['name','Full name','text'],['age','Age','number'],['gender','Gender','select',['Female','Male','Other']],['phone','Phone number','text'],['email','Email address','email'],['condition','Medical condition','text'],['status','Status','select',['Active','Inactive']]]},
    doctors:{title:'Doctor',fields:[['name','Doctor name','text'],['specialty','Specialization','text'],['experience','Experience','text'],['phone','Phone number','text'],['available','Availability','select',[['true','Available'],['false','Unavailable']]]]},
    appointments:{
  title:'Appointment',
  fields:[
    ['patient','Patient','select',patients.map(p=>p.name)],
    ['doctor','Doctor','select',[
      ...new Set([
        ...doctors.filter(d=>d.available).map(d=>d.name),
        ...(item?.doctor ? [item.doctor] : [])
      ])
    ]],
    ['date','Appointment date','date'],
    ['time','Appointment time','time'],
    ['reason','Reason','text'],
    ['status','Status','select',['Pending','Confirmed','Completed']]
  ]
},
    invoices:{title:'Invoice',fields:[['patient','Patient','select',patients.map(p=>p.name)],['date','Invoice date','date'],['service','Service description','text'],['amount','Amount (Rs.)','number'],['status','Payment status','select',['Paid','Unpaid']]]}
  };
  const config=configs[type];
  console.log("Doctors received:", doctors);
  const [values,setValues]=useState(()=>{
  const initial={...item};
  config.fields.forEach(([key,label,kind,options])=>{
    if(initial[key]===undefined && kind==='select'){
      initial[key]=key==='available'
        ? 'true'
        : Array.isArray(options[0])
          ? options[0][0]
          : options[0];
    }
  });
  return initial;
}); 
  const [error,setError]=useState('');
  const idPrefix={patients:'P',doctors:'D',appointments:'A',invoices:'INV'}[type];
  const update=(k,v)=>setValues(prev=>({...prev,[k]:v}));
  const submit=e=>{
    e.preventDefault();
    const required=config.fields.filter(f=>f[0]!=='email');
    if(required.some(f=>values[f[0]]===undefined||String(values[f[0]]).trim()==='')){setError('Please complete all required fields.');return;}
    const id=item?.id||`${idPrefix}-${Date.now().toString().slice(-6)}`;
    const record={...values,id};
    if(type==='doctors')record.available=String(values.available)==='true';
    if(type==='patients')record.age=Number(values.age);
    if(type==='invoices')record.amount=Number(values.amount);
    onSave(record);
  };
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal"><div className="modal-head"><div><span className="eyebrow">{item?'UPDATE RECORD':'NEW RECORD'}</span><h2>{item?'Edit':'Add'} {config.title}</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div><form onSubmit={submit}><div className="form-grid">{config.fields.map(([key,label,kind,options])=><div className="field" key={key}><label>{label}{key!=='email'&&<span> *</span>}</label>{kind==='select'?<select value={values[key]===undefined?(key==='available'?'true':Array.isArray(options[0])?options[0][0]:options[0]):String(values[key])} onChange={e=>{
  const value=e.target.value;
  update(key,value);

  if(type==='appointments' && key==='patient'){
    const selectedPatient=patients.find(p=>p.name===value);
    update('reason',selectedPatient?.condition || '');
  }
}}>{options.map(o=>Array.isArray(o)?<option value={o[0]} key={o[0]}>{o[1]}</option>:<option key={o}>{o}</option>)}</select>:<input type={kind} min={kind==='number'?'0':undefined} value={values[key]??''} onChange={e=>update(key,e.target.value)} placeholder={label}/>}</div>)}</div>{error&&<p className="error">{error}</p>}<div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary" type="submit">{item?'Save changes':'Save record'}</button></div></form></div></div>;
}
export default App;