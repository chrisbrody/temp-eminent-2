// src/slices/Story/StorySection/index.tsx
"use client"

import { FC, JSX, useState, useRef, useEffect, useCallback } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { Bounded } from "@/components/Bounded";
import { motion, useInView, AnimatePresence } from "framer-motion";

import model from "./model.json";

import type {
  ProjectSectionSliceBeforeAndAfterSliderPrimary,
  StorySectionSliceBeforeAndAfterSliderPrimary,
  StorySectionSliceImageCarouselPrimary
} from '../../../../prismicio-types';

/**
 * Props for `StorySection`.
 */
export type StorySectionProps = SliceComponentProps<Content.StorySectionSlice>;

/**
 * Component for "StorySection" Slices.
 */
const StorySection: ({slice}: { slice: any }) => (React.JSX.Element | null) = ({ slice }) => {

  const { variation, primary } = slice;

  // used in before and after slider
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(carouselRef, { once: true, amount: 0.3 });

  // Callback for mouse/touch move events for the slider
  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const { left, width } = containerRef.current.getBoundingClientRect();
      let newPosition = ((clientX - left) / width) * 100;
      newPosition = Math.max(0, Math.min(100, newPosition));
      setSliderPosition(newPosition);
    }
  }, []);

  // Mouse event handlers for the slider
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch event handlers for the slider
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [isDragging, handleMove]);

  const onTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Effect to add/remove global event listeners for slider dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('touchcancel', onTouchEnd);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isDragging, onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  // Function to get the human-readable name
  const getVariationDisplayName = (id: string) => {
    const variationInfo = model.variations.find(v => v.id === id);
    return variationInfo ? variationInfo.name : id;
  };

  // Base section props common to all variations
  const sectionBaseProps = {
    "data-slice-type": slice.slice_type,
    "data-slice-variation": variation,
    className: "py-8 md:py-12",
  };

  switch (variation) {
    case "default": // "Narrative Block, can be adjusted to 80%, default is 100%"
        const containerWidth = primary.narrative_block_width == "100%" ? "max-w-6xl" : "max-w-5xl"

          return (
              <section {...sectionBaseProps} aria-label="Narrative Block Section">
                <Bounded widthClass={containerWidth}>
                  <div className="grid grid-cols-1 items-center">
                    <div>
                      {isFilled.image(primary.image) && (
                          <PrismicNextImage
                              field={primary.image}
                              className=""
                              imgixParams={{ar: "4:3", fit: "crop"}}
                          />
                      )}
                      {isFilled.keyText(slice.primary.image_caption) && (
                          <p className="text-black-900 opacity-90 text-center font-gtAmerica">
                            {slice.primary.image_caption}
                          </p>
                      )}
                    </div>
                    <div className="flex gap-x-8">
                      <div className={slice.primary.tag ? "w-[70%]" : "w-[100%]"}>
                        {isFilled.richText(primary.title) && (
                            <div className="text-2xl lg:text-[32px] text-black-900 uppercase mt-8 mb-4">
                              <PrismicRichText field={primary.title}/>
                            </div>
                        )}
                        {isFilled.richText(primary.description) && (
                            <div className="text-base md:text-xl text-left text-black-700">
                              <PrismicRichText field={primary.description}/>
                            </div>
                        )}
                      </div>
                      {isFilled.keyText(primary.tag) && (
                          <div className="w-[30%]">
                            <div className="flex items-center mt-15 justify-end">
                              <div className="w-24 border-t border-solid border-gold-900 ml-6 mr-4"></div>
                              <p className="font-serif text-sm text-gold-900 min-w-fit font-gtAmerica">{primary.tag}</p>
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
                </Bounded>
              </section>
          );
    case "splitContent": // "Split Content, default is image left & text right"
      // console.log(primary)
      const splitContainerWidth = primary.split_content_width == "100%" ? "max-w-6xl" : "max-w-5xl"
      const splitConentDirection = primary.content_direction

      return (
          <section {...sectionBaseProps} aria-label="Split Content Section">
            <Bounded  widthClass={splitContainerWidth}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Column Image */}
                <div className={splitConentDirection === "Text Left, Image Right" ? "md:order-2" : "md:order-1"}>
                  {isFilled.image(primary.image) && (
                      <PrismicNextImage
                          field={primary.image}
                          className="shadow-lg w-full"
                          imgixParams={{ar: "3:4", fit:"crop"}}
                      />
                  )}
                  {isFilled.keyText(slice.primary.image_caption) && (
                      <figcaption className="flex justify-center items-center mt-1 text-base leading-4 text-center text-black-900 opacity-90 font-gtAmerica">
                        {slice.primary.image_caption}
                      </figcaption>
                  )}
                </div>
                {/* Column Text Content */}
                <div className={splitConentDirection === "Text Left, Image Right" ? "md:order-1" : "md:order-2"}>
                  {isFilled.richText(primary.title) && (
                      <div className="text-2xl lg:text-[32px] text-black-900 uppercase mt-8 mb-4">
                        <PrismicRichText field={primary.title} />
                      </div>
                  )}
                  {isFilled.keyText(primary.tag) && (
                      <div
                          className={`flex items-center mb-4 ${
                              splitConentDirection === "Text Left, Image Right" ? "justify-end" : "justify-end"
                          }`}
                      >
                        <div className="w-24 border-t border-solid border-gold-900 mr-4"></div>
                        <p className="font-serif text-sm text-gold-900 min-w-fit font-gtAmerica">{primary.tag}</p>
                      </div>
                  )}
                  {isFilled.richText(primary.description) && (
                      <div className="text-base md:text-xl text-left text-black-700">
                        <PrismicRichText field={primary.description} />
                      </div>
                  )}
                </div>
              </div>
            </Bounded>
          </section>
      );

    case "beforeAndAfterSlider": // "Before And After Slider"
      const sliderPrimary = primary as StorySectionSliceBeforeAndAfterSliderPrimary;

      const beforeImage = sliderPrimary.before_image;
      const afterImage = sliderPrimary.after_image;

      const beforeWidth = beforeImage?.dimensions?.width || 0;
      const afterWidth = afterImage?.dimensions?.width || 0;
      const useLargeWidth = beforeWidth > 1000 && afterWidth > 1000;
      // console.log(useLargeWidth)
      const containerMaxWidth = useLargeWidth ? "max-w-[100%]" : "max-w-[400px]";

      if (!isFilled.image(beforeImage) || !isFilled.image(afterImage)) {
        console.warn("BeforeAndAfterSlider variation: Missing 'before_image' or 'after_image'.");
        return null;
      }

      const BeforeAndAfterWidth = primary.before_and_after_width == "100%" ? "max-w-6xl" : "max-w-5xl"

      return (
          <section
              {...sectionBaseProps}
              aria-label="Before and After Slider"
              className="py-12"
          >
            <Bounded widthClass={BeforeAndAfterWidth}>
              <div
                  ref={containerRef}
                  className={`relative ${containerMaxWidth} mx-auto overflow-hidden rounded-lg shadow-xl select-none`}
                  onMouseDown={(e) => {
                    if (containerRef.current) {
                      const {left} = containerRef.current.getBoundingClientRect();
                      setSliderPosition(((e.clientX - left) / containerRef.current.offsetWidth) * 100);
                    }
                    onMouseDown(e);
                  }}
                  onTouchStart={(e) => {
                    if (containerRef.current && e.touches.length > 0) {
                      const {left} = containerRef.current.getBoundingClientRect();
                      setSliderPosition(((e.touches[0].clientX - left) / containerRef.current.offsetWidth) * 100);
                    }
                    onTouchStart(e);
                  }}
              >
                {/* Before Image (clipped by its parent div) */}
                <div
                    style={{width: `${sliderPosition}%`}}
                    className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
                >
                  <PrismicNextImage
                      field={beforeImage}
                      className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                  />
                </div>

                {/* After Image (full width, behind before image) */}
                <PrismicNextImage
                    field={afterImage}
                    className="w-full h-full object-cover pointer-events-none"
                />

                {/* Slider Handle */}
                <div
                    style={{left: `calc(${sliderPosition}% - 16px)`}}
                    className={`absolute top-0 bottom-0 w-8 cursor-ew-resize z-10 flex items-center justify-center transition-colors duration-200 ${
                        isDragging ? 'bg-gray-300' : 'bg-transparent'
                    }`}
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                    role="slider"
                    aria-valuenow={sliderPosition}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Image comparison slider"
                >
                  <div
                      className="w-8 h-8 rounded-full bg-white shadow-md border-2 border-gray-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M8 7h8m-4 4v4m-8-8h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description and Tag for the slider, using primary.description and primary.tag as requested */}
              <div className="flex gap-x-8 mt-6">
                <div className={isFilled.keyText(primary.tag) ? "w-[70%]" : "w-[100%]"}>
                  {isFilled.richText(primary.title) && (
                      <div className="mt-6">
                        <PrismicRichText
                            field={primary.title}
                            components={{
                              heading1: ({ children }) => <h2 className="text-2xl lg:text-[32px] text-black-900 uppercase mt-8 mb-4">{children}</h2>,
                              heading2: ({ children }) => <h2 className="text-2xl lg:text-[32px] text-black-900 uppercase mt-8 mb-4">{children}</h2>,
                            }}
                        />
                      </div>
                  )}
                  {isFilled.richText(primary.description) && (
                      <div className="text-base md:text-xl text-left text-black-700">
                        <PrismicRichText field={primary.description}/>
                      </div>
                  )}
                </div>
                {isFilled.keyText(primary.tag) && (
                    <div className="w-[30%]">
                      <div className="flex items-center mt-15 justify-end">
                        <div className="w-24 border-t border-solid border-gold-900 ml-6 mr-4"></div>
                        <p className="font-serif text-sm text-gold-900 min-w-fit font-gtAmerica">{primary.tag}</p>
                      </div>
                    </div>
                )}
              </div>
            </Bounded>
          </section>
      );

    case "beforeAndAfterBasic":
      let BeforeAndAfterBasicWidth;

      switch (primary.before_and_after_basic_width) {
        case "100%":
          BeforeAndAfterBasicWidth = "max-w-6xl";
          break;
        case "80%":
          BeforeAndAfterBasicWidth = "max-w-5xl";
          break;
        case "60%":
          BeforeAndAfterBasicWidth = "max-w-3xl";
          break;
        default:
          BeforeAndAfterBasicWidth = "max-w-6xl";
      }

      return (
          <section {...sectionBaseProps} aria-label="Showcase Images with Caption">
            <Bounded widthClass={BeforeAndAfterBasicWidth}>
              <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-10 md:gap-y-0">

                {/* Column 1: Image One & Description One */}
                <div className="flex flex-col">
                  {isFilled.image(primary.before_image) && (
                      <PrismicNextImage
                          field={primary.before_image}
                          className="img-responsive w-full"
                      />
                  )}
                  {isFilled.richText(primary.before_title) && (
                      <div className="mt-2 flex items-center uppercase sm:text-[22px] md:text-[26px] text-black-900 leading-tight font-ivar-display">
                        <PrismicRichText field={primary.before_title}/>
                      </div>
                  )}
                  {isFilled.richText(primary.before_description) && (
                      <div className="text-base leading-relaxed prose prose-sm max-w-none mt-2">
                        <PrismicRichText field={primary.before_description}/>
                      </div>
                  )}
                </div>

                {/* Column 2: Image Two & Description Two */}
                <div className="flex flex-col">
                  {isFilled.image(primary.after_image) && (
                      <PrismicNextImage
                          field={primary.after_image}
                          className="img-responsive w-full"
                      />
                  )}
                  {isFilled.richText(primary.after_title) && (
                      <div className="mt-2 flex items-center uppercase sm:text-[22px] md:text-[26px] text-black-900 leading-tight font-ivar-display">
                        <PrismicRichText field={primary.after_title}/>
                      </div>
                  )}
                  {isFilled.richText(primary.after_description) && (
                      <div className="text-base leading-relaxed prose prose-sm max-w-none mt-2">
                        <PrismicRichText field={primary.after_description}/>
                      </div>
                  )}
                </div>

              </div>
            </Bounded>
          </section>
      );

    case "imageCarousel": {
      // Cast 'primary' to the specific type for this variation
      const imageCarouselPrimary = primary as StorySectionSliceImageCarouselPrimary;
      // Access the group field from the correctly typed 'primary' object
      const images = imageCarouselPrimary.carousel_images || [];

      const nextImage = () => {
        if (!images.length) return; // Prevent errors if no images
        setCurrent((prev) => (prev + 1) % images.length);
      };

      const prevImage = () => {
        if (!images.length) return; // Prevent errors if no images
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
      };

      // Don't render the carousel if there are no images
      if (!images.length) {
        return null;
      }

      return (
          <section
              {...sectionBaseProps} // Applies common section props like `data-slice-type`
              ref={carouselRef} // Attach the ref for `useInView`
              className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black"
              aria-label="Full screen image carousel"
          >
            {/* Image Track: This div holds all images side-by-side.
                `transform: translateX` moves the entire track to show the current image. */}
            <div
                className="flex h-full w-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {images.map((item, index) => (
                  <div
                      key={`carousel-image-${index}`} // Using index as key is acceptable for static lists
                      className="flex-shrink-0 w-full h-full" // Each image wrapper takes full width/height of its slot
                  >
                    {isFilled.image(item.image) && (
                        <PrismicNextImage
                            field={item.image}
                            className="w-full h-full object-cover" // Ensures image covers the area without distortion
                        />
                    )}
                  </div>
              ))}
            </div>

            {/* Caption: Displays the caption for the current image. */}
            {isFilled.keyText(images[current]?.caption) && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white text-center z-20 p-4 bg-black/50 rounded-lg max-w-lg mx-auto">
                  {images[current]?.caption}
                </div>
            )}

            {/* Navigation Buttons: Next and Previous */}
            {images.length > 1 && ( // Only show buttons if there's more than one image
                <>
                  <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full z-20 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                      aria-label="Previous image"
                  >
                    {/* SVG for Left Arrow */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full z-20 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                      aria-label="Next image"
                  >
                    {/* SVG for Right Arrow */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </>
            )}

            {/* Indicators (Dots) */}
            {images.length > 1 && ( // Only show indicators if there's more than one image
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {images.map((_, index) => (
                      <button
                          key={`indicator-${index}`}
                          onClick={() => setCurrent(index)}
                          className={`w-3 h-3 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${
                              index === current ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                      />
                  ))}
                </div>
            )}
          </section>
      );
    }

    default:
      return (
          <section
              {...sectionBaseProps}
              style={{border: "2px dashed red", padding: "20px", margin: "20px 0"}}
          >
            <h2 className="text-xl font-semibold">
              Project Section - Variation Not Implemented
            </h2>
            <p>
              Selected Variation (Name):{" "}
              <strong>{getVariationDisplayName(variation)}</strong>
            </p>
            <p>
              Selected Variation (ID): <strong>{variation}</strong>
            </p>
            <p>Implement the layout for this variation in the component.</p>
          </section>
      );
  }


  return (
      <section
          data-slice-type={slice.slice_type}
          data-slice-variation={slice.variation}
      >
        Placeholder component for story_section (variation: {slice.variation})
        slices.
        <br/>
        <strong>You can edit this slice directly in your code editor.</strong>
      </section>
  );
};

export default StorySection;
