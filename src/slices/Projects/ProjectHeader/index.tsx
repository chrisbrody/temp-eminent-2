import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ProjectHeader`.
 */
export type ProjectHeaderProps =
  SliceComponentProps<Content.ProjectHeaderSlice>;

/**
 * Component for "ProjectHeader" Slices.
 */
const ProjectHeader: FC<ProjectHeaderProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for project_header (variation: {slice.variation})
      Slices
    </section>
  );
};

export default ProjectHeader;
