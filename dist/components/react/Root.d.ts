import React from "react";
/**
 * Root layout component used to render the main application structure.
 *
 * @remarks
 * This component provides the base UI layout for applications using
 * the SSO integration library.
 *
 * It is responsible for rendering:
 *
 * - the application top bar ({@link TopAppBar})
 * - the navigation drawer ({@link LeftDrawer})
 * - the main application content area
 *
 * The navigation menu is dynamically generated from resource
 * permission data using {@link mountDrawerMenuItem}.
 *
 * The component also handles:
 *
 * - responsive drawer behavior on small screens
 * - automatic drawer width adjustment
 * - persistence of drawer collapsed state
 *
 * When no `children` are provided, the component renders
 * the React Router {@link Outlet}.
 *
 * @param props Root component properties.
 *
 * @example
 * ```tsx
 * <Root
 *   menuData={resources}
 *   parser={parseIcon}
 *   translater={t}
 * />
 * ```
 */
export default function Root(props?: any): React.JSX.Element;
