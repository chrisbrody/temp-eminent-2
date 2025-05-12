// src/slices/Projects/ProjectHeader/index.tsx
import { FC } from "react";
import { Content, isFilled, asDate } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react"; // PrismicText is not needed for Key Text fields

/**
 * Props for `ProjectHeader`.
 */
export type ProjectHeaderProps =
    SliceComponentProps<Content.ProjectHeaderSlice>;

/**
 * Component for "ProjectHeader" Slices.
 */
const ProjectHeader: FC<ProjectHeaderProps> = ({ slice }) => {
    const { project_category, project_title, project_date, project_location } = slice.primary;

    const formattedDate = isFilled.date(project_date)
        ? new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(asDate(project_date))
        : null;

    return (
        <section
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className="project-header-slice bg-white py-10 md:py-16 text-charcoal"
        >
            <div className="container mx-auto px-4 text-center">

                {/* Project Category */}
                {isFilled.keyText(project_category) && (
                    <div className="mb-3 font-thin uppercase tracking-wider text-gold">
                        {project_category}
                    </div>
                )}

                {/* Project Title */}
                {isFilled.keyText(project_title) && (
                    <h1 className="text-3xl md:text-5xl uppercase font-bold font-serif font-thin mb-6">
                        {project_title}
                    </h1>
                )}

                {/* Project Meta: Date and Location */}
                <div className="meta-info text-sm text-gray-700 font-sans flex flex-col sm:flex-row justify-center items-center gap-x-4 gap-y-1">
                    {formattedDate && (
                        <span className="project-date text-black-900 text-base md:text-base opacity-50">
                          {formattedDate}
                        </span>
                    )}
                    {formattedDate && isFilled.keyText(project_location) && (
                        <span className="hidden sm:inline">|</span>
                    )}
                    {/* Project Location */}
                    {isFilled.keyText(project_location) && (
                        <span className="project-location text-black-900 text-base md:text-base opacity-50">
                          {project_location}
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProjectHeader;