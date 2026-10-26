import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminContactCard } from '../components/AdminContactCard';
import { createMachineryListing } from '../api';
import {
  Tractor,
  Truck,
  PlusCircle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Layers,
  ChevronRight,
  Info,
  Check
} from 'lucide-react';

export const ServicesView: React.FC = () => {
  const {
    currentUser,
    machineryListings,
    submitMachineryBooking,
    submitVehicleBooking,
    showToast,
    refreshAll,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'tractor_booking' | 'vehicle_booking' | 'available_machinery' | 'register_machinery'>('tractor_booking');

  // Tractor / Farm Machinery Booking Form State
  const [farmService, setFarmService] = useState('रोटावेटर से खेत की जुताई');
  const [tractorType, setTractorType] = useState('ट्रैक्टर मय ड्राइवर व उपकरण');
  const [hpRange, setHpRange] = useState('45-55 HP (मध्यम व हैवी काम)');
  const [implement, setImplement] = useState('रोटावेटर (Rotavator)');
  const [farmLocation, setFarmLocation] = useState(currentUser?.location || '');
  const [farmArea, setFarmArea] = useState('5 एकड़');
  const [cropType, setCropType] = useState('गेहूं');
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('सुबह 07:00 बजे');
  const [workingHours, setWorkingHours] = useState('4 से 6 घंटे');
  const [farmBudget, setFarmBudget] = useState('₹4,000');
  const [instructions, setInstructions] = useState('');
  const [isSubmittingFarm, setIsSubmittingFarm] = useState(false);

  // Vehicle / Goods Transport Booking Form State
  const [vehicleType, setVehicleType] = useState('ट्रैक्टर मय बड़ी ट्रॉली');
  const [pickupLoc, setPickupLoc] = useState('');
  const [destLoc, setDestLoc] = useState('');
  const [goodsDesc, setGoodsDesc] = useState('');
  const [vehicleDate, setVehicleDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [vehicleTime, setVehicleTime] = useState('सुबह 08:30 बजे');
  const [vehicleBudget, setVehicleBudget] = useState('₹2,000');
  const [specialReq, setSpecialReq] = useState('');
  const [isSubmittingVehicle, setIsSubmittingVehicle] = useState(false);

  // Provider Machinery Registration Form State
  const [regEquipType, setRegEquipType] = useState('');
  const [regTractorModel, setRegTractorModel] = useState('');
  const [regHp, setRegHp] = useState('45 HP');
  const [regImplements, setRegImplements] = useState<string[]>(['रोटावेटर']);
  const [regServiceArea, setRegServiceArea] = useState('');
  const [regRateDisplay, setRegRateDisplay] = useState('₹850 / घंटा');
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  // Implements list defined in Prompt Section 5
  const farmImplementsList = [
    'रोटावेटर से खेत की जुताई',
    'हल से जुताई',
    'कल्टीवेटर से जुताई',
    'डिस्क हैरो',
    'पांजा',
    'सीड ड्रिल से बुवाई',
    'जीरो टिलेज बुवाई',
    'गेहूँ की बुवाई',
    'धान की रोपाई से जुड़ी सेवाएँ',
    'रीपर से फसल कटाई',
    'थ्रेशर से फसल की मड़ाई',
    'खेत समतल करने की मशीन (लेजर लैंड लेवलर)',
    'आलू की खुदाई',
    'स्प्रे मशीन (फसल छिड़काव)',
    'ट्रॉली से सामान ढुलाई',
    'अन्य कृषि उपकरण और सेवाएँ'
  ];

  const vehicleTypesList = [
    'ट्रैक्टर (Tractor)',
    'ट्रैक्टर मय ट्रॉली (Tractor with Trolley)',
    'ऑटो-रिक्शा (Auto-rickshaw)',
    'लोडर / माल ऑटो (Goods Auto)',
    'पिकअप वाहन (Pickup - Bolero Maxi)',
    'छोटा हाथी / मिनी ट्रक (Tata Ace / Mini Truck)',
    'मालवाहक ट्रक (Goods Transport Vehicle)',
    'अन्य अनुमोदित स्थानीय वाहन'
  ];

  const handleFarmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('बुकिंग करने के लिए कृपया पहले लॉगिन करें।', 'error');
      setActiveTab('profile');
      return;
    }
    setIsSubmittingFarm(true);
    const ref = await submitMachineryBooking({
      serviceType: farmService,
      tractorType,
      horsepowerRange: hpRange,
      implementRequired: implement,
      villageFarmLocation: farmLocation,
      farmAreaAcres: farmArea,
      cropType,
      bookingDate,
      bookingTime,
      workingHours,
      budget: farmBudget,
      instructions
    });
    setIsSubmittingFarm(false);
    if (ref) {
      // Form reset or switch to bookings tab handled inside AppContext
    }
  };

  const handleVehicleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('वाहन बुक करने के लिए कृपया पहले लॉगिन करें।', 'error');
      setActiveTab('profile');
      return;
    }
    setIsSubmittingVehicle(true);
    const ref = await submitVehicleBooking({
      vehicleType,
      pickupLocation: pickupLoc,
      destination: destLoc,
      goodsDescription: goodsDesc,
      bookingDate: vehicleDate,
      bookingTime: vehicleTime,
      budget: vehicleBudget,
      specialRequirements: specialReq
    });
    setIsSubmittingVehicle(false);
  };

  const handleRegisterMachinery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('मशीनरी दर्ज करने के लिए लॉगिन करें।', 'error');
      setActiveTab('profile');
      return;
    }
    if (!regEquipType || !regServiceArea) {
      showToast('कृपया उपकरण का नाम और सेवा क्षेत्र अवश्य भरें।', 'error');
      return;
    }
    setIsSubmittingReg(true);
    try {
      await createMachineryListing({
        providerId: currentUser.id,
        equipmentType: regEquipType,
        tractorModel: regTractorModel,
        horsepower: regHp,
        availableImplements: regImplements,
        serviceArea: regServiceArea,
        rateDisplay: regRateDisplay
      });
      showToast('आपकी मशीनरी सफलतापूर्वक दर्ज हुई! एडमिन द्वारा सत्यापन किया जाएगा।', 'success');
      setActiveSubTab('available_machinery');
      await refreshAll();
    } catch {
      showToast('मशीनरी दर्ज करने में समस्या हुई', 'error');
    } finally {
      setIsSubmittingReg(false);
    }
  };

  const toggleRegImplement = (item: string) => {
    setRegImplements(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="pb-28 max-w-xl mx-auto p-4 space-y-4 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-5 shadow-md space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-emerald-900/80 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
          <Tractor className="w-4 h-4" />
          <span>कृषि मशीनरी एवं ट्रैक्टर सेवा</span>
        </div>
        <h2 className="text-xl font-black text-white leading-tight">
          खेत की जुताई, बुवाई, कटाई व वाहन ढुलाई की आसान बुकिंग
        </h2>
        <p className="text-xs text-emerald-100 leading-relaxed">
          गाँव-गाँव में उपलब्ध ट्रैक्टर, रोटावेटर, रीपर, थ्रेशर और लोडर वाहन। काम मित्र एडमिन द्वारा उचित दर पर समन्वय।
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-200/80 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('tractor_booking')}
          className={`py-2 px-2 text-xs font-bold rounded-xl transition text-center cursor-pointer ${
            activeSubTab === 'tractor_booking'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-300/60'
          }`}
        >
          🚜 ट्रैक्टर व कृषि बुकिंग
        </button>

        <button
          onClick={() => setActiveSubTab('vehicle_booking')}
          className={`py-2 px-2 text-xs font-bold rounded-xl transition text-center cursor-pointer ${
            activeSubTab === 'vehicle_booking'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-300/60'
          }`}
        >
          🚚 वाहन व माल ढुलाई
        </button>

        <button
          onClick={() => setActiveSubTab('available_machinery')}
          className={`py-2 px-2 text-xs font-bold rounded-xl transition text-center cursor-pointer ${
            activeSubTab === 'available_machinery'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-300/60'
          }`}
        >
          🌾 उपलब्ध मशीनें ({machineryListings.length})
        </button>

        <button
          onClick={() => setActiveSubTab('register_machinery')}
          className={`py-2 px-2 text-xs font-bold rounded-xl transition text-center cursor-pointer ${
            activeSubTab === 'register_machinery'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-300/60'
          }`}
        >
          🛠️ मशीनरी जोड़ें
        </button>
      </div>

      {/* TAB 1: Tractor & Agricultural Machinery Booking Form */}
      {activeSubTab === 'tractor_booking' && (
        <form onSubmit={handleFarmBooking} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Tractor className="w-5 h-5 text-emerald-700" />
              <span>कृषि मशीनरी एवं ट्रैक्टर बुकिंग फॉर्म</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              अपनी आवश्यकता अनुसार विवरण भरें। काम मित्र एडमिन योग्य ऑपरेटर नियुक्त करेंगे।
            </p>
          </div>

          {/* Service & Implement Selection */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                आवश्यक कृषि सेवा या कार्य चुनें *
              </label>
              <select
                value={farmService}
                onChange={(e) => {
                  setFarmService(e.target.value);
                  setImplement(e.target.value);
                }}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800"
                required
              >
                {farmImplementsList.map((imp) => (
                  <option key={imp} value={imp}>
                    {imp}
                  </option>
                ))}
              </select>
            </div>

            {/* Tractor Type & Rental Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ट्रैक्टर / मशीन प्रकार
                </label>
                <select
                  value={tractorType}
                  onChange={(e) => setTractorType(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ट्रैक्टर मय ड्राइवर व उपकरण">ट्रैक्टर मय ड्राइवर (सामान्य सेवा)</option>
                  <option value="ट्रैक्टर मय ट्रॉली">ट्रैक्टर मय ट्रॉली (ढुलाई कार्य)</option>
                  <option value="ट्रैक्टर सिर्फ कृषि कार्य हेतु">ट्रैक्टर सिर्फ जुताई/बुवाई कार्य</option>
                  <option value="किराये पर बिना ड्राइवर (शर्तों के अधीन)">किराये पर बिना ड्राइवर (पात्रता अनुसार)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  आवश्यक हॉर्सपावर (HP Range)
                </label>
                <select
                  value={hpRange}
                  onChange={(e) => setHpRange(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="35-45 HP (हल्की जुताई व ट्रॉली)">35-45 HP (हल्की जुताई व ट्रॉली)</option>
                  <option value="45-55 HP (मध्यम व हैवी काम)">45-55 HP (रोटावेटर व मध्यम खेत)</option>
                  <option value="55+ HP (हैवी ड्यूटी व लेवलर)">55+ HP (लेजर लेवलर व गहरी जुताई)</option>
                </select>
              </div>
            </div>

            {/* Location & Farm Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  गाँव और खेत का स्थान *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                    placeholder="गाँव, खेत का नंबर, जिला"
                    className="w-full text-xs pl-9 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  खेत का रकबा / क्षेत्रफल *
                </label>
                <input
                  type="text"
                  value={farmArea}
                  onChange={(e) => setFarmArea(e.target.value)}
                  placeholder="उदा: 4 एकड़ / 2 हेक्टेयर / 10 बीघा"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Crop Type & Date / Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">फसल का प्रकार</label>
                <input
                  type="text"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  placeholder="उदा: गेहूं, धान, गन्ना, आलू"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">तारीख *</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">समय</label>
                <input
                  type="text"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  placeholder="उदा: सुबह 07:00 बजे"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Hours & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">अपेक्षित कार्य समय</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="उदा: 5 घंटे / 1 दिन"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">अपेक्षित बजट (₹)</label>
                <input
                  type="text"
                  value={farmBudget}
                  onChange={(e) => setFarmBudget(e.target.value)}
                  placeholder="उदा: ₹3,500 (या प्रति घंटा दर)"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-800"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                विशेष निर्देश (खेत का रास्ता, मिट्टी की नमी, आदि)
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="खेत पक्के रास्ते पर है या कच्चे रास्ते पर, कोई विशेष बात..."
                rows={2}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Platform Rules Notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <strong>काम मित्र सुरक्षा गारंटी:</strong> बुकिंग सीधे काम मित्र व्यवस्थापक द्वारा सत्यापित की जाएगी और नजदीकी अनुमोदित ऑपरेटर को सौंपा जाएगा। भुगतान कार्य पूरा होने पर ही होगा।
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmittingFarm}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl shadow-md transition text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isSubmittingFarm ? 'अनुरोध भेजा जा रहा है...' : 'कृषि मशीनरी बुकिंग अनुरोध भेजें'}</span>
          </button>
        </form>
      )}

      {/* TAB 2: Vehicle & Goods Transport Booking Form */}
      {activeSubTab === 'vehicle_booking' && (
        <form onSubmit={handleVehicleBooking} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-700" />
              <span>वाहन एवं माल ढुलाई बुकिंग</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ट्रैक्टर-ट्रॉली, पिकअप, लोडर या छोटा हाथी माल ढुलाई हेतु बुक करें।
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                आवश्यक वाहन का प्रकार चुनें *
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-bold"
                required
              >
                {vehicleTypesList.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  पिकअप स्थान (कहाँ से माल उठाना है) *
                </label>
                <input
                  type="text"
                  value={pickupLoc}
                  onChange={(e) => setPickupLoc(e.target.value)}
                  placeholder="गाँव / मंडी / गोदाम का पता"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  गंतव्य स्थान (कहाँ पहुँचाना है) *
                </label>
                <input
                  type="text"
                  value={destLoc}
                  onChange={(e) => setDestLoc(e.target.value)}
                  placeholder="अनाज मंडी / दुकान / शहर का पता"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                माल का विवरण और वजन *
              </label>
              <input
                type="text"
                value={goodsDesc}
                onChange={(e) => setGoodsDesc(e.target.value)}
                placeholder="उदा: 100 बोरी गेहूं (लगभग 50 क्विंटल), ईंटें, खाद या फर्नीचर"
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">तारीख *</label>
                <input
                  type="date"
                  value={vehicleDate}
                  onChange={(e) => setVehicleDate(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">समय</label>
                <input
                  type="text"
                  value={vehicleTime}
                  onChange={(e) => setVehicleTime(e.target.value)}
                  placeholder="उदा: सुबह 08:00 बजे"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">अपेक्षित भाड़ा (₹)</label>
                <input
                  type="text"
                  value={vehicleBudget}
                  onChange={(e) => setVehicleBudget(e.target.value)}
                  placeholder="उदा: ₹1,800"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                विशेष आवश्यकता (तिरपाल, लोडिंग मजदूर आदि)
              </label>
              <input
                type="text"
                value={specialReq}
                onChange={(e) => setSpecialReq(e.target.value)}
                placeholder="उदा: बारिश से बचाव हेतु तिरपाल जरूरी है"
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmittingVehicle}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl shadow-md transition text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isSubmittingVehicle ? 'अनुरोध भेजा जा रहा है...' : 'वाहन बुकिंग अनुरोध भेजें'}</span>
          </button>
        </form>
      )}

      {/* TAB 3: Available Approved Machinery Listings in the Region */}
      {activeSubTab === 'available_machinery' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              अनुमोदित ट्रैक्टर व कृषि मशीनरी प्रदाता
            </h3>
            <span className="text-xs text-slate-500">एडमिन द्वारा सत्यापित</span>
          </div>

          {machineryListings.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-500 space-y-2">
              <Tractor className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-sm font-bold text-slate-700">अभी कोई मशीनरी सूचीबद्ध नहीं है</p>
              <p className="text-xs">प्रदाता 'मशीनरी जोड़ें' टैब का प्रयोग कर अपनी मशीन जोड़ सकते हैं।</p>
            </div>
          ) : (
            machineryListings.map((mach) => (
              <div
                key={mach.id}
                className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {mach.horsepower || 'ट्रैक्टर'}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        उपलब्ध
                      </span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mt-1">
                      {mach.equipmentType}
                    </h4>
                    <p className="text-xs text-slate-500">
                      प्रदाता: <strong>{mach.providerName}</strong> • {mach.tractorModel}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-400 block">अनुमानित दर</span>
                    <span className="text-sm font-black text-emerald-700">{mach.rateDisplay}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1 text-xs">
                  <div className="text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>सेवा क्षेत्र: <strong>{mach.serviceArea}</strong></span>
                  </div>
                  <div className="text-slate-600 flex flex-wrap gap-1 pt-1">
                    <span className="text-slate-400">उपलब्ध साधन:</span>
                    {mach.availableImplements.map((imp, idx) => (
                      <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                        {imp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Safe Platform Booking Button */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    🔒 संपर्क व भुगतान काम मित्र द्वारा
                  </span>
                  <button
                    onClick={() => {
                      setFarmService(mach.equipmentType);
                      setImplement(mach.availableImplements[0] || mach.equipmentType);
                      setHpRange(mach.horsepower || '45-55 HP');
                      setActiveSubTab('tractor_booking');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>यह मशीन बुक करें</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: Machinery Provider Registration Form */}
      {activeSubTab === 'register_machinery' && (
        <form onSubmit={handleRegisterMachinery} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-700" />
              <span>अपनी कृषि मशीनरी व वाहन सूचीबद्ध करें</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ट्रैक्टर मालिक व मशीनरी प्रदाता अपनी मशीनरी पंजीकृत कर नियमित काम प्राप्त करें।
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                उपकरण / मशीनरी का नाम *
              </label>
              <input
                type="text"
                value={regEquipType}
                onChange={(e) => setRegEquipType(e.target.value)}
                placeholder="उदा: महिंद्रा 575 DI + 7 फीट रोटावेटर"
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ट्रैक्टर / वाहन मॉडल
                </label>
                <input
                  type="text"
                  value={regTractorModel}
                  onChange={(e) => setRegTractorModel(e.target.value)}
                  placeholder="उदा: Swaraj 744 / Mahindra 575"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  हॉर्सपावर (HP)
                </label>
                <input
                  type="text"
                  value={regHp}
                  onChange={(e) => setRegHp(e.target.value)}
                  placeholder="उदा: 45 HP / 50 HP"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Implements multi-select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                उपलब्ध कृषि उपकरण (चुनें):
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                {farmImplementsList.slice(0, 10).map((imp) => {
                  const isChecked = regImplements.includes(imp);
                  return (
                    <button
                      key={imp}
                      type="button"
                      onClick={() => toggleRegImplement(imp)}
                      className={`text-[11px] p-2 rounded-lg font-bold text-left transition flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span className="truncate">{imp}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  सेवा क्षेत्र (गाँव व तहसील परिधि) *
                </label>
                <input
                  type="text"
                  value={regServiceArea}
                  onChange={(e) => setRegServiceArea(e.target.value)}
                  placeholder="उदा: करनाल, तरावड़ी व 15 किमी परिधि"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  किराया दर
                </label>
                <input
                  type="text"
                  value={regRateDisplay}
                  onChange={(e) => setRegRateDisplay(e.target.value)}
                  placeholder="उदा: ₹800 / घंटा या ₹1200 / एकड़"
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-800"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmittingReg}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl shadow-md transition text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isSubmittingReg ? 'सुरक्षित किया जा रहा है...' : 'मशीनरी पंजीकृत करें'}</span>
          </button>
        </form>
      )}

      {/* Permanent Admin Contact Card (Section 3 Requirement) */}
      <AdminContactCard
        title="कृषि व वाहन सेवा सहायता (एडमिन से संपर्क)"
      />

    </div>
  );
};
