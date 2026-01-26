import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCTS = [
    { id: 1, name: 'Split Muro X5', category: 'RESIDENCIAL', price: 12499, image: '/media/split_wall_modern.png', rating: 5, btu: 12000, seer: 18, type: 'split', voltage: '220V', refrigerant: 'R410A', frequency: '60Hz' },
    { id: 2, name: 'Titan Outdoor Unit', category: 'SEMI-INDUSTRIAL', price: 55900, image: '/media/condenser_outdoor.png', rating: 4, btu: 48000, seer: 16, type: 'industrial', voltage: '220V', refrigerant: 'R410A', frequency: '60Hz' },
    { id: 3, name: 'Industrial Pro V3', category: 'INDUSTRIAL', price: 88000, image: '/media/rooftop_package.png', rating: 5, btu: 60000, seer: 15, type: 'industrial', voltage: '440V', refrigerant: 'R410A', frequency: '60Hz' },
    { id: 4, name: 'Condensador Multi V', category: 'MULTI SPLIT', price: 45900, image: '/media/vrf_multi.png', rating: 4, btu: 36000, seer: 19, type: 'cassette', voltage: '220V', refrigerant: 'R32', frequency: '60Hz' },
    { id: 5, name: 'Compacto Ventana E-Series', category: 'SERIE E', price: 4200, image: '/media/window_compact.png', rating: 5, btu: 8000, seer: 11, type: 'split', voltage: '110V', refrigerant: 'R32', frequency: '60Hz' },
    { id: 6, name: 'Industrial Roof Package', category: 'PAQUETE TECHO', price: 85000, image: '/media/rooftop_package.png', rating: 4, btu: 48000, seer: 14, type: 'industrial', voltage: '220V/3Ph', refrigerant: 'R410A', frequency: '60Hz' },
    { id: 7, name: 'Split Inverter X5 Wifi', category: 'SMART CLIMATE', price: 14900, image: '/media/split_wall_modern.png', rating: 4, btu: 12000, seer: 20, type: 'split', voltage: '220V', refrigerant: 'R32', frequency: '60Hz' },
    { id: 8, name: 'Cassette Techo Premium', category: 'COMERCIAL LIGHT', price: 32000, image: '/media/cassette_ceiling.png', rating: 5, btu: 24000, seer: 18, type: 'cassette', voltage: '220V', refrigerant: 'R410A', frequency: '60Hz' },
];

const PopularCard = ({ product, onClick }) => (
    <motion.div
        whileHover={{ y: -5 }}
        onClick={onClick}
        className="bg-slate-800 dark:bg-slate-900 rounded-2xl p-6 flex items-center gap-4 cursor-pointer border border-white/10 hover:border-cyber-cyan/50 transition-all"
    >
        <div className="w-20 h-20 bg-white/5 rounded-xl flex items-center justify-center p-2">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1">
            <span className="text-cyan-400 text-[9px] font-bold uppercase tracking-wider block mb-1">{product.category}</span>
            <h4 className="text-white font-bold text-sm mb-1">{product.name}</h4>
            <p className="text-slate-400 text-xs">{product.btu.toLocaleString()} BTU</p>
        </div>
        <div className="text-right">
            <p className="text-white font-bold">${product.price.toLocaleString()}</p>
        </div>
    </motion.div>
);

const ProductCard = ({ product, onSelect }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={() => onSelect(product)}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-white/5 group cursor-pointer"
    >
        {/* Image Container */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-black p-10 flex items-center justify-center h-72 overflow-hidden">
            <span className="absolute top-4 left-4 text-[9px] font-bold tracking-widest uppercase text-primary dark:text-cyber-cyan bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
                {product.category}
            </span>

            {/* Decorative background circles */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 bg-primary dark:bg-cyber-cyan rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-500 dark:bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            <motion.img
                src={product.image}
                alt={product.name}
                className="relative z-10 w-48 h-48 object-contain drop-shadow-2xl"
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            />
        </div>

        <div className="p-6">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-1 leading-tight">{product.name}</h3>
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={`material-symbols-outlined text-base ${i < product.rating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-700'}`}>
                                star
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-5 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-base">ac_unit</span>
                    {product.btu.toLocaleString()} BTU
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-base">bolt</span>
                    SEER {product.seer}
                </span>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-3xl font-display font-bold text-primary dark:text-cyber-cyan">
                        ${product.price.toLocaleString()}
                    </p>
                </div>
                <button
                    className="bg-primary hover:bg-secondary dark:bg-cyber-cyan dark:hover:bg-white dark:text-black text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    <span className="hidden sm:inline">Ver Detalles</span>
                </button>
            </div>
        </div>
    </motion.div>
);

const TelemetryCard = ({ label, value, unit, trend }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl p-4 flex items-center justify-between">
        <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">{label}</div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                {value} <span className="text-xs text-slate-500 font-sans">{unit}</span>
            </div>
        </div>
        {trend && (
            <div className={`text-xs font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? '+' : ''}{trend}%
            </div>
        )}
    </div>
);

const ProductDetail = ({ product, onBack }) => {
    // Mock Telemetry Data
    const [telemetry, setTelemetry] = useState({
        compressorLoad: 42,
        fanSpeed: 850,
        tempOut: 32,
        powerDraw: 1.2
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry(prev => ({
                compressorLoad: Math.min(100, Math.max(0, prev.compressorLoad + (Math.random() - 0.5) * 5)).toFixed(1),
                fanSpeed: Math.floor(Math.min(1200, Math.max(600, prev.fanSpeed + (Math.random() - 0.5) * 50))),
                tempOut: (32 + (Math.random() - 0.5)).toFixed(1),
                powerDraw: (1.2 + (Math.random() - 0.5) * 0.1).toFixed(2)
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="min-h-screen bg-slate-50 dark:bg-black pt-28 pb-12 px-4 md:px-6"
        >
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 rounded-full border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">PROJECT: {product.category}</h2>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> ONLINE
                                </span>
                            </div>
                            <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white uppercase">{product.name}</h1>
                        </div>
                    </div>
                    <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-lg">download</span>
                        EXPORT DATA
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Visual - Exploded View Mockup */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 flex gap-2 z-20">
                            <button className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded">ISO View</button>
                            <button className="px-3 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors">Top</button>
                            <button className="px-3 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors">Side</button>
                        </div>

                        <div className="h-[500px] flex items-center justify-center relative">
                            {/* Grid Background */}
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #8882 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            <motion.img
                                src={product.image}
                                alt={product.name}
                                className="relative z-10 w-3/4 max-w-md object-contain drop-shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                            />

                            {/* Interactive Points Mockup */}
                            <motion.div
                                className="absolute top-1/2 left-1/2 -translate-x-12 -translate-y-12 w-4 h-4 rounded-full border-2 border-primary dark:border-cyber-cyan z-20 cursor-pointer"
                                animate={{ boxShadow: ['0 0 0 0px rgba(6,182,212,0.4)', '0 0 0 10px rgba(6,182,212,0)'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            ></motion.div>
                            <div className="absolute bottom-8 left-8 border-l-2 border-slate-200 dark:border-white/20 pl-4">
                                <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">MODEL X-500</h4>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">// EXPLODED VIEW</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Specs */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Core Specs */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">Core Specifications</h3>
                                <span className="material-symbols-outlined text-slate-400">settings</span>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Voltage Input</div>
                                    <div className="text-4xl font-display font-bold text-slate-900 dark:text-white">{product.voltage} <span className="text-base text-slate-500 font-sans font-normal">AC</span></div>
                                </div>
                                <div className="h-px bg-slate-100 dark:bg-white/5"></div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Frequency</div>
                                    <div className="text-4xl font-display font-bold text-slate-900 dark:text-white">50 / 60 <span className="text-base text-slate-500 font-sans font-normal">Hz</span></div>
                                </div>
                                <div className="h-px bg-slate-100 dark:bg-white/5"></div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Refrigerant</div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl font-display font-bold text-slate-900 dark:text-white">{product.refrigerant}</div>
                                        <div className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-[10px] font-bold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50">ECO-FRIENDLY</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schematics CTA */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-6 group cursor-pointer hover:border-primary/50 transition-colors">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white mb-2">Full Schematics</h3>
                            <p className="text-xs text-slate-500 mb-4">Download DWG / DXF engineering plans</p>
                            <div className="flex justify-between items-end">
                                <span className="material-symbols-outlined text-primary dark:text-cyber-cyan group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                <div className="grid grid-cols-2 gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
                                    {[...Array(4)].map((_, i) => <div key={i} className="w-2 h-2 bg-slate-900 dark:bg-white rounded-sm"></div>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom - Telemetry */}
                    <div className="lg:col-span-12">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary dark:text-cyber-cyan text-lg">activity_zone</span>
                            <h3 className="font-bold text-sm uppercase text-slate-900 dark:text-white">Live Performance Telemetry</h3>
                            <div className="ml-auto text-[10px] text-slate-400 font-mono">REFRESH_RATE: 500ms</div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <TelemetryCard label="SEER RATING" value={product.seer} unit="" trend={15} />
                            <TelemetryCard label="COOLING CAPACITY" value={Math.round(product.btu / 1000)} unit="k BTU/h" />
                            <TelemetryCard label="COMPRESSOR LOAD" value={telemetry.compressorLoad} unit="%" trend={0} />
                            <TelemetryCard label="AIRFLOW VOL" value={telemetry.fanSpeed} unit="CFM" />
                        </div>
                    </div>

                    {/* Purchase Bar */}
                    <div className="lg:col-span-12 mt-8">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center p-2">
                                    <img src={product.image} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">{product.name}</div>
                                    <div className="text-xl font-bold text-primary dark:text-cyber-cyan">${product.price.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="hidden md:flex flex-col items-end mr-4">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">01 High-Density Pre-Filter</div>
                                    <div className="w-32 h-1 bg-slate-100 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
                                        <div className="h-full bg-primary dark:bg-cyber-cyan w-full"></div>
                                    </div>
                                </div>
                                <button className="flex-1 md:flex-none bg-primary hover:bg-secondary dark:bg-cyber-cyan dark:hover:bg-white dark:text-black text-white px-8 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined">shopping_cart</span>
                                    Iniciar Proceso
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

const CatalogoPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [priceRange] = useState([0, 100000]);
    // State to toggle View
    const [selectedProduct, setSelectedProduct] = useState(null);

    const filteredProducts = React.useMemo(() => {
        let filtered = PRODUCTS;

        if (selectedType !== 'all') {
            filtered = filtered.filter(p => p.type === selectedType);
        }

        filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        return filtered;
    }, [selectedType, priceRange]);

    return (
        <AnimatePresence mode="wait">
            {selectedProduct ? (
                <ProductDetail key="detail" product={selectedProduct} onBack={() => setSelectedProduct(null)} />
            ) : (
                <motion.div
                    key="catalog"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-h-screen bg-background-light dark:bg-background-dark"
                >
                    <div className="pt-20 bg-slate-900 dark:bg-black">{/* Padding for navbar matching hero */}</div>

                    {/* Hero - Popular Models */}
                    <section className="bg-slate-900 dark:bg-black py-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-cyan-500/20 dark:from-cyber-cyan/10 dark:to-primary/5"></div>

                        <div className="container mx-auto px-4 md:px-6 relative z-10">
                            <motion.div
                                className="flex items-center justify-between mb-8"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div>
                                    <motion.span
                                        className="material-symbols-outlined text-cyan-400 text-3xl mb-2 block"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        local_fire_department
                                    </motion.span>
                                    <h2 className="font-display font-bold text-3xl text-white">Modelos Más Buscados</h2>
                                    <p className="text-slate-400 text-sm">Los favoritos de nuestros clientes este mes</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                            >
                                {PRODUCTS.slice(0, 3).map((product) => (
                                    <motion.div
                                        key={product.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                    >
                                        <PopularCard product={product} onClick={() => setSelectedProduct(product)} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>

                    {/* Info Banners */}
                    <div className="bg-primary dark:bg-slate-900 py-3">
                        <div className="container mx-auto px-4 md:px-6 flex flex-wrap justify-center gap-6 text-white text-sm">
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">local_shipping</span>
                                Envío Gratis en pedidos &gt; $6,000
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">ac_unit</span>
                                Gas-re-illa Elemento de Temporada
                            </span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <section className="py-12">
                        <div className="container mx-auto px-4 md:px-6">

                            {/* Search & Results Count */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div className="relative flex-1 max-w-md">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                    <input
                                        type="text"
                                        placeholder="Buscar productos..."
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary dark:focus:border-cyber-cyan transition-colors"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-slate-500">Mostrando {filteredProducts.length} resultados</p>
                                    <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary dark:focus:border-cyber-cyan">
                                        <option>Relevancia</option>
                                        <option>Menor Precio</option>
                                        <option>Mayor Precio</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Filters Sidebar */}
                                <aside className="lg:w-64 space-y-6">
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-white/5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-slate-900 dark:text-white">Filtros</h3>
                                            <button className="text-xs text-primary dark:text-cyber-cyan hover:underline">Limpiar</button>
                                        </div>

                                        {/* Type Filter */}
                                        <div className="mb-6">
                                            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3 uppercase text-xs tracking-wider">Tipo de Sistema</h4>
                                            <div className="space-y-2">
                                                {[
                                                    { label: 'Split Muro', value: 'split', count: 42 },
                                                    { label: 'Cassette', value: 'cassette', count: 18 },
                                                    { label: 'Piso Techo', value: 'piso', count: 9 },
                                                    { label: 'Industrial', value: 'industrial', count: 12 }
                                                ].map(type => (
                                                    <label key={type.value} className="flex items-center gap-2 cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value={type.value}
                                                            checked={selectedType === type.value}
                                                            onChange={(e) => setSelectedType(e.target.value)}
                                                            className="w-4 h-4 accent-primary dark:accent-cyber-cyan"
                                                        />
                                                        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-cyber-cyan transition-colors">
                                                            {type.label} ({type.count})
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Capacity Filter */}
                                        <div className="mb-6">
                                            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3 uppercase text-xs tracking-wider">Capacidad (BTU)</h4>
                                            <div className="space-y-2">
                                                {['< 12,000', '12,000', '18,000', '24,000', '> 36,000'].map(cap => (
                                                    <label key={cap} className="flex items-center gap-2 cursor-pointer group">
                                                        <input type="checkbox" className="w-4 h-4 accent-primary dark:accent-cyber-cyan" />
                                                        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-cyber-cyan transition-colors">{cap}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* SEER Filter */}
                                        <div className="mb-6">
                                            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3 uppercase text-xs tracking-wider">Eficiencia (SEER)</h4>
                                            <div className="space-y-2">
                                                {['SEER 11-15', 'SEER 16-19', 'SEER 20+'].map(seer => (
                                                    <label key={seer} className="flex items-center gap-2 cursor-pointer group">
                                                        <input type="checkbox" className="w-4 h-4 accent-primary dark:accent-cyber-cyan" />
                                                        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-cyber-cyan transition-colors">{seer}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price Range */}
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3 uppercase text-xs tracking-wider">Precio</h4>
                                            <div className="flex gap-2 mb-3">
                                                <input type="number" placeholder="Min" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm" />
                                                <input type="number" placeholder="Max" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </aside>

                                {/* Product Grid */}
                                <div className="flex-1">
                                    {/* Category Tabs */}
                                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                                        {[
                                            { icon: 'home', label: 'Residencial' },
                                            { icon: 'store', label: 'Comercial' },
                                            { icon: 'factory', label: 'Industrial' },
                                            { icon: 'bedroom_parent', label: 'Portables' }
                                        ].map(cat => (
                                            <button
                                                key={cat.label}
                                                className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === cat.label
                                                    ? 'bg-primary text-white dark:bg-cyber-cyan dark:text-black shadow-lg'
                                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-white/5'
                                                    }`}
                                                onClick={() => setSelectedCategory(cat.label)}
                                            >
                                                <span className="material-symbols-outlined">{cat.icon}</span>
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Products */}
                                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        <AnimatePresence>
                                            {filteredProducts.map(product => (
                                                <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Pagination */}
                                    <div className="flex justify-center items-center gap-2 mt-12">
                                        <button className="w-10 h-10 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            <span className="material-symbols-outlined">chevron_left</span>
                                        </button>
                                        {[1, 2, 3, 4].map(page => (
                                            <button
                                                key={page}
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors ${page === 1
                                                    ? 'bg-primary text-white dark:bg-cyber-cyan dark:text-black'
                                                    : 'border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button className="w-10 h-10 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            <span className="material-symbols-outlined">chevron_right</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CatalogoPage;
