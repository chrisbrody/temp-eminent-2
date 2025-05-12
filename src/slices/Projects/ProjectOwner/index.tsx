import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ProjectOwner`.
 */
export type ProjectOwnerProps = SliceComponentProps<Content.ProjectOwnerSlice>;

/**
 * Component for "ProjectOwner" Slices.
 */
const ProjectOwner: FC<ProjectOwnerProps> = ({ slice }) => {
  const owner = slice.primary.owner;
  console.log(owner)

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for project_owner (variation: {slice.variation})
      Slices
    </section>
  );
};

export default ProjectOwner;
