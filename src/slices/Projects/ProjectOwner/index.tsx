import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type ProjectOwnerProps = SliceComponentProps<Content.ProjectOwnerSlice>;

const ProjectOwner: FC<ProjectOwnerProps> = ({ slice }) => {
  const ownerLink = slice.primary.owner;

  if (!ownerLink || !('data' in ownerLink)) {
    return null; // or a fallback UI
  }

    const ownerData = ownerLink.data as Content.OwnerDocument['data'];

  const { name, title, image } = ownerData;

  return (
      <section className="text-center">
        {image?.url && (
            <img
                src={image.url}
                alt={image.alt ?? name}
                className="mx-auto rounded-full w-14 h-14 object-cover mb-2"
            />
        )}
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{title}</p>
      </section>
  );
};

export default ProjectOwner;
