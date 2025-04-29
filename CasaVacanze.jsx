import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Calendar, Clock, Home, Info, Map, MessageCircle, Navigation, Star, Moon, Sun, AlertCircle, Shield, Settings, X, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

// Dati di esempio per il calendario di disponibilità
const availabilityData = [
  { name: 'Maggio', occupancy: 45 },
  { name: 'Giugno', occupancy: 65 },
  { name: 'Luglio', occupancy: 85 },
  { name: 'Agosto', occupancy: 95 },
  { name: 'Settembre', occupancy: 60 },
  { name: 'Ottobre', occupancy: 40 },
];

// Cookie Categories
const cookieCategories = [
  { id: 'necessary', name: 'Necessari', description: 'Cookie necessari per il funzionamento del sito', required: true },
  { id: 'preferences', name: 'Preferenze', description: 'Cookie per salvare le tue preferenze e migliorare la tua esperienza' },
  { id: 'analytics', name: 'Analitici', description: 'Cookie che ci aiutano a comprendere come utilizzi il sito' },
  { id: 'marketing', name: 'Marketing', description: 'Cookie utilizzati per scopi pubblicitari e di marketing' }
];

// Lazy load components for performance optimization
const LazyCalendar3D = lazy(() => new Promise(resolve => {
  // Simula caricamento componente pesante
  setTimeout(() => {
    resolve({
      default: () => (
        <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-purple-600/20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl font-medium mb-3">Calendario 3D Interattivo</p>
              <p className="text-sm">Scorri per interagire con le date disponibili</p>
            </div>
          </div>
        </div>
      )
    });
  }, 1000);
}));

export default function CasaVacanze() {
  const [activeSection, setActiveSection] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [showGdprInfo, setShowGdprInfo] = useState(false);
  const [cookieConsent, setCookieConsent] = useState({
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [performance, setPerformance] = useState({ score: 0, loaded: false });
  
  const homeRef = useRef(null);
  const infoRef = useRef(null);
  const galleryRef = useRef(null);
  const calendarRef = useRef(null);
  const contactRef = useRef(null);
  const privacyRef = useRef(null);
  
  const [bookingInfo, setBookingInfo] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    name: '',
    email: '',
    privacyConsent: false
  });

  // Simulazione del controllo di intersezione per il cambio di sezione durante lo scrolling
  // Intersection Observer per il rilevamento delle sezioni visibili
  useEffect(() => {
    // Simula caricamento iniziale della pagina
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulazione calcolo performance dopo caricamento
      setTimeout(() => {
        setPerformance({ 
          score: Math.floor(Math.random() * 15) + 85, // Simula punteggio tra 85-100
          loaded: true 
        });
      }, 500);
    }, 1000);
    
    // Verifica il consenso dei cookie salvato
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      setCookieConsent(JSON.parse(savedConsent));
      setShowCookieConsent(false);
    }
    
    // Ottimizzazione dello scroll listener usando throttle
    const handleScroll = _.throttle(() => {
      const scrollPosition = window.scrollY;
      if (scrollPosition < 500) {
        setActiveSection('home');
      } else if (scrollPosition < 1200) {
        setActiveSection('info');
      } else if (scrollPosition < 1900) {
        setActiveSection('gallery');
      } else if (scrollPosition < 2600) {
        setActiveSection('calendar');
      } else {
        setActiveSection('contact');
      }
    }, 100); // Throttle di 100ms per ottimizzare le prestazioni

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Salva la preferenza se c'è il consenso
    if (cookieConsent.preferences) {
      localStorage.setItem('darkMode', !darkMode);
    }
  };

  const toggleBooking = () => {
    setShowBooking(!showBooking);
  };
  
  const handleCookieConsentChange = (category) => {
    if (category === 'necessary') return; // Non può essere modificato
    
    setCookieConsent(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const saveCookiePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(cookieConsent));
    setShowCookieSettings(false);
    setShowCookieConsent(false);
  };
  
  const acceptAllCookies = () => {
    const allAccepted = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true
    };
    setCookieConsent(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowCookieConsent(false);
  };
  
  const acceptOnlyNecessary = () => {
    const minimalConsent = {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false
    };
    setCookieConsent(minimalConsent);
    localStorage.setItem('cookieConsent', JSON.stringify(minimalConsent));
    setShowCookieConsent(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingInfo({
      ...bookingInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleBookingSubmit = () => {
    // Verifica del consenso alla privacy
    if (!bookingInfo.privacyConsent) {
      alert('È necessario accettare la Privacy Policy per continuare.');
      return;
    }
    
    // Qui invieremmo i dati ad un server sicuro conforme al GDPR
    // Per ora simuliamo solo il reindirizzamento a PayPal
    alert('Prenotazione inviata! Ti reindirizzeremo a PayPal per completare il pagamento.');
    
    // Log anonimizzato se c'è il consenso analitico
    if (cookieConsent.analytics) {
      console.log('Prenotazione effettuata:', {
        checkIn: bookingInfo.checkIn,
        checkOut: bookingInfo.checkOut,
        guests: bookingInfo.guests,
        // Dati personali omessi per privacy
      });
    }
    
    setShowBooking(false);
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
    
    switch(section) {
      case 'home':
        homeRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'info':
        infoRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'gallery':
        galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'calendar':
        calendarRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'contact':
        contactRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} transition-all duration-500`}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Caricamento di Villa Paradiso...</p>
          </div>
        </div>
      )}
      
      {/* Performance Indicator */}
      {performance.loaded && (
        <div className={`fixed bottom-24 right-4 z-40 py-2 px-4 rounded-lg shadow-lg text-white transition-opacity duration-1000 ${performance.score > 90 ? 'bg-green-600' : 'bg-yellow-600'}`}>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Performance:</span>
            <span>{performance.score}/100</span>
          </div>
        </div>
      )}
      
      {/* Cookie Consent Banner */}
      {showCookieConsent && (
        <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">Il tuo consenso ai cookie</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza di navigazione, personalizzare contenuti e analizzare il traffico. 
                  Per saperne di più, consulta la nostra <button onClick={() => {setShowCookieConsent(false); setShowCookieSettings(true)}} className="text-blue-500 hover:underline">Cookie Policy</button>.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={acceptOnlyNecessary}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                >
                  Solo necessari
                </button>
                <button
                  onClick={() => setShowCookieSettings(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                >
                  Personalizza
                </button>
                <button
                  onClick={acceptAllCookies}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Accetta tutti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cookie Settings Modal */}
      {showCookieSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
            <div className="flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
              <h3 className="text-xl font-bold">Impostazioni Cookie</h3>
              <button 
                onClick={() => setShowCookieSettings(false)}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                La tua privacy è importante per noi. Puoi scegliere quali tipi di cookie accettare. 
                I cookie necessari non possono essere disattivati poiché sono essenziali per il funzionamento del sito.
              </p>
              
              <div className="space-y-4 mb-8">
                {cookieCategories.map(category => (
                  <div 
                    key={category.id} 
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <h4 className="font-medium">{category.name}</h4>
                        {category.required && (
                          <span className={`ml-2 text-xs py-1 px-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                            Richiesto
                          </span>
                        )}
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={cookieConsent[category.id]}
                          onChange={() => handleCookieConsentChange(category.id)}
                          disabled={category.required}
                        />
                        <div className={`w-11 h-6 rounded-full peer ${cookieConsent[category.id] ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                      </label>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {category.description}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  onClick={() => setShowCookieSettings(false)}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                >
                  Annulla
                </button>
                <button
                  onClick={saveCookiePreferences}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Salva preferenze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* GDPR Info Modal */}
      {showGdprInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
            <div className="flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
              <h3 className="text-xl font-bold">Informativa sulla Privacy (GDPR)</h3>
              <button 
                onClick={() => setShowGdprInfo(false)}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} flex items-start space-x-3`}>
                <Shield size={24} className="text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-sm">
                  Villa Paradiso rispetta pienamente il Regolamento Generale sulla Protezione dei Dati (GDPR) dell'Unione Europea. 
                  Ci impegniamo a proteggere e rispettare la tua privacy.
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-2">Titolare del trattamento</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Villa Paradiso S.r.l.<br />
                    Via del Mare, 123<br />
                    Costa Azzurra, 12345<br />
                    Italia<br />
                    Email: privacy@villaparadiso.it
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Dati raccolti</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                    Raccogliamo i seguenti dati personali:
                  </p>
                  <ul className={`list-disc pl-5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                    <li>Dati di contatto (nome, email, telefono)</li>
                    <li>Dati di prenotazione (date di soggiorno, numero di ospiti)</li>
                    <li>Dati di pagamento (gestiti in modo sicuro tramite PayPal)</li>
                    <li>Dati tecnici (indirizzo IP, tipo di browser)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Finalità del trattamento</h4>
                  <ul className={`list-disc pl-5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                    <li>Gestione delle prenotazioni</li>
                    <li>Comunicazioni relative al tuo soggiorno</li>
                    <li>Miglioramento dei nostri servizi</li>
                    <li>Adempimento di obblighi legali</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">I tuoi diritti</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                    Hai diritto di:
                  </p>
                  <ul className={`list-disc pl-5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                    <li>Accedere ai tuoi dati personali</li>
                    <li>Rettificare i tuoi dati personali</li>
                    <li>Cancellare i tuoi dati personali</li>
                    <li>Limitare il trattamento dei tuoi dati</li>
                    <li>Opporti al trattamento dei tuoi dati</li>
                    <li>Portabilità dei dati</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowGdprInfo(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Ho capito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Header/Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-sm transition-all duration-300`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold">Villa Paradiso</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className={`${activeSection === 'home' ? 'text-blue-500 font-medium' : ''} hover:text-blue-500 transition-colors`}
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('info')} 
              className={`${activeSection === 'info' ? 'text-blue-500 font-medium' : ''} hover:text-blue-500 transition-colors`}
            >
              Informazioni
            </button>
            <button 
              onClick={() => scrollToSection('gallery')} 
              className={`${activeSection === 'gallery' ? 'text-blue-500 font-medium' : ''} hover:text-blue-500 transition-colors`}
            >
              Galleria 3D
            </button>
            <button 
              onClick={() => scrollToSection('calendar')} 
              className={`${activeSection === 'calendar' ? 'text-blue-500 font-medium' : ''} hover:text-blue-500 transition-colors`}
            >
              Prenota
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className={`${activeSection === 'contact' ? 'text-blue-500 font-medium' : ''} hover:text-blue-500 transition-colors`}
            >
              Contatti
            </button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-0.5 bg-current mb-1.5"></div>
              <div className="w-6 h-0.5 bg-current mb-1.5"></div>
              <div className="w-6 h-0.5 bg-current"></div>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} py-4`}>
            <div className="container mx-auto px-4 flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('home')} 
                className={`py-2 px-4 rounded-lg ${activeSection === 'home' ? darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-500' : ''}`}
              >
                <Home size={18} className="inline mr-2" /> Home
              </button>
              <button 
                onClick={() => scrollToSection('info')} 
                className={`py-2 px-4 rounded-lg ${activeSection === 'info' ? darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-500' : ''}`}
              >
                <Info size={18} className="inline mr-2" /> Informazioni
              </button>
              <button 
                onClick={() => scrollToSection('gallery')} 
                className={`py-2 px-4 rounded-lg ${activeSection === 'gallery' ? darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-500' : ''}`}
              >
                <Star size={18} className="inline mr-2" /> Galleria 3D
              </button>
              <button 
                onClick={() => scrollToSection('calendar')} 
                className={`py-2 px-4 rounded-lg ${activeSection === 'calendar' ? darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-500' : ''}`}
              >
                <Calendar size={18} className="inline mr-2" /> Prenota
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className={`py-2 px-4 rounded-lg ${activeSection === 'contact' ? darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-500' : ''}`}
              >
                <MessageCircle size={18} className="inline mr-2" /> Contatti
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Home Section with Video Background */}
      <section 
        ref={homeRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 z-0">
          {/* Video placeholder - in a real app you would use a real video */}
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-white text-6xl opacity-20">Video Background</div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 relative z-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 opacity-0 animate-fade-in">Villa Paradiso</h1>
          <p className="text-xl md:text-2xl text-white mb-10 max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-300">
            Un'oasi di pace immersa nella natura, la tua casa lontano da casa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in animation-delay-500">
            <button 
              onClick={() => scrollToSection('gallery')}
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Esplora in 3D
            </button>
            <button 
              onClick={() => scrollToSection('calendar')}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Prenota Ora
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white animate-bounce">
          <div className="flex flex-col items-center">
            <p className="mb-2 text-sm font-light">Scorri per scoprire</p>
            <div className="w-8 h-12 border-2 border-white rounded-full flex items-start justify-center">
              <div className="w-2 h-2 bg-white rounded-full mt-2 animate-scrolling-dot"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section 
        ref={infoRef}
        className={`min-h-screen py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">La Tua Vacanza da Sogno</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg transform transition-all duration-300 hover:scale-105`}>
              <div className="mb-4 text-blue-500">
                <Home size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">Villa di Lusso</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Villa di 250 mq con 4 camere da letto, 3 bagni, piscina privata, e vista panoramica sul mare e le montagne.
              </p>
            </div>
            
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg transform transition-all duration-300 hover:scale-105`}>
              <div className="mb-4 text-blue-500">
                <Map size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">Posizione Ideale</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                A soli 10 minuti dalla spiaggia e 15 minuti dal centro storico. Immersa nel verde con privacy totale.
              </p>
            </div>
            
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg transform transition-all duration-300 hover:scale-105`}>
              <div className="mb-4 text-blue-500">
                <Star size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">Servizi Premium</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Wi-Fi ad alta velocità, climatizzazione, cucina completamente attrezzata, barbecue, e possibilità di chef privato.
              </p>
            </div>
          </div>
          
          <div className="mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">Un'esperienza indimenticabile</h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Villa Paradiso è la destinazione perfetta per chi cerca una vacanza all'insegna del relax e del lusso. Immersa in un contesto naturale mozzafiato, la nostra villa offre tutti i comfort per un soggiorno indimenticabile.
                </p>
                <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Gli spazi interni sono eleganti e accoglienti, arredati con gusto e dotati di tutte le comodità. Gli ambienti esterni, dal giardino alla piscina a sfioro, sono progettati per offrire momenti di puro relax.
                </p>
                <button 
                  onClick={() => scrollToSection('gallery')}
                  className={`px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'} transition-colors`}
                >
                  Scopri gli Ambienti
                </button>
              </div>
              
              <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                {/* Placeholder for an image */}
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xl opacity-50">Immagine Villa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Gallery Section */}
      <section 
        ref={galleryRef}
        className={`min-h-screen py-24 relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors`}
      >
        {/* Background decoration elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-500/10"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-purple-500/10"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold mb-16 text-center">Esplora in 3D</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-16">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Tour Virtuale Immersivo</h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Esplora ogni angolo della villa con il nostro tour virtuale in 3D. Naviga liberamente tra le stanze, goditi la vista panoramica e immagina la tua prossima vacanza in questo paradiso.
              </p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Grazie alla tecnologia all'avanguardia, potrai vivere un'esperienza immersiva e realistica, perfetta per farti un'idea dettagliata degli spazi e dell'atmosfera della villa.
              </p>
            </div>
            
            <div className="flex-1 flex justify-center">
              {/* 3D Model con Lazy Loading */}
              <Suspense fallback={
                <div className={`w-full max-w-md aspect-square rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="w-10 h-10 border-2 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Caricamento modello 3D...</p>
                  </div>
                </div>
              }>
                <LazyCalendar3D />
              </Suspense>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Thumbnails of different rooms/views */}
            {['Salotto', 'Cucina', 'Camera Principale', 'Bagno', 'Piscina', 'Vista Panoramica'].map((room, index) => (
              <div 
                key={index} 
                className={`aspect-video rounded-xl overflow-hidden cursor-pointer shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} hover:scale-105 transition-transform`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking/Calendar Section */}
      <section 
        ref={calendarRef}
        className={`min-h-screen py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Prenota il Tuo Soggiorno</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Disponibilità</h3>
              
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg mb-8`}>
                <h4 className="text-lg font-medium mb-4">Occupazione mensile</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={availabilityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4b5563' : '#e5e7eb'} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: darkMode ? '#d1d5db' : '#4b5563' }} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fill: darkMode ? '#d1d5db' : '#4b5563' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Occupazione']}
                        labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                        contentStyle={{ 
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                          color: darkMode ? '#f3f4f6' : '#111827'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="occupancy" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg mb-8`}>
                <h4 className="text-lg font-medium mb-4">Tariffe</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span>Bassa Stagione (Nov-Mar)</span>
                    <span className="font-medium">€180/notte</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span>Media Stagione (Apr-Mag, Set-Ott)</span>
                    <span className="font-medium">€250/notte</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span>Alta Stagione (Giu-Ago)</span>
                    <span className="font-medium">€350/notte</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Deposito cauzionale</span>
                    <span className="font-medium">€500</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={toggleBooking}
                className={`w-full py-4 rounded-lg font-medium ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'} transition-colors`}
              >
                Verifica Disponibilità e Prenota
              </button>
            </div>
            
            <div>
              {showBooking ? (
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Prenota Ora</h3>
                    <button 
                      onClick={toggleBooking}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleBookingSubmit(); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">Check-in</label>
                        <input 
                          type="date" 
                          name="checkIn"
                          value={bookingInfo.checkIn}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Check-out</label>
                        <input 
                          type="date" 
                          name="checkOut"
                          value={bookingInfo.checkOut}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Numero di ospiti</label>
                      <select
                        name="guests"
                        value={bookingInfo.guests}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'ospite' : 'ospiti'}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Nome e Cognome</label>
                      <input 
                        type="text" 
                        name="name"
                        value={bookingInfo.name}
                        onChange={handleInputChange}
                        placeholder="Inserisci il tuo nome completo"
                        className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={bookingInfo.email}
                        onChange={handleInputChange}
                        placeholder="Inserisci la tua email"
                        className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                      />
                    </div>
                    
                    <div className="mb-8">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="privacyConsent"
                          name="privacyConsent"
                          checked={bookingInfo.privacyConsent}
                          onChange={handleInputChange}
                          className="mt-1"
                          required
                        />
                        <label htmlFor="privacyConsent" className="text-sm">
                          Ho letto e accetto la <button 
                            type="button" 
                            onClick={() => setShowGdprInfo(true)}
                            className="text-blue-500 hover:underline"
                          >
                            Privacy Policy
                          </button> e autorizzo il trattamento dei miei dati personali in conformità al GDPR.
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <button 
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                      >
                        <span>Procedi al Pagamento con PayPal</span>
                        <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11z" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg h-full flex flex-col justify-center`}>
                  <div className="text-center mb-8">
                    <Calendar size={64} className="mx-auto mb-4 text-blue-500" />
                    <h3 className="text-2xl font-bold mb-2">Verifica la disponibilità</h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Seleziona le date del tuo soggiorno e scopri la disponibilità in tempo reale.
                    </p>
                  </div>
                  
                  <button 
                    onClick={toggleBooking}
                    className={`py-4 rounded-lg font-medium ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'} transition-colors w-full md:w-2/3 mx-auto`}
                  >
                    Verifica Disponibilità
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        ref={contactRef}
        className={`min-h-screen py-24 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Contattaci</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Hai domande?</h3>
              <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Compila il modulo o contattaci direttamente usando uno dei metodi elencati qui sotto. Siamo qui per aiutarti a pianificare la vacanza perfetta.
              </p>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-blue-100'}`}>
                    <MessageCircle size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>info@villaparadiso.it</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-blue-100'}`}>
                    <Clock size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Orari</h4>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Lun - Ven: 9:00 - 18:00</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-blue-100'}`}>
                    <Navigation size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Indirizzo</h4>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Via del Mare, 123<br />Costa Azzurra, 12345<br />Italia</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <a href="#" className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.015-.628.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                <h3 className="text-2xl font-bold mb-6">Inviaci un messaggio</h3>
                
                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome</label>
                      <input 
                        type="text" 
                        placeholder="Il tuo nome"
                        className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input 
                        type="email" 
                        placeholder="La tua email"
                        className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Oggetto</label>
                    <input 
                      type="text" 
                      placeholder="Oggetto del messaggio"
                      className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Messaggio</label>
                    <textarea 
                      rows={5}
                      placeholder="Scrivi il tuo messaggio qui..."
                      className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Invia Messaggio
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} transition-colors`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-bold mb-4">Villa Paradiso</h3>
              <p className="mb-4">
                La tua casa vacanze di lusso nel cuore della Costa Azzurra italiana.
              </p>
              <p>
                © {new Date().getFullYear()} Villa Paradiso. Tutti i diritti riservati.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Link Utili</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('home')} className="hover:text-blue-500 transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('info')} className="hover:text-blue-500 transition-colors">
                    Informazioni
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('gallery')} className="hover:text-blue-500 transition-colors">
                    Galleria 3D
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('calendar')} className="hover:text-blue-500 transition-colors">
                    Prenota
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Informazioni Legali</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Termini e Condizioni
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Newsletter</h3>
              <p className="mb-4">
                Iscriviti per ricevere offerte esclusive e aggiornamenti.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="La tua email"
                  className={`flex-1 px-4 py-2 rounded-l-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border border-r-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                  Iscriviti
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm">
              Progettato e sviluppato con ❤️ in Italia
            </p>
          </div>
        </div>
      </footer>

      {/* CSS Styles for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scrolling {
          0% { transform: translateY(0); }
          50% { transform: translateY(6px); }
          100% { transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animate-scrolling-dot {
          animation: scrolling 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
