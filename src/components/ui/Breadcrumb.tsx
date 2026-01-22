import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="text-lg text-gray-700 mb-6">
      {items.map((item, index) => (
        <span key={index}>
          <Link to={item.href} className="text-green-600 hover:underline">
            {item.label}
          </Link>
          {index < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;