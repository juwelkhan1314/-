import React, { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  Menu, X, UserRound, BriefcaseBusiness, CarFront, ClipboardList,
  ShieldCheck, Plus, Search, MapPin, Clock3, LogOut, Bell, Trash2,
  Pencil, Send, FileText, CheckCircle, XCircle, Phone, Camera, Upload,
  CalendarClock, UserPlus
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "./supabase";

cconst C = {
  navy: "#183B5B",
  navy2: "#285A82",
  pale: "#EAF4FC",
  border: "#DFE8F0",
  muted: "#718096",
  red: "#C04444",
  white: "#FFFFFF",
  bg: "#F7FAFD",
  green: "#26836B"
};

function Btn({ children, onClick, type="button", disabled=false, tone="navy" }) {
  return <button type={type} disabled={disabled} onClick={onClick} style={{
    border: tone === "light" ? `1px solid ${C.border}` : 0,
    background: tone === "red" ? C.red : tone === "light" ? "#fff" : C.navy,
    color: tone === "light" ? C.navy : "#fff", borderRadius: 10,
    padding: "10px 14px", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? .55 : 1, display: "inline-flex", gap: 7,
    alignItems: "center", justifyContent: "center"
  }}>{children}</button>;
}
function Field({ label, as, ...props }) {
  const style = {padding:11,border:`1px solid ${C.border}`,borderRadius:9,font:"inherit",minWidth:0,width:"100%",boxSizing:"border-box"};
  return <label style={{display:"grid",gap:5,fontSize:14,fontWeight:600,color:C.navy}}>
    {label}
    {as === "textarea"
      ? <textarea {...props} style={{...style,minHeight:85,...props.style}} />
      : <input {...props} style={{...style,...props.style}} />}
  </label>;
}
function SelectField({label, options, ...props}) {
  return <label style={{display:"grid",gap:5,fontSize:14,fontWeight:600,color:C.navy}}>
    {label}<select {...props} style={{padding:11,border:`1px solid ${C.border}`,borderRadius:9,font:"inherit",background:"#fff",width:"100%"}}>
      {options.map(x => <option key={x.value} value={x.value}>{x.label}</option>)}
    </select>
  </label>;
}
function Panel({title, children, right}) {
  return <section style={{
    background:"#FFFFFF",
    border:`1px solid ${C.border}`,
    borderRadius:18,
    padding:20,
    marginBottom:16,
    boxShadow:"0 5px 20px rgba(40,90,130,0.06)"
  }}>
    <div style={{
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      gap:10,
      flexWrap:"wrap",
      marginBottom:15
    }}>
      <h2 style={{margin:0,color:C.navy,fontSize:21}}>{title}</h2>
      {right}
    </div>
    {children}
  </section>;
}
function Notice({text, error}) {
  if (!text) return null;
  return <div style={{padding:11,borderRadius:9,margin:"10px 0",background:error?"#fff0ef":C.pale,color:error?C.red:C.navy}}>{text}</div>;
}
function money(v) { return v === null || v === undefined || v === "" ? "আলোচনা সাপেক্ষ" : `৳${v}`; }
function publicPhoto(path) {
  if (!path) return "";
  return supabase.storage.from("driver-photos").getPublicUrl(path).data.publicUrl;
}
async function uploadFile(bucket, userId, file, prefix) {
  if (!file) return null;
  const ext = file.name.split(".").pop() || "file";
  const path = `${userId}/${prefix}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {upsert:true});
  if (error) throw error;
  return path;
}

function Header({user, role, signOut}) {
  const [open,setOpen] = useState(false);
  return <header style={{background:"#fff",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:10}}>
    <div style={{maxWidth:1120,margin:"auto",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
      <Link to="/" style={{display:"flex",alignItems:"center",gap:9,textDecoration:"none",color:C.navy,fontWeight:900,fontSize:18}}>
        <span style={{background:C.navy,color:"#fff",borderRadius:10,padding:"8px 10px"}}>CDB</span>
        <span>Chattogram Driver Bazar BD</span>
      </Link>
      <nav style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap",width:"100%",padding:"8px 0"}}>
        <NavLink to="/" style={navStyle}>হোম</NavLink>
        <NavLink to="/drivers" style={navStyle}>অভিজ্ঞ ড্রাইভার খুঁজুন</NavLink>
        <NavLink to="/jobs" style={navStyle}>ড্রাইভার চাকরি</NavLink>
        <NavLink to="/duties" style={navStyle}>বদলি ডিউটি</NavLink>
        {user ? <><NavLink to="/dashboard" style={navStyle}>ড্যাশবোর্ড</NavLink><button onClick={signOut} style={plainBtn}><LogOut size={16}/> লগআউট</button></>
          : <><NavLink to="/login" style={navStyle}>লগইন</NavLink></>}
      </nav>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginLeft:"auto"}}>
        {!user && <><Link to="/register?role=driver" style={smallReg}>ড্রাইভার রেজিস্ট্রেশন</Link><Link to="/register?role=owner" style={smallReg}>মালিক রেজিস্ট্রেশন</Link></>}
      </div>
    </div>
  </header>;
}
const navStyle = ({isActive}) => ({textDecoration:"none",color:isActive?C.navy2:C.muted,fontWeight:800});
const plainBtn={border:0,background:"none",color:C.navy,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:5};
const smallReg={textDecoration:"none",fontSize:12,fontWeight:800,color:C.navy,background:C.pale,border:`1px solid ${C.border}`,padding:"7px 9px",borderRadius:8};

function Home() {
  const actions = [
    {to:"/drivers",icon:<Search size={30}/>,title:"অভিজ্ঞ ড্রাইভার খুঁজুন",desc:"অভিজ্ঞ ও দক্ষ ড্রাইভারের প্রোফাইল দেখুন"},
    {to:"/jobs",icon:<BriefcaseBusiness size={30}/>,title:"ড্রাইভার চাকরি",desc:"চট্টগ্রাম জেলার চাকরির বিজ্ঞাপন দেখুন"},
    {to:"/duties",icon:<CalendarClock size={30}/>,title:"বদলি ডিউটি পোস্ট",desc:"অস্থায়ী ও দৈনিক ডিউটি খুঁজুন"},
    {to:"/guest-job",icon:<FileText size={30}/>,title:"রেজিস্ট্রেশন ছাড়া মালিক সরাসরি চাকরি পোস্ট",desc:"মালিকের তথ্য ও মোবাইল যাচাই করে পোস্টের আবেদন দিন"}
  ];
  return <main style={{maxWidth:1120,margin:"auto",padding:"20px 16px 32px"}}>
    <section style={{background:C.navy,color:"#fff",padding:"30px 22px",borderRadius:20,overflow:"hidden"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:13,fontWeight:800,letterSpacing:1,color:"color:"#52718F"৪}>চট্টগ্রাম জেলার চালক ও গাড়ির মালিকের মিলনমেলা</div>
        <h1 style={{fontSize:"clamp(27px,5vw,43px)",margin:"8px 0 17px"}}>Chattogram Driver Bazar BD</h1>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:15,alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:25,margin:"0 0 8px"}}>আপনার প্রয়োজনের ড্রাইভার ও চাকরি খুঁজুন</h2>
          <p style={{lineHeight:1.8,color:"#52677D",margin:0}}>চট্টগ্রাম জেলার ড্রাইভার এবং গাড়ির মালিকদের জন্য সহজ কর্মসংস্থান প্ল্যাটফর্ম।</p>
        </div>
        <div style={{background:"#DCE7F2",color:C.navy,borderRadius:15,minHeight:150,display:"grid",placeItems:"center",padding:15,textAlign:"center"}}>
          <CarFront size={58}/><b>গাড়ি ও ড্রাইভার</b><span style={{fontSize:12}}>বিশ্বস্ত কাজের সংযোগ</span>
        </div>
      </div>
    </section>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:13,marginTop:18}}>
      {actions.map((a,i)=><Link key={a.to} to={a.to} style={{textDecoration:"none",background:"#fff",border:`1px solid ${C.border}`,borderRadius:15,padding:"19px 13px",minHeight:145,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:9,textAlign:"center",color:C.navy,boxShadow:"0 3px 12px #102d500b"}}>
        <span style={{width:56,height:56,borderRadius:15,background:C.pale,display:"grid",placeItems:"center",color:C.navy2}}>{a.icon}</span>
        <b style={{fontSize:16,lineHeight:1.5}}>{a.title}</b>
        <span style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{a.desc}</span>
      </Link>)}
    </div>
    <p style={{textAlign:"center",color:C.muted,fontSize:12,marginTop:18}}>সেবা শুধুমাত্র চট্টগ্রাম জেলার জন্য।</p>
  </main>;
}

function Auth({mode, refresh}) {
  const nav = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [role,setRole]=useState(params.get("role")==="owner"?"owner":"driver");
  const [msg,setMsg]=useState("");
  const [err,setErr]=useState(false);
  const submit = async e => {
    e.preventDefault(); setMsg(""); setErr(false);
    if (!isSupabaseConfigured) {setMsg("Supabase কনফিগার করা নেই।");setErr(true);return;}
    try {
      if (mode==="register") {
        const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name,phone,role}}});
        if(error) throw error;
        if(data.user) {
          const {error:pe}=await supabase.from("profiles").upsert({id:data.user.id,role,full_name:name,phone},{onConflict:"id"});
          if(pe) throw pe;
        }
        setMsg("রেজিস্ট্রেশন হয়েছে। ইমেইল যাচাই করতে বললে যাচাই করে লগইন করুন।");
      } else {
        const {error}=await supabase.auth.signInWithPassword({email,password});
        if(error) throw error;
        await refresh(); nav("/dashboard");
      }
    } catch(e) {setMsg(e.message || "সমস্যা হয়েছে");setErr(true);}
  };
  return <main style={centerPage}><form onSubmit={submit} style={authBox}>
    <h1 style={{marginTop:0,color:C.navy}}>{mode==="register"?"নতুন অ্যাকাউন্ট":"লগইন"}</h1>
    {mode==="register" && <>
      <SelectField label="অ্যাকাউন্টের ধরন" value={role} onChange={e=>setRole(e.target.value)} options={[{value:"driver",label:"ড্রাইভার"},{value:"owner",label:"গাড়ির মালিক"}]}/>
      <Field label="আপনার নাম" value={name} onChange={e=>setName(e.target.value)} required/>
      <Field label="মোবাইল নম্বর" value={phone} onChange={e=>setPhone(e.target.value)} required/>
    </>}
    <Field label="ইমেইল" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
    <Field label="পাসওয়ার্ড" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
    <Btn type="submit">{mode==="register"?"রেজিস্ট্রেশন করুন":"লগইন করুন"}</Btn>
    <Notice text={msg} error={err}/>
    <p>{mode==="register"?<Link to="/login">আগে অ্যাকাউন্ট আছে? লগইন</Link>:<Link to="/register">নতুন অ্যাকাউন্ট খুলুন</Link>}</p>
  </form></main>;
}
const centerPage={minHeight:"65vh",display:"grid",placeItems:"center",padding:16};
const authBox={background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:22,width:"min(100%,430px)",display:"grid",gap:13};

function GuestJobPost() {
  return <main style={mainStyle}><Panel title="রেজিস্ট্রেশন ছাড়া মালিকের চাকরি পোস্ট">
    <Notice text="এই সুবিধার জন্য মালিকের নাম ও মোবাইল নম্বর যাচাই এবং অ্যাডমিন অনুমোদনের ব্যবস্থা তৈরি করতে হবে। নিরাপদ যাচাই ব্যবস্থা চালু না হওয়া পর্যন্ত এই ফর্ম থেকে পোস্ট প্রকাশ করা হচ্ছে না." error/>
    <p style={{color:C.muted,lineHeight:1.8}}>পরবর্তী ধাপে আমরা OTP যাচাই ও অ্যাডমিন অনুমোদনের ডাটাবেস ব্যবস্থা যোগ করে এই ফর্মটি চালু করব।</p>
  </Panel></main>;
}

function ListingPage({kind,user}) {
  const [items,setItems]=useState([]),[busy,setBusy]=useState(true),[msg,setMsg]=useState("");
  const table=kind==="jobs"?"jobs":"substitute_duties";
  useEffect(()=>{(async()=>{
    setBusy(true);
    const {data,error}=await supabase.from(table).select("*").eq("status","open").order("created_at",{ascending:false});
    if(error)setMsg(error.message); else setItems(data||[]);
    setBusy(false);
  })();},[table]);
  const apply=async item=>{
    if(!user){setMsg("আবেদন করতে আগে লগইন করুন।");return;}
    const {error}=await supabase.from("applications").insert({listing_type:table,listing_id:item.id,driver_id:user.id,message:""});
    setMsg(error?error.message:"আবেদন পাঠানো হয়েছে।");
  };
  return <main style={mainStyle}><h1>{kind==="jobs"?"ড্রাইভার চাকরি":"বদলি ডিউটি"}</h1><Notice text={msg} error={!!msg&&/error|permission|denied|violates/i.test(msg)}/>
    {busy?"লোড হচ্ছে...":items.length===0?"এখনো কোনো পোস্ট নেই।":<div style={cardsGrid}>{items.map(x=><article key={x.id} style={cardStyle}>
      <h3>{x.title||`${x.vehicle_type||"গাড়ি"} ডিউটি`}</h3>
      <p><MapPin size={15}/> {x.location||x.start_location||"ঠিকানা উল্লেখ নেই"}</p>
      {x.destination&&<p>গন্তব্য: {x.destination}</p>}
      <p>বেতন: <b>{money(x.salary??x.pay)}</b></p>
      {x.duty_date&&<p>তারিখ: {x.duty_date}</p>}
      {(x.description||x.details)&&<p>{x.description||x.details}</p>}
      <Btn onClick={()=>apply(x)} disabled={!user}>আবেদন করুন</Btn>
    </article>)}</div>}
  </main>;
}

function DriverSearch() {
  const [drivers,setDrivers]=useState([]),[msg,setMsg]=useState("");
  useEffect(()=>{(async()=>{
    const {data,error}=await supabase.rpc("get_public_driver_profiles");
    if(error)setMsg(error.message);else setDrivers(data||[]);
  })();},[]);
  return <main style={mainStyle}><h1>অভিজ্ঞ ড্রাইভার খুঁজুন</h1><Notice text={msg} error/>
    <p style={{color:C.muted}}>শুধু ড্রাইভারের প্রকাশ্য তথ্য দেখানো হবে। ব্যক্তিগত তথ্য অনুমতি ছাড়া প্রকাশ করা হবে না।</p>
    <div style={cardsGrid}>{drivers.map(d=><article key={d.driver_id} style={cardStyle}>
      {d.photo_path&&<img src={publicPhoto(d.photo_path)} alt="ড্রাইভার" style={{width:82,height:82,objectFit:"cover",borderRadius:"50%"}}/>}
      <h3>{d.full_name||"নাম দেওয়া হয়নি"}</h3><p>{d.experience_years||0} বছর অভিজ্ঞতা</p><p>{d.skills||"দক্ষতা উল্লেখ নেই"}</p><p><MapPin size={14}/> {d.address||"ঠিকানা নেই"}</p>
    </article>)}</div>
  </main>;
}

function DriverProfile({user,profile,refresh}) {
  const [form,setForm]=useState({full_name:"",phone:"",address:"",bio:"",age:"",experience_years:"",license_number:"",license_type:"",skills:"",previous_experience:"",preferred_work_types:["permanent","substitute"],availability_status:"available"});
  const [photo,setPhoto]=useState(null),[cv,setCv]=useState(null),[lic,setLic]=useState(null);
  const [msg,setMsg]=useState(""),[error,setError]=useState(false),[saving,setSaving]=useState(false);
  useEffect(()=>{if(profile)setForm(f=>({...f,...profile}));},[profile]);
  const change=(k,v)=>setForm(f=>({...f,[k]:v}));
  const save=async e=>{
    e.preventDefault();setSaving(true);setMsg("");setError(false);
    try{
      let photo_path=profile?.photo_path||null,cv_path=null,license_path=null;
      if(photo) photo_path=await uploadFile("driver-photos",user.id,photo,"profile");
      if(cv) cv_path=await uploadFile("driver-private",user.id,cv,"cv");
      if(lic) license_path=await uploadFile("driver-private",user.id,lic,"license");
      const {error:pe}=await supabase.from("profiles").upsert({id:user.id,role:"driver",full_name:form.full_name,phone:form.phone,address:form.address,bio:form.bio,photo_path},{onConflict:"id"});
      if(pe)throw pe;
      const details={driver_id:user.id,age:form.age?Number(form.age):null,experience_years:form.experience_years?Number(form.experience_years):0,license_number:form.license_number,license_type:form.license_type,skills:form.skills,previous_experience:form.previous_experience,preferred_work_types:form.preferred_work_types,availability_status:form.availability_status,...(cv_path?{cv_path}:{}),...(license_path?{license_path}:{})};
      const {error:de}=await supabase.from("driver_details").upsert(details,{onConflict:"driver_id"});
      if(de)throw de;
      setMsg("প্রোফাইল সংরক্ষণ হয়েছে।"); await refresh();
    }catch(e){setMsg(e.message||"সংরক্ষণ হয়নি");setError(true);}
    setSaving(false);
  };
  const toggleWork=v=>change("preferred_work_types",(form.preferred_work_types||[]).includes(v)?form.preferred_work_types.filter(x=>x!==v):[...(form.preferred_work_types||[]),v]);
  return <form onSubmit={save}><Panel title="ড্রাইভারের প্রোফাইল">
    <div style={formGrid}>
      <Field label="পূর্ণ নাম" value={form.full_name||""} onChange={e=>change("full_name",e.target.value)} required/>
      <Field label="মোবাইল নম্বর" value={form.phone||""} onChange={e=>change("phone",e.target.value)} required/>
      <Field label="বয়স" type="number" value={form.age||""} onChange={e=>change("age",e.target.value)}/>
      <Field label="অভিজ্ঞতা (বছর)" type="number" value={form.experience_years||""} onChange={e=>change("experience_years",e.target.value)}/>
      <Field label="ঠিকানা" value={form.address||""} onChange={e=>change("address",e.target.value)}/>
      <SelectField label="কাজের অবস্থা" value={form.availability_status||"available"} onChange={e=>change("availability_status",e.target.value)} options={[{value:"available",label:"কাজ খুঁজছি"},{value:"busy",label:"এখন ব্যস্ত"},{value:"unavailable",label:"এখন কাজ চাই না"}]}/>
      <Field label="ড্রাইভিং লাইসেন্স নম্বর" value={form.license_number||""} onChange={e=>change("license_number",e.target.value)}/>
      <Field label="লাইসেন্সের ধরন" value={form.license_type||""} onChange={e=>change("license_type",e.target.value)}/>
      <Field label="দক্ষতা" value={form.skills||""} onChange={e=>change("skills",e.target.value)}/>
      <Field label="আগের কাজের অভিজ্ঞতা" value={form.previous_experience||""} onChange={e=>change("previous_experience",e.target.value)}/>
    </div>
    <div style={{marginTop:12}}><Field label="নিজের পরিচিতি" as="textarea" value={form.bio||""} onChange={e=>change("bio",e.target.value)}/></div>
    <p style={{fontWeight:700}}>কোন ধরনের কাজ চান?</p>
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>{[["permanent","স্থায়ী"],["substitute","বিকল্প"],["part-time","পার্ট-টাইম"],["daily","দৈনিক"],["weekly","সাপ্তাহিক"],["monthly","মাসিক"]].map(([v,l])=><label key={v}><input type="checkbox" checked={(form.preferred_work_types||[]).includes(v)} onChange={()=>toggleWork(v)}/> {l}</label>)}</div>
    <div style={formGrid}>
      <Field label="প্রোফাইল ছবি" type="file" accept="image/*" onChange={e=>setPhoto(e.target.files[0])}/>
      <Field label="CV (PDF)" type="file" accept=".pdf,.doc,.docx" onChange={e=>setCv(e.target.files[0])}/>
      <Field label="লাইসেন্সের ছবি" type="file" accept="image/*,.pdf" onChange={e=>setLic(e.target.files[0])}/>
    </div>
    <Notice text={msg} error={error}/><Btn type="submit" disabled={saving}>{saving?"সংরক্ষণ হচ্ছে...":"প্রোফাইল সংরক্ষণ করুন"}</Btn>
  </Panel></form>;
}

function DriverDashboard({user,profile,refresh}) {
  const [apps,setApps]=useState([]),[offers,setOffers]=useState([]),[notices,setNotices]=useState([]),[msg,setMsg]=useState("");
  const load=async()=>{
    const [a,o,n]=await Promise.all([
      supabase.from("applications").select("*").eq("driver_id",user.id).order("created_at",{ascending:false}),
      supabase.from("owner_offers").select("*").eq("driver_id",user.id).order("created_at",{ascending:false}),
      supabase.from("notifications").select("*").eq("user_id",user.id).order("created_at",{ascending:false})
    ]);
    setApps(a.data||[]);setOffers(o.data||[]);setNotices(n.data||[]);
  };
  useEffect(()=>{load();},[user.id]);
  const answerOffer=async(id,status)=>{
    const {error}=await supabase.from("owner_offers").update({status}).eq("id",id);
    setMsg(error?error.message:"আপনার উত্তর পাঠানো হয়েছে।");load();
  };
  const cancelApp=async id=>{
    const reason=window.prompt("আবেদন বাতিলের কারণ লিখুন:");
    if(!reason)return;
    const {error}=await supabase.from("applications").update({status:"cancelled",cancellation_reason:reason}).eq("id",id);
    setMsg(error?error.message:"আবেদন বাতিল হয়েছে।");load();
  };
  return <div>
    <DriverProfile user={user} profile={profile} refresh={refresh}/>
    <Panel title="মালিকের কাজের অনুরোধ">
      {offers.length?offers.map(o=><div key={o.id} style={listRow}><div><b>{o.title}</b><p>{o.vehicle_type} · {o.work_type} · {o.location}</p><p>প্রস্তাবিত বেতন: {money(o.proposed_pay)} · অবস্থা: {o.status}</p><small>{o.details}</small></div>
        {o.status==="pending"&&<div style={{display:"flex",gap:7}}><Btn onClick={()=>answerOffer(o.id,"accepted")}><CheckCircle size={15}/> গ্রহণ</Btn><Btn tone="red" onClick={()=>answerOffer(o.id,"rejected")}><XCircle size={15}/> প্রত্যাখ্যান</Btn></div>}
      </div>):"এখনো কোনো অনুরোধ আসেনি।"}
    </Panel>
    <Panel title="আমার আবেদন">{apps.length?apps.map(a=><div key={a.id} style={listRow}><div><b>{a.listing_type==="jobs"?"স্থায়ী চাকরি":"বদলি ডিউটি"}</b><p>অবস্থা: {a.status}</p>{a.cancellation_reason&&<small>বাতিলের কারণ: {a.cancellation_reason}</small>}</div>{a.status==="pending"&&<Btn tone="red" onClick={()=>cancelApp(a.id)}>আবেদন বাতিল</Btn>}</div>):"এখনো কোনো আবেদন করেননি।"}</Panel>
    <Panel title="নোটিফিকেশন">{notices.length?notices.map(n=><div key={n.id} style={listRow}><div><b>{n.title}</b><p>{n.message}</p></div></div>):"নতুন নোটিফিকেশন নেই।"}</Panel>
    <Notice text={msg}/>
  </div>;
}

function OwnerDashboard({user,profile}) {
  const [jobs,setJobs]=useState([]),[duties,setDuties]=useState([]),[drivers,setDrivers]=useState([]),[apps,setApps]=useState([]),[offers,setOffers]=useState([]),[notices,setNotices]=useState([]);
  const [msg,setMsg]=useState(""),[tab,setTab]=useState("posts"),[editing,setEditing]=useState(null),[privateInfo,setPrivateInfo]=useState({});
  const [job,setJob]=useState({title:"",vehicle_type:"প্রাইভেট কার",location:"",salary:"",description:""});
  const [duty,setDuty]=useState({vehicle_type:"প্রাইভেট কার",location:"",start_location:"",destination:"",duty_date:"",start_time:"",end_time:"",duration_hours:"",pay:"",details:""});
  const [offer,setOffer]=useState({driver_id:"",title:"",vehicle_type:"প্রাইভেট কার",work_type:"daily",location:"",proposed_pay:"",details:"",start_at:""});
  const load=async()=>{
    const [j,d,p,o,n]=await Promise.all([
      supabase.from("jobs").select("*").eq("owner_id",user.id).order("created_at",{ascending:false}),
      supabase.from("substitute_duties").select("*").eq("owner_id",user.id).order("created_at",{ascending:false}),
      supabase.rpc("get_public_driver_profiles"),
      supabase.from("owner_offers").select("*").eq("owner_id",user.id).order("created_at",{ascending:false}),
      supabase.from("notifications").select("*").eq("user_id",user.id).order("created_at",{ascending:false})
    ]);
    setJobs(j.data||[]);setDuties(d.data||[]);setDrivers(p.data||[]);setOffers(o.data||[]);setNotices(n.data||[]);
    const ids=[...(j.data||[]).map(x=>({id:x.id,type:"jobs"})),...(d.data||[]).map(x=>({id:x.id,type:"substitute_duties"}))];
    if(ids.length){
      const clauses=ids.map(x=>`and(listing_type.eq.${x.type},listing_id.eq.${x.id})`).join(",");
      const {data:ap}=await supabase.from("applications").select("*").or(clauses).order("created_at",{ascending:false});
      setApps(ap||[]);
    }else setApps([]);
  };
  useEffect(()=>{load();},[user.id]);
  const savePost=async(type,e)=>{
    e.preventDefault();setMsg("");
    const table=type==="jobs"?"jobs":"substitute_duties";
    const values=type==="jobs"?{...job,owner_id:user.id,salary:job.salary?Number(job.salary):null,status:"open"}:{...duty,owner_id:user.id,pay:duty.pay?Number(duty.pay):null,duration_hours:duty.duration_hours?Number(duty.duration_hours):null,status:"open"};
    const result=editing?await supabase.from(table).update(values).eq("id",editing.id):await supabase.from(table).insert(values);
    if(result.error)setMsg(result.error.message);
    else {setMsg("পোস্ট সংরক্ষণ হয়েছে।");setEditing(null);setJob({title:"",vehicle_type:"প্রাইভেট কার",location:"",salary:"",description:""});setDuty({vehicle_type:"প্রাইভেট কার",location:"",start_location:"",destination:"",duty_date:"",start_time:"",end_time:"",duration_hours:"",pay:"",details:""});load();}
  };
  const deletePost=async(type,id)=>{
    if(!window.confirm("এই পোস্টটি ডিলিট করবেন?"))return;
    const {error}=await supabase.from(type).delete().eq("id",id);
    setMsg(error?error.message:"পোস্ট ডিলিট হয়েছে।");load();
  };
  const sendOffer=async e=>{
    e.preventDefault();
    const {error}=await supabase.from("owner_offers").insert({...offer,owner_id:user.id,proposed_pay:offer.proposed_pay?Number(offer.proposed_pay):null,start_at:offer.start_at||null,status:"pending"});
    setMsg(error?error.message:"কাজের অনুরোধ পাঠানো হয়েছে।");
    if(!error){setOffer({driver_id:"",title:"",vehicle_type:"প্রাইভেট কার",work_type:"daily",location:"",proposed_pay:"",details:"",start_at:""});load();}
  };
  const setAppStatus=async(id,status)=>{
    const {error}=await supabase.from("applications").update({status}).eq("id",id);
    setMsg(error?error.message:"আবেদনের অবস্থা আপডেট হয়েছে।");load();
  };
  const reveal=async(driverId)=>{
    const {data,error}=await supabase.rpc("get_driver_private_contact",{p_driver_id:driverId});
    if(error){setMsg(error.message);return;}
    const info=data?.[0];
    if(!info){setMsg("ব্যক্তিগত তথ্য দেখার অনুমতি নেই। আগে আবেদন বা কাজের অনুরোধ গ্রহণ করুন।");return;}
    const files={};
    for(const key of ["cv_path","license_path"])if(info[key]){
      const {data:signed,error:fileError}=await supabase.storage.from("driver-private").createSignedUrl(info[key],120);
      if(!fileError)files[key]=signed?.signedUrl;
    }
    setPrivateInfo(p=>({...p,[driverId]:{...info,...files}}));
  };
  const driverById=id=>drivers.find(d=>d.driver_id===id);
  const startEdit=(type,item)=>{setEditing({type,id:item.id});if(type==="jobs")setJob({...job,...item});else setDuty({...duty,...item});setTab(type);};
  const tabs=[["posts","আমার পোস্ট"],["jobs","স্থায়ী চাকরি পোস্ট"],["substitute_duties","বদলি ডিউটি পোস্ট"],["drivers","ড্রাইভার খুঁজুন"],["applications","আবেদন"],["offers","অনুরোধ"],["notifications","নোটিফিকেশন"]];
  return <div>
    <Panel title="মালিকের ড্যাশবোর্ড" right={<span style={{color:C.muted}}>{profile?.full_name||"মালিক"}</span>}>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{tabs.map(([v,l])=><button key={v} onClick={()=>setTab(v)} style={{padding:"9px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:tab===v?C.navy:"#fff",color:tab===v?"#fff":C.navy,fontWeight:700}}>{l}</button>)}</div>
    </Panel>
    {tab==="posts"&&<Panel title="আমার প্রকাশিত পোস্ট">
      <h3>স্থায়ী চাকরি</h3>{jobs.length?jobs.map(x=><div key={x.id} style={listRow}><div><b>{x.title}</b><p>{x.location} · {money(x.salary)}</p></div><Btn tone="light" onClick={()=>startEdit("jobs",x)}><Pencil size={15}/> Edit</Btn><Btn tone="red" onClick={()=>deletePost("jobs",x.id)}><Trash2 size={15}/> Delete</Btn></div>):"কোনো পোস্ট নেই।"}
      <h3>বদলি ডিউটি</h3>{duties.length?duties.map(x=><div key={x.id} style={listRow}><div><b>{x.vehicle_type}</b><p>{x.location} · {x.duty_date} · {money(x.pay)}</p></div><Btn tone="light" onClick={()=>startEdit("substitute_duties",x)}><Pencil size={15}/> Edit</Btn><Btn tone="red" onClick={()=>deletePost("substitute_duties",x.id)}><Trash2 size={15}/> Delete</Btn></div>):"কোনো পোস্ট নেই।"}
    </Panel>}
    {tab==="jobs"&&<Panel title={editing?.type==="jobs"?"চাকরির পোস্ট সম্পাদনা":"স্থায়ী চাকরির পোস্ট"}>
      <form onSubmit={e=>savePost("jobs",e)} style={formGrid}>
        <Field label="পদের নাম" value={job.title} onChange={e=>setJob({...job,title:e.target.value})} required/>
        <Field label="গাড়ির ধরন" value={job.vehicle_type} onChange={e=>setJob({...job,vehicle_type:e.target.value})}/>
        <Field label="কর্মস্থল" value={job.location} onChange={e=>setJob({...job,location:e.target.value})} required/>
        <Field label="মাসিক বেতন" type="number" value={job.salary||""} onChange={e=>setJob({...job,salary:e.target.value})}/>
        <Field label="বিস্তারিত" as="textarea" value={job.description||""} onChange={e=>setJob({...job,description:e.target.value})}/>
        <div style={{gridColumn:"1/-1"}}><Btn type="submit">{editing?.type==="jobs"?"পরিবর্তন সংরক্ষণ":"চাকরি পোস্ট করুন"}</Btn>{editing&&<Btn tone="light" onClick={()=>setEditing(null)}>বাতিল</Btn>}</div>
      </form>
    </Panel>}
    {tab==="substitute_duties"&&<Panel title={editing?.type==="substitute_duties"?"ডিউটি পোস্ট সম্পাদনা":"বদলি ডিউটি পোস্ট"}>
      <form onSubmit={e=>savePost("substitute_duties",e)} style={formGrid}>
        <Field label="গাড়ির ধরন" value={duty.vehicle_type} onChange={e=>setDuty({...duty,vehicle_type:e.target.value})}/>
        <Field label="এলাকা" value={duty.location} onChange={e=>setDuty({...duty,location:e.target.value})} required/>
        <Field label="শুরুর স্থান" value={duty.start_location||""} onChange={e=>setDuty({...duty,start_location:e.target.value})}/>
        <Field label="গন্তব্য" value={duty.destination||""} onChange={e=>setDuty({...duty,destination:e.target.value})}/>
        <Field label="ডিউটির তারিখ" type="date" value={duty.duty_date||""} onChange={e=>setDuty({...duty,duty_date:e.target.value})}/>
        <Field label="শুরু" type="time" value={duty.start_time||""} onChange={e=>setDuty({...duty,start_time:e.target.value})}/>
        <Field label="শেষ" type="time" value={duty.end_time||""} onChange={e=>setDuty({...duty,end_time:e.target.value})}/>
        <Field label="ঘণ্টা" type="number" value={duty.duration_hours||""} onChange={e=>setDuty({...duty,duration_hours:e.target.value})}/>
        <Field label="মোট পারিশ্রমিক" type="number" value={duty.pay||""} onChange={e=>setDuty({...duty,pay:e.target.value})}/>
        <Field label="বিস্তারিত" as="textarea" value={duty.details||""} onChange={e=>setDuty({...duty,details:e.target.value})}/>
        <div style={{gridColumn:"1/-1"}}><Btn type="submit">{editing?.type==="substitute_duties"?"পরিবর্তন সংরক্ষণ":"ডিউটি পোস্ট করুন"}</Btn></div>
      </form>
    </Panel>}
    {tab==="drivers"&&<Panel title="ড্রাইভার খুঁজুন"><p style={{color:C.muted}}>শুধু প্রকাশ্য প্রোফাইল দেখানো হবে।</p><div style={cardsGrid}>{drivers.map(d=><article key={d.driver_id} style={cardStyle}>
      {d.photo_path&&<img src={publicPhoto(d.photo_path)} alt="ড্রাইভার" style={{width:82,height:82,objectFit:"cover",borderRadius:"50%"}}/>}
      <h3>{d.full_name||"নাম দেওয়া হয়নি"}</h3><p>{d.experience_years||0} বছর অভিজ্ঞতা</p><p>{d.skills||"দক্ষতা উল্লেখ নেই"}</p><p><MapPin size={14}/> {d.address||"ঠিকানা নেই"}</p>
      <Btn onClick={()=>{setOffer({...offer,driver_id:d.driver_id});setTab("sendoffer");}}>কাজের অনুরোধ পাঠান</Btn>
    </article>)}</div></Panel>}
    {tab==="sendoffer"&&<Panel title="ড্রাইভারকে কাজের অনুরোধ"><form onSubmit={sendOffer} style={formGrid}>
      <SelectField label="ড্রাইভার" value={offer.driver_id} onChange={e=>setOffer({...offer,driver_id:e.target.value})} options={[{value:"",label:"ড্রাইভার নির্বাচন করুন"},...drivers.map(d=>({value:d.driver_id,label:d.full_name||d.driver_id}))]}/>
      <Field label="কাজের শিরোনাম" value={offer.title} onChange={e=>setOffer({...offer,title:e.target.value})} required/>
      <Field label="গাড়ির ধরন" value={offer.vehicle_type} onChange={e=>setOffer({...offer,vehicle_type:e.target.value})}/>
      <SelectField label="কাজের ধরন" value={offer.work_type} onChange={e=>setOffer({...offer,work_type:e.target.value})} options={[{value:"permanent",label:"স্থায়ী"},{value:"substitute",label:"বদলি"},{value:"part-time",label:"পার্ট-টাইম"},{value:"daily",label:"দৈনিক"},{value:"weekly",label:"সাপ্তাহিক"},{value:"monthly",label:"মাসিক"}]}/>
      <Field label="কর্মস্থল" value={offer.location} onChange={e=>setOffer({...offer,location:e.target.value})}/>
      <Field label="প্রস্তাবিত বেতন" type="number" value={offer.proposed_pay||""} onChange={e=>setOffer({...offer,proposed_pay:e.target.value})}/>
      <Field label="কাজ শুরুর সময়" type="datetime-local" value={offer.start_at||""} onChange={e=>setOffer({...offer,start_at:e.target.value})}/>
      <Field label="বিস্তারিত" as="textarea" value={offer.details} onChange={e=>setOffer({...offer,details:e.target.value})}/>
      <div style={{gridColumn:"1/-1"}}><Btn type="submit" disabled={!offer.driver_id}>অনুরোধ পাঠান</Btn></div>
    </form></Panel>}
    {tab==="applications"&&<Panel title="ড্রাইভারের আবেদন">{apps.length?apps.map(a=>{const d=driverById(a.driver_id);return <div key={a.id} style={listRow}><div>
      <b>{d?.full_name||"ড্রাইভার"}</b><p>{a.listing_type} · আবেদন: {a.status}</p><p>{d?.experience_years||0} বছর · {d?.skills||""} · {d?.address||""}</p>
      {a.status==="accepted"&&<><Btn tone="light" onClick={()=>reveal(a.driver_id)}>ব্যক্তিগত তথ্য দেখুন</Btn>{privateInfo[a.driver_id]&&<PrivateInfo info={privateInfo[a.driver_id]}/>}</>}
    </div>{a.status==="pending"&&<div style={{display:"flex",gap:7}}><Btn onClick={()=>setAppStatus(a.id,"accepted")}>গ্রহণ</Btn><Btn tone="red" onClick={()=>setAppStatus(a.id,"rejected")}>প্রত্যাখ্যান</Btn></div>}</div>; }):"এখনো কোনো আবেদন আসেনি।"}</Panel>}
    {tab==="offers"&&<Panel title="সরাসরি পাঠানো অনুরোধ">{offers.length?offers.map(o=><div key={o.id} style={listRow}><div><b>{o.title}</b><p>অবস্থা: {o.status} · বেতন: {money(o.proposed_pay)}</p>
      {o.status==="accepted"&&<><Btn tone="light" onClick={()=>reveal(o.driver_id)}>ড্রাইভারের ব্যক্তিগত তথ্য দেখুন</Btn>{privateInfo[o.driver_id]&&<PrivateInfo info={privateInfo[o.driver_id]}/>}</>}
    </div></div>):"কোনো অনুরোধ পাঠানো হয়নি।"}</Panel>}
    {tab==="notifications"&&<Panel title="নোটিফিকেশন">{notices.length?notices.map(n=><div key={n.id} style={listRow}><div><b>{n.title}</b><p>{n.message}</p></div></div>):"নতুন নোটিফিকেশন নেই।"}</Panel>}
    <Notice text={msg} error={!!msg&&/error|permission|denied|violates/i.test(msg)}/>
  </div>;
}
function PrivateInfo({info}) {
  return <div style={{background:C.pale,padding:10,borderRadius:9,marginTop:9}}>
    <p>নাম: {info.full_name||"নেই"}</p><p>ঠিকানা: {info.address||"নেই"}</p><p>ফোন: {info.phone||"নেই"}</p>
    {info.license_number&&<p>লাইসেন্স: {info.license_number} ({info.license_type||""})</p>}
    {info.cv_path&&<p><a href={info.cv_path} target="_blank" rel="noreferrer">CV খুলুন</a></p>}
    {info.license_path&&<p><a href={info.license_path} target="_blank" rel="noreferrer">লাইসেন্সের ছবি খুলুন</a></p>}
  </div>;
}
function Dashboard({user,profile,refresh}) {
  const role=profile?.role||user.user_metadata?.role||"driver";
  return <main style={mainStyle}><h1>আমার ড্যাশবোর্ড</h1>{role==="owner"?<OwnerDashboard user={user} profile={profile}/>:<DriverDashboard user={user} profile={profile} refresh={refresh}/>}</main>;
}
function App() {
  const [user,setUser]=useState(null),[profile,setProfile]=useState(null),[loading,setLoading]=useState(true);
  const refresh=async()=>{
    const {data:{user:u}}=await supabase.auth.getUser();setUser(u||null);
    if(u){const {data:p}=await supabase.from("profiles").select("*").eq("id",u.id).maybeSingle();setProfile(p||{id:u.id,role:u.user_metadata?.role,full_name:u.user_metadata?.full_name,phone:u.user_metadata?.phone});}
    else setProfile(null);
  };
  useEffect(()=>{
    let mounted=true;
    supabase.auth.getSession().then(async({data})=>{
      if(!mounted)return;
      const u=data.session?.user||null;setUser(u);
      if(u){const {data:p}=await supabase.from("profiles").select("*").eq("id",u.id).maybeSingle();if(mounted)setProfile(p||{id:u.id,role:u.user_metadata?.role,full_name:u.user_metadata?.full_name,phone:u.user_metadata?.phone});}
      if(mounted)setLoading(false);
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange(()=>{refresh();});
    return()=>{mounted=false;subscription.unsubscribe();};
  },[]);
  const signOut=async()=>{await supabase.auth.signOut();setUser(null);setProfile(null);};
  if(loading)return <div style={{padding:30,textAlign:"center"}}>লোড হচ্ছে...</div>;
  return <div style={{minHeight:"100vh",background:C.bg,color:C.navy,fontFamily:"'Hind Siliguri',Arial,sans-serif"}}>
    <Header user={user} role={profile?.role} signOut={signOut}/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/drivers" element={<DriverSearch/>}/>
      <Route path="/jobs" element={<ListingPage kind="jobs" user={user}/>}/>
      <Route path="/duties" element={<ListingPage kind="duties" user={user}/>}/>
      <Route path="/guest-job" element={<GuestJobPost/>}/>
      <Route path="/login" element={<Auth mode="login" refresh={refresh}/>}/>
      <Route path="/register" element={<Auth mode="register" refresh={refresh}/>}/>
      <Route path="/dashboard" element={user?<Dashboard user={user} profile={profile} refresh={refresh}/>:<Auth mode="login" refresh={refresh}/>}/>
      <Route path="*" element={<Home/>}/>
    </Routes>
    <footer style={{textAlign:"center",padding:25,color:C.muted}}>© Chattogram Driver Bazar BD · চট্টগ্রাম জেলা</footer>
  </div>;
}
const mainStyle={maxWidth:1120,margin:"auto",padding:"24px 16px"};
const cardsGrid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:14};
const cardStyle={background:"#fff",border:`1px solid ${C.border}`,borderRadius:13,padding:16,display:"grid",gap:8,alignContent:"start"};
const formGrid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12};
const listRow={display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"};

export default App;
