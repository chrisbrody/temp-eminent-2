// src/slices/Story/StorySection/index.tsx
"use client"

import { FC, JSX, useState, useRef, useEffect, useCallback } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { Bounded } from "@/components/Bounded";

import model from "./model.json";

import type { StorySectionSliceBeforeAndAfterSliderPrimary } from '../../../../prismicio-types';

/**
 * Props for `StorySection`.
 */
export type StorySectionProps = SliceComponentProps<Content.StorySectionSlice>;

/**
 * Component for "StorySection" Slices.
 */
const StorySection: ({slice}: { slice: any }) => React.JSX.Element = ({ slice }) => {

  const { variation, primary } = slice;

  // used in before and after slider
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      console.log(splitConentDirection)

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
        {/**
         * 💡 Use Prismic MCP with your code editor
         *
         * Get AI-powered help to build your slice components — based on your actual model.
         *
         * ▶️ Setup:
         * 1. Add a new MCP Server in your code editor:
         *
         * {
         *   "mcpServers": {
         *     "Prismic MCP": {
         *       "command": "npx",
         *       "args": ["-y", "@prismicio/mcp-server"]
         *     }
         *   }
         * }
         *
         * 2. Select Claude 3.7 Sonnet (recommended for optimal output)
         *
         * ✅ Then open your slice file and ask your code editor:
         *    "Code this slice"
         *
         * Your code editor reads your slice model and helps you code faster ⚡
         * 📚 Give your feedback: https://community.prismic.io/t/help-us-shape-the-future-of-slice-creation/19505
         */}
      </section>
  );
};

export default StorySection;
