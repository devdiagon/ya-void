export const getPathSegments = (pathname: string): string[] => {
  return pathname.split('/').filter((segment) => segment !== '');
};

export const buildCrumbsPaths = (pathSegments: string[]): { label: string; path: string }[] => {
  return pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);

    return { label, path };
  });
};
