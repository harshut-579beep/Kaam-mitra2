import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Database,
  Smartphone,
  ShieldCheck,
  Server,
  FileCode,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Lock,
  PhoneCall,
  Download
} from 'lucide-react';

export const BackendInfoModal: React.FC = () => {
  const { showBackendInfoModal, setShowBackendInfoModal, settings } = useApp();
  const [activeTab, setActiveTab] = useState<'apk_guide' | 'backend_arch' | 'roles_guide'>('apk_guide');

  if (!showBackendInfoModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-900 rounded-xl">
              <Smartphone className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black">काम मित्र - बैकएंड व APK गाइड</h3>
              <p className="text-[11px] text-emerald-200">सरल हिंदी में पूर्ण तकनीकी विवरण</p>
            </div>
          </div>

          <button
            onClick={() => setShowBackendInfoModal(false)}
            className="p-1.5 rounded-full bg-emerald-900 hover:bg-emerald-700 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex bg-slate-100 p-1.5 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('apk_guide')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
              activeTab === 'apk_guide' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📱 Android APK कैसे बनाएं
          </button>
          <button
            onClick={() => setActiveTab('backend_arch')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
              activeTab === 'backend_arch' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚙️ बैकएंड व सुरक्षा
          </button>
          <button
            onClick={() => setActiveTab('roles_guide')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
              activeTab === 'roles_guide' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👥 5 खाते टेस्ट करें
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700 leading-relaxed">
          
          {/* TAB 1: ANDROID APK PACKAGING GUIDE */}
          {activeTab === 'apk_guide' && (
            <div className="space-y-3.5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1">
                <h4 className="text-sm font-black text-emerald-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>एंड्रॉयड मोबाइल में ऐप (APK) कैसे इंस्टॉल करें?</span>
                </h4>
                <p className="text-emerald-800">
                  काम मित्र को विशेष रूप से भारतीय ग्रामीण स्मार्टफोन उपयोगकर्ताओं के लिए डिजाइन किया गया है।
                </p>
              </div>
              {/* Direct 1-Tap ZIP Download Button for Mobile Phones */}
              <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-4 shadow-md space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Download className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white">सीधे फोन में प्रोजेक्ट ZIP डाउनलोड करें</h5>
                    <p className="text-[10px] text-emerald-200">मोबाइल स्क्रीन के लिए 1-क्लिक डायरेक्ट डाउनलोड</p>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-100 leading-relaxed">
                  यदि AI Studio मेन्यू से डाउनलोड का विकल्प नहीं दिख रहा है, तो नीचे दिए गए बटन पर टैप करें। यह संपूर्ण प्रोजेक्ट (Android फोल्डर, GitHub Actions वर्कफ्लो, Capacitor फाइल्स व कोड) सीधे आपके फोन में डाउनलोड कर देगा:
                </p>
                <a
                  href="/api/download-project-zip"
                  download="kaam-mitra-complete-project.zip"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-900 rounded-xl font-black text-xs transition shadow-md cursor-pointer text-center"
                >
                  <Download className="w-4 h-4 text-slate-900" />
                  <span>📥 पूरा प्रोजेक्ट ZIP डाउनलोड करें (One-Tap ZIP)</span>
                </a>
              </div>

              {/* Method A: Instant 1-Click PWA Install */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2 shadow-xs">
                <span className="bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded text-[10px]">
                  तरीका 1 (सबसे आसान - तुरंत इंस्टॉल करें)
                </span>
                <h5 className="text-sm font-bold text-slate-900">Chrome ब्राउज़र से सीधे होम स्क्रीन पर जोड़ें</h5>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                  <li>अपने एंड्रॉइड फोन के <strong>Google Chrome</strong> में काम मित्र का लिंक खोलें।</li>
                  <li>ऊपर दाएं कोने में <strong>तीन बिंदु (⋮ Menu)</strong> पर टैप करें।</li>
                  <li><strong>"Add to Home Screen" (होम स्क्रीन पर जोड़ें)</strong> या "Install App" चुनें।</li>
                  <li>फोन के होम स्क्रीन पर काम मित्र का आइकन आ जाएगा और यह ठीक एक सामान्य Android ऐप की तरह फुल स्क्रीन में चलेगा।</li>
                </ol>
              </div>

              {/* Method B: Native APK Generation via Capacitor */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2 shadow-xs">
                <span className="bg-emerald-700 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                  तरीका 2: कैपेसिटर (Capacitor) द्वारा Android प्रोजेक्ट तैयार
                </span>
                <h5 className="text-sm font-bold text-slate-900">कमांड निष्पादन स्थिति (Status):</h5>
                
                <div className="bg-slate-900 text-emerald-400 font-mono p-3 rounded-xl text-[11px] space-y-1">
                  <p className="text-emerald-300">✔ @capacitor/core &amp; @capacitor/android स्थापित</p>
                  <p className="text-emerald-300">✔ @capacitor/cli dev-dependency स्थापित</p>
                  <p className="text-emerald-300">✔ npm run build (Web Assets तैयार)</p>
                  <p className="text-emerald-300">✔ npx cap init ("Kaam Mitra", "com.kaammitra.app")</p>
                  <p className="text-emerald-300">✔ npx cap add android (/android फोल्डर निर्मित)</p>
                  <p className="text-emerald-300">✔ npx cap sync android (सफल)</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-900">
                  <strong>महत्वपूर्ण सूचना:</strong> वेब सर्वर वातावरण में Android SDK / Java कंपाइलर नहीं होता है, इसलिए अंतिम .apk फाइल मोबाइल फोन या कंप्यूटर/क्लाउड में कंपाइल की जाती है।
                </div>

                <h5 className="text-xs font-bold text-slate-900 pt-1">एंड्रॉयड फोन पर APK कैसे बनाएं (3 विकल्प):</h5>
                
                <div className="space-y-2 text-[11px] text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="text-emerald-800 block">विकल्प 1 (सबसे आसान): GitHub Actions (क्लाउड बिल्ड)</strong>
                    इस कोड को GitHub पर पुश करें। GitHub Actions में Java और Android SDK मुफ्त उपलब्ध होता है। 2 मिनट में <code>assembleDebug</code> रन होकर सीधे फोन में डाउनलोड करने के लिए .apk लिंक मिल जाता है।
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="text-blue-800 block">विकल्प 2: मोबाइल में Termux ऐप द्वारा</strong>
                    Play Store / F-Droid से <strong>Termux</strong> इंस्टॉल करें। उसमें <code>pkg install openjdk-17</code> चलाकर प्रोजेक्ट फोल्डर में जाएं और <code>./gradlew assembleDebug</code> कमांड चलाएं।
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="text-purple-800 block">विकल्प 3: लैपटॉप / पीसी में Android Studio द्वारा</strong>
                    प्रोजेक्ट फोल्डर में <code>npx cap open android</code> चलाएं, फिर Android Studio के मेन्यू में <strong>Build ➔ Build Bundle(s) / APK(s) ➔ Build APK(s)</strong> पर क्लिक करें। तैयार APK को फोन में भेजें।
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BACKEND & SECURITY ARCHITECTURE */}
          {activeTab === 'backend_arch' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-emerald-700" />
                  <span>सुरक्षित बैकएंड व डेटाबेस संरचना</span>
                </h4>
                <p className="text-slate-600">
                  काम मित्र एक शक्तिशाली <strong>Node.js / Express</strong> बैकएंड और स्थायी फाइल-आधारित डेटाबेस (JSON Engine) पर संचालित है।
                </p>
              </div>

              <div className="space-y-2">
                <div className="border border-slate-200 p-3 rounded-xl bg-white space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>पासवर्ड सुरक्षा (Salted PBKDF2 Hashing):</span>
                  </span>
                  <p className="text-slate-600">
                    उपयोगकर्ताओं के पासवर्ड कभी भी सादे टेक्स्ट में स्टोर नहीं होते। प्रत्येक यूजर के लिए एक रैंडम साल्ट (Salt) उत्पन्न कर 1,000 पुनरावृत्तियों के साथ PBKDF2-SHA512 एन्क्रिप्शन किया जाता है।
                  </p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-white space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>गोपनीयता नीति (No Direct Phone Exposure):</span>
                  </span>
                  <p className="text-slate-600">
                    ग्रामीण कामगारों व किसानों की सुरक्षा हेतु पब्लिक एपीआई में फोन नंबर स्क्रबर (Data Sanitization) लगा है। काम देने वाले और कामगार एक दूसरे का फोन नंबर सीधे नहीं देख सकते।
                  </p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-white space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>स्थायी डेटा संग्रह (Collections):</span>
                  </span>
                  <p className="text-slate-600">
                    डेटाबेस में users, jobs, machineryListings, machineryBookings, vehicleBookings, applications, complaints, settings और auditLogs अलग-अलग सुरक्षित तालिकाओं में संचित होते हैं।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 5 ROLES TESTING GUIDE */}
          {activeTab === 'roles_guide' && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900">
                5 खाता प्रकार एवं उनके कार्य:
              </h4>

              <div className="space-y-2">
                <div className="border border-slate-200 p-3 rounded-xl bg-white space-y-0.5">
                  <span className="font-bold text-emerald-800">1. 🌾 किसान (Farmer)</span>
                  <p className="text-slate-600">
                    खेत की जुताई, गेहूं/धान कटाई, मड़ाई, रोटावेटर व ट्रैक्टर-ट्रॉली बुक कर सकते हैं।
                  </p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-white space-y-0.5">
                  <span className="font-bold text-blue-800">2. 👷 मजदूर / कारीगर (Worker)</span>
                  <p className="text-slate-600">
                    अपनी कला (मिस्त्री, बढ़ई, खेती मजदूरी) दर्ज कर सकते हैं, उपलब्ध काम देखकर आवेदन कर सकते हैं।
                  </p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-white space-y-0.5">
                  <span className="font-bold text-amber-800">3. 💼 काम देने वाला / ठेकेदार (Employer)</span>
                  <p className="text-slate-600">
                    काम पोस्ट कर सकते हैं, कामगारों की आवश्यकता व मजदूरी तय कर सकते हैं।
                  </p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-white space-y-0.5">
                  <span className="font-bold text-purple-800">4. 🚜 मशीनरी व वाहन प्रदाता (Provider)</span>
                  <p className="text-slate-600">
                    ट्रैक्टर, रोटावेटर, रीपर, पिकअप व मालवाहक वाहनों को सूचीबद्ध कर बुकिंग स्वीकार कर सकते हैं।
                  </p>
                </div>

                <div className="border border-slate-200 p-3 rounded-xl bg-white space-y-0.5">
                  <span className="font-bold text-slate-900">5. 🛡️ मुख्य व्यवस्थापक / ऐप मालिक (Admin)</span>
                  <p className="text-slate-600">
                    सभी बुकिंग्स की समीक्षा, ऑपरेटर व मजदूरों का आवंटन, आधिकारिक फोन नंबर संपादन व विवाद निवारण।
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            काम मित्र (Kaam Mitra) v2.0 • सुरक्षित व सुलभ
          </span>
          <button
            onClick={() => setShowBackendInfoModal(false)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
          >
            समझ गया (बंद करें)
          </button>
        </div>

      </div>
    </div>
  );
};
