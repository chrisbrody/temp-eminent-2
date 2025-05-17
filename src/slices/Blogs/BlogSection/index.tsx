// slices/Blogs/BlogSection/index.tsx
import {JSX} from "react";
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
  const { variation, primary, slice_type } = slice;
  const { image, image_caption, title, description, tag } = primary;

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
                    yPadding="sm"
                    data-slice-type={slice_type}
                    data-slice-variation={variation}
                    className="blog-section-slice"
                >
                    <article className="">
                        {isFilled.image(image) && (
                            <div className="aspect-[16/9] overflow-hidden">
                                <PrismicNextImage
                                    field={image}
                                    className="w-full h-full object-cover"
                                    imgixParams={{fit: "crop", ar: "16:9"}}
                                />
                            </div>
                        )}
                        <div className="flex gap-x-8">
                            <div className={tag ? "w-[80%]" : "w-[100%]"}>
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
                            </div>
                            {isFilled.keyText(tag) && (
                                <div className="w-[20%]">
                                    <div className="flex items-center mt-15 mr-5 justify-end">
                                        <div className="w-24 border-t border-solid border-gold-900 ml-6 mr-4"></div>
                                        <p className="font-serif text-sm text-gold-900 min-w-fit font-gtAmerica">{tag}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </article>
                </Bounded>
              </section>
          )

      case "splitContentTextRight": // Split Content text Right
          return (
              <section {...sectionBaseProps} aria-label="Split Content Section">
                  <Bounded yPadding="sm" widthClass="max-w-6xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                          {/* Column Image */}
                          <div className={variation === "splitContentTextLeft" ? "md:order-2" : "md:order-1"}>
                              {isFilled.image(image) && (
                                  <PrismicNextImage
                                      field={image}
                                      className="shadow-lg w-full"
                                      imgixParams={{ar: "3:4", fit:"crop"}}
                                  />
                              )}
                              {isFilled.keyText(image_caption) && (
                                  <figcaption className="flex justify-center items-center mt-1 text-base leading-4 text-center text-black-900 opacity-90 font-gtAmerica">
                                      {image_caption}
                                  </figcaption>
                              )}
                          </div>
                          {/* Column Text Content */}
                          <div className={variation === "splitContentTextLeft" ? "md:order-1" : "md:order-2"}>
                              {isFilled.keyText(tag) && (
                                  <div
                                      className={`flex items-center mt-4 ${
                                          variation === "splitContentTextLeft" ? "justify-start" : "justify-end"
                                      }`}
                                  >
                                      <div className="w-24 border-t border-solid border-gold-900 mr-4"></div>
                                      <p className="font-serif text-sm text-gold-900 min-w-fit font-gtAmerica">{tag}</p>
                                  </div>
                              )}
                              {isFilled.richText(title) && (
                                  <div className="text-2xl lg:text-[32px] text-black-900 uppercase mt-10 mb-6">
                                      <PrismicRichText field={title} />
                                  </div>
                              )}
                              {isFilled.richText(description) && (
                                  <div className="text-base md:text-xl text-left text-black-700 mt-10 mb-6">
                                      <PrismicRichText field={description} />
                                  </div>
                              )}
                          </div>
                      </div>
                  </Bounded>
              </section>
          );

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