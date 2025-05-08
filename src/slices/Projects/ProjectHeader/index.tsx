// src/slices/Projects/ProjectHeader/index.tsx
import { FC } from "react";
import { Content, isFilled, asDate } from "@prismicio/client";
import { SliceComponentProps, PrismicText } from "@prismicio/react"; // PrismicText for KeyText fields

/**
 * Props for `ProjectHeader`.
 */
export type ProjectHeaderProps =
    SliceComponentProps<Content.ProjectHeaderSlice>; // Assumes ProjectHeaderSlice is generated in prismicio-types.d.ts

/**
 * Component for "ProjectHeader" Slices.
 */
const ProjectHeader: FC<ProjectHeaderProps> = ({ slice }) => {
    // Destructure primary fields for easier access
    const { project_category, project_title, project_date, project_location } = slice.primary;

    // Format the date (optional, but good for display)
    const formattedDate = isFilled.date(project_date)
        ? new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(asDate(project_date)) // asDate converts Prismic date string to JS Date object
        : null;

    return (
        <section
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className="project-header-slice bg-gray-100 py-12 md:py-16 text-center" // Example styling
        >
            <div className="container mx-auto px-4">
                {/* Project Category */}
                {isFilled.keyText(project_category) && (
                    <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                        <PrismicText field={project_category} />
                    </div>
                )}

                {/* Project Title */}
                {isFilled.keyText(project_title) && (
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        <PrismicText field={project_title} />
                    </h1>
                )}

                {/* Project Meta: Date and Location */}
                <div className="meta-info text-gray-600 text-base">
                    {formattedDate && (
                        <span className="project-date mr-4">
              {formattedDate}
            </span>
                    )}
                    {isFilled.keyText(project_location) && (
                        <span className="project-location">
              <PrismicText field={project_location} />
            </span>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProjectHeader;