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
  const ownerData = owner.data;
  const name = ownerData.name
  const title = ownerData.title
  const img = ownerData.image

  console.log(name, title, img)

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
