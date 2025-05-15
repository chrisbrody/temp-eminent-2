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
    const [projectData, setProjectData] = useState<{
        one?: Content.FeaturedProjectDocument;
        two?: Content.FeaturedProjectDocument;
        three?: Content.FeaturedProjectDocument;
        four?: Content.FeaturedProjectDocument;
    }>({});

    useEffect(() => {
        const fetchProjects = async () => {
            const client = createClient();
            const variation = slice.variation;

            const newData: typeof projectData = {};

            if (
                variation === 'ratio115' &&
                slice.primary.project_one?.link_type === 'Document' &&
                !slice.primary.project_one.isBroken
            ) {
                newData.one = await client.getByID(slice.primary.project_one.id) as Content.FeaturedProjectDocument;
            }

            if (
                variation === 'ratio115' &&
                slice.primary.project_two?.link_type === 'Document' &&
                !slice.primary.project_two.isBroken
            ) {
                newData.two = await client.getByID(slice.primary.project_two.id) as Content.FeaturedProjectDocument;
            }

            if (
                variation === 'ratio151' &&
                slice.primary.project_three?.link_type === 'Document' &&
                !slice.primary.project_three.isBroken
            ) {
                newData.three = await client.getByID(slice.primary.project_three.id) as Content.FeaturedProjectDocument;
            }

            if (
                variation === 'ratio151' &&
                slice.primary.project_four?.link_type === 'Document' &&
                !slice.primary.project_four.isBroken
            ) {
                newData.four = await client.getByID(slice.primary.project_four.id) as Content.FeaturedProjectDocument;
            }

            setProjectData(newData);
        };

        fetchProjects();
    }, [slice]);

  return (
      <section
          data-slice-type={slice.slice_type}
          data-slice-variation={slice.variation}
          className="my-12 px-4 md:px-6 lg:px-8"
      >
          <div className="space-y-6">
              {slice.variation === 'ratio115' && (
                  <>
                      {projectData.one && (
                          <a href={projectData.one.url} className="text-xl text-blue-600 hover:underline block">
                              {projectData.one.data.project_title?.[0]?.text}
                          </a>
                      )}
                      {projectData.two && (
                          <a href={projectData.two.url} className="text-xl text-blue-600 hover:underline block">
                              {projectData.two.data.project_title?.[0]?.text}
                          </a>
                      )}
                  </>
              )}

              {slice.variation === 'ratio151' && (
                  <>
                      {projectData.three && (
                          <a href={projectData.three.url} className="text-xl text-blue-600 hover:underline block">
                              {projectData.three.data.project_title?.[0]?.text}
                          </a>
                      )}
                      {projectData.four && (
                          <a href={projectData.four.url} className="text-xl text-blue-600 hover:underline block">
                              {projectData.four.data.project_title?.[0]?.text}
                          </a>
                      )}
                  </>
              )}
          </div>
      </section>
  );
};

export default FeaturedProjects;