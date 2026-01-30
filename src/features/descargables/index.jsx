import React from 'react';
import { motion } from 'framer-motion';
import { useSEO } from '../../shared/hooks/useSEO';

const DescargablesPage = () => {
    useSEO({
        title: 'Descargables | Ghara - Documentos y Políticas',
        description: 'Descarga nuestras autorizaciones de tratamiento de datos, políticas de privacidad y documentos legales oficiales de Ghara.',
        keywords: ['descargables', 'políticas', 'tratamiento de datos', 'Ghara', 'documentos legales'],
        ogImage: '/media/logo-ghara.svg'
    });

    const documents = [
        {
            title: 'Autorización Tratamiento Datos Clientes',
            description: 'Autorización para el tratamiento de datos personales de nuestros clientes.',
            file: 'AUTORIZACIÓN DE TRATAMIENTO DE DATOS CLIENTES V1.docx',
            type: 'DOCX',
            icon: 'description',
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Autorización Tratamiento Datos Proveedores',
            description: 'Autorización para el tratamiento de datos personales de proveedores y aliados.',
            file: 'AUTORIZACIÓN DE TRATAMIENTO DE DATOS PROVEEDORES V1.docx',
            type: 'DOCX',
            icon: 'local_shipping',
            color: 'from-indigo-500 to-indigo-600'
        },
        {
            title: 'Autorización Uso de Imagen Clientes',
            description: 'Autorización para el uso y manejo de imagen de nuestros clientes.',
            file: 'AUTORIZACIÓN DE USO Y MANEJO DE IMAGEN CLIENTES V1.docx',
            type: 'DOCX',
            icon: 'image',
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Política Tratamiento Datos Personales',
            description: 'Política oficial de tratamiento de datos personales de Ghara S.A.S.',
            file: 'POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES GHARA S.pdf',
            type: 'PDF',
            icon: 'verified_user',
            color: 'from-teal-500 to-teal-600'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black pt-24 pb-16">
            {/* Hero Section */}
            <section className="container mx-auto px-4 md:px-6 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <span className="inline-block px-4 py-1.5 bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        Documentos Oficiales
                    </span>
                    <h1 className="font-display font-bold text-4xl md:text-6xl text-slate-900 dark:text-white mb-6">
                        Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Descargables</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        Accede a todos nuestros documentos legales, políticas de privacidad y autorizaciones de manera transparente.
                    </p>
                </motion.div>
            </section>

            {/* Documents Grid */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {documents.map((doc, index) => (
                        <motion.a
                            key={index}
                            href={`/media/documentos/${doc.file}`}
                            download
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-white/5 group hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                        >
                            {/* Background Gradient on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${doc.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                            <div className="relative z-10 flex items-start gap-6">
                                {/* Icon */}
                                <div className={`w-16 h-16 bg-gradient-to-br ${doc.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                    <span className="material-symbols-outlined text-3xl text-white">{doc.icon}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                                            {doc.title}
                                        </h3>
                                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500 font-bold uppercase tracking-wider">
                                            {doc.type}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                        {doc.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-primary dark:text-cyan-400 text-sm font-bold">
                                        <span className="material-symbols-outlined text-lg">download</span>
                                        Descargar documento
                                        <motion.span
                                            className="material-symbols-outlined text-lg"
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            arrow_forward
                                        </motion.span>
                                    </div>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </section>

            {/* Info Section */}
            <section className="container mx-auto px-4 md:px-6 mt-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-primary to-blue-700 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl -ml-24 -mb-24"></div>

                    <div className="relative z-10">
                        <span className="material-symbols-outlined text-5xl text-white/80 mb-6 block">shield</span>
                        <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
                            Tu privacidad es nuestra prioridad
                        </h2>
                        <p className="text-white/80 max-w-xl mx-auto leading-relaxed">
                            En Ghara nos comprometemos a proteger tu información personal. Estos documentos reflejan nuestro compromiso con la transparencia y el cumplimiento de las normativas de protección de datos.
                        </p>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default DescargablesPage;
