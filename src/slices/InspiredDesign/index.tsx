import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

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
    >
      Placeholder component for inspired_design (variation: {slice.variation})
      Slices
    </section>
  );
};

export default InspiredDesign;
