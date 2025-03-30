import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

import styles from "./InspiredDesign.module.css";

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
          <div className={styles.serviceWrap}>
              {slice.primary.services?.map((item, index) => (
                  <div key={index} className="mt-4">
                      <PrismicNextImage field={item.service_image} />
                      <PrismicRichText field={item.service_header} />
                      <PrismicRichText field={item.service_text} />
                      <PrismicNextLink field={item.service_link} />
                  </div>
              ))}
          </div>
      </section>
  );
};

export default InspiredDesign;
