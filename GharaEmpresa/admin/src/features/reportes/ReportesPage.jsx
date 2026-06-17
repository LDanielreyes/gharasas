import Swal from 'sweetalert2';
import React, { useState, useRef } from 'react';
import {
  BarChart2, Download, RefreshCw, Calendar, FileText,
  TrendingUp, Users, AlertCircle,
  ChevronDown,
} from 'lucide-react';
import {
  LineChart, Line, BarChart as RBarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import * as XLSX from 'xlsx';
import apiClient from '../../api/client';

// ─── Tipos de reporte ─────────────────────────────────────
const TIPOS = [
  { id: 'leads',     label: 'Cotizaciones WhatsApp', icon: Users,        color: '#25D366' },
  { id: 'pqr',       label: 'PQR',                   icon: AlertCircle,  color: '#b91c1c' },
  { id: 'productos', label: 'Productos',              icon: FileText,     color: '#7c3aed' },
];

// ─── Custom Tooltip ───────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="gh-card" style={{ padding: '10px 14px', minWidth: '130px' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--gh-text-muted)', marginBottom: '3px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: '0.875rem', fontWeight: 700, color: p.color || '#0d2137' }}>
          {typeof p.value === 'number' && p.name === 'total'
            ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p.value)
            : p.value}
        </p>
      ))}
    </div>
  );
};

// ─── Tipo selector card ───────────────────────────────────
const TipoCard = ({ tipo, selected, onClick }) => {
  const Icon = tipo.icon;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        padding: '16px 12px', borderRadius: '10px', cursor: 'pointer',
        border: selected ? `2px solid ${tipo.color}` : '2px solid var(--gh-border)',
        background: selected ? `${tipo.color}10` : 'transparent',
        transition: 'all 0.15s', flex: 1, fontFamily: 'inherit',
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: '10px',
        background: selected ? `${tipo.color}20` : 'var(--gh-surface-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color={selected ? tipo.color : 'var(--gh-text-muted)'} />
      </div>
      <span style={{
        fontSize: '0.8125rem', fontWeight: selected ? 700 : 500,
        color: selected ? tipo.color : '#6b7280',
      }}>
        {tipo.label}
      </span>
    </button>
  );
};

// ─── Summary Cards ────────────────────────────────────────
const SummaryCard = ({ label, value }) => (
  <div className="gh-card" style={{ padding: '14px 18px' }}>
    <p style={{ fontSize: '0.72rem', color: 'var(--gh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</p>
    <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gh-text-primary)', marginTop: '4px' }}>{value}</p>
  </div>
);

// ─── Export to Excel via SheetJS ─────────────────────────
function exportExcel(data, columnas, tipo, desde, hasta) {
  if (!data.length) return;

  // Mapear con nombres de columna amigables
  const filas = data.map(row => {
    const obj = {};
    const vals = Object.values(row);
    columnas.forEach((col, i) => { obj[col] = vals[i]; });
    return obj;
  });

  const wb  = XLSX.utils.book_new();
  const ws  = XLSX.utils.json_to_sheet(filas);

  // Estilos de ancho de columna automático
  const wsCols = columnas.map(c => ({ wch: Math.max(c.length + 2, 12) }));
  ws['!cols'] = wsCols;

  XLSX.utils.book_append_sheet(wb, ws, `Reporte_${tipo}`);
  XLSX.writeFile(wb, `Ghara_${tipo}_${desde}_${hasta}.xlsx`);
}

// ─── Main Page ───────────────────────────────────────────
const ReportesPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const hace30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [tipo,          setTipo]          = useState('leads');
  const [desde,         setDesde]         = useState(hace30);
  const [hasta,         setHasta]         = useState(today);
  const [reporte,       setReporte]       = useState(null);
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [chartView,     setChartView]     = useState('total');

  const handleGenerar = async () => {
    setLoading(true);
    try {
      const [reporteRes, diariasRes] = await Promise.all([
        apiClient.get(`/admin/reportes?tipo=${tipo}&desde=${desde}&hasta=${hasta}`),
        tipo === 'ventas' || tipo === 'leads'
          ? apiClient.get(`/admin/reportes/ventas-diarias?dias=30`)
          : Promise.resolve({ data: { data: [] } }),
      ]);

      setReporte(reporteRes.data);
      setVentasDiarias(diariasRes.data?.data || []);
    } catch (e) {
      console.error('Error generando reporte', e);
      Swal.fire({ icon: 'info', title: 'Notificación', text: 'Error al generar el reporte. Verifica los filtros.', confirmButtonColor: '#1a3f6a' });
    } finally {
      setLoading(false);
    }
  };

  const formatCOP = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Header ── */}
      <div>
        <h1 className="page-title">Informes Personalizados</h1>
        <p className="page-subtitle">Genera reportes por período y tipo, visualiza tendencias y exporta a Excel.</p>
      </div>

      {/* ── Config Card ── */}
      <div className="gh-card" style={{ padding: '22px 24px' }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--gh-text-primary)', marginBottom: '16px' }}>
          Configuración del Reporte
        </h2>

        {/* Tipo */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {TIPOS.map(t => (
            <TipoCard key={t.id} tipo={t} selected={tipo === t.id} onClick={() => setTipo(t.id)} />
          ))}
        </div>

        {/* Fecha range */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gh-text-primary)', marginBottom: '5px' }}>
              <Calendar size={13} style={{ display: 'inline', marginRight: '5px' }} />Desde
            </label>
            <input
              type="date"
              value={desde}
              onChange={e => setDesde(e.target.value)}
              max={hasta}
              className="input-field"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gh-text-primary)', marginBottom: '5px' }}>
              <Calendar size={13} style={{ display: 'inline', marginRight: '5px' }} />Hasta
            </label>
            <input
              type="date"
              value={hasta}
              onChange={e => setHasta(e.target.value)}
              min={desde}
              max={today}
              className="input-field"
            />
          </div>
          <button
            onClick={handleGenerar}
            disabled={loading}
            className="btn-primary"
            style={{ height: '40px', padding: '0 24px', gap: 8, whiteSpace: 'nowrap' }}
          >
            {loading ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generando...</> : <><BarChart2 size={14} /> Generar Reporte</>}
          </button>
        </div>
      </div>

      {/* ── Results ── */}
      {reporte && (
        <>
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            <SummaryCard label="Total registros"   value={reporte.resumen.total.toLocaleString()} />
            <SummaryCard label="Período"            value={`${reporte.resumen.desde} → ${reporte.resumen.hasta}`} />
            {reporte.resumen.totalIngresos !== undefined && (
              <SummaryCard label="Ingresos totales" value={formatCOP(reporte.resumen.totalIngresos)} />
            )}
            {reporte.resumen.ticketPromedio !== undefined && (
              <SummaryCard label="Ticket promedio"  value={formatCOP(reporte.resumen.ticketPromedio)} />
            )}
          </div>

          {/* Chart */}
          {ventasDiarias.length > 0 && (
            <div className="gh-card" style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--gh-text-primary)' }}>Tendencia — Últimos 30 días</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gh-text-muted)', marginTop: '2px' }}>Evolución diaria de {tipo}</p>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['total', 'cantidad'].map(v => (
                    <button
                      key={v}
                      onClick={() => setChartView(v)}
                      style={{
                        padding: '5px 12px', borderRadius: '6px', fontFamily: 'inherit',
                        border: chartView === v ? 'none' : '1px solid #e9ecf1',
                        background: chartView === v ? '#1a3f6a' : '#f4f7fb',
                        color: chartView === v ? '#fff' : '#6b7280',
                        fontSize: '0.78rem', fontWeight: chartView === v ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {v === 'total' ? 'Ingresos' : 'Cantidad'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ventasDiarias} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1a3f6a" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#1a3f6a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f2f5" />
                    <XAxis
                      dataKey="dia"
                      axisLine={false} tickLine={false}
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      tickFormatter={v => v.slice(5)} // Solo MM-DD
                    />
                    <YAxis
                      axisLine={false} tickLine={false}
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      tickFormatter={v =>
                        chartView === 'total'
                          ? v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : `$${v}`
                          : v
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={chartView}
                      stroke="#1a3f6a"
                      strokeWidth={2}
                      fill="url(#grad)"
                      dot={false}
                      activeDot={{ r: 4, fill: '#1a3f6a' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Table + Export */}
          <div className="gh-card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid #f0f2f5',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <p style={{ fontWeight: 700, color: 'var(--gh-text-primary)', fontSize: '0.9375rem' }}>
                Datos del Reporte — {reporte.data.length} registros
              </p>
              <button
                onClick={() => exportExcel(reporte.data, reporte.columnas, tipo, desde, hasta)}
                className="btn-primary"
                style={{ background: '#15803d', gap: 6, padding: '8px 16px' }}
              >
                <Download size={14} /> Exportar Excel
              </button>
            </div>

            {reporte.data.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--gh-text-muted)' }}>
                No hay datos en el período seleccionado.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      {reporte.columnas.map(col => <th key={col}>{col}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.data.slice(0, 100).map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => (
                          <td key={j}>
                            {reporte.columnas[j]?.includes('COP') || reporte.columnas[j] === 'Precio'
                              ? typeof val === 'number' ? formatCOP(val) : val
                              : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reporte.data.length > 100 && (
                  <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f2f5', fontSize: '0.8125rem', color: 'var(--gh-text-muted)', textAlign: 'center' }}>
                    Mostrando 100 de {reporte.data.length} registros. Exporta a Excel para ver todos.
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {!reporte && !loading && (
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <BarChart2 size={40} style={{ margin: '0 auto 14px', color: '#d1d5db' }} />
          <p style={{ fontWeight: 600, color: 'var(--gh-text-primary)', fontSize: '1rem', marginBottom: '4px' }}>
            Selecciona el tipo y período
          </p>
          <p style={{ color: 'var(--gh-text-muted)', fontSize: '0.875rem' }}>
            Los resultados aparecerán aquí junto con la gráfica de tendencias.
          </p>
        </div>
      )}

      {/* CSS for spinner */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ReportesPage;
