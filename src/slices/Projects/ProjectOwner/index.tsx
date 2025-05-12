// src/slices/Projects/ProjectOwner/index.tsx
import { FC } from "react";
// Make sure to import isFilled
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
// Import rendering components later
import { PrismicText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next"; // Or PrismicImage

/**
 * Props for `ProjectOwner`.
 */
export type ProjectOwnerProps = SliceComponentProps<Content.ProjectOwnerSlice>;

/**
 * Component for "ProjectOwner" Slices.
 */
const ProjectOwner: FC<ProjectOwnerProps> = ({ slice }) => {
  // Assign to a clear variable name
  const ownerLink = slice.primary.owner;

  // --- TYPE GUARD ---
  // Check if the link field is filled, not broken, AND has data populated
  if (isFilled.contentRelationship(ownerLink) && ownerLink.data) {
    // --- Access data safely INSIDE the guard ---
    const ownerData = ownerLink.data; // TS now knows .data exists here
    const name = ownerData.name;
    const title = ownerData.title;
    const img = ownerData.image;

    // Log only if needed for debugging
    console.log("Owner Data:", name, title, img);

    // --- Render the component using the safe data ---
    return (
        <section
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className="project-owner-slice py-12 md:py-16 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-y-4">
              {isFilled.image(img) && (
                  <PrismicNextImage // Or <PrismicImage ... />
                      field={img}
                      className="w-24 h-24 rounded-full object-cover"
                      width={96}
                      height={96}
                      imgixParams={{ ar: "1:1", fit: "crop" }}
                      alt={img.alt || (isFilled.keyText(name) ? `Portrait of ${name}` : 'Project Owner Portrait')}
                  />
              )}
              <div className="text-center">
                {isFilled.keyText(name) && (
                    <p className="text-xl md:text-2xl font-semibold text-charcoal mb-1">
                      {name}
                    </p>
                )}
                {isFilled.keyText(title) && (
                    <p className="text-base md:text-lg text-gray-500">
                      {title}
                    </p>
                )}
              </div>
            </div>
          </div>
        </section>
    );
  }

  // --- Fallback Rendering ---
  // If the link is empty, broken, or data wasn't fetched, render nothing or a placeholder
  // You could also log a warning here if desired during development
  // console.warn("ProjectOwner Slice: Owner link is missing, broken, or data not fetched.", ownerLink);
  return null; // Or return a placeholder component/message
};

export default ProjectOwner;