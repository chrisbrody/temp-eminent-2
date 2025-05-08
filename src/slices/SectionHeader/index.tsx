import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `SectionHeader`.
 */
export type SectionHeaderProps =
  SliceComponentProps<Content.SectionHeaderSlice>;

/**
 * Component for "SectionHeader" Slices.
 */
const SectionHeader = ({ slice }) => {
  return (
      <div className="section-header text-center mt-10">
          <h1>{slice.primary.eyebrow}</h1>
          <h2>{slice.primary.title}</h2>
          <p style={{ fontFamily: "'Herr Von Muellerhoff', cursive" }}>{slice.primary.cursivetext}</p>
      </div>
  )
}

export default SectionHeader;
