// slices/Blogs/BlogSection/index.tsx
import {FC, JSX} from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { Bounded } from "@/components/Bounded";

import model from "./model.json";

/**
 * Props for `BlogSection`.
 */
export type BlogSectionProps = SliceComponentProps<Content.BlogSectionSlice>;

/**
 * Component for "BlogSection" Slices.
 */
const BlogSection: ({slice}: { slice: any }) => JSX.Element = ({ slice }) => {
  const { variation, primary } = slice;
  const { image, title, description } = primary;

  // Function to get the human-readable name
  const getVariationDisplayName = (id: string) => {
    const variationInfo = model.variations.find(v => v.id === id);
    return variationInfo ? variationInfo.name : id;
  };

  // Base section props common to all variations
  const sectionBaseProps = {
    "data-slice-type": slice.slice_type,
    "data-slice-variation": variation,
    className: "",
  };

  // Render different layouts based on the variation ID
  switch (variation) {
    case "default": //  Image with Rich Text
          return(
              <section {...sectionBaseProps} aria-label="Image with Rich Text">
                <Bounded
                    as="section"
                    yPadding="sm" // Adjust padding as needed
                    data-slice-type={slice.slice_type}
                    data-slice-variation={slice.variation}
                    className="blog-section-slice"
                >
                  <article className="">
                    {isFilled.image(image) && (
                        <div className="mb-6 md:mb-8 aspect-[16/9] overflow-hidden">
                          <PrismicNextImage
                              field={image}
                              className="w-full h-full object-cover"
                              imgixParams={{ fit: "crop", ar: "16:9" }}
                          />
                        </div>
                    )}

                    {isFilled.keyText(title) && (
                        <h2 className="text-2xl lg:text-[32px] text-black-900 uppercase mt-10 mb-6">
                          {title}
                        </h2>
                    )}

                    {isFilled.richText(description) && (
                        <div className="text-base md:text-xl text-left text-black-700">
                          <PrismicRichText
                              field={description}
                              components={{}}
                          />
                        </div>
                    )}
                  </article>
                </Bounded>
              </section>
          )

    default:
      // Fallback for unknown variations or if you haven't implemented one yet
      return (
          <section
              {...sectionBaseProps}
              style={{border: "2px dashed red", padding: "20px", margin: "20px 0"}}
          >
            <h2 className="text-xl font-semibold">
              Blog Section - Variation Not Implemented
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

};

export default BlogSection;