import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../shared/api/client';
import ProductDetail from './ProductDetail';

/**
 * ProductPage — ruta /catalogo/:slug
 * Carga el producto y renderiza ProductDetail como pagina completa.
 */
const ProductPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        setError(false);
        client.get(`/productos/${slug}`)
            .then(res => {
                if (res.data?.success) setProduct(res.data.data);
                else setError(true);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--gh-bg)' }}>
            <div style={{ width:36, height:36, border:'3px solid var(--gh-border)', borderTopColor:'var(--gh-brand-3)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    if (error || !product) return (
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, background:'var(--gh-bg)' }}>
            <p style={{ color:'var(--gh-text-muted)', fontSize:'1rem' }}>Producto no encontrado.</p>
            <button onClick={() => navigate('/catalogo')}
                style={{ padding:'10px 20px', borderRadius:8, background:'var(--gh-brand-3)', color:'white', border:'none', cursor:'pointer', fontWeight:700 }}>
                Volver al catalogo
            </button>
        </div>
    );

    return (
        <div style={{ paddingTop:80 }}>
            <ProductDetail product={product} onClose={() => navigate('/catalogo')}/>
        </div>
    );
};

export default ProductPage;
