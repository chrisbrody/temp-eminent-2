import {FC, JSX} from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

export type ProjectOwnerProps = SliceComponentProps<Content.ProjectOwnerSlice>;

const ProjectOwner: ({slice}: { slice: any }) => (null | JSX.Element) = ({ slice }) => {
  const ownerLink = slice.primary.owner;

  if (!ownerLink || !('data' in ownerLink)) {
    return null;
  }

  const ownerData = ownerLink.data as Content.OwnerDocument['data'];
    // console.log(ownerData)

  const { name, title, image } = ownerData;

  return (
      <section className="text-center mt-8" id="project-owner">
        {image?.url && (
            <PrismicNextImage
                field={image}
                className="mx-auto rounded-full object-cover mb-4"
                width={56}
                height={56}
                imgixParams={{ ar: "1:1", fit: "crop" }}
            />
        )}
        <h3 className="mt-3 capitalize text-base">{name}</h3>
        <p className="mt-1 capitalize text-base md:text-base opacity-60">{title}</p>
      </section>
  );
};

export default ProjectOwner;
