import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `BlogSection`.
 */
export type BlogSectionProps = SliceComponentProps<Content.BlogSectionSlice>;

/**
 * Component for "BlogSection" Slices.
 */
const BlogSection: FC<BlogSectionProps> = ({ slice }) => {
  console.log(slice.primary)

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for blog_section (variation: {slice.variation})
      Slices
    </section>
  );
};

export default BlogSection;
