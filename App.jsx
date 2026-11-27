import React, { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  Menu, BriefcaseBusiness, CarFront,
  Search, MapPin, Clock3, LogOut, Trash2,
  Pencil, FileText, CheckCircle, XCircle, Phone,
  CalendarClock
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "./supabase";

const C = {
  navy: "#082F61", navy2: "#0755A0", pale: "#E8F4FF",
  border: "#D5E6F5", muted: "#647B91", red: "#B42318",
  white: "#FFFFFF", bg: "#F3F8FE", green: "#087B4B"
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
  return <section style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:15,padding:16,marginBottom:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:13,flexWrap:"wrap"}}>
      <h2 style={{fontSize:19,margin:0,color:C.navy}}>{title}</h2>{right}
    </div>{children}
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
  return <header style={{background:"#fff",position:"relative",zIndex:10,boxShadow:"0 2px 10px #082f5510"}}>
    <div style={{background:"#07366B",color:"#fff",fontSize:13}}>
      <div style={{maxWidth:1200,margin:"auto",padding:"8px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
          <span><MapPin size={14} style={{verticalAlign:"middle",marginRight:5}}/>চট্টগ্রাম,শহর</span>
          <span><Phone size={14} style={{verticalAlign:"middle",marginRight:5}}/>+88 01401314095</span>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}><span><Clock3 size={14} style={{verticalAlign:"middle",marginRight:5}}/>ওয়েবসাইট সমস্যা হলে যোগাযোগ সকাল ৮টা - রাত ১০টা</span><span style={{fontSize:17}}></span></div>
      </div>
    </div>
    <div style={{maxWidth:1200,margin:"auto",padding:"12px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:15,flexWrap:"wrap"}}>
      <Link to="/" style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none",color:"#07366B",minWidth:245}}>
        <span style={{width:122,height:72,display:"grid",placeItems:"center",position:"relative",color:"#0755A0"}}>
          <CarFront size={78} strokeWidth={1.8}/>
          <b style={{position:"absolute",bottom:0,fontSize:12,letterSpacing:2,background:"#fff",padding:"0 5px"}}>CDB</b>
        </span>
        <span style={{fontSize:22,fontWeight:900,lineHeight:1.08}}>Chattogram<br/>Driver Bazar BD<small style={{display:"block",fontSize:12,marginTop:5}}>চালক ও গাড়ির মালিকের এক প্লাটফর্মে</small></span>
      </Link>
      <button onClick={()=>setOpen(!open)} style={{display:"none",border:0,background:"#EAF4FF",color:"#07366B",padding:10,borderRadius:9}} className="cdb-menu"><Menu/></button>
      <nav className={`cdb-nav ${open ? "open" : ""}`} style={{display:"flex",gap:22,alignItems:"center",flexWrap:"wrap"}}>
        <NavLink to="/" style={({isActive})=>({...navStyle({isActive}),background:isActive?"#0865B8":"transparent",color:isActive?"#fff":"#152B45",padding:"12px 17px",borderRadius:10,boxShadow:isActive?"0 3px 9px #0755a033":"none"})}>⌂ হোম</NavLink>
        <NavLink to="/drivers" style={navStyle}>ড্রাইভার খুঁজুন</NavLink>
        <NavLink to="/jobs" style={navStyle}>ড্রাইভার চাকরি</NavLink>
        <NavLink to="/duties" style={navStyle}>বদলি ডিউটি</NavLink>
        {user&&<NavLink to="/dashboard" style={navStyle}>ড্যাশবোর্ড</NavLink>}
        {!user?<><Link to="/login" style={{...smallReg,background:"#E6F3FF",padding:"12px 22px",fontSize:15}}>♟ লগইন</Link><Link to="/register?role=driver" style={{...smallReg,padding:"12px 15px"}}>রেজিস্ট্রেশন</Link></>:<button onClick={signOut} style={plainBtn}><LogOut size={16}/> লগআউট</button>}
      </nav>
    </div>
    <style>{`@media(max-width:760px){.cdb-menu{display:block!important}.cdb-nav{width:100%;gap:9px!important;justify-content:center}.cdb-nav a{font-size:13px}}`}</style>
  </header>;
}
const navStyle = ({isActive}) => ({textDecoration:"none",color:isActive?C.navy2:C.muted,fontWeight:800});
const plainBtn={border:0,background:"none",color:C.navy,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:5};
const smallReg={textDecoration:"none",fontSize:12,fontWeight:800,color:C.navy,background:C.pale,border:`1px solid ${C.border}`,padding:"7px 9px",borderRadius:8};

function Home() {
  const actions = [
    {to:"/drivers",icon:<Search size={39}/>,title:"অভিজ্ঞ ড্রাইভার খুঁজুন",desc:"অভিজ্ঞ ও দক্ষ ড্রাইভারের প্রোফাইল দেখুন",cta:"এখনই দেখুন"},
    {to:"/jobs",icon:<BriefcaseBusiness size={39}/>,title:"ড্রাইভার চাকরি",desc:"চট্টগ্রাম জেলার চাকরির বিজ্ঞাপন দেখুন",cta:"চাকরি দেখুন"},
    {to:"/duties",icon:<CalendarClock size={39}/>,title:"বদলি ডিউটি পোস্ট",desc:"অস্থায়ী ও দৈনিক ডিউটি খুঁজুন",cta:"ডিউটি দেখুন"},
    {to:"/guest-job",icon:<FileText size={39}/>,title:"রেজিস্ট্রেশন ছাড়া মালিকের চাকরি পোস্ট",desc:"মালিকের তথ্য যাচাই করে চাকরির পোস্টের আবেদন দিন",cta:"এখনই পোস্ট করুন"}
  ];
  return <div style={{background:"linear-gradient(180deg,#F1F8FF 0%,#FFFFFF 65%,#EAF5FF 100%)",paddingBottom:0}}>
    <section className="cdb-hero" style={{
      maxWidth:1440,margin:"0 auto",position:"relative",overflow:"hidden",
      minHeight:590,display:"flex",alignItems:"center",padding:"35px 3.2%",
      backgroundColor:"#E8F5FF",
      backgroundImage:`linear-gradient(90deg,rgba(235,247,255,.98) 0%,rgba(235,247,255,.93) 36%,rgba(235,247,255,.38) 54%,rgba(235,247,255,0) 72%),url('${import.meta.env.BASE_URL}cdb-hero.png')`,
      backgroundSize:"cover",backgroundPosition:"center",
      borderRadius:"0 0 22px 22px"
    }}>
      <div style={{width:"52%",maxWidth:670,position:"relative",zIndex:1}}>
        <h2 style={{fontSize:"clamp(21px,2.4vw,31px)",lineHeight:1.3,color:"#0B315E",fontWeight:900,margin:"0 0 12px"}}>চট্টগ্রাম জেলার চালক ও গাড়ির<br/>মালিকের জন্য নির্ভরযোগ্য প্ল্যাটফর্ম</h2>
        <h1 style={{fontSize:"clamp(39px,5.2vw,76px)",lineHeight:1.02,letterSpacing:-2,color:"#082D5D",fontWeight:950,margin:"0 0 16px"}}>Chattogram<br/>Driver Bazar BD</h1>
        <div style={{display:"inline-block",background:"linear-gradient(90deg,#086CC4,#07519A)",color:"#fff",fontSize:"clamp(17px,2vw,25px)",fontWeight:900,padding:"8px 20px",margin:"0 0 14px",borderRadius:"0 25px 25px 0"}}>আপনার প্রয়োজনের ড্রাইভার ও চাকরি খুঁজুন</div>
        <div style={{display:"grid",gap:7,color:"#152D49",fontSize:"clamp(15px,1.5vw,19px)",fontWeight:700,marginBottom:20}}>
          <span>🟢 অভিজ্ঞ ড্রাইভার খুঁজুন</span><span>🟢 ড্রাইভার চাকরির সুযোগ</span><span>🟢 বদলি ডিউটি পোস্ট</span><span>🟢 মালিক ও চালকের সরাসরি যোগাযোগ</span>
        </div>
        <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          <Link to="/drivers" style={{background:"#07396F",color:"#fff",textDecoration:"none",padding:"13px 23px",borderRadius:30,fontWeight:900,fontSize:17,display:"inline-flex",alignItems:"center",gap:9,boxShadow:"0 4px 10px #082f5530"}}><Search size={20}/> ড্রাইভার খুঁজুন</Link>
          <Link to="/jobs" style={{background:"#F8FCFF",color:"#07396F",textDecoration:"none",padding:"12px 23px",borderRadius:30,fontWeight:900,fontSize:17,border:"2px solid #0A4D8A",display:"inline-flex",alignItems:"center",gap:9}}><BriefcaseBusiness size={20}/> চাকরি দেখুন</Link>
        </div>
      </div>
    </section>
    <section style={{maxWidth:1200,margin:"0 auto",padding:"18px 22px 28px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:13}} className="cdb-services">
        {actions.map((a)=><Link key={a.to} to={a.to} style={{textDecoration:"none",background:"#fff",border:"1px solid #D8E8F7",borderRadius:19,padding:"19px 13px 17px",minHeight:280,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",gap:9,textAlign:"center",color:"#092F61",boxShadow:"0 5px 14px #123c6018"}}>
          <span style={{width:92,height:92,borderRadius:"50%",background:"#D9EEFF",display:"grid",placeItems:"center",color:"#0755A0"}}>{a.icon}</span>
          <b style={{fontSize:21,lineHeight:1.35}}>{a.title}</b>
          <span style={{fontSize:16,color:"#25384E",lineHeight:1.5}}>{a.desc}</span>
          <span style={{background:"#07396F",color:"#fff",padding:"10px 19px",borderRadius:25,fontSize:15,fontWeight:900,minWidth:145}}>{a.cta}　→</span>
        </Link>)}
      </div>
    </section>
    <style>{`@media(max-width:850px){.cdb-hero{min-height:520px!important;background-position:58% center!important}.cdb-services{grid-template-columns:repeat(2,minmax(0,1fr))!important}.cdb-services a{min-height:235px!important}}@media(max-width:560px){.cdb-hero{min-height:620px!important;align-items:flex-start!important;padding:25px 18px!important;background-image:linear-gradient(180deg,rgba(235,247,255,.98) 0%,rgba(235,247,255,.94) 43%,rgba(235,247,255,.1) 100%),url('${import.meta.env.BASE_URL}cdb-hero.png')!important;background-position:60% center!important}.cdb-hero>div{width:100%!important}.cdb-services{gap:10px!important}.cdb-services a{padding:14px 8px!important;min-height:225px!important}.cdb-services b{font-size:16px!important}.cdb-services span:nth-child(3){font-size:13px!important}.cdb-services span:first-child{width:66px!important;height:66px!important}.cdb-services span:first-child svg{width:30px!important;height:30px!important}}`}</style>
  </div>;
}

function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(180deg,#087BCF 0%,#07366B 20%,#062C58 100%)",
      color: "#fff",
      padding: "32px 20px 25px",
      textAlign: "center",
      borderTop: "7px solid #35B7F4",
      marginTop: "auto",
      flexShrink: 0
    }}>
      <div style={{maxWidth:1100,margin:"auto",display:"flex",justifyContent:"space-between",alignItems:"center",gap:20,flexWrap:"wrap"}}>
        <CarFront size={76} strokeWidth={1.4}/>
        <div>
          <div style={{fontSize:20,fontWeight:900}}>© Chattogram Driver Bazar BD · চট্টগ্রাম জেলা</div>
          <div style={{fontSize:17,marginTop:8}}>বিশ্বস্ত সংযোগ, নিরাপদ ভবিষ্যৎ</div>
        </div>
        <div style={{fontSize:45}}>🌉</div>
      </div>
    </footer>
  );
}


function Auth({ mode, refresh }) {
  const nav = useNavigate();

  const params = new URLSearchParams(window.location.search);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(
    params.get("role") === "owner" ? "owner" : "driver"
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const passwordChecks = [
    { label: "কমপক্ষে ৮ অক্ষর", ok: password.length >= 8 },
    { label: "একটি বড় হাতের ইংরেজি অক্ষর", ok: /[A-Z]/.test(password) },
    { label: "একটি ছোট হাতের ইংরেজি অক্ষর", ok: /[a-z]/.test(password) },
    { label: "একটি সংখ্যা", ok: /[0-9]/.test(password) }
  ];

  const passwordStrong = passwordChecks.every(item => item.ok);

  const friendlyError = (message) => {
    const m = (message || "").toLowerCase();

    if (m.includes("already registered") || m.includes("already been registered")) {
      return "এই ইমেইল দিয়ে আগে থেকেই অ্যাকাউন্ট খোলা আছে।";
    }
    if (m.includes("invalid email")) {
      return "সঠিক ইমেইল ঠিকানা লিখুন।";
    }
    if (m.includes("password")) {
      return "পাসওয়ার্ড গ্রহণ করা যায়নি। পাসওয়ার্ডের নিয়মগুলো পরীক্ষা করুন।";
    }
    if (m.includes("rate limit")) {
      return "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";
    }
    if (m.includes("network") || m.includes("fetch")) {
      return "ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।";
    }

    return message || "দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।";
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr(false);

    if (!isSupabaseConfigured) {
      setMsg("Supabase কনফিগার করা নেই।");
      setErr(true);
      return;
    }

    if (loading) return;

    if (isRegister) {
      const cleanPhone = phone.replace(/[\s-]/g, "");

      const validPhone =
        /^01[3-9]\d{8}$/.test(cleanPhone) ||
        /^\+8801[3-9]\d{8}$/.test(cleanPhone) ||
        /^8801[3-9]\d{8}$/.test(cleanPhone);

      if (!name.trim()) {
        setMsg("আপনার নাম লিখুন।");
        setErr(true);
        return;
      }

      if (!validPhone) {
        setMsg("সঠিক বাংলাদেশের মোবাইল নম্বর লিখুন। যেমন: 01XXXXXXXXX");
        setErr(true);
        return;
      }

      if (!passwordStrong) {
        setMsg("পাসওয়ার্ডের সব শর্ত পূরণ করুন।");
        setErr(true);
        return;
      }

      if (password !== confirmPassword) {
        setMsg("দুইবার দেওয়া পাসওয়ার্ড মিলছে না।");
        setErr(true);
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: name.trim(),
              phone: phone.trim(),
              role
            }
          }
        });

        if (error) throw error;

        // ইমেইল যাচাই বন্ধ থাকলে সক্রিয় সেশনে প্রোফাইল তৈরি
        if (data.session && data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert({
              id: data.user.id,
              role,
              full_name: name.trim(),
              phone: phone.trim()
            }, { onConflict: "id" });

          if (profileError) throw profileError;
        }

        setMsg(
          "অভিনন্দন! আপনার রেজিস্ট্রেশন সম্পন্ন হয়েছে। আপনার ইমেইল ইনবক্সে গিয়ে যাচাইয়ের লিংকে ক্লিক করুন। এরপর লগইন করতে পারবেন।"
        );
        setErr(false);
        setPassword("");
        setConfirmPassword("");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });

        if (error) throw error;

        await refresh();
        nav("/dashboard");
      }
    } catch (e) {
      setMsg(friendlyError(e.message));
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: `1px solid ${C.border}`,
    borderRadius: 9,
    fontSize: 15,
    boxSizing: "border-box",
    outlineColor: C.navy,
    background: "#fff"
  };

  const labelStyle = {
    display: "grid",
    gap: 6,
    fontWeight: 600,
    color: C.navy,
    fontSize: 14
  };

  const toggleStyle = {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: C.navy,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700
  };

  return (
    <div style={centerPage}>
      <form onSubmit={submit} style={authBox}>
        <h1 style={{ marginTop: 0, color: C.navy }}>
          {isRegister ? "নতুন অ্যাকাউন্ট" : "লগইন"}
        </h1>

        {isRegister && (
          <>
            <label style={labelStyle}>
              অ্যাকাউন্টের ধরন
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={inputStyle}
              >
                <option value="driver">ড্রাইভার</option>
                <option value="owner">গাড়ির মালিক</option>
              </select>
            </label>

            <label style={labelStyle}>
              আপনার নাম
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="আপনার পূর্ণ নাম"
                required
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              মোবাইল নম্বর
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                required
                style={inputStyle}
              />
            </label>
          </>
        )}

        <label style={labelStyle}>
          ইমেইল
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            required
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          পাসওয়ার্ড
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="আপনার পাসওয়ার্ড"
              required
              style={{ ...inputStyle, paddingRight: 75 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={toggleStyle}
            >
              {showPassword ? "লুকান" : "দেখুন"}
            </button>
          </div>
        </label>

        {isRegister && (
          <>
            <div style={{
              display: "grid",
              gap: 5,
              padding: 10,
              background: "#F3F8FE",
              borderRadius: 9,
              fontSize: 12
            }}>
              <strong style={{ color: C.navy }}>পাসওয়ার্ডের শক্তি</strong>

              {passwordChecks.map((item, index) => (
                <div key={index} style={{
                  color: item.ok ? "#16834A" : "#777"
                }}>
                  {item.ok ? "✓" : "○"} {item.label}
                </div>
              ))}
            </div>

            <label style={labelStyle}>
              পাসওয়ার্ড আবার লিখুন
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="একই পাসওয়ার্ড আবার লিখুন"
                  required
                  style={{ ...inputStyle, paddingRight: 75 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={toggleStyle}
                >
                  {showConfirm ? "লুকান" : "দেখুন"}
                </button>
              </div>
              {confirmPassword && (
                <span style={{
                  color: password === confirmPassword ? "#16834A" : "#D32F2F",
                  fontSize: 12
                }}>
                  {password === confirmPassword
                    ? "✓ পাসওয়ার্ড মিলেছে"
                    : "✕ পাসওয়ার্ড মিলছে না"}
                </span>
              )}
            </label>
          </>
        )}

        <Btn type="submit" disabled={loading}>
          {loading
            ? "অপেক্ষা করুন..."
            : isRegister
              ? "রেজিস্ট্রেশন করুন"
              : "লগইন করুন"}
        </Btn>

        <Notice text={msg} error={err} />

        <p style={{ marginBottom: 0 }}>
          {isRegister
            ? <Link to="/login">আগে অ্যাকাউন্ট আছে? লগইন করুন</Link>
            : <Link to="/register">নতুন অ্যাকাউন্ট খুলুন</Link>}
        </p>
      </form>
    </div>
  );
}

const centerPage={minHeight:"65vh",display:"grid",placeItems:"center",padding:16};
const authBox={background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:22,width:"min(100%,430px)",display:"grid",gap:13};

function GuestJobPost() {
  return <div style={mainStyle}><Panel title="রেজিস্ট্রেশন ছাড়া মালিকের চাকরি পোস্ট">
    <Notice text="এই সুবিধার জন্য মালিকের নাম ও মোবাইল নম্বর যাচাই এবং অ্যাডমিন অনুমোদনের ব্যবস্থা তৈরি করতে হবে। নিরাপদ যাচাই ব্যবস্থা চালু না হওয়া পর্যন্ত এই ফর্ম থেকে পোস্ট প্রকাশ করা হচ্ছে না." error/>
    <p style={{color:C.muted,lineHeight:1.8}}>পরবর্তী ধাপে আমরা OTP যাচাই ও অ্যাডমিন অনুমোদনের ডাটাবেস ব্যবস্থা যোগ করে এই ফর্মটি চালু করব।</p>
  </Panel></div>;
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
  return <div style={mainStyle}><h1>{kind==="jobs"?"ড্রাইভার চাকরি":"বদলি ডিউটি"}</h1><Notice text={msg} error={!!msg&&/error|permission|denied|violates/i.test(msg)}/>
    {busy?"লোড হচ্ছে...":items.length===0?"এখনো কোনো পোস্ট নেই।":<div style={cardsGrid}>{items.map(x=><article key={x.id} style={cardStyle}>
      <h3>{x.title||`${x.vehicle_type||"গাড়ি"} ডিউটি`}</h3>
      <p><MapPin size={15}/> {x.location||x.start_location||"ঠিকানা উল্লেখ নেই"}</p>
      {x.destination&&<p>গন্তব্য: {x.destination}</p>}
      <p>বেতন: <b>{money(x.salary??x.pay)}</b></p>
      {x.duty_date&&<p>তারিখ: {x.duty_date}</p>}
      {(x.description||x.details)&&<p>{x.description||x.details}</p>}
      <Btn onClick={()=>apply(x)} disabled={!user}>আবেদন করুন</Btn>
    </article>)}</div>}
  </div>;
}

function DriverSearch() {
  const [drivers,setDrivers]=useState([]),[msg,setMsg]=useState("");
  useEffect(()=>{(async()=>{
    const {data,error}=await supabase.rpc("get_public_driver_profiles");
    if(error)setMsg(error.message);else setDrivers(data||[]);
  })();},[]);
  return <div style={mainStyle}><h1>অভিজ্ঞ ড্রাইভার খুঁজুন</h1><Notice text={msg} error/>
    <p style={{color:C.muted}}>শুধু ড্রাইভারের প্রকাশ্য তথ্য দেখানো হবে। ব্যক্তিগত তথ্য অনুমতি ছাড়া প্রকাশ করা হবে না।</p>
    <div style={cardsGrid}>{drivers.map(d=><article key={d.driver_id} style={cardStyle}>
      {d.photo_path&&<img src={publicPhoto(d.photo_path)} alt="ড্রাইভার" style={{width:82,height:82,objectFit:"cover",borderRadius:"50%"}}/>}
      <h3>{d.full_name||"নাম দেওয়া হয়নি"}</h3><p>{d.experience_years||0} বছর অভিজ্ঞতা</p><p>{d.skills||"দক্ষতা উল্লেখ নেই"}</p><p><MapPin size={14}/> {d.address||"ঠিকানা নেই"}</p>
    </article>)}</div>
  </div>;
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
  return <div style={mainStyle}><h1>আমার ড্যাশবোর্ড</h1>{role==="owner"?<OwnerDashboard user={user} profile={profile}/>:<DriverDashboard user={user} profile={profile} refresh={refresh}/>}</div>;
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
  return (
    <div
      className="app-shell"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#062C58",
        color: C.navy,
        fontFamily: "'Hind Siliguri',Arial,sans-serif"
      }}
    >
      <Header user={user} role={profile?.role} signOut={signOut}/>

      <main className="app-main" style={{ flex: "1 0 auto", background: C.bg }}>
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
      </main>

      <Footer/>
    </div>
  );
}
const mainStyle={maxWidth:1120,margin:"auto",padding:"24px 16px"};
const cardsGrid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:14};
const cardStyle={background:"#fff",border:`1px solid ${C.border}`,borderRadius:13,padding:16,display:"grid",gap:8,alignContent:"start"};
const formGrid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12};
const listRow={display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"};

export default App;
