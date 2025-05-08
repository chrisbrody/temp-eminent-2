// slices/SectionHeader/index.tsx
import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type SectionHeaderProps = SliceComponentProps<Content.SectionHeaderSlice>;

const SectionHeader: FC<SectionHeaderProps> = ({ slice }) => {
    return (
        <div className="section-header text-center mt-10">
            {'eyebrow' in slice.primary && isFilled.keyText(slice.primary.eyebrow) && (
                <h1>
                    {slice.primary.eyebrow}
                </h1>
            )}
            <h2>{slice.primary.title}</h2>
            <p>{slice.primary.cursivetext}</p>
        </div>
    );
};

export default SectionHeader;