import React, { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { Menu, X, UserRound, BriefcaseBusiness, CarFront, ClipboardList, ShieldCheck, LogOut, Plus, Search, MapPin, Clock3, Phone, Mail, CheckCircle2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "./supabase";

const nav = [
  ["/", "হোম"], ["/jobs", "স্থায়ী চাকরি"], ["/duties", "বদলি ডিউটি"], ["/bookings", "ড্রাইভার বুকিং"], ["/drivers", "ড্রাইভার খুঁজুন"]
];

function Header({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  return <header className="header"><div className="navwrap">
    <Link to="/" className="brand"><span className="brandmark">চা</span><span>Chattogram <b>Driver Bazar</b><small>চালক ও গাড়ির মালিকের মিলনমেলা</small></span></Link>
    <button className="menuBtn" onClick={() => setOpen(!open)} aria-label="মেনু">{open ? <X/> : <Menu/>}</button>
    <nav className={open ? "nav open" : "nav"}>{nav.map(([to,label]) => <NavLink key={to} to={to} onClick={()=>setOpen(false)}>{label}</NavLink>)}
      {user ? <><NavLink to="/dashboard">ড্যাশবোর্ড</NavLink><button className="linkBtn" onClick={onLogout}>লগআউট</button></> : <><NavLink to="/login">লগইন</NavLink><Link className="navJoin" to="/register">নিবন্ধন</Link></>}
    </nav>
  </div></header>
}

function Home() {
  return <><section className="hero"><div className="heroInner"><div className="eyebrow">চট্টগ্রামের ড্রাইভার সার্ভিস প্ল্যাটফর্ম</div><h1>আপনার প্রয়োজনের<br/><em>সঠিক ড্রাইভার</em> খুঁজুন</h1><p>স্থায়ী চাকরি, অস্থায়ী ড্রাইভার বুকিং এবং বদলি ডিউটি—সব এক জায়গায়।</p><div className="heroActions"><Link className="btn primary" to="/drivers">ড্রাইভার খুঁজুন <Search size={18}/></Link><Link className="btn light" to="/register">ফ্রি নিবন্ধন করুন</Link></div><div className="heroNote"><ShieldCheck size={17}/> যাচাই ও নিরাপত্তাকে গুরুত্ব দিয়ে তৈরি</div></div><div className="heroArt"><div className="circle"></div><div className="road"></div><div className="car"><CarFront size={112} strokeWidth={1.2}/></div><div className="floatingTag tagOne">✓ ড্রাইভার প্রোফাইল</div><div className="floatingTag tagTwo">চট্টগ্রাম জুড়ে</div></div></section>
  <section className="section"><div className="sectionHead"><div><div className="eyebrow dark">আমাদের সেবা</div><h2>আপনার প্রয়োজন, আমাদের সমাধান</h2></div><p>ড্রাইভার ও গাড়ির মালিক—দুই পক্ষের জন্য সহজ ব্যবস্থা।</p></div><div className="serviceGrid">
    <Service icon={<BriefcaseBusiness/>} title="স্থায়ী ড্রাইভার চাকরি" desc="বেতন, কর্মঘণ্টা ও শর্ত দেখে চাকরিতে আবেদন করুন।" to="/jobs" action="চাকরি দেখুন"/>
    <Service icon={<CarFront/>} title="অস্থায়ী ড্রাইভার বুকিং" desc="ঘণ্টা, দিন, সপ্তাহ বা মাসের জন্য ড্রাইভার খুঁজুন।" to="/bookings" action="বুকিং দেখুন"/>
    <Service icon={<ClipboardList/>} title="বদলি ডিউটি" desc="নিয়মিত ড্রাইভার ছুটিতে? বদলি ড্রাইভারের আবেদন নিন।" to="/duties" action="ডিউটি দেখুন"/>
  </div></section>
  <section className="cta"><div><div className="eyebrow">আজই শুরু করুন</div><h2>আপনি কি ড্রাইভার, নাকি গাড়ির মালিক?</h2><p>নিজের প্রয়োজন অনুযায়ী বিনামূল্যে অ্যাকাউন্ট খুলুন।</p></div><Link className="btn light" to="/register">অ্যাকাউন্ট খুলুন <Plus size={18}/></Link></section></>;
}
function Service({icon,title,desc,to,action}) { return <article className="serviceCard"><div className="serviceIcon">{icon}</div><h3>{title}</h3><p>{desc}</p><Link to={to}>{action} <span>→</span></Link></article> }

function Listing({kind}) {
  const [items,setItems] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const cfg = {
    jobs:{title:"স্থায়ী ড্রাইভার চাকরি",sub:"নিয়মিত চাকরির সুযোগ খুঁজুন",table:"jobs",empty:"এখনো কোনো চাকরির বিজ্ঞপ্তি নেই।"},
    duties:{title:"বদলি ডিউটি",sub:"অস্থায়ী বদলি ড্রাইভারের কাজ খুঁজুন",table:"substitute_duties",empty:"এখনো কোনো বদলি ডিউটির বিজ্ঞপ্তি নেই।"},
    bookings:{title:"অস্থায়ী ড্রাইভার বুকিং",sub:"স্বল্প বা দীর্ঘ সময়ের জন্য ড্রাইভার খুঁজুন",table:"booking_requests",empty:"এখনো কোনো বুকিং অনুরোধ নেই।"}
  }[kind];
  useEffect(()=>{let active=true;(async()=>{
    if(!isSupabaseConfigured){setLoading(false);setError("ডেটাবেস সংযোগ এখনো সেটআপ করা হয়নি। প্রকাশের আগে Supabase যুক্ত করতে হবে।");return;}
    const {data,error}=await supabase.from(cfg.table).select("*").eq("status","open").order("created_at",{ascending:false}).limit(30);
    if(!active)return;if(error)setError("তথ্য আনা যায়নি: "+error.message);else setItems(data||[]);setLoading(false);
  })();return()=>{active=false}},[kind]);
  return <main className="page"><div className="pageTitle"><div className="eyebrow dark">চাকরি ও কাজের তালিকা</div><h1>{cfg.title}</h1><p>{cfg.sub}</p></div>
    <div className="toolbar"><div className="searchBox"><Search size={18}/><input placeholder="এলাকা বা কাজের ধরন লিখুন" onChange={()=>{}}/></div><Link className="btn primary" to="/register"><Plus size={18}/> পোস্ট/আবেদন করতে নিবন্ধন</Link></div>
    {loading?<p className="notice">তথ্য লোড হচ্ছে…</p>:error?<p className="notice">{error}</p>:items.length===0?<div className="empty"><ClipboardList size={34}/><h3>{cfg.empty}</h3><p>নতুন বিজ্ঞপ্তি প্রকাশ হলে এখানে দেখা যাবে।</p></div>:<div className="listingGrid">{items.map(item=><article className="listingCard" key={item.id}><span className="status">চলমান</span><h3>{item.title||item.vehicle_type||"ড্রাইভার প্রয়োজন"}</h3><p><MapPin size={15}/>{item.location||"অবস্থান উল্লেখ নেই"}</p><p><Clock3 size={15}/>{item.duty_date||item.created_at?.slice(0,10)||"তারিখ উল্লেখ নেই"}</p><strong>{item.salary?`৳ ${item.salary}`:"পারিশ্রমিক আলোচনা সাপেক্ষে"}</strong></article>)}</div>}
  </main>
}

function Auth({mode,onAuth}) {
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [name,setName]=useState("");const [role,setRole]=useState("driver");const [busy,setBusy]=useState(false);const [msg,setMsg]=useState("");
 async function submit(e){e.preventDefault();setMsg("");if(!isSupabaseConfigured){setMsg("অ্যাকাউন্ট চালু করতে আগে Supabase সংযোগ সেটআপ করতে হবে।");return;}setBusy(true);
   if(mode==="login"){const {data,error}=await supabase.auth.signInWithPassword({email,password});if(error)setMsg(error.message);else onAuth(data.user);}
   else {const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name,role}}});if(error)setMsg(error.message);else setMsg("নিবন্ধন অনুরোধ সফল। ইমেইল যাচাই করে লগইন করুন।");}
   setBusy(false);
 }
 return <main className="authPage"><form className="authCard" onSubmit={submit}><div className="serviceIcon"><UserRound/></div><h1>{mode==="login"?"অ্যাকাউন্টে প্রবেশ":"নতুন অ্যাকাউন্ট খুলুন"}</h1><p>{mode==="login"?"আপনার অ্যাকাউন্টে লগইন করুন":"ড্রাইভার বা গাড়ির মালিক হিসেবে নিবন্ধন করুন"}</p>
 {mode==="register"&&<><label>আপনার নাম<input required value={name} onChange={e=>setName(e.target.value)} placeholder="সম্পূর্ণ নাম"/></label><label>আপনি কে?<select value={role} onChange={e=>setRole(e.target.value)}><option value="driver">ড্রাইভার</option><option value="owner">গাড়ির মালিক</option></select></label></>}
 <label>ইমেইল<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/></label><label>পাসওয়ার্ড<input required minLength="8" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="কমপক্ষে ৮ অক্ষর"/></label>
 <button className="btn primary full" disabled={busy}>{busy?"অপেক্ষা করুন…":mode==="login"?"লগইন":"নিবন্ধন করুন"}</button>{msg&&<p className="formMsg">{msg}</p>}
 <p className="switchAuth">{mode==="login"?"অ্যাকাউন্ট নেই? ":"আগে থেকেই অ্যাকাউন্ট আছে? "}<Link to={mode==="login"?"/register":"/login"}>{mode==="login"?"নিবন্ধন করুন":"লগইন করুন"}</Link></p></form></main>
}

function Dashboard({user}) {return <main className="page"><div className="pageTitle"><div className="eyebrow dark">আপনার অ্যাকাউন্ট</div><h1>ড্যাশবোর্ড</h1><p>{user?.email}</p></div><div className="dashboardGrid"><Link to="/jobs" className="dashTile"><BriefcaseBusiness/>চাকরি দেখুন</Link><Link to="/duties" className="dashTile"><ClipboardList/>বদলি ডিউটি দেখুন</Link><Link to="/drivers" className="dashTile"><UserRound/>ড্রাইভার খুঁজুন</Link><Link to="/profile" className="dashTile"><ShieldCheck/>প্রোফাইল সম্পন্ন করুন</Link></div><p className="notice">পরবর্তী ধাপে পূর্ণ CV, পরিচয়পত্র, লাইসেন্স, আবেদন ও বুকিং ব্যবস্থার ডেটাবেস যুক্ত হবে।</p></main>}
function Drivers(){return <main className="page"><div className="pageTitle"><div className="eyebrow dark">ড্রাইভার ডিরেক্টরি</div><h1>ড্রাইভার খুঁজুন</h1><p>অভিজ্ঞতা, এলাকা ও গাড়ির ধরন অনুযায়ী ড্রাইভার খুঁজুন।</p></div><div className="empty"><UserRound size={34}/><h3>ড্রাইভার প্রোফাইল এখনো প্রকাশিত হয়নি</h3><p>নিবন্ধন ও যাচাই সম্পন্ন হলে প্রোফাইল এখানে দেখানো হবে।</p><Link className="btn primary" to="/register">ড্রাইভার হিসেবে নিবন্ধন</Link></div></main>}
function Profile(){return <main className="page"><div className="pageTitle"><div className="eyebrow dark">প্রোফাইল</div><h1>প্রোফাইল তৈরি</h1><p>পরবর্তী সংস্করণে পূর্ণ CV ও নথি আপলোড ফর্ম যুক্ত হবে।</p></div><div className="notice">নিরাপত্তার কারণে NID ও ড্রাইভিং লাইসেন্সের ছবি প্রকাশ্য রাখা হবে না।</div></main>}
function Footer(){return <footer className="footer"><div className="brand"><span className="brandmark">চা</span><span>Chattogram <b>Driver Bazar</b><small>চট্টগ্রাম, বাংলাদেশ</small></span></div><p>ড্রাইভার চাকরি • অস্থায়ী বুকিং • বদলি ডিউটি</p><small>© {new Date().getFullYear()} Chattogram Driver Bazar</small></footer>}

export default function App(){
 const [user,setUser]=useState(null);
 useEffect(()=>{if(!isSupabaseConfigured)return;supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null));const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user||null));return()=>subscription.unsubscribe()},[]);
 async function logout(){await supabase?.auth.signOut();setUser(null)}
 return <><Header user={user} onLogout={logout}/><Routes><Route path="/" element={<Home/>}/><Route path="/jobs" element={<Listing kind="jobs"/>}/><Route path="/duties" element={<Listing kind="duties"/>}/><Route path="/bookings" element={<Listing kind="bookings"/>}/><Route path="/drivers" element={<Drivers/>}/><Route path="/login" element={<Auth mode="login" onAuth={setUser}/>}/><Route path="/register" element={<Auth mode="register" onAuth={setUser}/>}/><Route path="/dashboard" element={user?<Dashboard user={user}/>:<Auth mode="login" onAuth={setUser}/>}/><Route path="/profile" element={user?<Profile/>:<Auth mode="login" onAuth={setUser}/>}/><Route path="*" element={<main className="page"><h1>পেজটি পাওয়া যায়নি</h1><Link to="/">হোমে ফিরে যান</Link></main>}/></Routes><Footer/></>
}