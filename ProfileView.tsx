import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryIcon } from '../components/CategoryIcon';
import { loginUser, registerUser, updateUserProfile, recoverPassword } from '../api';
import { UserRole } from '../types';
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  Tractor,
  Truck,
  ShieldCheck,
  Edit,
  Save,
  LogOut,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Lock,
  RotateCcw
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    categories,
    showToast,
    switchDemoRole,
    setShowBackendInfoModal
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover'>('login');

  // Form states for login/register
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState<UserRole>('farmer');
  const [villageInput, setVillageInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [districtInput, setDistrictInput] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('आपकी जन्मभूमि / पसंदीदा गाँव?');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Editing profile states
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editVillage, setEditVillage] = useState(currentUser?.village || '');
  const [editCity, setEditCity] = useState(currentUser?.city || '');
  const [editDistrict, setEditDistrict] = useState(currentUser?.district || '');
  const [editLocation, setEditLocation] = useState(currentUser?.location || '');
  const [editSkills, setEditSkills] = useState<string[]>(currentUser?.skills || []);
  const [editServices, setEditServices] = useState<string[]>(currentUser?.servicesOffered || []);
  const [editExp, setEditExp] = useState(String(currentUser?.experienceYears || '2'));
  const [editWage, setEditWage] = useState(String(currentUser?.expectedWage || '650'));
  const [editBio, setEditBio] = useState(currentUser?.bio || '');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!phoneInput) {
      setAuthError('कृपया 10 अंकों का मोबाइल नंबर दर्ज करें');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await loginUser(phoneInput, passwordInput);
      setCurrentUser(res.user);
      showToast(res.message, 'success');
      setIsEditing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'लॉगिन विफल';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!nameInput || !phoneInput || !passwordInput) {
      setAuthError('कृपया नाम, मोबाइल नंबर और पासवर्ड अवश्य भरें');
      return;
    }
    if (passwordInput.length < 4) {
      setAuthError('पासवर्ड कम से कम 4 अक्षरों का होना चाहिए');
      return;
    }
    setAuthLoading(true);
    try {
      const locationFull = [villageInput, cityInput, districtInput].filter(Boolean).join(', ') || 'भारत';
      const res = await registerUser({
        name: nameInput,
        phone: phoneInput,
        role: roleInput,
        village: villageInput,
        city: cityInput,
        district: districtInput,
        location: locationFull,
        skills: editSkills,
        servicesOffered: editServices,
        experienceYears: Number(editExp) || 1,
        expectedWage: Number(editWage) || 600,
        bio: editBio,
        password: passwordInput,
        securityQuestion,
        securityAnswer
      });
      setCurrentUser(res.user);
      showToast(res.message, 'success');
      setIsEditing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'पंजीकरण विफल';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!phoneInput || !newPasswordInput) {
      setAuthError('कृपया मोबाइल नंबर और नया पासवर्ड भरें');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await recoverPassword(phoneInput, securityAnswer, newPasswordInput);
      showToast(res.message, 'success');
      setAuthMode('login');
      setPasswordInput(newPasswordInput);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'पासवर्ड रीसेट विफल';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    try {
      const locFull = [editVillage, editCity, editDistrict].filter(Boolean).join(', ') || editLocation;
      const res = await updateUserProfile(currentUser.id, {
        name: editName,
        village: editVillage,
        city: editCity,
        district: editDistrict,
        location: locFull,
        skills: editSkills,
        servicesOffered: editServices,
        experienceYears: Number(editExp),
        expectedWage: Number(editWage),
        bio: editBio
      });
      setCurrentUser(res.user);
      setIsEditing(false);
      showToast(res.message, 'success');
    } catch {
      showToast('प्रोफाइल सेव करने में समस्या हुई', 'error');
    }
  };

  const toggleSkill = (skill: string) => {
    setEditSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('लॉगआउट सफल हुआ', 'info');
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'farmer':
        return '🌾 किसान (Farmer)';
      case 'worker':
        return '👷 मजदूर / कारीगर (Worker)';
      case 'employer':
        return '💼 काम देने वाला (Employer)';
      case 'machinery_provider':
        return '🚜 वाहन व कृषि मशीनरी प्रदाता';
      case 'admin':
        return '🛡️ मुख्य व्यवस्थापक (Admin)';
      default:
        return 'उपयोगकर्ता';
    }
  };

  return (
    <div className="pb-28 max-w-lg mx-auto p-4 space-y-4 animate-in fade-in duration-150">
      
      {/* If user is logged in */}
      {currentUser ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white text-emerald-800 font-black text-2xl flex items-center justify-center shadow">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-black">{currentUser.name}</h2>
                  {currentUser.verified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  )}
                </div>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>+91 {currentUser.phone}</span>
                </p>
                <span className="inline-block mt-1 bg-emerald-950/80 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {getRoleDisplayName(currentUser.role)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setEditName(currentUser.name);
                setEditVillage(currentUser.village || '');
                setEditCity(currentUser.city || '');
                setEditDistrict(currentUser.district || '');
                setEditLocation(currentUser.location);
                setEditSkills(currentUser.skills || []);
                setEditServices(currentUser.servicesOffered || []);
                setEditExp(String(currentUser.experienceYears || '2'));
                setEditWage(String(currentUser.expectedWage || '650'));
                setEditBio(currentUser.bio || '');
                setIsEditing(!isEditing);
              }}
              className="p-2 bg-emerald-800 hover:bg-emerald-600 rounded-xl transition text-white cursor-pointer"
              title="प्रोफाइल बदलें"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Details or Edit Form */}
          <div className="p-5 space-y-4">
            {isEditing ? (
              <div className="space-y-3.5">
                <h4 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">
                  प्रोफाइल जानकारी बदलें:
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">पूरा नाम</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">गाँव (Village)</label>
                    <input
                      type="text"
                      value={editVillage}
                      onChange={(e) => setEditVillage(e.target.value)}
                      placeholder="गाँव का नाम"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">शहर (City)</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="शहर"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">जिला (District)</label>
                    <input
                      type="text"
                      value={editDistrict}
                      onChange={(e) => setEditDistrict(e.target.value)}
                      placeholder="जिला"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {currentUser.role === 'worker' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        कौशल और हुनर (कहाँ काम कर सकते हैं)
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                        {categories.map((cat) => {
                          const isChecked = editSkills.includes(cat.name);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => toggleSkill(cat.name)}
                              className={`text-[11px] p-2 rounded-lg font-bold text-left transition flex items-center gap-1.5 cursor-pointer ${
                                isChecked
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white text-slate-700 border border-slate-200'
                              }`}
                            >
                              <CategoryIcon name={cat.name} className="w-3.5 h-3.5" />
                              <span className="truncate">{cat.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">तजुर्बा (वर्ष)</label>
                        <input
                          type="number"
                          value={editExp}
                          onChange={(e) => setEditExp(e.target.value)}
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">अपेक्षित दिहाड़ी (₹)</label>
                        <input
                          type="number"
                          value={editWage}
                          onChange={(e) => setEditWage(e.target.value)}
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">अपने बारे में दो शब्द</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>सुरक्षित करें</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    रद्द करें
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>गाँव / शहर / जिला:</span>
                  </span>
                  <span className="font-bold text-slate-800 text-right">{currentUser.location}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                  <span className="text-slate-500">खाता प्रकार (Account Type):</span>
                  <span className="font-bold text-emerald-800">{getRoleDisplayName(currentUser.role)}</span>
                </div>

                {currentUser.role === 'worker' && (
                  <>
                    <div className="py-2 border-b border-slate-100 text-xs">
                      <span className="text-slate-500 block mb-1.5">कौशल / हुनर:</span>
                      <div className="flex flex-wrap gap-1">
                        {currentUser.skills && currentUser.skills.length > 0 ? (
                          currentUser.skills.map((s, i) => (
                            <span key={i} className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-lg border border-emerald-200">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">कोई हुनर नहीं चुना गया</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-2 border-b border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-500 block">काम का तजुर्बा:</span>
                        <span className="font-bold text-slate-800">{currentUser.experienceYears || 1} साल</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">उपेक्षित दिहाड़ी:</span>
                        <span className="font-bold text-emerald-700">₹{currentUser.expectedWage || 600} / दिन</span>
                      </div>
                    </div>
                  </>
                )}

                {currentUser.bio && (
                  <div className="py-2 text-xs">
                    <span className="text-slate-500 block mb-1">विवरण:</span>
                    <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-700">
                      {currentUser.bio}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Logout & guide links */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>लॉगआउट करें</span>
              </button>

              <div className="flex items-center gap-3">
                <a
                  href="/api/download-project-zip"
                  download="kaam-mitra-complete-project.zip"
                  className="text-xs text-amber-700 font-bold hover:underline cursor-pointer"
                  title="पूरा प्रोजेक्ट ZIP डाउनलोड करें"
                >
                  📥 प्रोजेक्ट ZIP
                </a>
                <button
                  onClick={() => setShowBackendInfoModal(true)}
                  className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  बैकएंड व APK गाइड
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Login / Register / Recover Card if logged out */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto font-black text-xl shadow-xs">
              KM
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {authMode === 'login'
                ? 'काम मित्र में लॉगिन करें'
                : authMode === 'register'
                ? 'नया सुरक्षित खाता बनाएं'
                : 'पासवर्ड रीसेट करें (खाता रिकवर)'}
            </h3>
            <p className="text-xs text-slate-500">
              {authMode === 'login'
                ? 'अपना पंजीकृत मोबाइल नंबर व पासवर्ड दर्ज करें'
                : authMode === 'register'
                ? 'किसान, मजदूर, काम देने वाले व मशीनरी प्रदाता सीधे जुड़ें'
                : 'सुरक्षा प्रश्न के जरिए नया पासवर्ड बनाएं'}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={
              authMode === 'login'
                ? handleLogin
                : authMode === 'register'
                ? handleRegister
                : handleRecover
            }
            className="space-y-3"
          >
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">पूरा नाम *</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="जैसे: बलविंदर सिंह"
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                    required
                  />
                </div>

                {/* Account Type Selection (Section 1: 5 Account Types) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    खाता प्रकार (Account Type) चुनें *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRoleInput('farmer')}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left transition flex items-center gap-2 cursor-pointer ${
                        roleInput === 'farmer'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Tractor className="w-4 h-4 shrink-0" />
                      <span>🌾 किसान (Farmer)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRoleInput('worker')}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left transition flex items-center gap-2 cursor-pointer ${
                        roleInput === 'worker'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <User className="w-4 h-4 shrink-0" />
                      <span>👷 मजदूर (Worker)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRoleInput('employer')}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left transition flex items-center gap-2 cursor-pointer ${
                        roleInput === 'employer'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 shrink-0" />
                      <span>💼 काम देने वाला</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRoleInput('machinery_provider')}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left transition flex items-center gap-2 cursor-pointer ${
                        roleInput === 'machinery_provider'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Truck className="w-4 h-4 shrink-0" />
                      <span>🚜 मशीनरी प्रदाता</span>
                    </button>
                  </div>
                </div>

                {/* Village, City, District */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">गाँव *</label>
                    <input
                      type="text"
                      value={villageInput}
                      onChange={(e) => setVillageInput(e.target.value)}
                      placeholder="गाँव"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">शहर</label>
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="शहर"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">जिला *</label>
                    <input
                      type="text"
                      value={districtInput}
                      onChange={(e) => setDistrictInput(e.target.value)}
                      placeholder="जिला"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Mobile number input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">10 अंकों का मोबाइल नंबर *</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-xs font-bold text-slate-500">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="98XXXXXXXX"
                  className="w-full text-xs pl-11 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold tracking-wider"
                  required
                />
              </div>
            </div>

            {/* Password input (Never plain text stored, hashed on server) */}
            {authMode !== 'recover' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">पासवर्ड (सुरक्षा कोड) *</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('recover')}
                      className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      पासवर्ड भूल गए?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="कम से कम 4 अक्षर (डेमो: 123456)"
                    className="w-full text-xs pl-9 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                    required
                  />
                </div>
              </div>
            )}

            {/* Security Question for Account Recovery */}
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  खाता रिकवरी प्रश्न (पासवर्ड भूलने पर उपयोगी)
                </label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="आपकी जन्मभूमि या पसंदीदा गाँव का नाम"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Password recovery fields */}
            {authMode === 'recover' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    सुरक्षा उत्तर (गाँव का नाम या जन्मभूमि)
                  </label>
                  <input
                    type="text"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="पंजीकरण के समय भरा गया उत्तर"
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    नया पासवर्ड दर्ज करें *
                  </label>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="नया पासवर्ड"
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl shadow-md transition text-sm cursor-pointer disabled:opacity-50"
            >
              {authLoading
                ? 'कृपया प्रतीक्षा करें...'
                : authMode === 'login'
                ? 'लॉगिन करें'
                : authMode === 'register'
                ? 'सुरक्षित पंजीकरण पूरा करें'
                : 'पासवर्ड बदलें व रीसेट करें'}
            </button>
          </form>

          {/* Toggle login / register / recover */}
          <div className="text-center pt-2 space-y-1">
            {authMode === 'login' ? (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError('');
                }}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer block mx-auto"
              >
                नया खाता बनाना चाहते हैं? यहाँ क्लिक करें
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer block mx-auto"
              >
                पहले से खाता है? यहाँ लॉगिन करें
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5 Quick Role Demo Switcher */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 space-y-2">
        <h4 className="text-xs font-black text-slate-800">
          त्वरित 5 खाता रोल (बिना टाइप किए तुरंत टेस्ट करें):
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
          <button
            onClick={() => switchDemoRole('farmer')}
            className="p-2.5 bg-white rounded-xl border border-slate-200 font-bold text-emerald-800 hover:bg-emerald-50 text-center cursor-pointer shadow-xs"
          >
            🌾 बलविंदर (किसान)
          </button>
          <button
            onClick={() => switchDemoRole('machinery_provider')}
            className="p-2.5 bg-white rounded-xl border border-slate-200 font-bold text-purple-800 hover:bg-purple-50 text-center cursor-pointer shadow-xs"
          >
            🚜 गुरमीत (मशीनरी ऑपरेटर)
          </button>
          <button
            onClick={() => switchDemoRole('worker')}
            className="p-2.5 bg-white rounded-xl border border-slate-200 font-bold text-blue-800 hover:bg-blue-50 text-center cursor-pointer shadow-xs"
          >
            👷 सुरेश (कारीगर/मजदूर)
          </button>
          <button
            onClick={() => switchDemoRole('employer')}
            className="p-2.5 bg-white rounded-xl border border-slate-200 font-bold text-amber-800 hover:bg-amber-50 text-center cursor-pointer shadow-xs"
          >
            💼 रामेश (ठेकेदार/नियोक्ता)
          </button>
          <button
            onClick={() => switchDemoRole('admin')}
            className="p-2.5 bg-slate-900 rounded-xl font-black text-amber-300 hover:bg-slate-800 text-center cursor-pointer shadow-xs col-span-2 sm:col-span-1"
          >
            🛡️ मुख्य एडमिन पैनल
          </button>
        </div>
      </div>

    </div>
  );
};
