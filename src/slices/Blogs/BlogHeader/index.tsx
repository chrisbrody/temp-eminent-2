import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `BlogHeader`.
 */
export type BlogHeaderProps = SliceComponentProps<Content.BlogHeaderSlice>;

/**
 * Component for "BlogHeader" Slices.
 */
const BlogHeader: FC<BlogHeaderProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for blog_header (variation: {slice.variation})
      Slices
    </section>
  );
};

export default BlogHeader;
