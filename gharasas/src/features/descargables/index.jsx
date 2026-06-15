import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSEO } from '../../shared/hooks/useSEO';
import axios from 'axios';
import documentsData from '../../data/documentsConfig.json';

const DescargablesPage = () => {
    useSEO({
        title: 'Biblioteca Técnica | Ghara - Documentación y Recursos',
        description: 'Accede a nuestra biblioteca técnica completa: fichas técnicas, manuales, códigos de error, catálogos y documentos legales.',
        keywords: ['biblioteca técnica', 'documentación', 'fichas técnicas', 'manuales', 'Ghara'],
        ogImage: '/media/logo-ghara.svg'
    });

    // States
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, name-asc, name-desc
    const itemsPerPage = 9;

    // Get available years
        useEffect(() => {
        const fetchDocs = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/descargables`);
                const mapped = res.data.map(d => ({
                    id: d.idDescargable.toString(),
                    title: d.titulo,
                    description: d.descripcion || '',
                    category: d.categoria,
                    fileType: d.tipoArchivo,
                    fileSize: d.pesoArchivo,
                    url: `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api$/, '')}${d.rutaArchivo}`,
                    date: d.fechaCreacion,
                    year: d.version,
                    tags: d.tags ? d.tags.split(',').map(t => t.trim()) : []
                }));
                setDocuments(mapped);
            } catch (err) {
                console.error('Error fetching descargables:', err);
                setErrorMsg(err.toString() + (err.response ? ' ' + JSON.stringify(err.response.data) : ''));
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocs();
    }, []);

    const availableYears = useMemo(() => {
        const years = [...new Set(documents.map(doc => doc.year))];
        return years.sort((a, b) => b - a);
    }, [documents]);

    // Filter and search logic
    const filteredDocuments = useMemo(() => {
        let filtered = documents;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(doc =>
                doc.title.toLowerCase().includes(query) ||
                doc.description.toLowerCase().includes(query) ||
                doc.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Year filter
        if (selectedYear !== 'all') {
            filtered = filtered.filter(doc => doc.year === parseInt(selectedYear));
        }

        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(doc => selectedCategories.includes(doc.category));
        }

        // Sorting
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'name-asc':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [documents, searchQuery, selectedYear, selectedCategories, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const paginatedDocuments = filteredDocuments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedYear, selectedCategories]);

    // Scroll to top when page changes
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // Toggle category
    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Get file type color
    const getFileTypeColor = (type) => {
        switch (type) {
            case 'PDF': return 'from-red-500 to-red-600';
            case 'DOCX': return 'from-blue-500 to-blue-600';
            case 'MP4': return 'from-purple-500 to-purple-600';
            case 'BIN': return 'from-green-500 to-green-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    // Get category data
    const getCategoryData = (categoryId) => {
        return documentsData.categories.find(cat => cat.id === categoryId) || {};
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32">
            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="flex gap-6">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-800">
                            <h3 className="font-display font-bold text-lg mb-6 text-slate-900 dark:text-white">
                                Filtros
                            </h3>

                            {/* Year Filter */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                                    Año de Publicación
                                </label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="all">Todos los años</option>
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                                    Categorías
                                </label>
                                <div className="space-y-2">
                                    {documentsData.categories.map(category => (
                                        <label
                                            key={category.id}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={() => toggleCategory(category.id)}
                                                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                {category.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {(selectedYear !== 'all' || selectedCategories.length > 0) && (
                                <button
                                    onClick={() => {
                                        setSelectedYear('all');
                                        setSelectedCategories([]);
                                    }}
                                    className="w-full mt-6 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
                                <div className="w-full sm:w-auto">
                                    <div className="flex justify-between items-start w-full">
                                        <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-900 dark:text-white mb-2 leading-tight">
                                            Biblioteca Técnica <br className="sm:hidden" />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">2026</span>
                                        </h1>
                                        {/* Mobile Filter Button */}
                                        <button
                                            onClick={() => setSidebarOpen(true)}
                                            className="lg:hidden flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-sm font-medium mt-1"
                                        >
                                            <span className="material-symbols-outlined text-lg">tune</span>
                                            Filtros
                                        </button>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 text-sm sm:text-base mt-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></span>
                                        <span>Sistema actualizado: {filteredDocuments.length} documentos disponibles</span>
                                    </p>
                                </div>
                            </div>

                            {/* Search and Sort */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Search Bar */}
                                <div className="flex-1 relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        search
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Buscar manuales, esquemas, firmware..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
                                    />
                                </div>

                                {/* Sort */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
                                >
                                    <option value="date-desc">Más reciente</option>
                                    <option value="date-asc">Más antiguo</option>
                                    <option value="name-asc">A-Z</option>
                                    <option value="name-desc">Z-A</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(selectedYear !== 'all' || selectedCategories.length > 0) && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {selectedYear !== 'all' && (
                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-sm font-medium">
                                        Año: {selectedYear}
                                        <button onClick={() => setSelectedYear('all')} className="hover:text-cyan-700">
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </span>
                                )}
                                {selectedCategories.map(catId => {
                                    const cat = getCategoryData(catId);
                                    return (
                                        <span key={catId} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                                            {cat.name}
                                            <button onClick={() => toggleCategory(catId)} className="hover:text-blue-700">
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {/* Documents Grid */}
                        {errorMsg ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                <p><strong>Error cargando documentos:</strong> {errorMsg}</p>
                            </div>
                        ) : isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-slate-500 dark:text-slate-400">Cargando biblioteca técnica...</p>
                            </div>
                        ) : paginatedDocuments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                                <AnimatePresence mode="popLayout">
                                    {paginatedDocuments.map((doc, index) => {
                                        const categoryData = getCategoryData(doc.category);
                                        return (
                                            <motion.a
                                                key={doc.id}
                                                href={doc.url} target="_blank" rel="noopener noreferrer"
                                                download
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                whileHover={{ y: -8 }}
                                                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all group cursor-pointer relative overflow-hidden"
                                            >
                                                {/* Background Gradient */}
                                                <div className={`absolute inset-0 bg-gradient-to-br ${getFileTypeColor(doc.fileType)} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                                                {/* Content */}
                                                <div className="relative z-10">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className={`w-12 h-12 bg-gradient-to-br ${getFileTypeColor(doc.fileType)} rounded-xl flex items-center justify-center shadow-md`}>
                                                            <span className="material-symbols-outlined text-white text-xl">
                                                                {categoryData.icon || 'description'}
                                                            </span>
                                                        </div>
                                                        <span className="px-2 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-md text-xs font-bold">
                                                            Ver. {doc.year}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                                        {doc.title}
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                                                        {doc.description}
                                                    </p>

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                            <span className="flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-sm">description</span>
                                                                {doc.fileType}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-sm">data_usage</span>
                                                                {doc.fileSize}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                                {doc.date}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Download Icon */}
                                                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="material-symbols-outlined text-cyan-500 text-2xl">
                                                            download
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.a>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4 block">
                                    search_off
                                </span>
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">
                                    No se encontraron documentos
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-4">
                                    Intenta ajustar los filtros o la búsqueda
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedYear('all');
                                        setSelectedCategories([]);
                                    }}
                                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>

                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Show first, last, current, and adjacent pages
                                    if (
                                        pageNum === 1 ||
                                        pageNum === totalPages ||
                                        Math.abs(pageNum - currentPage) <= 1
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`min-w-[40px] h-10 rounded-lg font-medium transition-colors ${currentPage === pageNum
                                                    ? 'bg-cyan-500 text-white'
                                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (
                                        pageNum === currentPage - 2 ||
                                        pageNum === currentPage + 2
                                    ) {
                                        return <span key={pageNum} className="text-slate-400">...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 z-50 lg:hidden p-6 overflow-y-auto shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                                    Filtros
                                </h3>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            {/* Year Filter */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                                    Año de Publicación
                                </label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => {
                                        setSelectedYear(e.target.value);
                                        setSidebarOpen(false);
                                    }}
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="all">Todos los años</option>
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                                    Categorías
                                </label>
                                <div className="space-y-3">
                                    {documentsData.categories.map(category => (
                                        <label
                                            key={category.id}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={() => toggleCategory(category.id)}
                                                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                {category.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Clear & Apply */}
                            <div className="space-y-3">
                                {(selectedYear !== 'all' || selectedCategories.length > 0) && (
                                    <button
                                        onClick={() => {
                                            setSelectedYear('all');
                                            setSelectedCategories([]);
                                        }}
                                        className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Limpiar filtros
                                    </button>
                                )}
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Aplicar filtros
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DescargablesPage;
