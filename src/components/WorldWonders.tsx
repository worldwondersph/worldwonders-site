"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

// -------------------------------- Types --------------------------------
interface PackageItem {
  id: string;
  title: string;
  destination: string;
  days: number;
  nights: number;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  currency: "PHP";
  rating: number;
  slots: number;
  thumb: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: string[];
  departures: string[]; // ISO dates
}

// ----------------------------- Mock data (MVP) -----------------------------
const CATALOG: PackageItem[] = [
  {
    id: "hk-wonders-3d2n",
    title: "Hong Kong Wonders (3D2N)",
    destination: "Hong Kong",
    days: 3,
    nights: 2,
    price: 15888,
    oldPrice: 18999,
    discountPercent: 16,
    currency: "PHP",
    rating: 4.7,
    slots: 20,
    thumb:
      "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1600&auto=format&fit=crop",
    highlights: [
      "Disneyland or Peak Tram option",
      "City tour with local guide",
      "Airport transfers",
    ],
    inclusions: [
      "2 nights hotel (twin share)",
      "Daily breakfast",
      "Roundtrip airport transfers",
      "Half-day city tour",
    ],
    exclusions: ["Flights unless selected", "Personal expenses", "Tips"],
    itinerary: [
      "Day 1: Arrival • Hotel check-in • Free time",
      "Day 2: City tour • Optional Disneyland/Peak Tram",
      "Day 3: Checkout • Airport transfer",
    ],
    departures: ["2025-10-05", "2025-10-19", "2025-11-02", "2025-12-07"],
  },
  {
    id: "jp-tokyo-osaka-5d4n",
    title: "Tokyo + Osaka Express (5D4N)",
    destination: "Japan",
    days: 5,
    nights: 4,
    price: 44888,
    oldPrice: 48888,
    discountPercent: 8,
    currency: "PHP",
    rating: 4.9,
    slots: 12,
    thumb:
      "https://images.unsplash.com/photo-1518544801976-3e188ea9a38a?q=80&w=1600&auto=format&fit=crop",
    highlights: [
      "Shinkansen experience",
      "Universal Studios Japan (optional)",
      "Breakfasts included",
    ],
    inclusions: [
      "4 nights hotel (twin share)",
      "Daily breakfast",
      "JR base tickets (select routes)",
    ],
    exclusions: ["International flights", "Lunch/Dinner", "Visa fees"],
    itinerary: [
      "Day 1: Arrival Tokyo",
      "Day 2: Tokyo highlights (Senso-ji, Shibuya)",
      "Day 3: Tokyo → Osaka via Shinkansen",
      "Day 4: Osaka • USJ optional",
      "Day 5: Departure",
    ],
    departures: ["2025-10-12", "2025-11-09", "2025-12-14"],
  },
];

// -------------------------------- Utilities --------------------------------
function formatPeso(value: number): string {
  return value.toLocaleString("en-PH", { maximumFractionDigits: 0 });
}
function Peso({ value }: { value: number }) {
  return <span>₱{formatPeso(value)}</span>;
}
function classNames(...arr: Array<string | false | undefined>): string {
  return arr.filter(Boolean).join(" ");
}
function useInterval(callback: () => void, delay: number) {
  const savedRef = useRef(callback);
  useEffect(() => {
    savedRef.current = callback;
  }, [callback]);
  useEffect(() => {
    const id = setInterval(() => savedRef.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// ------------------------------ Main Component ------------------------------
export default function WorldWondersBookingMVP() {
  // filters & UI state
  const [q, setQ] = useState("");
  const [dest, setDest] = useState("All");
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sort, setSort] = useState("popular");
  const [openId, setOpenId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [inquireId, setInquireId] = useState<string | null>(null);

  // booking form
  const [date, setDate] = useState("");
  const [pax, setPax] = useState(2);
  const [leadName, setLeadName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // derived lists
  const destinations = useMemo(
    () => ["All", ...Array.from(new Set(CATALOG.map((c) => c.destination)))],
    []
  );
  const filtered = useMemo(() => {
    let rows = CATALOG.filter((c) =>
      (c.title + c.destination).toLowerCase().includes(q.toLowerCase())
    );
    if (dest !== "All") rows = rows.filter((c) => c.destination === dest);
    if (maxPrice) rows = rows.filter((c) => c.price <= maxPrice);
    if (sort === "price-asc") rows = rows.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") rows = rows.sort((a, b) => b.price - a.price);
    if (sort === "popular") rows = rows.sort((a, b) => b.rating - a.rating);
    return rows;
  }, [q, dest, maxPrice, sort]);
  const discounted = useMemo(
    () => CATALOG.filter((c) => (c.discountPercent || 0) > 0),
    []
  );

  // carousel
  const [slide, setSlide] = useState(0);
  useInterval(() => setSlide((s) => (s + 1) % discounted.length), 4500);

  // handlers
  function resetForm() {
    setDate("");
    setPax(2);
    setLeadName("");
    setEmail("");
    setPhone("");
    setNote("");
    setAgreed(false);
  }
  function submitReservation(pkgId: string) {
    console.log("Reservation payload:", { pkgId, date, pax, leadName, email, phone, note });
    setSuccess(
      `Thanks, ${leadName || "Guest"}! Your reservation for ${pkgId} was received.`
    );
    setOpenId(null);
    resetForm();
  }
  function submitInquiry(pkgId: string, quick: { name?: string; contact: string }) {
    console.log("Inquiry payload:", { pkgId, ...quick });
    setSuccess(`Got it! We’ll reach out about ${pkgId} via ${quick.contact}.`);
    setInquireId(null);
  }

  // render
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-orange-600 text-white text-sm py-2 text-center">
        🔥 Flash Deals today — use code WOWTRIP300. No prepayment needed!
      </div>

      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="font-bold text-xl">Wandr</h1>
          <nav className="hidden md:flex gap-4 text-sm">
            <a href="#packages">Packages</a>
            <a href="#visa">Visa Assistance</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Carousel */}
      <section className="max-w-7xl mx-auto p-4">
        <div className="relative h-72 rounded-xl overflow-hidden bg-black text-white">
          {discounted.map((pkg, i) => (
            <div
              key={pkg.id}
              className={classNames(
                "absolute inset-0 transition-opacity duration-700",
                i === slide ? "opacity-100" : "opacity-0"
              )}
            >
              <img src={pkg.thumb} alt={pkg.title} className="h-full w-full object-cover opacity-70"/>
              <div className="absolute bottom-6 left-6">
                <h2 className="text-2xl font-bold">{pkg.title}</h2>
                <p className="text-sm">{pkg.highlights.join(" • ")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages Grid */}
      <section id="packages" className="max-w-7xl mx-auto p-4">
        <h3 className="text-xl font-bold mb-4">Featured Packages</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((pkg) => (
            <div key={pkg.id} className="border rounded-xl bg-white shadow p-3">
              <img src={pkg.thumb} alt={pkg.title} className="h-32 w-full object-cover rounded"/>
              <div className="mt-2 font-semibold">{pkg.title}</div>
              <div className="text-sm text-neutral-600">{pkg.destination}</div>
              <div className="font-bold text-blue-700"><Peso value={pkg.price}/></div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setInquireId(pkg.id)} className="bg-neutral-900 text-white px-3 py-1 rounded">Inquire</button>
                <button onClick={() => setOpenId(pkg.id)} className="bg-blue-600 text-white px-3 py-1 rounded">Reserve</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visa Assistance */}
      <section id="visa" className="max-w-7xl mx-auto p-4">
        <h3 className="text-xl font-bold mb-2">Visa Assistance & Requirements</h3>
        <p className="text-sm text-neutral-600 mb-2">Quickly check what you need and request help.</p>
        <select className="border rounded px-2 py-1 mb-2">
          <option>Philippine Passport</option>
          <option>Chinese Passport with ACR I-Card</option>
        </select>
        <select className="border rounded px-2 py-1 mb-2">
          <option>Japan</option>
          <option>Korea</option>
          <option>Singapore</option>
        </select>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto p-4 bg-white rounded-xl shadow mt-6">
        <h3 className="text-xl font-bold mb-2">Contact Us</h3>
        <p>Email: hello@worldwonders.ph</p>
        <p>Phone: +63 917 000 0000</p>
        <p>Address: Quezon City, Philippines</p>
      </section>

      <footer className="bg-neutral-900 text-white text-center py-4 mt-6">
        © {new Date().getFullYear()} World Wonders Travel & Tours Inc.
      </footer>

      {/* Inquiry Modal */}
      {inquireId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl">
            <h4 className="font-semibold mb-2">Quick Inquiry</h4>
            <input className="border rounded px-2 py-1 mb-2 w-full" placeholder="Your name"/>
            <input className="border rounded px-2 py-1 mb-2 w-full" placeholder="WhatsApp/Viber or Email"/>
            <button onClick={() => submitInquiry(inquireId, { contact: "demo" })} className="bg-blue-600 text-white px-3 py-1 rounded">Send</button>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {openId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h4 className="font-semibold mb-2">Reserve Slot</h4>
            <input type="date" className="border rounded px-2 py-1 mb-2 w-full" value={date} onChange={(e) => setDate(e.target.value)}/>
            <input type="number" className="border rounded px-2 py-1 mb-2 w-full" value={pax} onChange={(e) => setPax(parseInt(e.target.value || "1"))}/>
            <input className="border rounded px-2 py-1 mb-2 w-full" placeholder="Lead guest name" value={leadName} onChange={(e) => setLeadName(e.target.value)}/>
            <input className="border rounded px-2 py-1 mb-2 w-full" placeholder="WhatsApp/Viber" value={phone} onChange={(e) => setPhone(e.target.value)}/>
            <label className="text-sm"><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mr-1"/>Agree to Terms</label>
            <button onClick={() => submitReservation(openId)} disabled={!agreed} className="bg-blue-600 text-white px-3 py-1 rounded mt-2">Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
}
