import React, {
  FC,
  PropsWithChildren,
} from 'react';

interface NavLinkMeta {
  href: string;
  label?: string;
}

// Treat link label as children
type NavLinkProps = PropsWithChildren<Pick<NavLinkMeta, 'href'>>;

const NavLink: FC<NavLinkProps> = ({ href, children }) => (
  <li>
    <a href={href}>
      {children || href}
    </a>
  </li>
);

/**
 * Minimal navigation link list
 */
export const Nav: FC<{ links: NavLinkMeta[] }> = ({ links }) => (
  <nav>
    <ul>
      {links.map(({ href, label }, i) => (
        <NavLink key={`${label || href}--${i}`} href={href}>
          {label}
        </NavLink>
      ))}
    </ul>
  </nav>
);
