import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Info, Thermometer, Ruler, Users, Tv, Sun, Calculator,
    CheckCircle, ArrowUp, Zap, Download, MessageCircle, MapPin,
    Flame, Leaf, DollarSign, Settings
} from 'lucide-react';
import Section from '../../shared/components/ui/Section';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- Configuration & Constants ---

const CITIES = [
    { name: 'Barranquilla', temp: 32, altitude: 18, label: 'Cálido Costero' },
    { name: 'Cartagena', temp: 31, altitude: 2, label: 'Cálido Costero' },
    { name: 'Santa Marta', temp: 32, altitude: 15, label: 'Cálido Costero' },
    { name: 'Bogotá', temp: 14, altitude: 2600, label: 'Frío' },
    { name: 'Medellín', temp: 22, altitude: 1495, label: 'Templado' },
    { name: 'Cali', temp: 24, altitude: 1018, label: 'Cálido Seco' },
    { name: 'Bucaramanga', temp: 23, altitude: 959, label: 'Templado' },
    { name: 'Cúcuta', temp: 28, altitude: 320, label: 'Cálido' },
    { name: 'Pereira', temp: 21, altitude: 1411, label: 'Templado' },
    { name: 'Montería', temp: 33, altitude: 18, label: 'Muy Cálido' },
    { name: 'Otro / Manual', temp: 25, altitude: 0, label: 'Personalizado' },
];

const KWH_COST = 850; // COP Average

// --- Logic Implementation ---

const calculateBTU = (data) => {
    const largo = parseFloat(data.largo) || 0;
    const ancho = parseFloat(data.ancho) || 0;
    const personas = parseFloat(data.personas) || 0;
    const equipos = parseFloat(data.equipos) || 0;

    // Validation
    if (largo === 0 || ancho === 0) return { error: 'Dimensiones requeridas.' };

    const selectedCity = CITIES.find(c => c.name === data.ciudad) || CITIES[CITIES.length - 1];

    // Base Check: Temperature Factor
    let factorClima = 600; // Base ASHRAE standard approximation
    let zona = "B";

    // Dynamic Logic based on City Temp
    if (selectedCity.temp >= 30) {
        factorClima = 800; // High heat load
        zona = "A (Muy Cálida)";
    } else if (selectedCity.temp <= 18) {
        factorClima = 450; // Low heat load
        zona = "C (Fría)";
    } else {
        factorClima = 600; // Moderate
        zona = "B (Templada)";
    }

    // Advanced Factors
    let cargaTechoZinc = 0;
    let cargaOrientacion = 0;
    const areaRecinto = largo * ancho;
    let cargaBase = areaRecinto * factorClima;

    // Material & Orientation Corrections
    if (data.techoZinc) {
        const factorZinc = cargaBase * 0.20; // +20% for zinc roof heat transfer
        cargaTechoZinc = factorZinc;
        cargaBase += factorZinc;
    }

    if (data.orientacionOeste) {
        const factorOeste = cargaBase * 0.15; // +15% for afternoon sun
        cargaOrientacion = factorOeste;
        cargaBase += factorOeste;
    }

    // Height Factor
    let factorAltura = 0;
    if (data.techoAlto) {
        factorAltura = cargaBase * 0.15; // +15% if high ceiling
    }

    // Occupancy & Equipment Load
    const cargaPersonas = personas * 600; // 600 BTU/person
    const cargaEquipos = equipos * 500; // ~500 BTU/device average

    // Windows (Simplified Area * Factor)
    const vAlto = parseFloat(data.ventanaAlto) || 0;
    const vAncho = parseFloat(data.ventanaAncho) || 0;
    const areaVentana = vAlto * vAncho;
    const cargaVentana = areaVentana * 1200; // Solar gain through glass

    // Total Calculation
    const subtotal = cargaBase + factorAltura + cargaPersonas + cargaEquipos + cargaVentana;
    const seguridad = subtotal * 0.10; // Safety margin
    const total = subtotal + seguridad;
    const btuFinal = Math.ceil(total);

    // --- Recommendation Logic ---
    let recomendacion = "9,000 BTU";
    let type = "minisplit";

    // Standard Commercial Capacities
    if (btuFinal > 9000 && btuFinal <= 12000) recomendacion = "12,000 BTU";
    else if (btuFinal > 12000 && btuFinal <= 18000) recomendacion = "18,000 BTU";
    else if (btuFinal > 18000 && btuFinal <= 24000) recomendacion = "24,000 BTU";
    else if (btuFinal > 24000 && btuFinal <= 36000) { recomendacion = "36,000 BTU"; type = "piso-techo"; }
    else if (btuFinal > 36000 && btuFinal <= 48000) { recomendacion = "48,000 BTU"; type = "cassette"; }
    else if (btuFinal > 48000 && btuFinal <= 60000) { recomendacion = "60,000 BTU"; type = "grand"; }
    else if (btuFinal > 60000) { recomendacion = "Proyecto VRF / Comercial"; type = "industrial"; }

    // --- ROI / Energy Estimation ---
    // Formula: (Capacity / SEER) / 1000 * Hours * Days * Cost
    const hoursPerDay = 8;
    const daysPerMonth = 30;

    // Conventional (SEER 10)
    const wattsConventional = btuFinal / 10;
    const kwhMonthlyConventional = (wattsConventional / 1000) * hoursPerDay * daysPerMonth;
    const costConventional = kwhMonthlyConventional * KWH_COST;

    // Inverter (SEER 20)
    const wattsInverter = btuFinal / 20;
    const kwhMonthlyInverter = (wattsInverter / 1000) * hoursPerDay * daysPerMonth;
    const costInverter = kwhMonthlyInverter * KWH_COST;

    const savingsMonthly = costConventional - costInverter;
    const savingsYearly = savingsMonthly * 12;

    return {
        btu: btuFinal,
        recomendacion,
        type,
        city: selectedCity,
        economics: {
            costConventional,
            costInverter,
            savingsMonthly,
            savingsYearly
        },
        detalles: {
            areaRecinto: areaRecinto.toFixed(2),
            factorClima,
            zona,
            cargaTechoZinc,
            cargaOrientacion,
            cargaPersonas,
            cargaEquipos,
            cargaVentana,
            factorAltura,
            seguridad
        }
    };
};

// Container Variants for staggering
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

const CalculatorPage = () => {
    const [formData, setFormData] = useState({
        ciudad: 'Barranquilla',
        largo: '',
        ancho: '',
        personas: '',
        equipos: '',
        ventanaAlto: '',
        ventanaAncho: '',
        techoAlto: false,
        techoZinc: false,
        orientacionOeste: false
    });

    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const resultRef = useRef(null);
    const cardRef = useRef(null); // For PDF generation

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (resultado) setResultado(null);
        if (error) setError('');
    };

    const handleCalculate = () => {
        const res = calculateBTU(formData);
        if (res.error) {
            setError(res.error);
            return;
        }
        setResultado(res);
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const generatePDF = async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Ghara_Calculo_${formData.ciudad}.pdf`);
        } catch (err) {
            console.error("PDF Fail", err);
        }
    };

    const getWhatsAppLink = () => {
        if (!resultado) return '#';
        const msg = `Hola Ghara! Hice un cálculo en su web para ${formData.ciudad}. Necesito un equipo de ${resultado.recomendacion} para un área de ${resultado.detalles.areaRecinto}m². ¿Me asesoran?`;
        return `https://wa.me/573022326569?text=${encodeURIComponent(msg)}`;
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pt-24 pb-24 font-sans">
            <Section>
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center p-3 bg-primary/10 dark:bg-cyber-cyan/10 rounded-2xl mb-6 shadow-lg shadow-primary/5 border border-primary/20 backdrop-blur-sm"
                    >
                        <Calculator className="text-primary dark:text-cyber-cyan w-8 h-8" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display font-bold text-4xl md:text-5xl text-slate-900 dark:text-white mb-4 tracking-tight"
                    >
                        Calculadora <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-cyber-cyan dark:to-blue-400">Ghara</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg"
                    >
                        Dimensionamiento HVAC profesional con análisis de retorno de inversión y consumo energético.
                    </motion.p>
                </div>

                <div className="max-w-3xl mx-auto space-y-8">

                    {/* --- Input Form --- */}
                    <motion.div
                        layout
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-white/5 space-y-8 overflow-hidden relative"
                    >
                        {/* Decorative Background Blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                        {/* City Selector */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                    <MapPin size={18} />
                                </div>
                                Ubicación del Proyecto
                            </label>
                            <div className="relative group">
                                <select
                                    name="ciudad"
                                    value={formData.ciudad}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-black/20 border-r-[16px] border-transparent text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-base focus:border-primary dark:focus:border-cyber-cyan outline-none transition-all shadow-sm hover:border-slate-300 dark:hover:border-white/20 appearance-none cursor-pointer"
                                >
                                    {CITIES.map(c => (
                                        <option key={c.name} value={c.name}>{c.name} ({c.label} - {c.temp}°C)</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                                    <ArrowUp className="rotate-180" size={16} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Dimensions & Windows Grid */}
                        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8">
                            {/* Space */}
                            <div className="bg-slate-50/50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors duration-300">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                                        <Ruler size={16} />
                                    </div>
                                    Dimensiones
                                </h3>
                                <div className="space-y-5">
                                    <div className="relative group">
                                        <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#1a202c] px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-blue-500 transition-colors z-10 rounded-full border border-slate-100 dark:border-white/10">Largo (m)</label>
                                        <input type="number" name="largo" value={formData.largo} onChange={handleChange} className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3.5 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium placeholder:text-slate-300" placeholder="0" />
                                    </div>
                                    <div className="relative group">
                                        <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#1a202c] px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-blue-500 transition-colors z-10 rounded-full border border-slate-100 dark:border-white/10">Ancho (m)</label>
                                        <input type="number" name="ancho" value={formData.ancho} onChange={handleChange} className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3.5 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium placeholder:text-slate-300" placeholder="0" />
                                    </div>
                                </div>
                            </div>

                            {/* Windows */}
                            <div className="bg-slate-50/50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-amber-200 dark:hover:border-amber-500/30 transition-colors duration-300">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <div className="p-1.5 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400">
                                        <Sun size={16} />
                                    </div>
                                    Ventanas
                                </h3>
                                <div className="space-y-5">
                                    <div className="relative group">
                                        <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#1a202c] px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-amber-500 transition-colors z-10 rounded-full border border-slate-100 dark:border-white/10">Alto (m)</label>
                                        <input type="number" name="ventanaAlto" value={formData.ventanaAlto} onChange={handleChange} className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3.5 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium placeholder:text-slate-300" placeholder="0" />
                                    </div>
                                    <div className="relative group">
                                        <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#1a202c] px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-amber-500 transition-colors z-10 rounded-full border border-slate-100 dark:border-white/10">Ancho (m)</label>
                                        <input type="number" name="ventanaAncho" value={formData.ventanaAncho} onChange={handleChange} className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3.5 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium placeholder:text-slate-300" placeholder="0" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Occupancy Grid */}
                        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Users size={20} />
                                </div>
                                <label className="absolute -top-2.5 left-10 bg-white dark:bg-[#1a202c] px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-primary transition-colors z-10 rounded-full border border-slate-100 dark:border-white/10">Ocupantes</label>
                                <input type="number" name="personas" value={formData.personas} onChange={handleChange} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl p-4 pl-12 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium placeholder:text-slate-400" placeholder="#" />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Tv size={20} />
                                </div>
                                <label className="absolute -top-2.5 left-10 bg-white dark:bg-[#1a202c] px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-primary transition-colors z-10 rounded-full border border-slate-100 dark:border-white/10">Equipos</label>
                                <input type="number" name="equipos" value={formData.equipos} onChange={handleChange} className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl p-4 pl-12 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium placeholder:text-slate-400" placeholder="#" />
                            </div>
                        </motion.div>

                        {/* Standard Toggles */}
                        <motion.div variants={itemVariants} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm cursor-pointer" onClick={() => handleChange({ target: { name: 'techoAlto', type: 'checkbox', checked: !formData.techoAlto } })}>
                            <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${formData.techoAlto ? 'bg-primary border-primary' : 'bg-white dark:bg-transparent border-slate-300 dark:border-white/30'}`}>
                                {formData.techoAlto && <CheckCircle size={14} className="text-white" />}
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Techo Alto ({'>'} 2.5m)</span>
                        </motion.div>

                        {/* Advanced Options Toggle */}
                        <motion.div variants={itemVariants}>
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-4 hover:text-primary dark:hover:text-cyber-cyan transition-colors"
                            >
                                <Settings size={14} /> {showAdvanced ? 'Ocultar Opciones Avanzadas' : 'Ver Opciones Avanzadas (Techo Zinc, Sol de Tarde)'}
                            </button>

                            <AnimatePresence>
                                {showAdvanced && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="grid md:grid-cols-2 gap-4 overflow-hidden"
                                    >
                                        <div className={`p-4 rounded-xl border transition-all cursor-pointer ${formData.techoZinc ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10'}`} onClick={() => handleChange({ target: { name: 'techoZinc', type: 'checkbox', checked: !formData.techoZinc } })}>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.techoZinc ? 'bg-amber-500 border-amber-500' : 'bg-white dark:bg-transparent border-slate-300 dark:border-white/30'}`}>
                                                    {formData.techoZinc && <CheckCircle size={12} className="text-white" />}
                                                </div>
                                                <span className="text-sm font-bold text-slate-800 dark:text-amber-100 flex items-center gap-2">
                                                    <Flame size={14} /> Techo de Zinc
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-8 leading-tight">Sin cielo raso. Aumenta drásticamente la carga térmica (+20%).</p>
                                        </div>

                                        <div className={`p-4 rounded-xl border transition-all cursor-pointer ${formData.orientacionOeste ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10'}`} onClick={() => handleChange({ target: { name: 'orientacionOeste', type: 'checkbox', checked: !formData.orientacionOeste } })}>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.orientacionOeste ? 'bg-orange-500 border-orange-500' : 'bg-white dark:bg-transparent border-slate-300 dark:border-white/30'}`}>
                                                    {formData.orientacionOeste && <CheckCircle size={12} className="text-white" />}
                                                </div>
                                                <span className="text-sm font-bold text-slate-800 dark:text-orange-100 flex items-center gap-2">
                                                    <Sun size={14} /> Sol de Tarde
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-8 leading-tight">Muros expuestos al oeste reciben radiación directa (+15%).</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Calculate Button */}
                        <motion.button
                            variants={itemVariants}
                            onClick={handleCalculate}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-primary to-secondary dark:from-cyber-cyan dark:to-blue-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl transition-all duration-300 text-lg uppercase tracking-wider flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center gap-2"><Calculator size={20} /> Calcular Capacidad</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </motion.button>

                        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center font-bold text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">{error}</motion.p>}

                    </motion.div>

                    {/* --- Results Section --- */}
                    <div className="w-full" ref={resultRef}>
                        <AnimatePresence mode="wait">
                            {resultado && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Main Result Card */}
                                    <div ref={cardRef} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-primary/20 dark:border-cyber-cyan/30">
                                        <div className="bg-gradient-to-br from-primary to-indigo-900 dark:from-slate-800 dark:to-black p-8 text-center relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h3 className="text-xs font-bold text-white/70 uppercase tracking-[0.2em] mb-3">Recomendación Ghara</h3>
                                                <motion.div
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: 'spring', delay: 0.2 }}
                                                    className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-lg"
                                                >
                                                    {resultado.btu.toLocaleString()} <span className="text-lg font-medium text-white/50 block mt-1">BTU/h</span>
                                                </motion.div>
                                                <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs text-white backdrop-blur-md">
                                                    <MapPin size={12} className="text-cyber-cyan" /> {formData.ciudad} · {resultado.city.temp}°C
                                                </div>
                                            </div>
                                            {/* Abstract Shapes */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
                                        </div>

                                        <div className="p-8">
                                            {/* Details Breakdown */}
                                            <div className="space-y-4 mb-8">
                                                <DetailRow label="Carga Base (Área + Clima)" value={Math.round(resultado.detalles.cargaBase)} delay={0.1} />
                                                <DetailRow label="Personas & Equipos" value={resultado.detalles.cargaPersonas + resultado.detalles.cargaEquipos} delay={0.2} />
                                                {resultado.detalles.cargaVentana > 0 && <DetailRow label="Carga Solar (Ventanas)" value={Math.round(resultado.detalles.cargaVentana)} delay={0.3} />}
                                                {resultado.detalles.cargaTechoZinc > 0 && <DetailRow label="Factor Techo Zinc (+20%)" value={Math.round(resultado.detalles.cargaTechoZinc)} isWarning delay={0.3} />}
                                                {resultado.detalles.cargaOrientacion > 0 && <DetailRow label="Factor Sol Oeste (+15%)" value={Math.round(resultado.detalles.cargaOrientacion)} isWarning delay={0.3} />}
                                                <motion.div
                                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                                    className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-between font-bold text-slate-900 dark:text-white"
                                                >
                                                    <span>Total + Seguridad (10%)</span>
                                                    <span className="text-primary dark:text-cyber-cyan">{resultado.btu.toLocaleString()} BTU/h</span>
                                                </motion.div>
                                            </div>

                                            {/* ROI Analysis */}
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.6 }}
                                                className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/5 mb-8 relative overflow-hidden group"
                                            >
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors"></div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10">
                                                    <Zap size={14} className="text-amber-500" /> Ahorro Energético (Inverter)
                                                </h4>
                                                <div className="flex items-end justify-between relative z-10">
                                                    <div>
                                                        <div className="text-2xl font-black text-slate-800 dark:text-white">${Math.round(resultado.economics.savingsMonthly).toLocaleString()}</div>
                                                        <div className="text-[10px] font-bold text-green-600 dark:text-green-400">AHORRO MENSUAL ESTIMADO*</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs text-slate-400 line-through decoration-red-400 decoration-2">${Math.round(resultado.economics.costConventional).toLocaleString()}</div>
                                                        <div className="text-sm font-bold text-green-600 dark:text-green-400">${Math.round(resultado.economics.costInverter).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </motion.div>

                                            {/* Actions */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <button onClick={generatePDF} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all group">
                                                    <Download size={20} className="text-slate-400 group-hover:text-primary dark:group-hover:text-white mb-2 transition-colors" />
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Descargar Ficha</span>
                                                </button>
                                                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-green-500/30">
                                                    <MessageCircle size={24} className="mb-2" />
                                                    <span className="text-xs font-bold">Consultar Asesor</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Section>
        </div>
    );
};

// Helper for breakdown rows
const DetailRow = ({ label, value, isWarning = false, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className={`flex justify-between items-center border-b border-dashed border-slate-200 dark:border-white/5 pb-2 ${isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'} text-sm`}
    >
        <span>{label}</span>
        <span className="font-mono font-medium">{typeof value === 'number' ? value.toLocaleString() : value}</span>
    </motion.div>
);

export default CalculatorPage;
