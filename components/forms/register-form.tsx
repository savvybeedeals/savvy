"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, Globe, Loader2, CheckCircle2, XCircle, Eye, EyeOff, Search } from "lucide-react";

// القائمة الكاملة والشاملة لدول العالم ومفاتيح الاتصال مرتبة أبجدياً بصيغة Alpha-3
const COUNTRY_KEYS = [
  { code: "+93", country: "AFG", name: "Afghanistan" },
  { code: "+355", country: "ALB", name: "Albania" },
  { code: "+213", country: "DZA", name: "Algeria" },
  { code: "+1684", country: "ASM", name: "American Samoa" },
  { code: "+376", country: "AND", name: "Andorra" },
  { code: "+244", country: "AGO", name: "Angola" },
  { code: "+1264", country: "AIA", name: "Anguilla" },
  { code: "+1268", country: "ATG", name: "Antigua and Barbuda" },
  { code: "+54", country: "ARG", name: "Argentina" },
  { code: "+374", country: "ARM", name: "Armenia" },
  { code: "+297", country: "ABW", name: "Aruba" },
  { code: "+61", country: "AUS", name: "Australia" },
  { code: "+43", country: "AUT", name: "Austria" },
  { code: "+994", country: "AZE", name: "Azerbaijan" },
  { code: "+1242", country: "BHS", name: "Bahamas" },
  { code: "+973", country: "BHR", name: "Bahrain" },
  { code: "+880", country: "BGD", name: "Bangladesh" },
  { code: "+1246", country: "BRB", name: "Barbados" },
  { code: "+375", country: "BLR", name: "Belarus" },
  { code: "+32", country: "BEL", name: "Belgium" },
  { code: "+501", country: "BLZ", name: "Belize" },
  { code: "+229", country: "BEN", name: "Benin" },
  { code: "+1441", country: "BMU", name: "Bermuda" },
  { code: "+975", country: "BTN", name: "Bhutan" },
  { code: "+591", country: "BOL", name: "Bolivia" },
  { code: "+387", country: "BIH", name: "Bosnia and Herzegovina" },
  { code: "+267", country: "BWA", name: "Botswana" },
  { code: "+55", country: "BRA", name: "Brazil" },
  { code: "+1284", country: "VGB", name: "British Virgin Islands" },
  { code: "+673", country: "BRN", name: "Brunei" },
  { code: "+359", country: "BGR", name: "Bulgaria" },
  { code: "+226", country: "BFA", name: "Burkina Faso" },
  { code: "+257", country: "BDI", name: "Burundi" },
  { code: "+855", country: "KHM", name: "Cambodia" },
  { code: "+237", country: "CMR", name: "Cameroon" },
  { code: "+1", country: "CAN", name: "Canada" },
  { code: "+238", country: "CPV", name: "Cape Verde" },
  { code: "+1345", country: "CYM", name: "Cayman Islands" },
  { code: "+236", country: "CAF", name: "Central African Republic" },
  { code: "+235", country: "TCD", name: "Chad" },
  { code: "+56", country: "CHL", name: "Chile" },
  { code: "+86", country: "CHN", name: "China" },
  { code: "+57", country: "COL", name: "Colombia" },
  { code: "+269", country: "COM", name: "Comoros" },
  { code: "+242", country: "COG", name: "Congo" },
  { code: "+243", country: "COD", name: "Congo (DRC)" },
  { code: "+682", country: "COK", name: "Cook Islands" },
  { code: "+506", country: "CRI", name: "Costa Rica" },
  { code: "+225", country: "CIV", name: "Côte d'Ivoire" },
  { code: "+385", country: "HRV", name: "Croatia" },
  { code: "+53", country: "CUB", name: "Cuba" },
  { code: "+357", country: "CYP", name: "Cyprus" },
  { code: "+420", country: "CZE", name: "Czechia" },
  { code: "+45", country: "DNK", name: "Denmark" },
  { code: "+253", country: "DJI", name: "Djibouti" },
  { code: "+1767", country: "DMA", name: "Dominica" },
  { code: "+1809", country: "DOM", name: "Dominican Republic" },
  { code: "+593", country: "ECU", name: "Ecuador" },
  { code: "+20", country: "EGY", name: "Egypt" },
  { code: "+503", country: "SLV", name: "El Salvador" },
  { code: "+240", country: "GNQ", name: "Equatorial Guinea" },
  { code: "+291", country: "ERI", name: "Eritrea" },
  { code: "+372", country: "EST", name: "Estonia" },
  { code: "+268", country: "SWZ", name: "Eswatini" },
  { code: "+251", country: "ETH", name: "Ethiopia" },
  { code: "+1345", country: "FLK", name: "Falkland Islands" },
  { code: "+298", country: "FRO", name: "Faroe Islands" },
  { code: "+679", country: "FJI", name: "Fiji" },
  { code: "+358", country: "FIN", name: "Finland" },
  { code: "+33", country: "FRA", name: "France" },
  { code: "+594", country: "GUF", name: "French Guiana" },
  { code: "+689", country: "PYF", name: "French Polynesia" },
  { code: "+241", country: "GAB", name: "Gabon" },
  { code: "+220", country: "GMB", name: "Gambia" },
  { code: "+995", country: "GEO", name: "Georgia" },
  { code: "+49", country: "DEU", name: "Germany" },
  { code: "+233", country: "GHA", name: "Ghana" },
  { code: "+350", country: "GIB", name: "Gibraltar" },
  { code: "+30", country: "GRC", name: "Greece" },
  { code: "+299", country: "GRL", name: "Greenland" },
  { code: "+1473", country: "GRD", name: "Grenada" },
  { code: "+590", country: "GLP", name: "Guadeloupe" },
  { code: "+1671", rounded: "GUM", name: "Guam" },
  { code: "+502", country: "GTM", name: "Guatemala" },
  { code: "+224", country: "GIN", name: "Guinea" },
  { code: "+245", country: "GNB", name: "Guinea-Bissau" },
  { code: "+592", country: "GUY", name: "Guyana" },
  { code: "+509", country: "HTI", name: "Haiti" },
  { code: "+504", country: "HND", name: "Honduras" },
  { code: "+852", country: "HKG", name: "Hong Kong" },
  { code: "+36", country: "HUN", name: "Hungary" },
  { code: "+354", country: "ISL", name: "Iceland" },
  { code: "+91", country: "IND", name: "India" },
  { code: "+62", country: "IDN", name: "Indonesia" },
  { code: "+98", country: "IRN", name: "Iran" },
  { code: "+964", country: "IRQ", name: "Iraq" },
  { code: "+353", country: "IRL", name: "Ireland" },
  { code: "+972", country: "ISR", name: "Israel" },
  { code: "+39", country: "ITA", name: "Italy" },
  { code: "+1876", country: "JAM", name: "Jamaica" },
  { code: "+81", country: "JPN", name: "Japan" },
  { code: "+962", country: "JOR", name: "Jordan" },
  { code: "+7", country: "KAZ", name: "Kazakhstan" },
  { code: "+254", country: "KEN", name: "Kenya" },
  { code: "+686", country: "KIR", name: "Kiribati" },
  { code: "+965", country: "KWT", name: "Kuwait" },
  { code: "+996", country: "KGZ", name: "Kyrgyzstan" },
  { code: "+856", country: "LAO", name: "Laos" },
  { code: "+371", country: "LVA", name: "Latvia" },
  { code: "+961", country: "LBN", name: "Lebanon" },
  { code: "+266", country: "LSO", name: "Lesotho" },
  { code: "+231", country: "LBR", name: "Liberia" },
  { code: "+218", country: "LBY", name: "Libya" },
  { code: "+423", country: "LIE", name: "Liechtenstein" },
  { code: "+370", country: "LTU", name: "Lithuania" },
  { code: "+352", country: "LUX", name: "Luxembourg" },
  { code: "+853", country: "MAC", name: "Macau" },
  { code: "+389", country: "MKD", name: "North Macedonia" },
  { code: "+261", country: "MDG", name: "Madagascar" },
  { code: "+265", country: "MWI", name: "Malawi" },
  { code: "+60", country: "MYS", name: "Malaysia" },
  { code: "+960", country: "MDV", name: "Maldives" },
  { code: "+223", country: "MLI", name: "Mali" },
  { code: "+356", country: "MLT", name: "Malta" },
  { code: "+692", country: "MHL", name: "Marshall Islands" },
  { code: "+596", country: "MTQ", name: "Martinique" },
  { code: "+222", country: "MRT", name: "Mauritania" },
  { code: "+230", country: "MUS", name: "Mauritius" },
  { code: "+262", country: "MYT", name: "Mayotte" },
  { code: "+52", country: "MEX", name: "Mexico" },
  { code: "+691", country: "FSM", name: "Micronesia" },
  { code: "+373", country: "MDA", name: "Moldova" },
  { code: "+377", country: "MCO", name: "Monaco" },
  { code: "+976", country: "MNG", name: "Mongolia" },
  { code: "+382", country: "MNE", name: "Montenegro" },
  { code: "+1664", country: "MSR", name: "Montserrat" },
  { code: "+212", country: "MAR", name: "Morocco" },
  { code: "+258", country: "MOZ", name: "Mozambique" },
  { code: "+95", country: "MMR", name: "Myanmar" },
  { code: "+264", country: "NAM", name: "Namibia" },
  { code: "+674", country: "NRU", name: "Nauru" },
  { code: "+977", country: "NPL", name: "Nepal" },
  { code: "+31", country: "NLD", name: "Netherlands" },
  { code: "+687", country: "NCL", name: "New Caledonia" },
  { code: "+64", country: "NZL", name: "New Zealand" },
  { code: "+505", country: "NIC", name: "Nicaragua" },
  { code: "+227", country: "NER", name: "Niger" },
  { code: "+234", country: "NGA", name: "Nigeria" },
  { code: "+683", country: "NIU", name: "Niue" },
  { code: "+1670", country: "MNP", name: "Northern Mariana Islands" },
  { code: "+47", country: "NOR", name: "Norway" },
  { code: "+968", country: "OMN", name: "Oman" },
  { code: "+92", country: "PAK", name: "Pakistan" },
  { code: "+680", country: "PLW", name: "Palau" },
  { code: "+970", country: "PSE", name: "Palestine" },
  { code: "+507", country: "PAN", name: "Panama" },
  { code: "+675", country: "PNG", name: "Papua New Guinea" },
  { code: "+595", country: "PRY", name: "Paraguay" },
  { code: "+51", country: "PER", name: "Peru" },
  { code: "+63", country: "PHL", name: "Philippines" },
  { code: "+48", country: "POL", name: "Poland" },
  { code: "+351", country: "PRT", name: "Portugal" },
  { code: "+1787", country: "PRI", name: "Puerto Rico" },
  { code: "+974", country: "QAT", name: "Qatar" },
  { code: "+262", country: "REU", name: "Réunion" },
  { code: "+40", country: "ROU", name: "Romania" },
  { code: "+7", country: "RUS", name: "Russia" },
  { code: "+250", country: "RWA", name: "Rwanda" },
  { code: "+1869", country: "KNA", name: "St. Kitts and Nevis" },
  { code: "+1758", country: "LCA", name: "St. Lucia" },
  { code: "+1784", country: "VCT", name: "St. Vincent" },
  { code: "+685", country: "WSM", name: "Samoa" },
  { code: "+378", country: "SMR", name: "San Marino" },
  { code: "+239", country: "STP", name: "São Tomé and Príncipe" },
  { code: "+966", country: "SAU", name: "Saudi Arabia" },
  { code: "+221", country: "SEN", name: "Senegal" },
  { code: "+381", country: "SRB", name: "Serbia" },
  { code: "+248", country: "SYC", name: "Seychelles" },
  { code: "+232", country: "SLE", name: "Sierra Leone" },
  { code: "+65", country: "SGP", name: "Singapore" },
  { code: "+421", country: "SVK", name: "Slovakia" },
  { code: "+386", country: "SVN", name: "Slovenia" },
  { code: "+677", country: "SLB", name: "Solomon Islands" },
  { code: "+252", country: "SOM", name: "Somalia" },
  { code: "+27", country: "ZAF", name: "South Africa" },
  { code: "+82", country: "KOR", name: "South Korea" },
  { code: "+211", country: "SSD", name: "South Sudan" },
  { code: "+34", country: "ESP", name: "Spain" },
  { code: "+94", country: "LKA", name: "Sri Lanka" },
  { code: "+249", country: "SDN", name: "Sudan" },
  { code: "+597", country: "SUR", name: "Suriname" },
  { code: "+46", country: "SWE", name: "Sweden" },
  { code: "+41", country: "CHE", name: "Switzerland" },
  { code: "+963", country: "SYR", name: "Syria" },
  { code: "+886", country: "TWN", name: "Taiwan" },
  { code: "+992", country: "TJK", name: "Tajikistan" },
  { code: "+255", country: "TZA", name: "Tanzania" },
  { code: "+66", country: "THA", name: "Thailand" },
  { code: "+228", country: "TGO", name: "Togo" },
  { code: "+690", country: "TKL", name: "Tokelau" },
  { code: "+676", country: "TON", name: "Tonga" },
  { code: "+1868", country: "TTO", name: "Trinidad and Tobago" },
  { code: "+216", country: "TUN", name: "Tunisia" },
  { code: "+90", country: "TUR", name: "Turkey" },
  { code: "+993", country: "TKM", name: "Turkmenistan" },
  { code: "+1649", country: "TCA", name: "Turks and Caicos" },
  { code: "+688", country: "TUV", name: "Tuvalu" },
  { code: "+256", country: "UGA", name: "Uganda" },
  { code: "+380", country: "UKR", name: "Ukraine" },
  { code: "+971", country: "UAE", name: "United Arab Emirates" },
  { code: "+44", country: "GBR", name: "United Kingdom" },
  { code: "+1", country: "USA", name: "United States" },
  { code: "+598", country: "URY", name: "Uruguay" },
  { code: "+998", country: "UZB", name: "Uzbekistan" },
  { code: "+678", country: "VUT", name: "Vanuatu" },
  { code: "+58", country: "VEN", name: "Venezuela" },
  { code: "+84", country: "VNM", name: "Vietnam" },
  { code: "+1340", country: "VIR", name: "Virgin Islands (US)" },
  { code: "+967", country: "YEM", name: "Yemen" },
  { code: "+260", country: "ZMB", name: "Zambia" },
  { code: "+263", country: "ZWE", name: "Zimbabwe" }
];

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryKey: "USA", 
    phoneNumber: "",
    country: "United States",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showKeyDropdown, setShowKeyDropdown] = useState(false);
  const [keySearch, setKeySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const [activeKeyIndex, setActiveKeyIndex] = useState(-1);
  const [activeCountryIndex, setActiveCountryIndex] = useState(-1);

  const keyDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const keyItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const countryItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const currentKeyObj = COUNTRY_KEYS.find(k => k.country === formData.countryKey) || { country: "USA", code: "+1" };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (keyDropdownRef.current && !keyDropdownRef.current.contains(event.target as Node)) {
        setShowKeyDropdown(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const newErrors = { ...errors };

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    } else {
      newErrors.email = "";
    }

    if (formData.phoneNumber && !/^\d{7,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone must be 7-15 digits";
    } else {
      newErrors.phoneNumber = "";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else {
      newErrors.password = "";
    }

    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    } else {
      newErrors.confirmPassword = "";
    }

    setErrors(newErrors);
  }, [formData]);

  const filteredCountryKeys = COUNTRY_KEYS.filter((k) =>
    (k.code && k.code.includes(keySearch)) ||
    (k.country && k.country.toLowerCase().includes(keySearch.toLowerCase())) ||
    (k.name && k.name.toLowerCase().includes(keySearch.toLowerCase()))
  );

  const filteredCountries = COUNTRY_KEYS.filter((k) =>
    k.name && k.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  useEffect(() => {
    setActiveKeyIndex(-1);
  }, [keySearch]);

  useEffect(() => {
    setActiveCountryIndex(-1);
  }, [countrySearch]);

  useEffect(() => {
    if (activeKeyIndex >= 0 && keyItemsRef.current[activeKeyIndex]) {
      keyItemsRef.current[activeKeyIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeKeyIndex]);

  useEffect(() => {
    if (activeCountryIndex >= 0 && countryItemsRef.current[activeCountryIndex]) {
      countryItemsRef.current[activeCountryIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeCountryIndex]);

  const handleKeyKeyDown = (e: React.KeyboardEvent) => {
    if (!showKeyDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveKeyIndex((prev) => (prev + 1 < filteredCountryKeys.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveKeyIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredCountryKeys.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeKeyIndex >= 0 && filteredCountryKeys[activeKeyIndex]) {
        const selected = filteredCountryKeys[activeKeyIndex];
        setFormData({ ...formData, countryKey: selected.country || "", country: selected.name });
        setShowKeyDropdown(false);
      }
    } else if (e.key === "Escape") {
      setShowKeyDropdown(false);
    }
  };

  const handleCountryKeyDown = (e: React.KeyboardEvent) => {
    if (!showCountryDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveCountryIndex((prev) => (prev + 1 < filteredCountries.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveCountryIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredCountries.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeCountryIndex >= 0 && filteredCountries[activeCountryIndex]) {
        const selected = filteredCountries[activeCountryIndex];
        setFormData({ ...formData, country: selected.name, countryKey: selected.country || "" });
        setShowCountryDropdown(false);
      }
    } else if (e.key === "Escape") {
      setShowCountryDropdown(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    setGlobalSuccess("");

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.country.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setGlobalError("All fields are required. Please fill in all the blanks.");
      return;
    }

    if (Object.values(errors).some((err) => err !== "")) {
      setGlobalError("Please fix the validation errors first.");
      return;
    }

    setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: `${currentKeyObj.code}${formData.phoneNumber}`,
          country: formData.country,
        },
      },
    });

    if (authError) {
      setGlobalError(authError.message);
      setLoading(false);
    } else {
      if (data.user && data.user.identities?.length === 0) {
        setGlobalError("This email is already registered.");
        return;
      } else {
        setGlobalSuccess("A verification code link has been sent to your email! Please check your inbox to activate your account. ✉️");
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleRegister} className="w-full max-w-xl p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm space-y-4">
      {globalError && <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2"><XCircle size={16} /> {globalError}</div>}
      {globalSuccess && <div className="p-4 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2"><CheckCircle2 size={16} /> {globalSuccess}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider pl-1">First Name</label>
          <div className="relative flex items-center">
            <User size={15} className="absolute left-4 text-slate-400" />
            <input
              type="text" required placeholder="John"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-400"
              value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider pl-1">Last Name</label>
          <div className="relative flex items-center">
            <User size={15} className="absolute left-4 text-slate-400" />
            <input
              type="text" required placeholder="Doe"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-amber-400"
              value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider pl-1">Phone Number</label>
          <div className="relative flex items-center">
            <Phone size={15} className="absolute left-4 text-slate-400" />
            
            <div ref={keyDropdownRef} className="absolute left-10 z-20 flex items-center" onKeyDown={handleKeyKeyDown}>
              <button
                type="button"
                className="bg-slate-100/80 hover:bg-slate-200 px-2 py-1 rounded-md text-xs font-black text-slate-700 flex items-center gap-0.5 transition-all"
                onClick={() => {
                  setShowKeyDropdown(!showKeyDropdown);
                  setKeySearch("");
                }}
              >
                {currentKeyObj.country} ({currentKeyObj.code})
              </button>

              {showKeyDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-150 rounded-xl shadow-xl p-2 space-y-2">
                  <div className="relative flex items-center bg-slate-50 rounded-lg px-2 border border-slate-200 focus-within:border-amber-400">
                    <Search size={12} className="text-slate-400 mr-1.5" />
                    <input
                      type="text"
                      placeholder="Search key or text..."
                      className="w-full bg-transparent py-1.5 text-xs font-semibold focus:outline-none"
                      value={keySearch}
                      onChange={(e) => setKeySearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                    {filteredCountryKeys.length > 0 ? (
                      filteredCountryKeys.map((k, index) => (
                        <button
                          key={`${k.country}-${k.code}`}
                          ref={(el) => { keyItemsRef.current[index] = el; }}
                          type="button"
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${formData.countryKey === k.country ? "bg-amber-50 text-amber-900 font-bold" : index === activeKeyIndex ? "bg-slate-100 text-slate-900 font-semibold" : "hover:bg-slate-50 text-slate-700"}`}
                          onClick={() => {
                            setFormData({ ...formData, countryKey: k.country || "", country: k.name });
                            setShowKeyDropdown(false);
                          }}
                        >
                          <span className="truncate max-w-[140px]">{k.name}</span>
                          <span className="text-slate-400 font-bold">{k.country} ({k.code})</span>
                        </button>
                      ))
                    ) : (
                      <p className="text-[10px] text-slate-400 text-center py-2 font-semibold">No results found</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <input
              type="tel" required placeholder="1012345678"
              className={`w-full pl-32 pr-4 py-3 bg-slate-50 border ${errors.phoneNumber ? "border-red-400" : "border-slate-200 focus:border-amber-400"} rounded-xl text-sm font-semibold focus:outline-none`}
              value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
          {errors.phoneNumber && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.phoneNumber}</p>}
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider pl-1">Country</label>
          <div ref={countryDropdownRef} className="relative" onKeyDown={handleCountryKeyDown}>
            <Globe size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            
            <button
              type="button"
              className="w-full text-left pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-amber-400 cursor-pointer flex items-center justify-between transition-all"
              onClick={() => {
                setShowCountryDropdown(!showCountryDropdown);
                setCountrySearch("");
              }}
            >
              <span>{formData.country}</span>
              <span className="text-xs text-slate-400">▼</span>
            </button>

            {showCountryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-150 rounded-2xl shadow-2xl p-2 space-y-2 z-30">
                <div className="relative flex items-center bg-slate-50 rounded-xl px-3 border border-slate-200 focus-within:border-amber-400">
                  <Search size={14} className="text-slate-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Type to search country instantly..."
                    className="w-full bg-transparent py-2 text-xs font-semibold focus:outline-none"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-52 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((k, index) => (
                      <button
                        key={`name-${k.name}`}
                        ref={(el) => { countryItemsRef.current[index] = el; }}
                        type="button"
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${formData.country === k.name ? "bg-amber-50 text-amber-900" : index === activeCountryIndex ? "bg-slate-100 text-slate-900" : "hover:bg-slate-50 text-slate-700"}`}
                        onClick={() => {
                          setFormData({ ...formData, country: k.name, countryKey: k.country || "" });
                          setShowCountryDropdown(false);
                        }}
                      >
                        {k.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4 font-medium">No countries found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider pl-1">Email Address</label>
        <div className="relative flex items-center">
          <Mail size={15} className="absolute left-4 text-slate-400" />
          <input
            type="email" required placeholder="you@example.com"
            className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.email ? "border-red-400" : "border-slate-200 focus:border-amber-400"} rounded-xl text-sm font-semibold focus:outline-none`}
            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        {errors.email && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-600 uppercase tracking-wider pl-1">Password</label>
        <div className="relative flex items-center">
          <Lock size={15} className="absolute left-4 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"} required placeholder="••••••••"
            className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${errors.password ? "border-red-400" : "border-slate-200 focus:border-amber-400"} rounded-xl text-sm font-semibold focus:outline-none`}
            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="button" className="absolute right-4 text-slate-400 hover:text-amber-500" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.password}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-600 tracking-wider uppercase pl-1">Confirm Password</label>
        <div className="relative flex items-center">
          <Lock size={15} className="absolute left-4 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"} required placeholder="••••••••"
            className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${errors.confirmPassword ? "border-red-400" : "border-slate-200 focus:border-amber-400"} rounded-xl text-sm font-semibold focus:outline-none`}
            value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <button type="button" className="absolute right-4 text-slate-400 hover:text-amber-500" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}