'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, ZoomIn, ZoomOut, RotateCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker with optimized settings
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Optimize PDF.js settings for faster loading
pdfjs.GlobalWorkerOptions.workerPort = null;

interface PDFViewerProps {
  url: string;
}

export default function PDFViewer({ url }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.2);
  const [rotation, setRotation] = useState(0);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [documentLoading, setDocumentLoading] = useState(false);
  // Track loading progress (0-100)
  const [loadingProgress, setLoadingProgress] = useState(0);
  // Track if loading is complete (at 100%)
  const [loadingComplete, setLoadingComplete] = useState(false);
  // Track if progress bar should be hidden (after delay)
  const [hideProgressBar, setHideProgressBar] = useState(false);
  // Track which pages should be rendered (lazy loading)
  // Always start with only page 1, then load others progressively
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1]));
  // Track loaded pages for progress calculation
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());

  // Track container width for responsive PDF rendering
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Set initial width
    updateWidth();

    // Create ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []);


  // Track document loading progress
  function onDocumentLoadProgress({ loaded, total }: { loaded: number; total: number }) {
    // Show progress bar when loading actually starts
    if (!documentLoading) {
      setDocumentLoading(true);
    }
    const progress = Math.round((loaded / total) * 100);
    setLoadingProgress(progress);
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoadingProgress(100);
    setDocumentLoading(false);
    
    // Keep only page 1 visible initially - it will load first
    setVisiblePages(new Set([1]));
    
    // After page 1 loads, progressively load other pages
    // Load pages 2-5 after 500ms
    setTimeout(() => {
      setVisiblePages((prev) => {
        const updated = new Set(prev);
        for (let i = 2; i <= Math.min(5, numPages); i++) {
          updated.add(i);
        }
        return updated;
      });
    }, 500);
    
    // Load remaining pages after 1 second
    if (numPages > 5) {
      setTimeout(() => {
        setVisiblePages((prev) => {
          const updated = new Set(prev);
          for (let i = 6; i <= numPages; i++) {
            updated.add(i);
          }
          return updated;
        });
      }, 1000);
    }
    
    // Mark document as loaded after a short delay to allow first page to render
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }

  // Track when individual pages finish loading by monitoring canvas elements
  useEffect(() => {
    if (!numPages || isLoading) return;

    const checkPageLoaded = () => {
      const canvases = document.querySelectorAll('.react-pdf__Page__canvas');
      const newLoadedPages = new Set<number>();
      
      canvases.forEach((canvas) => {
        const pageElement = canvas.closest('[data-page-number]');
        if (pageElement) {
          const pageNum = parseInt(pageElement.getAttribute('data-page-number') || '0');
          if (pageNum > 0 && canvas.getAttribute('data-loaded') !== 'true') {
            // Mark as loaded
            canvas.setAttribute('data-loaded', 'true');
            newLoadedPages.add(pageNum);
          }
        }
      });

      if (newLoadedPages.size > 0) {
        setLoadedPages((prev) => {
          const updated = new Set(prev);
          newLoadedPages.forEach((pageNum) => updated.add(pageNum));
          
          // Check if all pages are loaded
          if (updated.size >= numPages && !loadingComplete) {
            setLoadingComplete(true);
            // Hide progress bar after 1.5 seconds
            setTimeout(() => {
              setHideProgressBar(true);
            }, 1500);
          }
          
          return updated;
        });
      }
    };

    // Check periodically for loaded pages
    const interval = setInterval(checkPageLoaded, 200);
    
    // Also check immediately
    checkPageLoaded();

    return () => clearInterval(interval);
  }, [numPages, isLoading, visiblePages, loadingComplete]);


  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  // Calculate width to fit container, accounting for padding
  // -48 for padding (24px on each side)
  const pageWidth = containerWidth > 48 ? containerWidth - 48 : 800;

  // Calculate overall progress based on document and pages loaded
  const overallProgress = useMemo(() => {
    if (!numPages) return loadingProgress;
    // Document loading is 40% of progress, page loading is 60%
    const documentProgress = loadingProgress * 0.4;
    const pagesProgress = (loadedPages.size / numPages) * 60;
    const progress = Math.min(100, Math.round(documentProgress + pagesProgress));
    
    // When progress reaches 100%, mark as complete
    if (progress >= 100 && !loadingComplete) {
      setLoadingComplete(true);
      // Hide progress bar after 1.5 seconds
      setTimeout(() => {
        setHideProgressBar(true);
      }, 1500);
    }
    
    return progress;
  }, [loadingProgress, loadedPages.size, numPages, loadingComplete]);

  // Show progress bar when document is loading, pages are loading, or loading just completed
  const showProgressBar = !hideProgressBar && (documentLoading || (numPages && loadedPages.size < numPages && !isLoading) || loadingComplete);

  // Memoize PDF.js options to prevent unnecessary reloads
  const pdfOptions = useMemo(() => ({
    // Optimize PDF.js loading options for faster performance
    cMapUrl: 'https://unpkg.com/pdfjs-dist@5.4.296/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@5.4.296/standard_fonts/',
    // Disable unnecessary features for faster loading
    disableAutoFetch: false,
    disableStream: false,
    disableRange: false,
  }), []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden relative">
      {/* Progress Bar - Show when document or pages are loading */}
      {showProgressBar && (
        <div className="sticky top-0 z-30 w-full bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800">
          <div className="h-1.5 bg-neutral-800">
            <div
              className="h-full bg-primary-500 transition-all duration-300 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="px-4 py-2.5 flex items-center justify-between text-xs text-neutral-300">
            <span className="flex items-center gap-2 font-medium">
              {loadingComplete ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Loading Complete
                </>
              ) : (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-500" />
                  {documentLoading ? 'Loading Blueprint...' : `Loading pages... (${loadedPages.size}/${numPages})`}
                </>
              )}
            </span>
            <span className="font-mono text-primary-400 font-semibold">{overallProgress}%</span>
          </div>
        </div>
      )}

      {/* Controls Header */}
      <div className={`sticky ${showProgressBar ? 'top-[57px]' : 'top-0'} z-20 w-full bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 p-2 sm:p-4 flex items-center justify-between shadow-lg`}>
        <div className="text-white font-medium text-xs sm:text-sm hidden sm:block">
            Galion Blueprint V2
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 mx-auto sm:mx-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomOut}
            className="text-neutral-400 hover:text-white h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <span className="text-neutral-400 text-xs font-mono w-10 sm:w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomIn}
            className="text-neutral-400 hover:text-white h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="w-px h-5 sm:h-6 bg-neutral-800 mx-1 sm:mx-2" />
          <Button
            variant="ghost"
            size="icon"
            onClick={rotate}
            className="text-neutral-400 hover:text-white h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>

      {/* PDF Container */}
      <div 
        ref={containerRef}
        className="w-full flex-1 overflow-y-auto flex justify-center p-2 sm:p-4 md:p-8"
        style={{ minHeight: '80vh' }}
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadProgress={onDocumentLoadProgress}
          loading={
            <div className="flex items-center gap-3 text-neutral-400 mt-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              <span>Loading Blueprint...</span>
            </div>
          }
          error={(error) => {
            return (
              <div className="text-red-500 mt-20 text-center">
                <p>Failed to load PDF.</p>
                <p className="text-sm opacity-70">Please check your connection or try downloading it directly.</p>
              </div>
            );
          }}
          className="flex flex-col gap-0"
          options={pdfOptions}
        >
            {numPages && Array.from(new Array(numPages), (el, index) => {
                const pageNum = index + 1;
                // Always render page 1 first, then render others based on visiblePages
                const shouldRender = pageNum === 1 || visiblePages.has(pageNum);
                
                return (
                    <div
                        key={`page-wrapper-${pageNum}`}
                        data-page-number={pageNum}
                        className="w-full"
                    >
                        {shouldRender ? (
                            <Page
                                key={`page_${pageNum}`}
                                pageNumber={pageNum}
                                scale={scale}
                                rotate={rotation}
                                width={pageWidth > 1000 ? 1000 : pageWidth}
                                className="bg-white shadow-none"
                                loading={
                                    <div className="w-full h-[1000px] bg-neutral-800 animate-pulse flex items-center justify-center">
                                        <div className="text-neutral-500 text-sm">Loading page {pageNum}...</div>
                                    </div>
                                }
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                renderMode="canvas"
                            />
                        ) : (
                            // Placeholder for unloaded pages to maintain scroll position
                            <div 
                                className="bg-neutral-800 w-full flex items-center justify-center"
                                style={{ 
                                    height: (pageWidth > 1000 ? 1000 : pageWidth) * 1.414, // Approximate A4 aspect ratio
                                    minHeight: '800px'
                                }}
                            >
                                <div className="text-neutral-600 text-sm">Page {pageNum} will load shortly...</div>
                            </div>
                        )}
                    </div>
                );
            })}
        </Document>
      </div>
    </div>
  );
}
