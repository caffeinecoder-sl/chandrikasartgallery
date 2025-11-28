'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';

interface ArtProduct {
  _id: string;
  title: string;
  price: number;
  category: string;
  status: 'available' | 'sold';
  images: string[];
}

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<ArtProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/shop/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/shop/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting product');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Products</h1>
          <p className="text-white/40 text-sm mt-1">Manage your art shop items</p>
        </div>
        <Link href="/admin/products/new">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
            <Plus size={16} />
            New Product
          </span>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-400/70 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-white/40" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#111] border border-white/[0.08] rounded-xl p-12 text-center">
          <Package className="h-12 w-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/60 mb-2">No products yet</p>
          <p className="text-white/30 text-sm mb-4">Add your first art piece to start selling</p>
          <Link href="/admin/products/new">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
              <Plus size={16} />
              Add Product
            </span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden group hover:border-white/[0.16] transition-all">
              {product.images[0] ? (
                <div className="aspect-[4/3] bg-black/50 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-white/[0.02] flex items-center justify-center">
                  <Package className="h-12 w-12 text-white/10" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-white truncate">{product.title}</h3>
                  <span
                    className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      product.status === 'available'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-semibold text-white">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-white/40 uppercase tracking-wide">{product.category}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/products/${product._id}`} className="flex-1">
                    <span className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
                      <Edit2 size={14} />
                      Edit
                    </span>
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
