/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BRANDS, FIRMWARE_DATABASE } from './data/firmwareData';
import { Brand, FirmwareFile, CartItem, PurchasedFile } from './types';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { BrandGrid } from './components/BrandGrid';
import { BrandDetailView } from './components/BrandDetailView';
import { FileDetailView } from './components/FileDetailView';
import { CheckoutModal } from './components/CheckoutModal';
import { RequestFileModal } from './components/RequestFileModal';
import { CartDrawer } from './components/CartDrawer';
import { MyDownloadsModal } from './components/MyDownloadsModal';
import { ToolsDriversModal } from './components/ToolsDriversModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'brand' | 'file'>('home');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('samsung');
  const [selectedFileId, setSelectedFileId] = useState<string>('sam-a125f-u4');

  // Modals & Drawers State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState<boolean>(false);
  const [isDownloadsModalOpen, setIsDownloadsModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Checkout State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [checkoutFiles, setCheckoutFiles] = useState<FirmwareFile[]>([]);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('flashfilebd_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Purchases State (Persisted in localStorage)
  const [purchases, setPurchases] = useState<PurchasedFile[]>(() => {
    try {
      const saved = localStorage.getItem('flashfilebd_purchases');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('flashfilebd_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Save Purchases to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('flashfilebd_purchases', JSON.stringify(purchases));
    } catch {
      // ignore
    }
  }, [purchases]);

  // Navigation Handlers
  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBrand = (brandId: string) => {
    setSelectedBrandId(brandId);
    setCurrentView('brand');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFile = (fileId: string) => {
    const file = FIRMWARE_DATABASE.find((f) => f.id === fileId);
    if (file) {
      setSelectedBrandId(file.brandId);
    }
    setSelectedFileId(fileId);
    setCurrentView('file');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Handlers
  const handleAddToCart = (file: FirmwareFile) => {
    if (!cart.some((item) => item.file.id === file.id)) {
      setCart((prev) => [...prev, { file, addedAt: Date.now() }]);
    }
    setIsCartModalOpen(true);
  };

  const handleRemoveFromCart = (fileId: string) => {
    setCart((prev) => prev.filter((item) => item.file.id !== fileId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Checkout Handlers
  const handleInstantBuy = (file: FirmwareFile) => {
    setCheckoutFiles([file]);
    setIsCheckoutModalOpen(true);
  };

  const handleProceedCartCheckout = () => {
    if (cart.length > 0) {
      setCheckoutFiles(cart.map((item) => item.file));
      setIsCartModalOpen(false);
      setIsCheckoutModalOpen(true);
    }
  };

  const handlePaymentSuccess = (newPurchases: PurchasedFile[]) => {
    setPurchases((prev) => {
      // avoid duplicates by orderId or fileId
      const existingIds = new Set(prev.map(p => p.orderId));
      const filteredNew = newPurchases.filter(p => !existingIds.has(p.orderId));
      return [...filteredNew, ...prev];
    });

    // Remove purchased files from cart if present
    const purchasedIds = new Set(newPurchases.map((p) => p.fileId));
    setCart((prev) => prev.filter((item) => !purchasedIds.has(item.file.id)));
  };

  // Current Selected Entities
  const currentBrand = BRANDS.find((b) => b.id === selectedBrandId) || BRANDS[0];
  const currentFile = FIRMWARE_DATABASE.find((f) => f.id === selectedFileId) || FIRMWARE_DATABASE[0];
  const brandFiles = FIRMWARE_DATABASE.filter((f) => f.brandId === selectedBrandId);
  const isCurrentFileUnlocked = purchases.some((p) => p.fileId === currentFile.id);
  const isCurrentFileInCart = cart.some((item) => item.file.id === currentFile.id);
  const hotFiles = FIRMWARE_DATABASE.filter((f) => f.isHot);

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Red/Blue Announcement Bar */}
      <AnnouncementBar />

      {/* Main Clean Header */}
      <Header
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onSelectBrand={handleSelectBrand}
        onSelectFile={handleSelectFile}
        onOpenRequestModal={() => setIsRequestModalOpen(true)}
        onOpenCartModal={() => setIsCartModalOpen(true)}
        onOpenToolsModal={() => setIsToolsModalOpen(true)}
        onOpenDownloadsModal={() => setIsDownloadsModalOpen(true)}
        onOpenAdminPanel={() => setIsAdminModalOpen(true)}
        cartCount={cart.length}
        purchasedCount={purchases.length}
        allFiles={FIRMWARE_DATABASE}
        allBrands={BRANDS}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Top Quick Search & Value Proposition Banner */}
            <HomeHero
              onSelectBrand={handleSelectBrand}
              onSelectFile={handleSelectFile}
              onOpenRequestModal={() => setIsRequestModalOpen(true)}
              onOpenToolsModal={() => setIsToolsModalOpen(true)}
              hotFiles={hotFiles}
            />

            {/* Folder-Based Mobile Brands Grid */}
            <BrandGrid
              brands={BRANDS}
              onSelectBrand={handleSelectBrand}
            />
          </>
        )}

        {currentView === 'brand' && (
          <BrandDetailView
            brand={currentBrand}
            files={brandFiles}
            onBackToBrands={handleNavigateHome}
            onSelectFile={handleSelectFile}
            onInstantBuy={handleInstantBuy}
          />
        )}

        {currentView === 'file' && (
          <FileDetailView
            file={currentFile}
            brand={currentBrand}
            isUnlocked={isCurrentFileUnlocked}
            onBackToBrand={() => {
              setSelectedBrandId(currentFile.brandId);
              setCurrentView('brand');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToHome={handleNavigateHome}
            onInstantBuy={handleInstantBuy}
            onAddToCart={handleAddToCart}
            isInCart={isCurrentFileInCart}
          />
        )}
      </main>

      {/* Floating WhatsApp Live Support */}
      <FloatingWhatsApp />

      {/* Footer */}
      <Footer
        onSelectBrand={handleSelectBrand}
        onOpenToolsModal={() => setIsToolsModalOpen(true)}
        onOpenRequestModal={() => setIsRequestModalOpen(true)}
        onNavigateHome={handleNavigateHome}
        onOpenAdminPanel={() => setIsAdminModalOpen(true)}
      />

      {/* Modals & Drawers */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        files={checkoutFiles}
        onPaymentSuccess={handlePaymentSuccess}
        onOpenAdminPanel={() => setIsAdminModalOpen(true)}
      />

      <RequestFileModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />

      <CartDrawer
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedCartCheckout}
        onSelectFile={handleSelectFile}
      />

      <MyDownloadsModal
        isOpen={isDownloadsModalOpen}
        onClose={() => setIsDownloadsModalOpen(false)}
        purchases={purchases}
        onSelectFile={handleSelectFile}
      />

      <ToolsDriversModal
        isOpen={isToolsModalOpen}
        onClose={() => setIsToolsModalOpen(false)}
      />

      {/* Merchant / Admin Payment Manager Modal */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onApproveOrder={handlePaymentSuccess}
      />
    </div>
  );
}
