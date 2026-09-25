import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Search, Truck, ChevronLeft, ChevronRight, ArrowUpDown, X } from 'lucide-react';
import { YapeBadge, PlinBadge, CulqiBadge, CardsBadge } from './PaymentIcons';

export const ProductsSection = () => {
  const {
    filteredProducts,
    productCategories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    productSortBy,
    setProductSortBy,
    settings
  } = useStore();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const productsTopRef = useRef(null);

  // Reset to page 1 whenever search query, category filter or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, productSortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      if (productsTopRef.current) {
        productsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const bannerText = settings.productsBannerText || "Envíos Olva & Shalom a todo el Perú • Express < 2h en Chiclayo y alrededores";

  return (
    <div ref={productsTopRef} style={{ animation: 'fadeIn 0.35s ease-out', padding: '1rem 0 5rem 0', background: 'var(--bg-canvas)' }}>
      <div className="container">

        {/* 1. Minimalist Delivery & Payment Ribbon (Zero heavy boxes) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingBottom: '0.85rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4D4D4' }}>
            <Truck size={14} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ letterSpacing: '0.01em' }}>
              {bannerText}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#888888', fontSize: '0.72rem', marginRight: '0.1rem' }}>Pagos directos:</span>
            <YapeBadge size="sm" />
            <PlinBadge size="sm" />
            <CulqiBadge size="sm" />
            <CardsBadge size="sm" />
          </div>
        </div>

        {/* 2. Clean Luxury Toolbar: Search Input + Sort Dropdown (No enclosing cards/frames) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '0.85rem',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          {/* Minimalist Floating Pill Search */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
            <input
              type="text"
              placeholder="Buscar productos por nombre, fórmula o categoría (ej. sérum, labial, guasha)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 2.5rem 0.65rem 2.8rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                background: '#161616 !important',
                border: '1px solid rgba(229, 192, 123, 0.3) !important',
                color: '#FFFFFF !important',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#888888',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.2rem'
                }}
                title="Limpiar búsqueda"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Minimalist Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
            <ArrowUpDown size={14} style={{ color: 'var(--accent-gold)' }} />
            <select
              value={productSortBy}
              onChange={(e) => setProductSortBy(e.target.value)}
              style={{
                padding: '0.62rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: '#161616 !important',
                color: '#FFFFFF !important',
                border: '1px solid rgba(229, 192, 123, 0.35) !important',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
            >
              <option value="destacados">Recomendados</option>
              <option value="precio-menor">Precio: Menor a Mayor</option>
              <option value="precio-mayor">Precio: Mayor a Menor</option>
              <option value="mas-comprados">Más Comprados</option>
              <option value="recientes">Recién Llegados</option>
            </select>
          </div>
        </div>

        {/* 3. Direct Floating Category Pills (No enclosing container) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.25rem',
          scrollbarWidth: 'none'
        }}>
          {productCategories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.4rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 800 : 600,
                  whiteSpace: 'nowrap',
                  background: isSelected ? 'linear-gradient(135deg, #F7E7C4 0%, #E5C07B 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#0A0A0A' : '#D4D4D4',
                  border: isSelected ? '1px solid rgba(229, 192, 123, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: isSelected ? '0 0 12px rgba(229, 192, 123, 0.35)' : 'none',
                  touchAction: 'manipulation',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 4. Products Count Indicator (Subtle single line) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          fontSize: '0.78rem',
          color: '#8E8E8E'
        }}>
          <span>
            Mostrando <strong style={{ color: '#FFFFFF' }}>{filteredProducts.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}</strong> de <strong style={{ color: 'var(--accent-gold)' }}>{filteredProducts.length}</strong> productos
          </span>
          {totalPages > 1 && (
            <span>
              Página <strong style={{ color: '#FFFFFF' }}>{currentPage}</strong> de <strong style={{ color: '#FFFFFF' }}>{totalPages}</strong>
            </span>
          )}
        </div>

        {/* 5. Direct Products Grid (Immediate focus, no delay) */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
              No encontramos productos para tu búsqueda.
            </p>
            <p style={{ fontSize: '0.85rem', color: '#888888', marginBottom: '1.5rem' }}>
              Intenta con palabras clave como "sérum", "labial", "protector" o restablece los filtros.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="btn-luxury-gold"
              style={{ fontSize: '0.8rem', padding: '0.65rem 1.6rem' }}
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <>
            <div 
              className="products-grid-mobile-2col"
              style={{
                display: 'grid',
                gap: '2rem'
              }}
            >
              {currentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <style>{`
              .products-grid-mobile-2col {
                grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
              }
              @media (max-width: 640px) {
                .products-grid-mobile-2col {
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                  gap: 0.75rem !important;
                }
              }
            `}</style>

            {/* Scalable Pagination Controls */}
            {totalPages > 1 && (
              <div style={{
                marginTop: '3.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.6rem 1.2rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: currentPage === 1 ? '#181818' : '#222222',
                    color: currentPage === 1 ? '#555555' : '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    touchAction: 'manipulation'
                  }}
                >
                  <ChevronLeft size={15} />
                  <span>Anterior</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => goToPage(pageNum)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      fontSize: '0.82rem',
                      fontWeight: currentPage === pageNum ? 900 : 600,
                      background: currentPage === pageNum 
                        ? 'linear-gradient(135deg, #F7E7C4 0%, #E5C07B 100%)' 
                        : '#181818',
                      color: currentPage === pageNum ? '#0A0A0A' : '#D4D4D4',
                      border: currentPage === pageNum ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: currentPage === pageNum ? '0 0 12px rgba(229, 192, 123, 0.35)' : 'none',
                      cursor: 'pointer',
                      touchAction: 'manipulation'
                    }}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.6rem 1.2rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: currentPage === totalPages ? '#181818' : '#222222',
                    color: currentPage === totalPages ? '#555555' : '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    touchAction: 'manipulation'
                  }}
                >
                  <span>Siguiente</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
