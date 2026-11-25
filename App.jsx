
import React, { useEffect, useState } from "react";
import {
  Link, NavLink, Route, Routes, useNavigate
} from "react-router-dom";
import {
  Menu, X, UserRound, BriefcaseBusiness, CarFront,
  ClipboardList, ShieldCheck, Plus, Search, MapPin, Clock3
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "./supabase";

const nav = [
  ["/", "হোম"],
  ["/jobs", "স্থায়ী চাকরি"],
  ["/duties", "বদলি ডিউটি"],
  ["/bookings", "ড্রাইভার বুকিং"],
  ["/drivers", "ড্রাইভার খুঁজুন"]
];

function getRole(user) {
  return user?.user_metadata?.role === "owner" ? "owner" : "driver";
}

function Header({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="navwrap">
        <Link to="/" className="brand">
          <span className="brandmark">চা</span>
          <span>
            Chattogram <b>Driver Bazar</b>
            <small>চালক ও গাড়ির মালিকের মিলনমেলা</small>
          </span>
        </Link>

        <button className="menuBtn" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>

        <nav className={open ? "nav open" : "nav"}>
          {nav.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink to="/dashboard">ড্যাশবোর্ড</NavLink>
              <button className="linkBtn" onClick={onLogout}>
                লগআউট
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">লগইন</NavLink>
              <Link className="navJoin" to="/register">নিবন্ধন</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="heroInner">
          <div className="eyebrow">চট্টগ্রামের ড্রাইভার সার্ভিস প্ল্যাটফর্ম</div>
          <h1>আপনার প্রয়োজনের<br /><em>সঠিক ড্রাইভার</em> খুঁজুন</h1>
          <p>
            স্থায়ী চাকরি, অস্থায়ী ড্রাইভার বুকিং এবং বদলি ডিউটি—
            সব এক জায়গায়।
          </p>
          <div className="heroActions">
            <Link className="btn primary" to="/drivers">
              ড্রাইভার খুঁজুন <Search size={18} />
            </Link>
            <Link className="btn light" to="/register">
              ফ্রি নিবন্ধন করুন
            </Link>
          </div>
          <div className="heroNote">
            <ShieldCheck size={17} /> যাচাই ও নিরাপত্তাকে গুরুত্ব দিয়ে তৈরি
          </div>
        </div>

        <div className="heroArt">
          <div className="circle"></div>
          <div className="road"></div>
          <div className="car"><CarFront size={112} /></div>
          <div className="floatingTag tagOne">✓ ড্রাইভার প্রোফাইল</div>
          <div className="floatingTag tagTwo">চট্টগ্রাম জুড়ে</div>
        </div>
      </section>

      <section className="section">
        <div className="sectionHead">
          <div>
            <div className="eyebrow dark">আমাদের সেবা</div>
            <h2>আপনার প্রয়োজন, আমাদের সমাধান</h2>
          </div>
          <p>ড্রাইভার ও গাড়ির মালিক—দুই পক্ষের জন্য সহজ ব্যবস্থা।</p>
        </div>

        <div className="serviceGrid">
          <Service
            icon={<BriefcaseBusiness />}
            title="স্থায়ী ড্রাইভার চাকরি"
            desc="বেতন, কর্মঘণ্টা ও শর্ত দেখে চাকরিতে আবেদন করুন।"
            to="/jobs"
            action="চাকরি দেখুন"
          />
          <Service
            icon={<CarFront />}
            title="অস্থায়ী ড্রাইভার বুকিং"
            desc="ঘণ্টা, দিন, সপ্তাহ বা মাসের জন্য ড্রাইভার খুঁজুন।"
            to="/bookings"
            action="বুকিং দেখুন"
          />
          <Service
            icon={<ClipboardList />}
            title="বদলি ডিউটি"
            desc="নিয়মিত ড্রাইভার ছুটিতে? বদলি ড্রাইভারের প্রয়োজন জানান।"
            to="/duties"
            action="ডিউটি দেখুন"
          />
        </div>
      </section>

      <section className="cta">
        <div>
          <div className="eyebrow">আজই শুরু করুন</div>
          <h2>আপনি কি ড্রাইভার, নাকি গাড়ির মালিক?</h2>
          <p>নিজের প্রয়োজন অনুযায়ী বিনামূল্যে অ্যাকাউন্ট খুলুন।</p>
        </div>
        <Link className="btn light" to="/register">
          অ্যাকাউন্ট খুলুন <Plus size={18} />
        </Link>
      </section>
    </>
  );
}

function Service({ icon, title, desc, to, action }) {
  return (
    <article className="serviceCard">
      <div className="serviceIcon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <Link to={to}>{action} <span>→</span></Link>
    </article>
  );
}

function Auth({ mode, onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("driver");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    if (!isSupabaseConfigured) {
      setMsg("ডেটাবেস সংযোগ পাওয়া যায়নি।");
      return;
    }

    setBusy(true);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        onAuth(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role
            }
          }
        });

        if (error) throw error;

        if (data.session) {
          onAuth(data.user);
        } else {
          setMsg("নিবন্ধন সফল হয়েছে। ইমেইল যাচাই করে লগইন করুন।");
        }
      }
    } catch (err) {
      setMsg(err.message || "সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="authPage">
      <form className="authCard" onSubmit={submit}>
        <div className="serviceIcon"><UserRound /></div>
        <h1>{mode === "login" ? "অ্যাকাউন্টে প্রবেশ" : "নতুন অ্যাকাউন্ট খুলুন"}</h1>

        {mode === "register" && (
          <>
            <label>
              আপনার নাম
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="সম্পূর্ণ নাম"
              />
            </label>

            <label>
              অ্যাকাউন্টের ধরন
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="driver">ড্রাইভার</option>
                <option value="owner">গাড়ির মালিক</option>
              </select>
            </label>
          </>
        )}

        <label>
          ইমেইল
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </label>

        <label>
          পাসওয়ার্ড
          <input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="কমপক্ষে ৮ অক্ষর"
          />
        </label>

        <button className="btn primary full" disabled={busy}>
          {busy ? "অপেক্ষা করুন..." : mode === "login" ? "লগইন" : "নিবন্ধন করুন"}
        </button>

        {msg && <p className="formMsg">{msg}</p>}

        <p className="switchAuth">
          {mode === "login" ? "অ্যাকাউন্ট নেই? " : "আগে থেকেই অ্যাকাউন্ট আছে? "}
          <Link to={mode === "login" ? "/register" : "/login"}>
            {mode === "login" ? "নিবন্ধন করুন" : "লগইন করুন"}
          </Link>
        </p>
      </form>
    </main>
  );
}

function Listing({ kind }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const configs = {
    jobs: {
      title: "স্থায়ী ড্রাইভার চাকরি",
      sub: "নিয়মিত চাকরির সুযোগ খুঁজুন",
      table: "jobs",
      empty: "এখনো কোনো চাকরির বিজ্ঞপ্তি নেই।"
    },
    duties: {
      title: "বদলি ডিউটি",
      sub: "অস্থায়ী বদলি ড্রাইভারের কাজ খুঁজুন",
      table: "substitute_duties",
      empty: "এখনো কোনো বদলি ডিউটির বিজ্ঞপ্তি নেই।"
    },
    bookings: {
      title: "অস্থায়ী ড্রাইভার বুকিং",
      sub: "স্বল্প বা দীর্ঘ সময়ের জন্য ড্রাইভার খুঁজুন",
      table: "booking_requests",
      empty: "এখনো কোনো বুকিং অনুরোধ নেই।"
    }
  };

  const cfg = configs[kind];

  useEffect(() => {
    let active = true;

    async function loadItems() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from(cfg.table)
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!active) return;

      if (error) {
        setError("তথ্য আনা যায়নি: " + error.message);
      } else {
        setItems(data || []);
      }

      setLoading(false);
    }

    loadItems();

    return () => {
      active = false;
    };
  }, [cfg.table]);

  return (
    <main className="page">
      <div className="pageTitle">
        <div className="eyebrow dark">চাকরি ও কাজের তালিকা</div>
        <h1>{cfg.title}</h1>
        <p>{cfg.sub}</p>
      </div>

      <div className="toolbar">
        <div className="searchBox">
          <Search size={18} />
          <input placeholder="এলাকা বা কাজের ধরন লিখুন" />
        </div>
        <Link className="btn primary" to="/login">
          <Plus size={18} /> লগইন করুন
        </Link>
      </div>

      {loading ? (
        <p className="notice">তথ্য লোড হচ্ছে...</p>
      ) : error ? (
        <p className="notice">{error}</p>
      ) : items.length === 0 ? (
        <div className="empty">
          <ClipboardList size={34} />
          <h3>{cfg.empty}</h3>
          <p>নতুন বিজ্ঞপ্তি প্রকাশ হলে এখানে দেখা যাবে।</p>
        </div>
      ) : (
        <div className="listingGrid">
          {items.map(item => (
            <article className="listingCard" key={item.id}>
              <span className="status">চলমান</span>
              <h3>{item.title || item.vehicle_type || "ড্রাইভার প্রয়োজন"}</h3>
              <p><MapPin size={15} /> {item.location || "অবস্থান উল্লেখ নেই"}</p>
              <p>
                <Clock3 size={15} />
                {item.duty_date || item.start_at?.slice(0, 10) ||
                  item.created_at?.slice(0, 10) || "তারিখ উল্লেখ নেই"}
              </p>
              <strong>
                {item.salary || item.pay
                  ? `৳ ${item.salary || item.pay}`
                  : "পারিশ্রমিক আলোচনা সাপেক্ষে"}
              </strong>
              <p>{item.description || item.details || ""}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function OwnerPost({ user, kind }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    vehicle_type: "",
    location: "",
    salary: "",
    description: "",
    duty_date: "",
    start_time: "",
    end_time: "",
    pay: "",
    destination: "",
    start_at: "",
    duration: "",
    details: ""
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const configs = {
    jobs: { title: "স্থায়ী চাকরির বিজ্ঞপ্তি", table: "jobs" },
    duties: { title: "বদলি ডিউটির বিজ্ঞপ্তি", table: "substitute_duties" },
    bookings: { title: "ড্রাইভার বুকিং অনুরোধ", table: "booking_requests" }
  };

  const cfg = configs[kind];

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    if (getRole(user) !== "owner") {
      setMsg("এই সুবিধাটি শুধু গাড়ির মালিকদের জন্য।");
      return;
    }

    setBusy(true);

    try {
      let payload;

      if (kind === "jobs") {
        payload = {
          owner_id: user.id,
          title: form.title,
          vehicle_type: form.vehicle_type,
          location: form.location,
          salary: form.salary ? Number(form.salary) : null,
          description: form.description
        };
      } else if (kind === "duties") {
        payload = {
          owner_id: user.id,
          vehicle_type: form.vehicle_type,
          location: form.location,
          duty_date: form.duty_date,
          start_time: form.start_time || null,
          end_time: form.end_time || null,
          pay: form.pay ? Number(form.pay) : null,
          details: form.details
        };
      } else {
        const startDate = new Date(form.start_at);

        if (Number.isNaN(startDate.getTime())) {
          throw new Error("সঠিক তারিখ ও সময় নির্বাচন করুন।");
        }

        payload = {
          owner_id: user.id,
          vehicle_type: form.vehicle_type,
          location: form.location,
          destination: form.destination || null,
          start_at: startDate.toISOString(),
          duration: form.duration,
          pay: form.pay ? Number(form.pay) : null,
          details: form.details
        };
      }

      const { error } = await supabase
        .from(cfg.table)
        .insert(payload);

      if (error) throw error;

      setMsg("আপনার বিজ্ঞপ্তি প্রকাশ হয়েছে।");
      setTimeout(() => navigate(`/${kind}`), 1200);
    } catch (err) {
      setMsg(err.message || "পোস্ট করা যায়নি।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <div className="pageTitle">
        <div className="eyebrow dark">গাড়ির মালিকের জন্য</div>
        <h1>{cfg.title}</h1>
        <p>প্রয়োজনীয় তথ্য পূরণ করে বিজ্ঞপ্তি প্রকাশ করুন।</p>
      </div>

      <form className="authCard" onSubmit={submit}>
        {kind === "jobs" && (
          <label>
            চাকরির শিরোনাম
            <input
              name="title"
              value={form.title}
              onChange={change}
              required
              placeholder="যেমন: ব্যক্তিগত গাড়ির ড্রাইভার"
            />
          </label>
        )}

        <label>
          গাড়ির ধরন
          <select
            name="vehicle_type"
            value={form.vehicle_type}
            onChange={change}
            required
          >
            <option value="">গাড়ি নির্বাচন করুন</option>
            <option value="কার">কার</option>
            <option value="মাইক্রোবাস">মাইক্রোবাস</option>
            <option value="জিপ">জিপ</option>
            <option value="পিকআপ">পিকআপ</option>
            <option value="অন্যান্য">অন্যান্য</option>
          </select>
        </label>

        <label>
          কাজের এলাকা
          <input
            name="location"
            value={form.location}
            onChange={change}
            required
            placeholder="যেমন: বায়েজিদ, চট্টগ্রাম"
          />
        </label>

        {kind === "jobs" && (
          <>
            <label>
              মাসিক বেতন (টাকা)
              <input
                name="salary"
                type="number"
                min="0"
                value={form.salary}
                onChange={change}
                placeholder="যেমন: ১৫০০০"
              />
            </label>

            <label>
              কাজের বিবরণ
              <textarea
                name="description"
                value={form.description}
                onChange={change}
                rows={4}
                placeholder="বেতন, কর্মঘণ্টা ও অন্যান্য শর্ত লিখুন"
              />
            </label>
          </>
        )}

        {kind === "duties" && (
          <>
            <label>
              ডিউটির তারিখ
              <input
                name="duty_date"
                type="date"
                value={form.duty_date}
                onChange={change}
                required
              />
            </label>

            <label>
              শুরুর সময়
              <input
                name="start_time"
                type="time"
                value={form.start_time}
                onChange={change}
              />
            </label>

            <label>
              শেষের সময়
              <input
                name="end_time"
                type="time"
                value={form.end_time}
                onChange={change}
              />
            </label>

            <label>
              পারিশ্রমিক (টাকা)
              <input
                name="pay"
                type="number"
                min="0"
                value={form.pay}
                onChange={change}
              />
            </label>

            <label>
              ডিউটির বিবরণ
              <textarea
                name="details"
                value={form.details}
                onChange={change}
                rows={4}
                placeholder="ডিউটির বিস্তারিত লিখুন"
              />
            </label>
          </>
        )}

        {kind === "bookings" && (
          <>
            <label>
              গন্তব্য
              <input
                name="destination"
                value={form.destination}
                onChange={change}
                placeholder="কোথায় যেতে হবে?"
              />
            </label>

            <label>
              ডিউটি শুরুর তারিখ ও সময়
              <input
                name="start_at"
                type="datetime-local"
                value={form.start_at}
                onChange={change}
                required
              />
            </label>

            <label>
              কত সময়ের জন্য?
              <select
                name="duration"
                value={form.duration}
                onChange={change}
                required
              >
                <option value="">সময় নির্বাচন করুন</option>
                <option value="ঘণ্টাভিত্তিক">ঘণ্টাভিত্তিক</option>
                <option value="অর্ধদিবস">অর্ধদিবস</option>
                <option value="পূর্ণদিবস">পূর্ণদিবস</option>
                <option value="দৈনিক">দৈনিক</option>
                <option value="সাপ্তাহিক">সাপ্তাহিক</option>
                <option value="মাসিক">মাসিক</option>
                <option value="বিমানবন্দর যাতায়াত">বিমানবন্দর যাতায়াত</option>
              </select>
            </label>

            <label>
              পারিশ্রমিক (টাকা)
              <input
                name="pay"
                type="number"
                min="0"
                value={form.pay}
                onChange={change}
              />
            </label>

            <label>
              অতিরিক্ত নির্দেশনা
              <textarea
                name="details"
                value={form.details}
                onChange={change}
                rows={4}
                placeholder="প্রয়োজনীয় তথ্য লিখুন"
              />
            </label>
          </>
        )}

        <button className="btn primary full" disabled={busy}>
          {busy ? "প্রকাশ হচ্ছে..." : "বিজ্ঞপ্তি প্রকাশ করুন"}
        </button>

        {msg && <p className="formMsg">{msg}</p>}
      </form>
    </main>
  );
}

function Dashboard({ user }) {
  const role = getRole(user);

  return (
    <main className="page">
      <div className="pageTitle">
        <div className="eyebrow dark">আপনার অ্যাকাউন্ট</div>
        <h1>ড্যাশবোর্ড</h1>
        <p>স্বাগতম, {user?.user_metadata?.full_name || user?.email}</p>
      </div>

      <div className="dashboardGrid">
        <Link className="dashTile" to="/profile">
          <UserRound />
          <h3>আমার প্রোফাইল</h3>
          <p>নিজের তথ্য দেখুন ও পরিবর্তন করুন</p>
        </Link>

        {role === "owner" ? (
          <>
            <Link className="dashTile" to="/post/jobs">
              <BriefcaseBusiness />
              <h3>চাকরি পোস্ট</h3>
              <p>স্থায়ী ড্রাইভার নিয়োগ দিন</p>
            </Link>

            <Link className="dashTile" to="/post/duties">
              <ClipboardList />
              <h3>বদলি ডিউটি পোস্ট</h3>
              <p>অস্থায়ী ড্রাইভারের প্রয়োজন জানান</p>
            </Link>

            <Link className="dashTile" to="/post/bookings">
              <CarFront />
              <h3>ড্রাইভার বুকিং পোস্ট</h3>
              <p>ড্রাইভার বুকিংয়ের অনুরোধ দিন</p>
            </Link>
          </>
        ) : (
          <>
            <Link className="dashTile" to="/jobs">
              <BriefcaseBusiness />
              <h3>চাকরি খুঁজুন</h3>
              <p>স্থায়ী চাকরির বিজ্ঞপ্তি দেখুন</p>
            </Link>

            <Link className="dashTile" to="/duties">
              <ClipboardList />
              <h3>বদলি ডিউটি খুঁজুন</h3>
              <p>অস্থায়ী কাজের বিজ্ঞপ্তি দেখুন</p>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

function Profile({ user }) {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    bio: ""
  });

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, address, bio")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setMsg(error.message);
      } else if (data) {
        setForm({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          bio: data.bio || ""
        });
      }

      setLoading(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [user.id]);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update(form)
        .eq("id", user.id);

      if (error) throw error;

      setMsg("আপনার প্রোফাইল সংরক্ষণ হয়েছে।");
    } catch (err) {
      setMsg("তথ্য সংরক্ষণ হয়নি: " + err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <main className="page"><p>প্রোফাইল লোড হচ্ছে...</p></main>;
  }

  return (
    <main className="page">
      <div className="pageTitle">
        <div className="eyebrow dark">ব্যক্তিগত তথ্য</div>
        <h1>আমার প্রোফাইল</h1>
        <p>আপনার যোগাযোগ ও পরিচিতির তথ্য পূরণ করুন।</p>
      </div>

      <form className="authCard" onSubmit={save}>
        <label>
          সম্পূর্ণ নাম
          <input
            name="full_name"
            value={form.full_name}
            onChange={change}
            required
            placeholder="আপনার নাম"
          />
        </label>

        <label>
          মোবাইল নম্বর
          <input
            name="phone"
            value={form.phone}
            onChange={change}
            required
            placeholder="01XXXXXXXXX"
          />
        </label>

        <label>
          ঠিকানা
          <textarea
            name="address"
            value={form.address}
            onChange={change}
            rows={3}
            placeholder="আপনার বর্তমান ঠিকানা"
          />
        </label>

        <label>
          নিজের সম্পর্কে / অভিজ্ঞতা
          <textarea
            name="bio"
            value={form.bio}
            onChange={change}
            rows={5}
            placeholder="আপনার কাজের অভিজ্ঞতা ও দক্ষতা লিখুন"
          />
        </label>

        <button className="btn primary full" disabled={busy}>
          {busy ? "সংরক্ষণ হচ্ছে..." : "প্রোফাইল সংরক্ষণ করুন"}
        </button>

        {msg && <p className="formMsg">{msg}</p>}
      </form>
    </main>
  );
}

function Drivers() {
  return (
    <main className="page">
      <div className="pageTitle">
        <div className="eyebrow dark">ড্রাইভার ডিরেক্টরি</div>
        <h1>ড্রাইভার খুঁজুন</h1>
        <p>ড্রাইভারদের প্রোফাইল খোঁজার ব্যবস্থা পরবর্তী ধাপে যুক্ত হবে।</p>
      </div>

      <div className="empty">
        <UserRound size={34} />
        <h3>ড্রাইভার তালিকা প্রস্তুত হচ্ছে</h3>
        <p>ড্রাইভারদের প্রোফাইল প্রকাশের ব্যবস্থা এখনো তৈরি হয়নি।</p>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <b>Chattogram Driver Bazar</b>
        <p>চালক ও গাড়ির মালিকের জন্য একটি অনলাইন প্ল্যাটফর্ম।</p>
      </div>
      <small>© {new Date().getFullYear()} Chattogram Driver Bazar</small>
    </footer>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (active) {
        setUser(data.session?.user || null);
        setChecking(false);
      }
    }

    checkSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (checking) {
    return <main className="page"><p>লোড হচ্ছে...</p></main>;
  }

  return (
    <>
      <Header user={user} onLogout={logout} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/jobs" element={<Listing kind="jobs" />} />
        <Route path="/duties" element={<Listing kind="duties" />} />
        <Route path="/bookings" element={<Listing kind="bookings" />} />

        <Route path="/drivers" element={<Drivers />} />

        <Route
          path="/login"
          element={
            user
              ? <Dashboard user={user} />
              : <Auth mode="login" onAuth={setUser} />
          }
        />

        <Route
          path="/register"
          element={
            user
              ? <Dashboard user={user} />
              : <Auth mode="register" onAuth={setUser} />
          }
        />

        <Route
          path="/dashboard"
          element={
            user
              ? <Dashboard user={user} />
              : <Auth mode="login" onAuth={setUser} />
          }
        />

        <Route
          path="/profile"
          element={
            user
              ? <Profile user={user} />
              : <Auth mode="login" onAuth={setUser} />
          }
        />

        <Route
          path="/post/jobs"
          element={
            user && getRole(user) === "owner"
              ? <OwnerPost user={user} kind="jobs" />
              : <Auth mode="login" onAuth={setUser} />
          }
        />

        <Route
          path="/post/duties"
          element={
            user && getRole(user) === "owner"
              ? <OwnerPost user={user} kind="duties" />
              : <Auth mode="login" onAuth={setUser} />
          }
        />

        <Route
          path="/post/bookings"
          element={
            user && getRole(user) === "owner"
              ? <OwnerPost user={user} kind="bookings" />
              : <Auth mode="login" onAuth={setUser} />
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </>
  );
}
