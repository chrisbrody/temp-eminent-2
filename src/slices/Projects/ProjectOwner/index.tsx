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
  console.log(slice.primary)
  // Assign to a clear variable name
  const ownerLink = slice.primary.owner;

  console.log(ownerLink)

  // --- Fallback Rendering ---
  // If the link is empty, broken, or data wasn't fetched, render nothing or a placeholder
  // You could also log a warning here if desired during development
  // console.warn("ProjectOwner Slice: Owner link is missing, broken, or data not fetched.", ownerLink);
  return null; // Or return a placeholder component/message
};

export default ProjectOwner;