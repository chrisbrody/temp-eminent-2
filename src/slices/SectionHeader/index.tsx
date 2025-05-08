// slices/SectionHeader/index.tsx
import { FC } from "react";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

export type SectionHeaderProps = SliceComponentProps<Content.SectionHeaderSlice>;

const SectionHeader: FC<SectionHeaderProps> = ({ slice }) => {
    return (
        <div className="section-header text-center mt-10">
            <h1>{slice.primary.eyebrow}</h1>
            <h2>{slice.primary.title}</h2>
            <p style={{ fontFamily: "'Herr Von Muellerhoff', cursive" }}>
                {slice.primary.cursivetext}
            </p>
        </div>
    );
};

export default SectionHeader;