'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Loader2, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

interface Image {
  _id: string;
  imageUrl: string;
  title: string;
  category: string;
  uploadDate: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageCategory, setNewImageCategory] = useState('painting');
  const [newImageDescription, setNewImageDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/images/list');
        if (!res.ok) throw new Error('Failed to fetch images');
        const data = await res.json();
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newImageFile) {
      setError('Please select an image file');
      return;
    }

    if (!newImageTitle.trim()) {
      setError('Image title is required');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', newImageFile);
      formData.append('title', newImageTitle);
      formData.append('category', newImageCategory);
      formData.append('description', newImageDescription);

      const res = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const response = await res.json();
      setImages([response.image, ...images]);
      setNewImageFile(null);
      setNewImageTitle('');
      setNewImageCategory('painting');
      setNewImageDescription('');
      setPreview('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete image');
      setImages(images.filter((img) => img._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting image');
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-black border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-white/70 mb-2";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Gallery</h1>
        <p className="text-white/40 text-sm mt-1">Manage your image library</p>
      </div>

      {/* Upload Form */}
      <div className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Upload size={18} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">Upload Image</h2>
            <p className="text-sm text-white/40">Add a new image to your gallery</p>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleUpload} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium">Error</p>
                  <p className="text-red-400/70 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* File Input with Preview */}
            <div>
              <label className={labelClass}>Upload Image (JPEG, PNG, WebP, GIF - Max 5MB)</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/[0.08] text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-white/70 file:text-sm hover:file:bg-white/20 disabled:opacity-50 cursor-pointer"
                  />
                </div>
                {preview && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/[0.08] flex-shrink-0">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="image-title" className={labelClass}>Title *</label>
                <input
                  id="image-title"
                  type="text"
                  value={newImageTitle}
                  onChange={(e) => setNewImageTitle(e.target.value)}
                  placeholder="Image title"
                  disabled={uploading}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="image-category" className={labelClass}>Category</label>
                <select
                  id="image-category"
                  value={newImageCategory}
                  onChange={(e) => setNewImageCategory(e.target.value)}
                  disabled={uploading}
                  className={inputClass}
                >
                  <option value="painting">Painting</option>
                  <option value="sculpture">Sculpture</option>
                  <option value="sketch">Sketch</option>
                  <option value="process">Process</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="image-description" className={labelClass}>Description</label>
              <textarea
                id="image-description"
                value={newImageDescription}
                onChange={(e) => setNewImageDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
                disabled={uploading}
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !newImageFile}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Image
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-white/40" />
        </div>
      ) : images.length === 0 ? (
        <div className="bg-[#111] border border-white/[0.08] rounded-xl p-12 text-center">
          <ImageIcon className="h-12 w-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/60 mb-2">No images yet</p>
          <p className="text-white/30 text-sm">Add your first image using the form above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image._id} className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden group hover:border-white/[0.16] transition-all">
              <div className="aspect-[4/3] bg-black/50 overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-white mb-1 truncate">{image.title}</h3>
                <p className="text-xs text-white/40 uppercase tracking-wide mb-3">{image.category}</p>
                <button
                  onClick={() => handleDelete(image._id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 text-sm hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
