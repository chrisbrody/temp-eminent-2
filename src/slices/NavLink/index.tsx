// slices/NavLink/index.tsx
import { PrismicNextLink } from "@prismicio/next";
import { isFilled } from "@prismicio/client"; // Correct import for isFilled
import type { Content } from "@prismicio/client"; // Import Content type

type NavLinkProps = {
    slice: Content.NavLinkSlice; // Use the generated slice type
};

export function NavLink({ slice }: NavLinkProps) {
    const label = slice.primary.label; // <--- Get the actual label value (string | null)
    const link = slice.primary.link;

    // Correct usage: Use isFilled.keyText() to check the label, and isFilled.link() to check the link
    if (!isFilled.keyText(label) || !isFilled.link(link)) {
        return null; // Don't render if essential data is missing
    }

    return (
        <li className={`nav-item`}>
            <PrismicNextLink field={link} className="nav-link font-semibold tracking-tight text-slate-800">
                {label} {/* Display the actual label value */}
            </PrismicNextLink>
        </li>
    );
}