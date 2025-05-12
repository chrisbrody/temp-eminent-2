import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react"; // PrismicText is not strictly needed for Text fields
import { PrismicNextImage } from "@prismicio/next"; // Assuming you use PrismicNextImage

/**
 * Props for `FeaturedProjects`.
 * SliceComponentProps includes the 'index' prop automatically.
 */
export type FeaturedProjectsProps =
    SliceComponentProps<Content.FeaturedProjectsSlice>;

/**
 * Component for "FeaturedProjects" Slices.
 * Displays up to 2 manually entered projects in a row with alternating layouts.
 *
 * NOTE: This slice structure uses a Group field in Primary, which is less
 * ideal for lists of items and prevents linking to existing documents.
 * The recommended approach is a Repeatable Zone with a Content Relationship field.
 */
const FeaturedProjects: FC<FeaturedProjectsProps> = ({ slice, index }) => {

  // Access the repeating group from the primary fields
  const projects = slice.primary.featured_project;

  // Limit to the first two projects for the row layout
  const projectsToDisplay = projects?.slice(0, 2) || [];

  // If there are no projects to display, don't render the row
  if (projectsToDisplay.length === 0) {
    return null;
  }

  // Determine the layout based on the slice's index (0-based)
  // Odd rows (index 1, 3, 5...) are 2/3 | 1/3
  // Even rows (index 0, 2, 4...) are 1/3 | 2/3
  const isEvenRow = index % 2 === 0;

  // Define layout classes based on the row index and item position
  // Using Tailwind CSS classes as an example - ADAPT THESE TO YOUR CSS FRAMEWORK
  const rowClasses = `flex flex-col md:flex-row gap-6 items-center`; // Base flex classes for the row

  const itemClasses = (itemIndex: number) => {
    // Classes for each individual project item within the row
    let classes = "w-full"; // Full width on small screens

    if (projectsToDisplay.length === 2) {
      // If there are two items, apply split layout on medium screens and up
      if (isEvenRow) {
        // Even row (0, 2, 4...): First item 1/3, Second item 2/3
        if (itemIndex === 0) classes += " md:w-1/3";
        if (itemIndex === 1) classes += " md:w-2/3";
        // Add classes to control order for even rows to achieve 1/3 | 2/3 visually
        if (itemIndex === 0) classes += " md:order-last"; // First item comes second visually
        if (itemIndex === 1) classes += " md:order-first"; // Second item comes first visually
      } else {
        // Odd row (1, 3, 5...): First item 2/3, Second item 1/3
        if (itemIndex === 0) classes += " md:w-2/3";
        if (itemIndex === 1) classes += " md:w-1/3";
        // No order classes needed for odd rows
      }
    } else {
      // If only one item, it takes full width on medium screens+
      // You might want a specific layout for a single item row, e.g., centered 2/3
      classes += " md:w-full"; // Or md:w-2/3 md:mx-auto etc.
    }

    return classes;
  };

  return (
      <section
          data-slice-type={slice.slice_type}
          data-slice-variation={slice.variation}
          // Add padding/margin to the section
          className="my-12 px-4 md:px-6 lg:px-8"
      >
        {/* Container for the projects in this row */}
        <div className={rowClasses}>
          {projectsToDisplay.map((item, itemIndex) => {
            // Access the manually entered data for each project item
            const { image, title, location } = item;

            return (
                // Note: Linking to a full project page is NOT possible with this slice structure
                // as it doesn't link to actual documents. This div is not a link.
                <div
                    key={itemIndex} // Use itemIndex as key for mapping
                    className={itemClasses(itemIndex)} // Apply layout classes
                >
                  {/* Container for the individual project item's content */}
                  <div className="flex flex-col items-center text-center"> {/* Example: Center content */}
                    {/* Display Project Image */}
                    {image && (
                        <div className="w-full mb-4"> {/* Example: Image container */}
                          <PrismicNextImage
                              field={image}
                              // Add responsive image attributes if needed
                              sizes={projectsToDisplay.length === 2 ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (min-width: 1025px) var(--calculated-width)" : "(max-width: 768px) 100vw, 100vw"} // Example sizes
                              className="w-full h-auto object-cover rounded-lg shadow-md" // Example styling
                          />
                        </div>
                    )}

                    {/* Display Project Title */}
                    {title && (
                        <h3 className="text-xl md:text-2xl font-semibold mb-1">
                          {title}
                        </h3>
                    )}

                    {/* Display Project Location */}
                    {location && (
                        <p className="text-gray-600 text-base">
                          {location}
                        </p>
                    )}
                  </div>
                </div>
            );
          })}
        </div>
      </section>
  );
};

export default FeaturedProjects;