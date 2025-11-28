'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { AuthNav, AuthNavMobile } from '@/components/auth-nav';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/gallery', label: 'Gallery' },
    { href: '/shop', label: 'Collection' },
    { href: '/blog', label: 'Journal' },
    { href: '/subscribe', label: 'Subscribe' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.05]' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="relative z-50">
              <span className="text-lg tracking-[0.2em] font-light uppercase">
                Chandrika <span className="font-medium">Maelge</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
              <AuthNav />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative z-50 p-2"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 bg-black z-40 flex flex-col justify-center items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-light tracking-wide hover:text-white/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4">
              <AuthNavMobile onClose={() => setMenuOpen(false)} />
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32">
          <div className="max-w-4xl">
            {/* Tagline */}
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
              <span className="text-xs tracking-[0.3em] uppercase text-white/40">Fine Art Collection</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight leading-[1.1] tracking-tight mb-8">
              Where Art<br />
              <span className="font-medium bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text">
                Meets Soul
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/40 max-w-xl leading-relaxed mb-12 font-light">
              Experience a curated collection of contemporary masterpieces. 
              Each piece tells a story, evokes emotion, and transforms spaces 
              into sanctuaries of beauty.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <span className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all">
                  View Collection
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/gallery">
                <span className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 rounded-full font-light hover:bg-white/5 transition-all">
                  Explore Gallery
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32 px-6 lg:px-12 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text Content */}
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 block">The Artist</span>
              <h2 className="text-4xl md:text-5xl font-extralight leading-tight mb-8">
                A Journey Through<br />
                <span className="font-medium">Color & Emotion</span>
              </h2>
              <p className="text-white/40 text-lg leading-relaxed mb-8 font-light">
                Chandrika Maelge creates art that bridges the gap between the visible 
                and the felt. With each brushstroke, she captures moments of profound 
                beauty and invites viewers into a world where imagination reigns supreme.
              </p>
              <Link href="/blog">
                <span className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                  Read the Journal
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Image Placeholder */}
            <div className="relative aspect-[4/5] bg-gradient-to-br from-white/[0.02] to-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.05]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-light text-white/20">CM</span>
                  </div>
                  <span className="text-white/20 text-sm tracking-wide">Featured Artwork</span>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute top-8 right-8 w-24 h-24 border border-white/[0.05] rounded-full" />
              <div className="absolute bottom-8 left-8 w-16 h-16 border border-white/[0.05] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features */}
      <section className="py-32 px-6 lg:px-12 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 block">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-extralight">
              Experience the <span className="font-medium">Extraordinary</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Original Art',
                description: 'One-of-a-kind pieces crafted with passion and precision',
                link: '/shop',
              },
              {
                title: 'Limited Prints',
                description: 'Exclusive numbered editions for discerning collectors',
                link: '/shop',
              },
              {
                title: 'Commissions',
                description: 'Bespoke artwork tailored to your vision and space',
                link: '/subscribe',
              },
              {
                title: 'Art Journal',
                description: 'Insights into the creative process and artistic journey',
                link: '/blog',
              },
            ].map((item, idx) => (
              <Link key={idx} href={item.link}>
                <div className="group p-8 rounded-2xl border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all h-full">
                  <span className="text-5xl font-extralight text-white/10 block mb-6">0{idx + 1}</span>
                  <h3 className="text-xl font-light mb-3 group-hover:text-white/90 transition-colors">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-light">{item.description}</p>
                  <ArrowUpRight size={16} className="mt-6 text-white/20 group-hover:text-white/60 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-32 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-16 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-violet-500/5 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <span className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 block">Join the Circle</span>
              <h2 className="text-4xl md:text-5xl font-extralight mb-6">
                Stay <span className="font-medium">Inspired</span>
              </h2>
              <p className="text-white/40 text-lg max-w-lg mx-auto mb-10 font-light leading-relaxed">
                Receive exclusive previews of new collections, behind-the-scenes content, 
                and invitations to private viewings.
              </p>
              <Link href="/subscribe">
                <span className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all">
                  Subscribe Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <span className="text-lg tracking-[0.2em] font-light uppercase block mb-4">
                Chandrika <span className="font-medium">Maelge</span>
              </span>
              <p className="text-white/30 text-sm max-w-sm leading-relaxed font-light">
                Creating art that speaks to the soul. Based in Sri Lanka, 
                exhibited worldwide.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">Explore</h4>
              <ul className="space-y-3">
                {['Gallery', 'Collection', 'Journal', 'About'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase()}`} className="text-sm text-white/50 hover:text-white transition-colors font-light">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">Connect</h4>
              <ul className="space-y-3">
                {['Subscribe', 'Contact', 'Instagram', 'Studio'].map((item) => (
                  <li key={item}>
                    <Link 
                      href={item === 'Studio' ? '/admin' : item === 'Subscribe' ? '/subscribe' : '#'} 
                      className="text-sm text-white/50 hover:text-white transition-colors font-light"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/20 text-xs font-light">
              © 2024 Chandrika Maelge Art. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/20 hover:text-white/40 text-xs transition-colors">Privacy</a>
              <a href="#" className="text-white/20 hover:text-white/40 text-xs transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
