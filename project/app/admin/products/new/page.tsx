'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('painting');
  const [images, setImages] = useState<string[]>(['']);
  const [status, setStatus] = useState<'available' | 'sold'>('available');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Common input styling for dark theme
  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-black border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClass = "block text-sm font-medium text-white/70 mb-2";
  const selectClass = "w-full px-4 py-2.5 rounded-lg bg-black border border-white/[0.08] text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer";

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageInput = () => {
    if (images.length < 10) {
      setImages([...images, '']);
    }
  };

  const removeImageInput = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !price || !category) {
      setError('All fields are required');
      return;
    }

    const filledImages = images.filter((img) => img.trim());
    if (filledImages.length === 0) {
      setError('At least one image URL is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/shop/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          category,
          images: filledImages,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-white">Add New Product</h1>
        <p className="text-white/50 mt-1">List a new artwork or item for sale</p>
      </div>

      {/* Form Card */}
      <div className="bg-[#111] border border-white/[0.08] rounded-xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClass}>Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Artwork title"
              disabled={loading}
              required
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your artwork, materials, dimensions, and unique features..."
              rows={6}
              disabled={loading}
              required
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Price and Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className={labelClass}>Price ($) *</label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                disabled={loading}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>Category *</label>
              <div className="relative">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                  className={selectClass}
                >
                  <option value="painting">Painting</option>
                  <option value="sculpture">Sculpture</option>
                  <option value="print">Print</option>
                  <option value="craft">Craft</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className={labelClass}>Images (up to 10) *</label>
            <div className="space-y-3">
              {images.map((image, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    disabled={loading}
                    className={inputClass}
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageInput(index)}
                      disabled={loading}
                      className="px-3 py-2.5 rounded-lg border border-white/[0.08] text-white/50 hover:text-red-400 hover:border-red-500/30 transition-all disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {images.length < 10 && (
              <button
                type="button"
                onClick={addImageInput}
                disabled={loading}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Another Image
              </button>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className={labelClass}>Status</label>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'available' | 'sold')}
                disabled={loading}
                className={selectClass}
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/[0.08]">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-2.5 border border-white/[0.08] text-white/70 font-medium rounded-lg hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
