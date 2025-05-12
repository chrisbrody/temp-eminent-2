// src/slices/Projects/ProjectOwner/index.tsx
import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next"; // Or PrismicImage

/**
 * Props for `ProjectOwner`.
 */
export type ProjectOwnerProps = SliceComponentProps<Content.ProjectOwnerSlice>;

/**
 * Component for "ProjectOwner" Slices.
 */
const ProjectOwner: FC<ProjectOwnerProps> = ({ slice }) => {
    const ownerLink = slice.primary.owner;

    // Use the type guard for safety and type inference
    if (isFilled.contentRelationship(ownerLink) && ownerLink.data) {
        const ownerData = ownerLink.data; // TS knows the shape here
        const name = ownerData.name;
        const title = ownerData.title;
        const img = ownerData.image;

        return (
            <section
                data-slice-type={slice.slice_type}
                data-slice-variation={slice.variation}
                className="project-owner-slice py-12 md:py-16 bg-white text-center" // Added text-center to section
            >
                <div className="container mx-auto px-4">
                    {/* Removed the inner flex container as section is text-center now */}
                    {isFilled.image(img) && (
                        <PrismicNextImage // Use the Prismic image component
                            field={img}
                            className="mx-auto rounded-full w-24 h-24 object-cover mb-4" // Adjusted margin and size
                            width={96}
                            height={96}
                            imgixParams={{ ar: "1:1", fit: "crop" }}
                            // --- FIX IS HERE ---
                            alt={img.alt ?? name ?? ""} // Use nullish coalescing with empty string fallback
                            // --- ------------ ---
                        />
                    )}

                    {/* Removed wrapping div as section is text-center */}
                    {isFilled.keyText(name) && (
                        <h3 className="text-xl md:text-2xl font-semibold text-charcoal mb-1">
                            {name}
                        </h3>
                    )}
                    {isFilled.keyText(title) && (
                        <p className="text-base md:text-lg text-gray-500">
                            {title}
                        </p>
                    )}
                </div>
            </section>
        );
    }

    // Fallback if data is not valid
    return null;
};

export default ProjectOwner;