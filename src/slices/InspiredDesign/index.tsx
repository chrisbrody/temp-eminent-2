import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";


/**
 * Props for `InspiredDesign`.
 */
export type InspiredDesignProps =
  SliceComponentProps<Content.InspiredDesignSlice>;

/**
 * Component for "InspiredDesign" Slices.
 */
const InspiredDesign: FC<InspiredDesignProps> = ({ slice }) => {
  return (
      <section
          data-slice-type={slice.slice_type}
          data-slice-variation={slice.variation}
          className="p-6 bg-gray-100"
      >
          <h2 className="text-2xl font-bold">
              <PrismicRichText field={slice.primary.heading || "Inspiring Design"}/>
          </h2>
          <h3 className="text-2xl font-bold">
              <PrismicRichText field={slice.primary.header_two || "Inspired by you"} />
          </h3>
          {slice.primary.services.map((item) => (
              // Render the item
              <div className="mt-4">
                  <PrismicNextImage field={item.service_image || ""} />
                  <PrismicRichText field={item.service_header || "INTERIOR DESIGN"} />
                  <PrismicRichText field={item.service_text || "Interiors with surprising colors, textures, and details that capture your spirit and bring joy to your life."} />
                  <PrismicNextLink field={item.service_link || ""} />
              </div>
          ))}
      </section>
  );
};

export default InspiredDesign;
