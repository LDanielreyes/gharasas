import React from 'react';
import { motion } from 'framer-motion';
import { useSEO } from '../../shared/hooks/useSEO';

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' },
    }),
};

const COMPANY = 'Ghara SAS';
const NIT = 'En trámite';
const EMAIL = 'gharasas.colombia@gmail.com';
const PHONE = '+57 302 232 6569';
const ADDRESS = 'Cra. 27 #68b-105, Suroccidente, Barranquilla, Atlántico, Colombia';
const UPDATED = '29 de marzo de 2026';

const sections = [
    {
        title: '1. Responsable del Tratamiento',
        content: (
            <>
                <p>
                    <strong>{COMPANY}</strong> (en adelante "la Empresa"), identificada con NIT {NIT},
                    con domicilio en {ADDRESS}, es la entidad responsable del tratamiento de los datos
                    personales recolectados a través de este sitio web y sus canales de contacto.
                </p>
                <ul className="mt-3 space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
                    <li><strong>Correo electrónico:</strong> {EMAIL}</li>
                    <li><strong>Teléfono / WhatsApp:</strong> {PHONE}</li>
                    <li><strong>Dirección:</strong> {ADDRESS}</li>
                </ul>
            </>
        ),
    },
    {
        title: '2. Marco Legal',
        content: (
            <p>
                La presente política se rige por la <strong>Ley 1581 de 2012</strong> (Ley de Protección
                de Datos Personales), el <strong>Decreto 1377 de 2013</strong> y demás normas concordantes
                y complementarias vigentes en la República de Colombia, que regulan la recolección,
                almacenamiento, uso, circulación y supresión de datos personales.
            </p>
        ),
    },
    {
        title: '3. Finalidades del Tratamiento',
        content: (
            <>
                <p>Los datos personales recolectados serán utilizados para las siguientes finalidades:</p>
                <ul className="mt-3 space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400">
                    <li>Gestionar solicitudes de cotización, instalación y mantenimiento de equipos de aire acondicionado y climatización HVAC.</li>
                    <li>Dar respuesta a peticiones, quejas y reclamos (PQR) presentados a través del formulario del sitio web.</li>
                    <li>Enviar información comercial, promociones y novedades relacionadas con nuestros servicios, previo consentimiento del titular.</li>
                    <li>Gestionar la vinculación de técnicos y distribuidores aliados al programa "Familia Ghara".</li>
                    <li>Generar estadísticas internas, análisis de uso del sitio web y mejora continua de nuestros servicios.</li>
                    <li>Cumplir con obligaciones legales, contractuales y regulatorias aplicables.</li>
                    <li>Facilitar la comunicación a través de WhatsApp, correo electrónico y otros canales habilitados.</li>
                </ul>
            </>
        ),
    },
    {
        title: '4. Datos Recolectados',
        content: (
            <>
                <p>A través de nuestros formularios y canales de contacto podemos recolectar:</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        'Nombre completo',
                        'Número de cédula o NIT',
                        'Correo electrónico',
                        'Número de teléfono / celular',
                        'Dirección de residencia o trabajo',
                        'Ciudad y departamento',
                        'Información del espacio a climatizar (área, tipo de uso)',
                        'Datos de navegación y cookies (IP, navegador, dispositivo)',
                    ].map((item) => (
                        <div
                            key={item}
                            className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                        >
                            <span className="material-symbols-outlined text-primary dark:text-cyan-400 text-lg mt-0.5">check_circle</span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">{item}</span>
                        </div>
                    ))}
                </div>
            </>
        ),
    },
    {
        title: '5. Derechos de los Titulares',
        content: (
            <>
                <p>
                    De conformidad con la Ley 1581 de 2012, los titulares de los datos personales tienen
                    los siguientes derechos:
                </p>
                <div className="mt-4 space-y-3">
                    {[
                        { icon: 'visibility', title: 'Conocer', desc: 'Acceder a sus datos personales que hayan sido objeto de tratamiento.' },
                        { icon: 'edit', title: 'Actualizar', desc: 'Solicitar la actualización o rectificación de sus datos cuando estos sean inexactos, incompletos o estén desactualizados.' },
                        { icon: 'delete', title: 'Suprimir', desc: 'Solicitar la supresión de sus datos cuando no exista obligación legal o contractual que justifique su conservación.' },
                        { icon: 'block', title: 'Revocar', desc: 'Revocar la autorización otorgada para el tratamiento de sus datos personales.' },
                        { icon: 'gavel', title: 'Quejarse', desc: 'Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.' },
                        { icon: 'download', title: 'Solicitar prueba', desc: 'Solicitar prueba de la autorización otorgada, salvo las excepciones previstas en la ley.' },
                    ].map((right) => (
                        <div
                            key={right.title}
                            className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-cyan-500/5 dark:from-cyan-500/5 dark:to-primary/5 border border-primary/10 dark:border-cyan-500/10"
                        >
                            <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 dark:bg-cyan-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary dark:text-cyan-400">{right.icon}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{right.title}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{right.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        ),
    },
    {
        title: '6. Procedimiento para Ejercer sus Derechos',
        content: (
            <>
                <p>
                    Para ejercer cualquiera de los derechos mencionados, el titular o su representante
                    legal podrá dirigir su solicitud a través de los siguientes canales:
                </p>
                <ul className="mt-3 space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
                    <li><strong>Correo electrónico:</strong> {EMAIL}</li>
                    <li><strong>WhatsApp:</strong> {PHONE}</li>
                    <li><strong>Formulario PQR:</strong> disponible en la sección <a href="/pqr" className="text-primary dark:text-cyan-400 underline hover:no-underline">PQR</a> de este sitio web.</li>
                </ul>
                <p className="mt-3">
                    La solicitud deberá contener: nombre completo del titular, número de identificación,
                    descripción de los hechos que dan lugar a la petición, dirección de contacto y
                    documentos que soporten la solicitud. {COMPANY} dará respuesta en un plazo máximo
                    de <strong>quince (15) días hábiles</strong> contados a partir de la fecha de recepción
                    de la solicitud.
                </p>
            </>
        ),
    },
    {
        title: '7. Seguridad de la Información',
        content: (
            <p>
                {COMPANY} adopta medidas técnicas, humanas y administrativas razonables para proteger
                los datos personales contra acceso no autorizado, pérdida, alteración o destrucción.
                Nuestro sitio web opera bajo protocolo <strong>HTTPS</strong> y utiliza servicios de
                terceros confiables (EmailJS para formularios, Google Analytics para estadísticas,
                Vercel para alojamiento) que cuentan con sus propias políticas de seguridad y
                privacidad.
            </p>
        ),
    },
    {
        title: '8. Cookies y Tecnologías de Seguimiento',
        content: (
            <>
                <p>
                    Este sitio web utiliza <strong>cookies</strong> y tecnologías similares para mejorar
                    la experiencia del usuario, analizar el tráfico web y personalizar contenidos.
                    En particular utilizamos:
                </p>
                <ul className="mt-3 space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
                    <li><strong>Google Analytics (GA4):</strong> para estadísticas anónimas de uso del sitio.</li>
                    <li><strong>Cookies de preferencia:</strong> para recordar su selección de tema (claro/oscuro).</li>
                    <li><strong>Leaflet:</strong> para el mapa interactivo de ubicación.</li>
                </ul>
                <p className="mt-3">
                    El usuario puede configurar su navegador para rechazar o eliminar cookies en
                    cualquier momento, aunque esto podría afectar la funcionalidad del sitio.
                </p>
            </>
        ),
    },
    {
        title: '9. Transferencia y Transmisión de Datos',
        content: (
            <p>
                {COMPANY} podrá compartir datos personales con terceros proveedores de servicios
                (como plataformas de correo electrónico, hosting y analítica) únicamente para
                cumplir con las finalidades descritas en esta política. En todos los casos, se
                garantizará que dichos terceros cuenten con niveles adecuados de protección de
                datos personales conforme a la legislación colombiana.
            </p>
        ),
    },
    {
        title: '10. Vigencia',
        content: (
            <p>
                La presente política entra en vigencia a partir de su publicación en el sitio web
                y permanecerá vigente mientras {COMPANY} continúe realizando actividades de
                tratamiento de datos personales. Los datos personales serán conservados durante
                el tiempo necesario para cumplir con las finalidades descritas o según lo exija
                la ley. {COMPANY} se reserva el derecho de modificar esta política en cualquier
                momento, publicando la versión actualizada en este mismo sitio web.
            </p>
        ),
    },
];

export default function PoliticaDatosPage() {
    useSEO({
        title: 'Política de Tratamiento de Datos Personales | Ghara SAS',
        description:
            'Conoce cómo Ghara SAS recopila, usa y protege tus datos personales conforme a la Ley 1581 de 2012 de Colombia.',
    });

    return (
        <section className="min-h-screen pt-36 pb-24 bg-white dark:bg-slate-950 transition-colors duration-500">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-cyan-500/10 border border-primary/20 dark:border-cyan-500/20 mb-6">
                        <span className="material-symbols-outlined text-primary dark:text-cyan-400 text-lg">shield</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-cyan-400">
                            Protección de Datos
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-4 leading-tight">
                        Política de Tratamiento de{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">
                            Datos Personales
                        </span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                        En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia,
                        {COMPANY} informa sobre el tratamiento de datos personales.
                    </p>
                    <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                        Última actualización: {UPDATED}
                    </p>
                </motion.div>

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section, i) => (
                        <motion.article
                            key={section.title}
                            className="p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-primary/30 dark:hover:border-cyan-500/30 transition-colors"
                            custom={i}
                            variants={sectionVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                        >
                            <h2 className="text-lg md:text-xl font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 shrink-0 rounded-lg bg-primary/10 dark:bg-cyan-500/10 flex items-center justify-center text-primary dark:text-cyan-400 text-sm font-black">
                                    {i + 1}
                                </span>
                                {section.title.replace(/^\d+\.\s*/, '')}
                            </h2>
                            <div className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                                {section.content}
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    className="mt-16 text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/5 via-cyan-500/5 to-primary/5 dark:from-cyan-500/5 dark:via-primary/5 dark:to-cyan-500/5 border border-primary/10 dark:border-cyan-500/10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <span className="material-symbols-outlined text-4xl text-primary dark:text-cyan-400 mb-4 block">
                        mail
                    </span>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">
                        ¿Tienes preguntas sobre tus datos?
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-md mx-auto">
                        Puedes ejercer tus derechos contactándonos directamente o a través de nuestro formulario PQR.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href={`mailto:${EMAIL}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors shadow-lg hover:shadow-primary/30"
                        >
                            <span className="material-symbols-outlined text-lg">email</span>
                            {EMAIL}
                        </a>
                        <a
                            href="/pqr"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary dark:border-cyan-500 text-primary dark:text-cyan-400 text-sm font-bold hover:bg-primary/10 dark:hover:bg-cyan-500/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">forum</span>
                            Ir a PQR
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
