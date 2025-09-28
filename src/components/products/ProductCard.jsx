"use client";

import React, { useState } from 'react';
import { Button, Skeleton, Modal, ModalContent, ModalBody } from '@heroui/react';
import { useDispatch } from 'react-redux';
import { addItem } from '../../lib/store/cartSlice';
import { FiPlus, FiMinus, FiShoppingCart, FiChevronLeft, FiChevronRight, FiTag, FiMaximize2, FiX } from 'react-icons/fi';

const ProductCard = ({ product, isLoading = false }) => {
  
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const dispatch = useDispatch();

  // Image navigation functions
  const nextImage = () => {
    if (product.prod_img && product.prod_img.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.prod_img.length);
    }
  };

  const prevImage = () => {
    if (product.prod_img && product.prod_img.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.prod_img.length) % product.prod_img.length);
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Modal image navigation
  const nextModalImage = () => {
    if (product.prod_img && product.prod_img.length > 1) {
      setModalImageIndex((prev) => (prev + 1) % product.prod_img.length);
    }
  };

  const prevModalImage = () => {
    if (product.prod_img && product.prod_img.length > 1) {
      setModalImageIndex((prev) => (prev - 1 + product.prod_img.length) % product.prod_img.length);
    }
  };

  const openImageViewer = () => {
    setModalImageIndex(currentImageIndex);
    setIsImageViewerOpen(true);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Add to cart with both price and new_price preserved
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      new_price: product.new_price || null,
      img: product.prod_img && product.prod_img.length > 0 ? product.prod_img[currentImageIndex].img : null,
      quantity: quantity
    }));
    
    // Reset quantity after adding to cart
    setQuantity(1);
    
    // Brief loading state for better UX
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="group relative bg-white  border border-gray-200/50  rounded-3xl p-3 shadow-xs">
        {/* Image Skeleton */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200  rounded-2xl overflow-hidden mb-4">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-3">
          <div>
            <Skeleton className="h-6 w-3/4 rounded-lg mb-2" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3 rounded-lg mt-1" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Skeleton className="h-7 w-16 rounded-lg" />
              <Skeleton className="h-3 w-8 rounded-lg mt-1" />
            </div>
            
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Quantity and Add to Cart Skeleton */}
          <div className="flex items-center gap-3 pt-2">
            {/* Quantity Controls Skeleton */}
            <div className="flex items-center bg-gray-100 rounded-xl border border-gray-200 ">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 mx-2 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>

            {/* Add to Cart Button Skeleton */}
            <Skeleton className="flex-1 h-10 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Actual product card
  return (
    <>
      <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-3 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
        
        {/* Availability Badge */}
        {!product.available && (
          <div className="absolute top-11 -left-10.5 -rotate-45 z-10">
            <span className="inline-flex items-center px-18 py-1.5  text-xs font-bold shadow-lg bg-amber-400 ">
              غير متوفر
            </span>
          </div>
        )}

        {/* Promo badge */}
        {(product.available ===true && product.promo && product.promo[0]) && (
          <div className="absolute top-9 -left-11 -rotate-45 z-10">
            <div className="bg-gradient-to-r px-12 from-red-500 to-pink-500 text-white  py-1.5  shadow-lg border border-red-400">
              <div className="flex items-center gap-1">
                <FiTag className="inline-block w-2.5 h-2.5 md:w-3 md:h-3 ml-1" />
                <span className="text-xs font-bold">
                  عرض {product.promo[0].qte} ب {product.promo[0].price} دج
                </span>
              </div> 
            </div>
          </div>
        )}

        {/* Product Image Carousel */}
        <div className="relative aspect-square p-6 bg-stone-100 rounded-2xl overflow-hidden mb-4">
          {product.prod_img && product.prod_img.length > 0 ? (
            <>
              <img 
                src={product.prod_img[currentImageIndex].img} 
                alt={product.name}
                className="w-full h-full object-contain transition-opacity duration-300 cursor-pointer"
                loading="lazy"
                onClick={openImageViewer}
              />
              
              {/* Zoom icon overlay */}
              <div className="absolute  top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={openImageViewer}
                  className="bg-white/80 cursor-pointer hover:bg-white rounded-full p-1.5 shadow-md"
                >
                  <FiMaximize2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              
              {/* Navigation arrows - only show if multiple images */}
              {product.prod_img.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  >
                    <FiChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  >
                    <FiChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </>
              )}
              
              {/* Image dots indicator - only show if multiple images */}
              {product.prod_img.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
                  {product.prod_img.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'bg-black/60 shadow-md' 
                          : 'bg-black/20 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-gray-400 text-5xl opacity-50">
                📦
              </div>
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-2xl pointer-events-none"></div>
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900  line-clamp-1 mb-1">
              {product.name}
            </h3>
            <p className="text-gray-600  text-sm line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {(product.new_price && product.new_price !== 0) ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                     <span className="text-lg font-medium text-gray-500  line-through">
                      {product.price}
                    </span>
                    <span className="text-2xl  font-bold text-gray-900">
                      {product.new_price}
                    </span>
                   
                  </div>
                  <span className="text-xs text-gray-500  -mt-1">
                    دج
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price}
                  </span>
                  <span className="text-xs text-gray-500  -mt-1">
                    دج
                  </span>
                </>
              )}
            </div>
            
            {product.available && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50  rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600  font-medium">
                  متوفر
                </span>
              </div>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-3 pt-2">
            {/* Quantity Controls */}
            <div className="flex items-center bg-gray-100  rounded-xl border border-gray-200 ">
              <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={incrementQuantity}
                isDisabled={!product.available}
                className="min-w-8 h-10 text-gray-600  hover:bg-gray-200 "
              >
                <FiPlus className="w-3 h-3" />
              </Button>

              <div className="px-3 py-2 min-w-[2rem] text-center">
                <span className="text-sm font-semibold text-gray-900 ">
                  {quantity}
                </span>
              </div>

              <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={decrementQuantity}
                isDisabled={!product.available || quantity <= 1}
                className="min-w-8 h-10 text-gray-600  hover:bg-gray-200 "
              >
                <FiMinus className="w-3 h-3" />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <Button
              onPress={handleAddToCart}
              isDisabled={!product.available}
              isLoading={isAdding}
              className="flex-1 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium"
              startContent={!isAdding && <FiShoppingCart className="w-4 h-4" />}
            >
              {isAdding ? 'جاري الإضافة...' : 'إضافة للسلة'}
            </Button>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal - Mobile Responsive */}
      <Modal 
        isOpen={isImageViewerOpen} 
        onClose={() => setIsImageViewerOpen(false)}
        size="full"
        hideCloseButton={true}
        classNames={{
          base: "bg-black/95",
          backdrop: "bg-black/80"
        }}
      >
        <ModalContent>
          <ModalBody className="p-0 flex items-center justify-center min-h-screen">
            <div className="relative w-full h-full flex items-center justify-center px-2 sm:px-4">
              {product.prod_img && product.prod_img.length > 0 && (
                <>
                  {/* Main Image - Mobile Responsive */}
                  <img 
                    src={product.prod_img[modalImageIndex].img} 
                    alt={product.name}
                    className="max-w-full max-h-[70vh] sm:max-h-full object-contain"
                  />
                  
                  {/* Navigation arrows - Mobile Optimized */}
                  {product.prod_img.length > 1 && (
                    <>
                      <button
                        onClick={prevModalImage}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full p-2 sm:p-3 transition-colors duration-200 touch-manipulation"
                      >
                        <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </button>
                      <button
                        onClick={nextModalImage}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full p-2 sm:p-3 transition-colors duration-200 touch-manipulation"
                      >
                        <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </button>
                    </>
                  )}
                  
                  {/* Close button - Mobile Optimized */}
                  <button
                    onClick={() => setIsImageViewerOpen(false)}
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full p-2 sm:p-3 transition-colors duration-200 touch-manipulation z-10"
                  >
                    <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>
                  
                  {/* Image counter - Mobile Responsive */}
                  {product.prod_img.length > 1 && (
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/50 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
                      {modalImageIndex + 1} / {product.prod_img.length}
                    </div>
                  )}
                  
                  {/* Mobile swipe indicator */}
                  {product.prod_img.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:hidden">
                      <div className="flex space-x-1">
                        {product.prod_img.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              index === modalImageIndex 
                                ? 'bg-white' 
                                : 'bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Thumbnail navigation - Hidden on Mobile, Visible on Desktop */}
                  {product.prod_img.length > 1 && (
                    <div className="absolute bottom-4 sm:bottom-16 left-1/2 -translate-x-1/2 hidden sm:flex space-x-2 max-w-sm overflow-x-auto">
                      {product.prod_img.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setModalImageIndex(index)}
                          className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            index === modalImageIndex 
                              ? 'border-white shadow-lg' 
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img 
                            src={img.img} 
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Mobile gesture hint - Only show on first view */}
                  {product.prod_img.length > 1 && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 sm:hidden">
                      <div className="bg-black/50 text-white px-3 py-2 rounded-full text-xs text-center opacity-80">
                        اسحب يميناً أو يساراً للتنقل
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile swipe gestures - Touch events */}
            <div 
              className="absolute inset-0 sm:hidden"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                const startX = touch.clientX;
                
                const handleTouchEnd = (endEvent) => {
                  const endTouch = endEvent.changedTouches[0];
                  const endX = endTouch.clientX;
                  const diffX = startX - endX;
                  
                  // Swipe threshold
                  if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                      // Swipe left - next image
                      nextModalImage();
                    } else {
                      // Swipe right - previous image
                      prevModalImage();
                    }
                  }
                  
                  // Remove event listener
                  document.removeEventListener('touchend', handleTouchEnd);
                };
                
                document.addEventListener('touchend', handleTouchEnd);
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductCard;