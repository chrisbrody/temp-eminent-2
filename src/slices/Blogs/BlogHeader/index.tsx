import {FC, JSX} from "react";
import { Content, isFilled, asDate } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `BlogHeader`.
 */
export type BlogHeaderProps = SliceComponentProps<Content.BlogHeaderSlice>;

/**
 * Component for "BlogHeader" Slices.
 */
const BlogHeader: ({slice}: { slice: any }) => JSX.Element = ({ slice }) => {
  const { eyebrow, title } = slice.primary;

  console.log(eyebrow, title, slice.primary)

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="blog-header-slice bg-white pt-6 md:pt-10 text-charcoal"
    >
      <div className="container mx-auto px-4 text-center">

        {/* Blog Eyebrow */}
        {isFilled.keyText(eyebrow) && (
            <div className="mb-3 font-thin uppercase tracking-wider text-gold">
              {eyebrow}
            </div>
        )}

        {/* Blog Title */}
        {isFilled.keyText(title) && (
            <h1 className="text-3xl md:text-5xl uppercase font-bold font-serif font-thin mb-6">
              {title}
            </h1>
        )}
      </div>
    </section>
  );
};

export default BlogHeader;
