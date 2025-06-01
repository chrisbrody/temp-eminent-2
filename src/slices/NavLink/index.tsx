// slices/NavLink/index.tsx
import { PrismicNextLink } from "@prismicio/next";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";

type NavLinkProps = {
    slice: Content.NavLinkSlice;
};

export function NavLink({ slice }: NavLinkProps) {
    const label = slice.primary.label;
    const link = slice.primary.link;

    if (!isFilled.keyText(label) || !isFilled.link(link)) {
        return null;
    }

    return (
        <li className={`nav-item`}>
            <PrismicNextLink
                field={link}
                // Reverted to original desktop classes
                className="nav-link font-semibold tracking-tight text-slate-800"
            >
                {label}
            </PrismicNextLink>
        </li>
    );
}