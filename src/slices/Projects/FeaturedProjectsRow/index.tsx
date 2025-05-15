'use client'
import { FC, useEffect, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";

/**
 * Props for `FeaturedProjects`.
 * SliceComponentProps includes the 'index' prop automatically.
 */
export type FeaturedProjectsProps = SliceComponentProps<Content.FeaturedProjectsSlice>;

/**
 * Component for "FeaturedProjects" Slices.
 */
const FeaturedProjects: FC<FeaturedProjectsProps> = ({ slice }) => {
    const [projectOneData, setProjectOneData] = useState<Content.FeaturedProjectDocument | null>(null);
    const [projectTwoData, setProjectTwoData] = useState<Content.FeaturedProjectDocument | null>(null);
    const [projectThreeData, setProjectThreeData] = useState<Content.FeaturedProjectDocument | null>(null);
    const [projectFourData, setProjectFourData] = useState<Content.FeaturedProjectDocument | null>(null);

    useEffect(() => {
        const fetchRelated = async () => {
            const client = createClient();

            if (
                slice.primary.project_one &&
                slice.primary.project_one.link_type === "Document" &&
                !slice.primary.project_one.isBroken
            ) {
                const relatedProject = await client.getByID(slice.primary.project_one.id);
                setProjectOneData(relatedProject as Content.FeaturedProjectDocument);
            }
        };

        fetchRelated();

    }, [slice.primary.project_one]);

    useEffect(() => {
        const fetchRelated = async () => {
            const client = createClient();

            if (
                slice.primary.project_two &&
                slice.primary.project_two.link_type === "Document" &&
                !slice.primary.project_two.isBroken
            ) {
                const relatedProject = await client.getByID(slice.primary.project_two.id);
                setProjectTwoData(relatedProject as Content.FeaturedProjectDocument);
            }
        };

        fetchRelated();

    }, [slice.primary.project_two]);

    useEffect(() => {
        const fetchRelated = async () => {
            const client = createClient();

            if (
                slice.primary.project_three &&
                slice.primary.project_three.link_type === "Document" &&
                !slice.primary.project_three.isBroken
            ) {
                const relatedProject = await client.getByID(slice.primary.project_three.id);
                setProjectThreeData(relatedProject as Content.FeaturedProjectDocument);
            }
        };

        fetchRelated();

    }, [slice.primary.project_three]);

    useEffect(() => {
        const fetchRelated = async () => {
            const client = createClient();

            if (
                slice.primary.project_four &&
                slice.primary.project_four.link_type === "Document" &&
                !slice.primary.project_four.isBroken
            ) {
                const relatedProject = await client.getByID(slice.primary.project_four.id);
                setProjectFourData(relatedProject as Content.FeaturedProjectDocument);
            }
        };

        fetchRelated();

    }, [slice.primary.project_four]);

  return (
      <section
          data-slice-type={slice.slice_type}
          data-slice-variation={slice.variation}
          // Add padding/margin to the section
          className="my-12 px-4 md:px-6 lg:px-8"
      >
          <div className="space-y-6">
              {projectOneData ? (
                  <a href={projectOneData.url} className="text-xl text-blue-600 hover:underline block">
                      {projectOneData.data.project_title?.[0]?.text}
                  </a>
              ) : (
                  null
              )}

              {projectTwoData ? (
                  <a href={projectTwoData.url} className="text-xl text-blue-600 hover:underline block">
                      {projectTwoData.data.project_title?.[0]?.text}
                  </a>
              ) : (
                  null
              )}

              {projectThreeData ? (
                  <a href={projectThreeData.url} className="text-xl text-blue-600 hover:underline block">
                      {projectThreeData.data.project_title?.[0]?.text}
                  </a>
              ) : (
                  null
              )}

              {projectFourData ? (
                  <a href={projectFourData.url} className="text-xl text-blue-600 hover:underline block">
                      {projectFourData.data.project_title?.[0]?.text}
                  </a>
              ) : (
                  null
              )}
          </div>
      </section>
  );
};

export default FeaturedProjects;