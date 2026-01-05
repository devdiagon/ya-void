import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center">
      <ol className="flex items-center space-x-2">
        {items.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">/</span>}
            {index === items.length - 1 ? (
              <span className="text-sm font-semibold text-blue-700">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
