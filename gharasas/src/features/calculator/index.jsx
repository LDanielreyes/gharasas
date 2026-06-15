import client from '../../shared/api/client';
import { Link } from 'react-router-dom';
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Users, Tv, Monitor, Lightbulb, LayoutGrid, Package,
    Calculator, Download, MessageCircle,
    Plus, Minus, Trash2, AlertTriangle, Star, CheckCircle, ArrowRight,
    Building2, Home, Wind, Sun, BarChart3, TrendingDown
} from 'lucide-react';
import Section from '../../shared/components/ui/Section';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ---- BRAND ------------------------------------------------------------------
const B = {
    primary: '#0C4D89', mid: '#2678A4', accent: '#2DC4C4',
    light: '#EAF6F7', border: '#D0E8ED', text: '#0D2137',
    muted: '#5B8FA8', bg: '#F4FAFA', surface: '#FFFFFF',
    danger: '#DC2626', warning: '#D97706', success: '#0E9E6E',
};

// ---- CONSTANTS --------------------------------------------------------------
const CITIES = [
    { name: 'Barranquilla', temp: 32, label: 'Calido Costero' },
    { name: 'Cartagena',    temp: 31, label: 'Calido Costero' },
    { name: 'Santa Marta',  temp: 32, label: 'Calido Costero' },
    { name: 'Bogota',       temp: 14, label: 'Frio'           },
    { name: 'Medellin',     temp: 22, label: 'Templado'       },
    { name: 'Cali',         temp: 24, label: 'Calido Seco'    },
    { name: 'Bucaramanga',  temp: 23, label: 'Templado'       },
    { name: 'Cucuta',       temp: 28, label: 'Calido'         },
    { name: 'Pereira',      temp: 21, label: 'Templado'       },
    { name: 'Monteria',     temp: 33, label: 'Muy Calido'     },
    { name: 'Otro / Manual',temp: 25, label: 'Personalizado'  },
];

const KWH_COST = 850;

const DEVICE_DEFS = [
    { key: 'personas',     label: 'Personas',     btu: 600  },
    { key: 'televisores',  label: 'Televisores',  btu: 500  },
    { key: 'computadores', label: 'Computadores', btu: 600  },
    { key: 'luces',        label: 'Luces',        btu: 300  },
    { key: 'ventanas',     label: 'Ventanas',     btu: 1200 },
    { key: 'otros',        label: 'Otros',        btu: 400  },
];

const BTU_LEVELS = [9000,12000,18000,24000,36000,48000,60000];

const PREFERENCES = [
    { key: 'ahorro', label: 'Maximo Ahorro',  desc: 'Inverter con alto SEER. Menor factura mensual.',  icon: TrendingDown },
    { key: 'precio', label: 'Menor Precio',   desc: 'Inversion inicial accesible.',                    icon: Star         },
    { key: 'smart',  label: 'Smart / WiFi',   desc: 'Control desde el celular. Ultima tecnologia.',     icon: Wind         },
];

const SVG_W = 580, SVG_H = 280, SNAP = 8;

// ---- SVG DEVICE ICONS (line-art, sin emojis) --------------------------------
// Cada icono es un <g> de paths finos, estilo blueprint/plano técnico.
const PlanIcon = ({ type, x, y, s = 10, color = B.mid }) => {
    const sw = Math.max(0.7, s * 0.09);
    const icons = {
        // Silueta de persona: cabeza + cuerpo
        personas: (
            <>
                <circle cx={s/2} cy={s*0.27} r={s*0.2} fill="none" stroke={color} strokeWidth={sw}/>
                <path d={`M${s*0.12},${s} C${s*0.12},${s*0.55} ${s*0.88},${s*0.55} ${s*0.88},${s}`}
                    fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
                <line x1={s/2} y1={s*0.47} x2={s/2} y2={s*0.68} stroke={color} strokeWidth={sw}/>
            </>
        ),
        // Televisor: pantalla + base + patas
        televisores: (
            <>
                <rect x={s*0.05} y={0} width={s*0.9} height={s*0.68} rx={s*0.07}
                    fill="none" stroke={color} strokeWidth={sw}/>
                <rect x={s*0.18} y={s*0.1} width={s*0.64} height={s*0.46} rx={s*0.04}
                    fill="none" stroke={color} strokeWidth={sw*0.6}/>
                <line x1={s*0.5} y1={s*0.68} x2={s*0.5} y2={s*0.8} stroke={color} strokeWidth={sw}/>
                <line x1={s*0.2} y1={s*0.8} x2={s*0.8} y2={s*0.8} stroke={color} strokeWidth={sw} strokeLinecap="round"/>
            </>
        ),
        // Laptop: tapa abierta + base con teclado
        computadores: (
            <>
                <rect x={s*0.15} y={0} width={s*0.7} height={s*0.52} rx={s*0.06}
                    fill="none" stroke={color} strokeWidth={sw}/>
                <rect x={s*0.22} y={s*0.07} width={s*0.56} height={s*0.38} rx={s*0.03}
                    fill="none" stroke={color} strokeWidth={sw*0.6}/>
                <path d={`M0,${s*0.62} L${s*0.12},${s*0.52} L${s*0.88},${s*0.52} L${s},${s*0.62} Z`}
                    fill="none" stroke={color} strokeWidth={sw}/>
                <line x1={s*0.3} y1={s*0.72} x2={s*0.7} y2={s*0.72} stroke={color} strokeWidth={sw*0.6}/>
            </>
        ),
        // Bombilla: circulo + base + filamentos
        luces: (
            <>
                <path d={`M${s*0.2},${s*0.42} A${s*0.3},${s*0.3} 0 1 1 ${s*0.8},${s*0.42} L${s*0.7},${s*0.62} L${s*0.3},${s*0.62} Z`}
                    fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"/>
                <line x1={s*0.33} y1={s*0.62} x2={s*0.33} y2={s*0.76} stroke={color} strokeWidth={sw}/>
                <line x1={s*0.67} y1={s*0.62} x2={s*0.67} y2={s*0.76} stroke={color} strokeWidth={sw}/>
                <rect x={s*0.3} y={s*0.76} width={s*0.4} height={s*0.12} rx={2}
                    fill="none" stroke={color} strokeWidth={sw}/>
                <line x1={s*0.35} y1={s*0.88} x2={s*0.35} y2={s} stroke={color} strokeWidth={sw}/>
                <line x1={s*0.65} y1={s*0.88} x2={s*0.65} y2={s} stroke={color} strokeWidth={sw}/>
                <line x1={s*0.3} y1={s} x2={s*0.7} y2={s} stroke={color} strokeWidth={sw} strokeLinecap="round"/>
            </>
        ),
        // Ventana: marco + 4 paneles
        ventanas: (
            <>
                <rect x={0} y={0} width={s} height={s} rx={s*0.07}
                    fill="none" stroke={color} strokeWidth={sw}/>
                <line x1={s/2} y1={s*0.08} x2={s/2} y2={s*0.92} stroke={color} strokeWidth={sw}/>
                <line x1={s*0.08} y1={s/2} x2={s*0.92} y2={s/2} stroke={color} strokeWidth={sw}/>
                <line x1={0} y1={s*0.08} x2={s} y2={s*0.08} stroke={color} strokeWidth={sw*0.5}/>
            </>
        ),
        // Caja / unidad industrial: cubo simple con líneas
        otros: (
            <>
                <rect x={0} y={s*0.18} width={s} height={s*0.82} rx={s*0.07}
                    fill="none" stroke={color} strokeWidth={sw}/>
                <path d={`M0,${s*0.18} L${s*0.5},0 L${s},${s*0.18}`}
                    fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"/>
                <line x1={s*0.25} y1={s*0.45} x2={s*0.75} y2={s*0.45} stroke={color} strokeWidth={sw*0.7}/>
                <line x1={s*0.25} y1={s*0.6}  x2={s*0.75} y2={s*0.6}  stroke={color} strokeWidth={sw*0.7}/>
                <line x1={s*0.25} y1={s*0.75} x2={s*0.75} y2={s*0.75} stroke={color} strokeWidth={sw*0.7}/>
            </>
        ),
    };
    return <g transform={`translate(${x},${y})`}>{icons[type] ?? null}</g>;
};

// ---- ENGINE -----------------------------------------------------------------
const calcRoomBTU = (room, city) => {
    const largo = parseFloat(room.largo) || 0;
    const ancho = parseFloat(room.ancho) || 0;
    if (!largo || !ancho) return { error: true, btu: 0, area: '0', detalles: {} };
    const area = largo * ancho;
    const factorClima = city.temp >= 30 ? 800 : city.temp <= 18 ? 450 : 600;
    let cargaBase = area * factorClima;
    let cargaTechoZinc = 0, cargaOrientacion = 0;
    if (room.techoZinc)        { cargaTechoZinc   = cargaBase*0.20; cargaBase += cargaTechoZinc; }
    if (room.orientacionOeste) { cargaOrientacion = cargaBase*0.15; cargaBase += cargaOrientacion; }
    const cargaAltura = room.techoAlto ? cargaBase*0.15 : 0;
    let cargaDisp = 0;
    DEVICE_DEFS.forEach(d => { cargaDisp += (parseInt(room.devices?.[d.key]) || 0) * d.btu; });
    const subtotal = cargaBase + cargaAltura + cargaDisp;
    const seguridad = subtotal * 0.10;
    return { error: false, btu: Math.ceil(subtotal+seguridad), area: area.toFixed(1),
             detalles: { cargaBase, cargaTechoZinc, cargaOrientacion, cargaAltura, cargaDisp, seguridad } };
};

const nearestBtu = (btu) => { if (btu<=9000) return 9000; for (const b of BTU_LEVELS) if (btu<=b) return b; return btu; };
const calcROI = (btu) => {
    const c = (btu/10/1000)*8*30*KWH_COST, i = (btu/20/1000)*8*30*KWH_COST;
    return { costConv:c, costInv:i, monthly:c-i, yearly:(c-i)*12 };
};

const snap = v => Math.round(v/SNAP)*SNAP;
let _rid = 0;

// Auto-position: grid layout inicial
const autoPos = (idx) => ({
    x: snap(20 + (idx%3)*186),
    y: snap(16 + Math.floor(idx/3)*126),
});

const newRoom = (nombre, idx=0) => ({
    id: ++_rid, nombre: nombre||'Habitacion',
    largo:'', ancho:'',
    techoAlto:false, techoZinc:false, orientacionOeste:false,
    devices: { personas:0, televisores:0, computadores:0, luces:0, ventanas:0, otros:0 },
    pos: autoPos(idx),
});

// ---- FLOOR PLAN (drag & drop) -----------------------------------------------
const FloorPlan = ({ rooms, city, onMove }) => {
    const svgRef = useRef(null);
    const dragRef = useRef(null); // { roomId, startSVGX, startSVGY, startRX, startRY }

    const toSVGPt = (clientX, clientY) => {
        const svg = svgRef.current;
        if (!svg) return { x:0, y:0 };
        const pt = svg.createSVGPoint();
        pt.x = clientX; pt.y = clientY;
        const sp = pt.matrixTransform(svg.getScreenCTM().inverse());
        return { x: sp.x, y: sp.y };
    };

    const onPointerDown = (e, roomId) => {
        e.preventDefault();
        e.stopPropagation();
        const { x, y } = toSVGPt(e.clientX, e.clientY);
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;
        dragRef.current = { roomId, sx: x, sy: y, rx: room.pos.x, ry: room.pos.y };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        if (!dragRef.current) return;
        const { x, y } = toSVGPt(e.clientX, e.clientY);
        const { roomId, sx, sy, rx, ry } = dragRef.current;
        const newX = snap(Math.max(2, Math.min(rx + (x-sx), SVG_W - 60)));
        const newY = snap(Math.max(2, Math.min(ry + (y-sy), SVG_H - 40)));
        onMove(roomId, { x: newX, y: newY });
    };

    const onPointerUp = () => { dragRef.current = null; };

    // Calcular tamaño visual de cada habitación
    const validRooms = rooms.filter(r => parseFloat(r.largo)>0 && parseFloat(r.ancho)>0);
    const maxL = validRooms.length ? Math.max(...validRooms.map(r=>parseFloat(r.largo)||1)) : 1;
    const maxA = validRooms.length ? Math.max(...validRooms.map(r=>parseFloat(r.ancho)||1)) : 1;
    const SCALE = Math.min(140/maxL, 110/maxA, 22); // px por metro, max size ~140x110

    const hasValid = validRooms.length > 0;

    return (
        <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ width:'100%', borderRadius:12, display:'block', cursor: dragRef.current ? 'grabbing' : 'default', touchAction:'none' }}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
        >
            {/* Grid */}
            <defs>
                <pattern id="pg" width={SNAP} height={SNAP} patternUnits="userSpaceOnUse">
                    <path d={`M ${SNAP} 0 L 0 0 0 ${SNAP}`} fill="none" stroke={B.border} strokeWidth="0.5"/>
                </pattern>
            </defs>
            <rect width={SVG_W} height={SVG_H} fill={B.bg} rx="12"/>
            <rect width={SVG_W} height={SVG_H} fill="url(#pg)" rx="12"/>

            {/* Regla: muestra escala */}
            {hasValid && (
                <g transform={`translate(${SVG_W-60},${SVG_H-18})`}>
                    <line x1={0} y1={0} x2={SCALE} y2={0} stroke={B.muted} strokeWidth={1.5} strokeLinecap="round"/>
                    <line x1={0} y1={-3} x2={0} y2={3} stroke={B.muted} strokeWidth={1}/>
                    <line x1={SCALE} y1={-3} x2={SCALE} y2={3} stroke={B.muted} strokeWidth={1}/>
                    <text x={SCALE/2} y={-5} textAnchor="middle"
                        style={{ fontSize:7, fill:B.muted, fontFamily:'monospace' }}>1 m</text>
                </g>
            )}

            {/* Hint cuando está vacío */}
            {!hasValid && (
                <text x={SVG_W/2} y={SVG_H/2} textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize:12, fill:B.border, fontFamily:'system-ui', fontWeight:500 }}>
                    Ingresa dimensiones para ver el plano
                </text>
            )}

            {/* Habitaciones */}
            {rooms.map(room => {
                const l = parseFloat(room.largo)||0, a = parseFloat(room.ancho)||0;
                const hasSize = l>0 && a>0;
                const rW = hasSize ? Math.max(l*SCALE, 40) : 80;
                const rH = hasSize ? Math.max(a*SCALE, 32) : 60;
                const { x: rx, y: ry } = room.pos;
                const btu = hasSize ? calcRoomBTU(room, city) : null;
                const isDragging = dragRef.current?.roomId === room.id;

                // Dispositivos activos (que tienen qty > 0)
                const activeDevs = DEVICE_DEFS
                    .map(d => ({ key: d.key, qty: parseInt(room.devices?.[d.key])||0 }))
                    .filter(d => d.qty > 0);

                // Tamaño de icono adaptativo al cuarto
                const iSz = Math.max(6, Math.min(10, rW*0.14, rH*0.22));
                const iGap = iSz + 3;
                const iconsPerRow = Math.max(1, Math.floor((rW-6)/iGap));

                return (
                    <g key={room.id}
                        transform={`translate(${rx},${ry})`}
                        onPointerDown={e => onPointerDown(e, room.id)}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                        {/* Sombra sutil */}
                        <rect x={2} y={2} width={rW} height={rH} rx={5} fill="rgba(12,77,137,0.07)"/>
                        {/* Fondo del cuarto */}
                        <rect x={0} y={0} width={rW} height={rH} rx={5}
                            fill={B.surface} stroke={isDragging ? B.primary : B.mid}
                            strokeWidth={isDragging ? 1.8 : 1.2}
                            strokeDasharray={hasSize ? 'none' : '4,3'}
                        />
                        {/* Trazo diagonal de "pared" en esquinas — estética plano */}
                        <line x1={0} y1={rH} x2={rW} y2={0} stroke={B.border} strokeWidth={0.4}/>

                        {/* Nombre habitación */}
                        <text x={rW/2} y={-5} textAnchor="middle"
                            style={{ fontSize: Math.max(8, Math.min(10, rW*0.14)), fontWeight:700, fill: B.primary, fontFamily:'system-ui', pointerEvents:'none' }}>
                            {room.nombre}{hasSize ? ` · ${l}×${a}m` : ''}
                        </text>

                        {/* Área y BTU dentro */}
                        {hasSize && btu && !btu.error && (
                            <text x={rW/2} y={rH/2} textAnchor="middle" dominantBaseline="middle"
                                style={{ fontSize: Math.max(7, Math.min(9, rW*0.12)), fontWeight:700, fill: B.mid, fontFamily:'monospace', pointerEvents:'none' }}>
                                {btu.btu.toLocaleString()} BTU
                            </text>
                        )}

                        {/* Iconos de dispositivos (blueprint style) */}
                        {activeDevs.slice(0, 6).map((dev, di) => {
                            const col = di % iconsPerRow;
                            const row = Math.floor(di / iconsPerRow);
                            const ix = 4 + col * iGap;
                            const iy = 4 + row * iGap;
                            // Solo mostrar si caben dentro del cuarto
                            if (ix + iSz > rW - 2 || iy + iSz > rH - 12) return null;
                            return (
                                <g key={dev.key} style={{ pointerEvents:'none' }}>
                                    <PlanIcon type={dev.key} x={ix} y={iy} s={iSz} color={B.mid}/>
                                    {dev.qty > 1 && (
                                        <text x={ix + iSz + 1} y={iy + iSz*0.55}
                                            style={{ fontSize: Math.max(5, iSz*0.6), fontWeight:800, fill:B.mid, fontFamily:'monospace' }}>
                                            ×{dev.qty}
                                        </text>
                                    )}
                                </g>
                            );
                        })}

                        {/* Indicador de arrastre */}
                        <text x={rW-4} y={rH-3} textAnchor="end"
                            style={{ fontSize:7, fill:B.border, fontFamily:'system-ui', pointerEvents:'none' }}>
                            ↖↗
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

// ---- DEVICE COUNTER ---------------------------------------------------------
const DeviceCounter = ({ def, value, onChange }) => {
    const on = value > 0;
    // Render el mismo icono SVG de plano pero a mayor escala
    return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8,
            padding:'12px 8px', borderRadius:12,
            background: on ? B.light : '#fafafa',
            border:`1.5px solid ${on ? B.border : '#eee'}`,
            transition:'all 0.18s' }}>
            {/* Icono SVG en lugar de componente Lucide */}
            <svg width={32} height={32} viewBox="0 0 10 10"
                style={{ opacity: on ? 1 : 0.3, transition:'opacity 0.18s' }}>
                <PlanIcon type={def.key} x={0} y={0} s={10} color={on ? B.primary : B.muted}/>
            </svg>
            <span style={{ fontSize:'0.67rem', fontWeight:700, color: on ? B.text : '#bbb', textAlign:'center', lineHeight:1.2 }}>
                {def.label}
            </span>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <button onClick={() => onChange(Math.max(0,value-1))} disabled={!on}
                    style={{ width:24, height:24, borderRadius:7, background: on?'#f1f5f9':'transparent',
                        border:`1px solid ${on?B.border:'#eee'}`, cursor: on?'pointer':'default',
                        display:'flex', alignItems:'center', justifyContent:'center', opacity: on?1:0.3 }}>
                    <Minus size={10} color="#64748b"/>
                </button>
                <span style={{ width:24, textAlign:'center', fontSize:'0.95rem', fontWeight:800,
                    color: on?B.primary:'#ccc', fontVariantNumeric:'tabular-nums' }}>{value}</span>
                <button onClick={() => onChange(value+1)}
                    style={{ width:24, height:24, borderRadius:7, background:B.primary, border:'none',
                        cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Plus size={10} color="#fff"/>
                </button>
            </div>
        </div>
    );
};

// ---- ROOM CARD --------------------------------------------------------------
const RoomCard = ({ room, city, onChange, onDelete, canDelete }) => {
    const res = calcRoomBTU(room, city);
    const upd = (f,v) => onChange({ ...room, [f]:v });
    const updDev = (k,v) => onChange({ ...room, devices:{...room.devices,[k]:v} });

    const NInput = ({ label, field }) => (
        <div>
            <label style={{ display:'block', fontSize:'0.65rem', fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>{label}</label>
            <input type="number" value={room[field]} placeholder="0" onChange={e=>upd(field,e.target.value)}
                style={{ width:'100%', height:40, padding:'0 11px', background:'#fafafa',
                    border:`1.5px solid ${room[field]?B.mid+'80':B.border}`, borderRadius:9,
                    fontSize:'0.9rem', fontWeight:600, color:B.text, outline:'none', boxSizing:'border-box' }}/>
        </div>
    );
    const Toggle = ({ label, field, icon:Icon }) => (
        <button onClick={()=>upd(field,!room[field])}
            style={{ padding:'6px 11px', borderRadius:8, display:'flex', alignItems:'center', gap:5,
                background: room[field]?B.light:'#fafafa', border:`1.5px solid ${room[field]?B.mid+'80':B.border}`,
                cursor:'pointer', fontSize:'0.7rem', fontWeight:700,
                color: room[field]?B.primary:B.muted, transition:'all 0.15s' }}>
            <Icon size={12}/>{label}
        </button>
    );

    return (
        <motion.div layout initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
            style={{ borderRadius:18, border:`1.5px solid ${B.border}`, background:B.surface, boxShadow:'0 2px 12px rgba(12,77,137,0.06)' }}>
            <div style={{ background:B.light, padding:'13px 18px', display:'flex', justifyContent:'space-between',
                alignItems:'center', borderBottom:`1px solid ${B.border}`, borderRadius:'16px 16px 0 0' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:B.primary, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Home size={13} color="white"/>
                    </div>
                    <input value={room.nombre} onChange={e=>upd('nombre',e.target.value)}
                        style={{ background:'transparent', border:'none', outline:'none', fontSize:'0.88rem', fontWeight:700, color:B.text, width:160 }}/>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    {!res.error && res.btu>0 && (
                        <span style={{ fontSize:'0.7rem', fontWeight:700, color:B.mid, background:'white', padding:'3px 10px', borderRadius:7, border:`1px solid ${B.border}` }}>
                            {res.btu.toLocaleString()} BTU
                        </span>
                    )}
                    {canDelete && (
                        <button onClick={onDelete}
                            style={{ width:27, height:27, borderRadius:7, background:'#fee2e2', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Trash2 size={13} color={B.danger}/>
                        </button>
                    )}
                </div>
            </div>
            <div style={{ padding:18, display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <NInput label="Largo (m)" field="largo"/>
                    <NInput label="Ancho (m)" field="ancho"/>
                </div>
                <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                    <Toggle label="Techo Alto"  field="techoAlto"       icon={Building2}/>
                    <Toggle label="Techo Zinc"  field="techoZinc"       icon={AlertTriangle}/>
                    <Toggle label="Sol de Tarde" field="orientacionOeste" icon={Sun}/>
                </div>
                <div>
                    <p style={{ fontSize:'0.66rem', fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Fuentes de calor</p>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(110px, 1fr))', gap:7 }}>
                        {DEVICE_DEFS.map(d => (
                            <DeviceCounter key={d.key} def={d} value={parseInt(room.devices?.[d.key])||0} onChange={v=>updDev(d.key,v)}/>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ---- PREFERENCES ------------------------------------------------------------
const PreferenceSelector = ({ selected, onSelect }) => (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:10 }}>
        {PREFERENCES.map(p => {
            const Icon = p.icon; const on = selected===p.key;
            return (
                <button key={p.key} onClick={()=>onSelect(p.key)}
                    style={{ padding:'14px 10px', borderRadius:12, cursor:'pointer',
                        background: on?B.light:'#fafafa', border:`1.5px solid ${on?B.mid:B.border}`,
                        display:'flex', flexDirection:'column', alignItems:'center', gap:7, textAlign:'center', transition:'all 0.18s' }}>
                    <div style={{ width:36, height:36, borderRadius:10,
                        background: on?B.primary:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.18s' }}>
                        <Icon size={18} color={on?'white':'#aaa'}/>
                    </div>
                    <div>
                        <p style={{ fontSize:'0.77rem', fontWeight:700, color:on?B.primary:B.text, marginBottom:3 }}>{p.label}</p>
                        <p style={{ fontSize:'0.63rem', color:B.muted, lineHeight:1.4 }}>{p.desc}</p>
                    </div>
                    {on && <CheckCircle size={13} color={B.primary}/>}
                </button>
            );
        })}
    </div>
);

// ---- ROI CHART --------------------------------------------------------------
const ROIChart = ({ btuTotal }) => {
    const roi = calcROI(btuTotal);
    const payback = roi.monthly>0 ? Math.ceil(800000/roi.monthly) : 0;
    const maxV = Math.max(roi.costConv,1);
    return (
        <div style={{ background:B.surface, borderRadius:18, padding:24, border:`1.5px solid ${B.border}`, boxShadow:'0 2px 12px rgba(12,77,137,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:20 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:B.light, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <BarChart3 size={16} color={B.primary}/>
                </div>
                <div>
                    <h4 style={{ fontSize:'0.88rem', fontWeight:700, color:B.text }}>Comparativa de Consumo Mensual</h4>
                    <p style={{ fontSize:'0.68rem', color:B.muted }}>Estimado 8h/dia | tarifa $850 COP/kWh</p>
                </div>
            </div>
            {[
                { label:'Convencional (SEER 10)', val:roi.costConv, pct:100       },
                { label:'Inverter (SEER 20)',     val:roi.costInv,  pct:(roi.costInv/maxV)*100 },
            ].map((b,i) => (
                <div key={b.label} style={{ marginBottom:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                        <span style={{ fontSize:'0.72rem', color:B.muted, fontWeight:600 }}>{b.label}</span>
                        <span style={{ fontSize:'0.82rem', fontWeight:800, color: i===0?B.warning:B.success }}>${Math.round(b.val).toLocaleString()}/mes</span>
                    </div>
                    <div style={{ height:8, background:B.bg, borderRadius:99, overflow:'hidden', border:`1px solid ${B.border}` }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${b.pct}%` }} transition={{ duration:0.7, delay:0.4+i*0.15 }}
                            style={{ height:'100%', background: i===0?'#fbbf24':B.accent, borderRadius:99 }}/>
                    </div>
                </div>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:18, borderTop:`1px solid ${B.border}`, paddingTop:18 }}>
                {[
                    { label:'Ahorro Mensual', val:`$${Math.round(roi.monthly).toLocaleString()}` },
                    { label:'Ahorro Anual',   val:`$${Math.round(roi.yearly).toLocaleString()}`  },
                    { label:'Recuperacion',   val: payback>0?`~${payback} meses`:'N/A'           },
                ].map(s => (
                    <div key={s.label} style={{ textAlign:'center', padding:'10px 8px', background:B.bg, borderRadius:10, border:`1px solid ${B.border}` }}>
                        <div style={{ fontSize:'0.95rem', fontWeight:800, color:B.primary }}>{s.val}</div>
                        <div style={{ fontSize:'0.62rem', color:B.muted, marginTop:3, fontWeight:500 }}>{s.label}</div>
                    </div>
                ))}
            </div>
            <p style={{ fontSize:'0.61rem', color:B.muted, marginTop:14, opacity:0.7 }}>
                * Diferencia de precio de referencia entre equipos: $800.000 COP
            </p>
        </div>
    );
};

// ---- MAIN -------------------------------------------------------------------
const CalculatorPage = () => {
    const [ciudad, setCiudad] = useState('Barranquilla');
    const [rooms, setRooms] = useState([newRoom('Habitacion',0)]);
    const [preference, setPreference] = useState('ahorro');
    const [resultado, setResultado] = useState(null);
    const [recomendados, setRecomendados] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(false);
    const [error, setError] = useState('');
    const resultRef = useRef(null);
    const cardRef = useRef(null);

    const selectedCity = CITIES.find(c=>c.name===ciudad) || CITIES[CITIES.length-1];

    const addRoom = () => {
        if (rooms.length>=6) return;
        setRooms(prev=>[...prev, newRoom(`Habitacion ${prev.length+1}`, prev.length)]);
        setResultado(null);
    };

    const updRoom = useCallback((id,upd) => {
        setRooms(prev=>prev.map(r=>r.id===id?upd:r));
        setResultado(null);
    },[]);

    const delRoom = useCallback((id) => {
        setRooms(prev=>prev.filter(r=>r.id!==id));
        setResultado(null);
    },[]);

    // Drag position update desde FloorPlan
    const handleMove = useCallback((roomId, newPos) => {
        setRooms(prev=>prev.map(r=>r.id===roomId?{...r,pos:newPos}:r));
    },[]);

    const handleCalc = async () => {
        setError('');
        const results = rooms.map(r=>calcRoomBTU(r,selectedCity));
        if (!results.some(r=>!r.error&&r.btu>0)) {
            setError('Ingresa las dimensiones de al menos una habitacion.');
            return;
        }
        const btuTotal = results.reduce((s,r)=>s+(r.error?0:r.btu),0);
        const btuNorm = nearestBtu(btuTotal);
        const roomResults = rooms.map((r,i)=>({...r,resultado:results[i]})).filter(r=>!r.resultado.error&&r.resultado.btu>0);
        setResultado({ btuTotal, btuNorm, roomResults, ciudad:selectedCity });
        setTimeout(()=>resultRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),150);

        setLoadingRecs(true);
        try {
            const res = await client.get(`/productos?capacidadBtu=${btuNorm}&limite=3`);
            setRecomendados(res.data?.success?res.data.data:[]);
        } catch { setRecomendados([]); }
        finally { setLoadingRecs(false); }
    };

    const getWA = () => {
        if (!resultado) return '#';
        const m=`Hola Ghara! Calcule ${resultado.roomResults.length} habitacion(es) en ${ciudad}. Total: ${resultado.btuTotal.toLocaleString()} BTU/h.`;
        return `https://wa.me/573022326569?text=${encodeURIComponent(m)}`;
    };

    const API_HOST = (import.meta.env.VITE_API_URL||'http://localhost:3001/api').replace(/\/api$/, '');

    return (
        <div style={{ minHeight:'100vh', background:B.bg, paddingTop:120, paddingBottom:80 }}>
            <Section>
                <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center', marginBottom:40 }}>
                    <p style={{ fontSize:'0.72rem', fontWeight:700, color:B.mid, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>
                        Dimensionamiento Profesional HVAC
                    </p>
                    <h1 style={{ fontSize:'clamp(1.9rem,4.5vw,3rem)', fontWeight:900, color:B.text, letterSpacing:'-0.03em', marginBottom:10, lineHeight:1.1 }}>
                        Calculadora de BTU
                    </h1>
                    <p style={{ color:B.muted, fontSize:'0.95rem', maxWidth:500, margin:'0 auto' }}>
                        Calcula la capacidad exacta para multiples espacios y obtiene recomendaciones de equipo.
                    </p>
                </motion.div>

                <div style={{ maxWidth:820, margin:'0 auto', display:'flex', flexDirection:'column', gap:20 }}>

                    {/* CITY */}
                    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
                        style={{ background:B.surface, borderRadius:18, padding:22, border:`1.5px solid ${B.border}`, boxShadow:'0 2px 12px rgba(12,77,137,0.06)' }}>
                        <label style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.77rem', fontWeight:700, color:B.text, marginBottom:14 }}>
                            <MapPin size={14} color={B.primary}/> Ubicacion del proyecto
                        </label>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:6 }}>
                            {CITIES.map(c=>(
                                <button key={c.name} onClick={()=>{setCiudad(c.name);setResultado(null);}}
                                    style={{ padding:'8px 10px', borderRadius:9, cursor:'pointer',
                                        background: ciudad===c.name?B.light:'#fafafa',
                                        border:`1.5px solid ${ciudad===c.name?B.mid:B.border}`,
                                        textAlign:'left', transition:'all 0.15s' }}>
                                    <div style={{ fontSize:'0.73rem', fontWeight:700, color:ciudad===c.name?B.primary:B.text }}>{c.name.split('/')[0].trim()}</div>
                                    <div style={{ fontSize:'0.62rem', color:B.muted }}>{c.temp}C | {c.label}</div>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* FLOOR PLAN — draggable */}
                    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                        style={{ background:B.surface, borderRadius:18, padding:20, border:`1.5px solid ${B.border}`, boxShadow:'0 2px 12px rgba(12,77,137,0.06)' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                            <h3 style={{ fontSize:'0.77rem', fontWeight:700, color:B.text, display:'flex', alignItems:'center', gap:7 }}>
                                <Home size={14} color={B.primary}/> Plano en tiempo real
                            </h3>
                            <span style={{ fontSize:'0.62rem', color:B.muted }}>Arrastra las habitaciones para reposicionarlas</span>
                        </div>
                        <FloorPlan rooms={rooms} city={selectedCity} onMove={handleMove}/>
                    </motion.div>

                    {/* ROOMS */}
                    <AnimatePresence mode="popLayout">
                        {rooms.map((room,i)=>(
                            <RoomCard key={room.id} room={room} idx={i} city={selectedCity}
                                onChange={upd=>updRoom(room.id,upd)}
                                onDelete={()=>delRoom(room.id)}
                                canDelete={rooms.length>1}/>
                        ))}
                    </AnimatePresence>

                    {rooms.length<6 && (
                        <motion.button layout onClick={addRoom}
                            style={{ padding:'13px 20px', borderRadius:14, border:`1.5px dashed ${B.border}`,
                                background:'transparent', cursor:'pointer', display:'flex', alignItems:'center',
                                justifyContent:'center', gap:8, color:B.muted, fontSize:'0.82rem', fontWeight:600, transition:'all 0.15s' }}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor=B.mid;e.currentTarget.style.color=B.primary;e.currentTarget.style.background=B.light;}}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor=B.border;e.currentTarget.style.color=B.muted;e.currentTarget.style.background='transparent';}}>
                            <Plus size={15}/> Agregar habitacion ({rooms.length}/6)
                        </motion.button>
                    )}

                    {/* PREFERENCES */}
                    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
                        style={{ background:B.surface, borderRadius:18, padding:22, border:`1.5px solid ${B.border}`, boxShadow:'0 2px 12px rgba(12,77,137,0.06)' }}>
                        <h3 style={{ fontSize:'0.77rem', fontWeight:700, color:B.text, marginBottom:14, display:'flex', alignItems:'center', gap:7 }}>
                            <Star size={14} color={B.primary}/> Que es mas importante para ti?
                        </h3>
                        <PreferenceSelector selected={preference} onSelect={setPreference}/>
                    </motion.div>

                    {error && (
                        <p style={{ textAlign:'center', color:B.danger, fontWeight:600, fontSize:'0.83rem', padding:'10px 16px', background:'#fee2e2', borderRadius:10, border:'1px solid #fecaca' }}>
                            {error}
                        </p>
                    )}

                    <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }} onClick={handleCalc}
                        style={{ width:'100%', padding:'16px 28px', borderRadius:14, border:'none', background:B.primary, color:'white', fontSize:'0.95rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, letterSpacing:'0.01em' }}>
                        <Calculator size={18}/> Calcular capacidad total
                    </motion.button>

                    {/* RESULTS */}
                    <div ref={resultRef}>
                        <AnimatePresence mode="wait">
                            {resultado && (
                                <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                                    style={{ display:'flex', flexDirection:'column', gap:18 }}>

                                    <div ref={cardRef} style={{ background:B.surface, borderRadius:20, overflow:'hidden', border:`1.5px solid ${B.border}`, boxShadow:'0 4px 24px rgba(12,77,137,0.1)' }}>
                                        <div style={{ background:B.primary, padding:'28px 26px', textAlign:'center' }}>
                                            <p style={{ fontSize:'0.68rem', fontWeight:700, color:'rgba(255,255,255,0.6)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:8 }}>Capacidad total requerida</p>
                                            <motion.div initial={{ scale:0.7, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', delay:0.1 }}>
                                                <div style={{ fontSize:'clamp(2.8rem,7vw,4.2rem)', fontWeight:900, color:'white', letterSpacing:'-0.04em', lineHeight:1 }}>
                                                    {resultado.btuTotal.toLocaleString()}
                                                </div>
                                                <div style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.55)', marginTop:4 }}>BTU/h  |  Equipo sugerido: {resultado.btuNorm.toLocaleString()} BTU</div>
                                            </motion.div>
                                            <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:12, background:'rgba(255,255,255,0.12)', borderRadius:99, padding:'4px 13px' }}>
                                                <MapPin size={10} color={B.accent}/>
                                                <span style={{ fontSize:'0.73rem', color:'rgba(255,255,255,0.8)' }}>{resultado.ciudad.name} | {resultado.ciudad.temp}C | {resultado.roomResults.length} hab.</span>
                                            </div>
                                        </div>
                                        <div style={{ padding:'20px 24px', borderBottom:`1px solid ${B.border}` }}>
                                            <h4 style={{ fontSize:'0.7rem', fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Desglose por habitacion</h4>
                                            {resultado.roomResults.map((r,i)=>{
                                                const pct=Math.round((r.resultado.btu/resultado.btuTotal)*100);
                                                return (
                                                    <div key={r.id} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:9 }}>
                                                        <span style={{ fontSize:'0.78rem', fontWeight:600, color:B.text, flex:1 }}>{r.nombre} ({r.resultado.area}m2)</span>
                                                        <div style={{ flex:2, height:5, background:B.bg, borderRadius:99, overflow:'hidden', border:`1px solid ${B.border}` }}>
                                                            <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.6, delay:i*0.1 }}
                                                                style={{ height:'100%', background:B.accent, borderRadius:99 }}/>
                                                        </div>
                                                        <span style={{ fontSize:'0.75rem', fontWeight:700, color:B.primary, minWidth:88, textAlign:'right' }}>{r.resultado.btu.toLocaleString()} BTU</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div style={{ padding:'16px 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                                            <button onClick={async()=>{
                                                if(!cardRef.current)return;
                                                try{const c=await html2canvas(cardRef.current,{scale:2});const pdf=new jsPDF('p','mm','a4');const w=pdf.internal.pageSize.getWidth();pdf.addImage(c.toDataURL('image/png'),'PNG',0,0,w,(c.height*w)/c.width);pdf.save(`Ghara_BTU_${ciudad}.pdf`);}catch{}
                                            }} style={{ padding:'10px 16px', borderRadius:10, border:`1.5px solid ${B.border}`, background:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, fontSize:'0.77rem', fontWeight:700, color:B.text }}>
                                                <Download size={14}/> Descargar ficha
                                            </button>
                                            <a href={getWA()} target="_blank" rel="noopener noreferrer"
                                                style={{ padding:'10px 16px', borderRadius:10, background:B.success, color:'white', textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:7, fontSize:'0.77rem', fontWeight:700 }}>
                                                <MessageCircle size={14}/> Consultar asesor
                                            </a>
                                        </div>
                                    </div>

                                    {resultado.btuTotal>36000 && (
                                        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                                            style={{ borderRadius:16, background:B.primary, padding:'20px 22px', color:'white', display:'flex', gap:14, alignItems:'flex-start' }}>
                                            <div style={{ width:40, height:40, borderRadius:11, background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                                <Building2 size={20} color="white"/>
                                            </div>
                                            <div style={{ flex:1 }}>
                                                <h4 style={{ fontSize:'0.9rem', fontWeight:800, marginBottom:5 }}>Proyecto de alta capacidad</h4>
                                                <p style={{ fontSize:'0.77rem', color:'rgba(255,255,255,0.75)', lineHeight:1.55, marginBottom:14 }}>
                                                    Su proyecto requiere <strong>{resultado.btuTotal.toLocaleString()} BTU/h</strong>. Ghara ofrece visita tecnica gratuita para garantizar el dimensionamiento correcto.
                                                </p>
                                                <a href={getWA()} target="_blank" rel="noopener noreferrer"
                                                    style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 16px', borderRadius:9, background:'rgba(255,255,255,0.15)', color:'white', textDecoration:'none', fontSize:'0.76rem', fontWeight:700, border:'1px solid rgba(255,255,255,0.2)' }}>
                                                    <MessageCircle size={13}/> Solicitar visita tecnica gratuita
                                                </a>
                                            </div>
                                        </motion.div>
                                    )}

                                    <ROIChart btuTotal={resultado.btuTotal}/>

                                    <div>
                                        <h3 style={{ fontSize:'0.77rem', fontWeight:700, color:B.text, marginBottom:14, display:'flex', alignItems:'center', gap:7 }}>
                                            <Wind size={14} color={B.primary}/> Equipos recomendados &mdash; {resultado.btuNorm.toLocaleString()} BTU
                                        </h3>
                                        {loadingRecs ? (
                                            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                                                {[1,2,3].map(i=><div key={i} style={{ height:220, borderRadius:12, background:B.light, border:`1.5px solid ${B.border}` }}/>)}
                                            </div>
                                        ) : recomendados.length>0 ? (
                                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:12 }}>
                                                {recomendados.map(prod=>(
                                                    <Link key={prod.idProducto} to={`/catalogo/${prod.slug}`}
                                                        style={{ display:'flex', flexDirection:'column', borderRadius:12, overflow:'hidden', background:B.surface, border:`1.5px solid ${B.border}`, textDecoration:'none', transition:'all 0.18s' }}
                                                        onMouseEnter={e=>{e.currentTarget.style.borderColor=B.mid;e.currentTarget.style.boxShadow=`0 6px 20px rgba(12,77,137,0.1)`;e.currentTarget.style.transform='translateY(-2px)';}}
                                                        onMouseLeave={e=>{e.currentTarget.style.borderColor=B.border;e.currentTarget.style.boxShadow='';e.currentTarget.style.transform='';}}>
                                                        <div style={{ height:110, background:B.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:10 }}>
                                                            {prod.imagenPrincipal
                                                                ?<img src={`${API_HOST}${prod.imagenPrincipal}`} alt={prod.modelo} style={{ maxHeight:'100%', objectFit:'contain' }}/>
                                                                :<Wind size={34} color={B.border} strokeWidth={1}/>}
                                                        </div>
                                                        <div style={{ padding:'10px 12px', flex:1 }}>
                                                            <p style={{ fontSize:'0.61rem', fontWeight:700, color:B.mid, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>{prod.categoria||'Minisplit'}</p>
                                                            <p style={{ fontSize:'0.78rem', fontWeight:700, color:B.text, lineHeight:1.3, marginBottom:4 }}>{prod.nombre}</p>
                                                            <p style={{ fontSize:'0.67rem', color:B.muted, marginBottom:6 }}>{prod.capacidadBtu?.toLocaleString()} BTU | SEER {prod.seerValue}</p>
                                                            <p style={{ fontSize:'0.95rem', fontWeight:800, color:B.primary }}>${prod.precio?.toLocaleString()}</p>
                                                        </div>
                                                        <div style={{ padding:'8px 12px', background:B.light, display:'flex', alignItems:'center', justifyContent:'center', gap:5, color:B.primary, fontSize:'0.7rem', fontWeight:700, borderTop:`1px solid ${B.border}` }}>
                                                            Ver detalles <ArrowRight size={11}/>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign:'center', padding:'24px 14px', background:B.bg, borderRadius:12, border:`1.5px dashed ${B.border}`, color:B.muted, fontSize:'0.83rem' }}>
                                                No hay equipos disponibles para esta capacidad. Consulta con nuestro asesor.
                                            </div>
                                        )}
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

export default CalculatorPage;
