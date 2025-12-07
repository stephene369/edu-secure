// src/components/layout/Sidebar.jsx
import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaGraduationCap,
  FaQuestionCircle,
  FaUsers,
  FaCog,
  FaPlus,
  FaFolderOpen 
} from "react-icons/fa";

const navigation = [
  {
    name: "Tableau de bord",
    href: "/teacher/dashboard",
    icon: FaTachometerAlt,
  },
  {
    name: "Matières",
    icon: FaBook,
    children: [
      { name: "Ajouter une matière", href: "/teacher/add-subject", icon: FaPlus },
      { name: "Gérer les matières", href: "/teacher/manage-subjects", icon: FaBook },
    ],
  },
  {
    name: "Chapitres",
    icon: FaFolderOpen,
    children: [
      { name: "Ajouter un chapitre", href: "/teacher/add-chapter", icon: FaPlus },
      { name: "Gérer les chapitres", href: "/teacher/manage-chapters", icon: FaFolderOpen },
    ],
  },
    {
    name: "Sous-Chapitres",
    icon: FaFolderOpen,
    children: [
      { name: "Ajouter sous-chapitres", href: "/teacher/add-subchapters", icon: FaFolderOpen },
      { name: "Gérer les sous-chapitres", href: "/teacher/manage-subchapters", icon: FaFolderOpen },
    ],
  },
  {
    name: "Cours",
    icon: FaGraduationCap,
    children: [
      { name: "Créer un cours", href: "/teacher/add-lesson", icon: FaPlus },
      { name: "Cours existants", href: "/teacher/lessons", icon: FaGraduationCap },
    ],
  },
  {
    name: "Quiz",
    icon: FaQuestionCircle,
    children: [
      { name: "Créer un quiz", href: "/teacher/create-quiz", icon: FaPlus },
      { name: "Quiz existants", href: "/teacher/quizzes", icon: FaQuestionCircle },
    ],
  },
  {
    name: "Élèves",
    href: "/teacher/students",
    icon: FaUsers,
  },
  {
    name: "Paramètres",
    href: "/teacher/settings",
    icon: FaCog,
  },
];

export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();

  // Ouvrir automatiquement le groupe qui contient la route active
  const defaultOpenGroups = useMemo(() => {
    const openSet = new Set();
    navigation.forEach((item, idx) => {
      if (item.children?.some((c) => pathname.startsWith(c.href))) {
        openSet.add(idx);
      }
    });
    return openSet;
  }, [pathname]);

  const [openGroups, setOpenGroups] = useState(defaultOpenGroups);

  // Sur changement de route : ouvrir le bon groupe et fermer la sidebar mobile
  useEffect(() => {
    setOpenGroups(defaultOpenGroups);
    if (open && typeof onClose === "function") onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleGroup = (idx) => {
    const next = new Set(openGroups);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setOpenGroups(next);
  };

  const isActive = (href) => !!href && pathname.startsWith(href);

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
        role="navigation"
        aria-label="Sidebar"
      >
        {/* Logo */}
        {/* <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">E</span>
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">
              EducSecu
            </span>
          </div>
        </div> */}

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navigation.map((item, idx) => {
              const Icon = item.icon;

              // Liens simples
              if (!item.children || item.children.length === 0) {
                const active = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                        ${active
                          ? "bg-gray-50 text-gray-900 border-l-2 border-gray-900"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      aria-current={active ? "page" : undefined}
                      onClick={onClose}
                    >
                      <Icon
                        className={`mr-3 flex-shrink-0 ${active ? "text-gray-900" : "text-gray-400"
                          }`}
                        size={18}
                        aria-hidden="true"
                      />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              }

              // Groupes avec enfants
              const groupOpen = openGroups.has(idx);
              const groupActive =
                item.children?.some((c) => isActive(c.href)) ?? false;

              return (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(idx)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${groupActive
                        ? "bg-gray-50 text-gray-900 border-l-2 border-gray-900"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    aria-expanded={groupOpen}
                    aria-controls={`group-${idx}`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 ${groupActive ? "text-gray-900" : "text-gray-400"
                        }`}
                      size={18}
                      aria-hidden="true"
                    />
                    <span className="flex-1 text-left">{item.name}</span>
                    <svg
                      className={`h-4 w-4 transform transition-transform ${groupOpen ? "rotate-90" : ""
                        }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 6l6 4-6 4V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Sous-menu */}
                  <ul
                    id={`group-${idx}`}
                    className={`mt-1 pl-9 pr-2 space-y-1 overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${groupOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const active = isActive(child.href);
                      return (
                        <li key={child.name}>
                          <Link
                            to={child.href}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                              ${active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                            aria-current={active ? "page" : undefined}
                            onClick={onClose}
                          >
                            <ChildIcon
                              className={`mr-3 flex-shrink-0 ${active ? "text-gray-900" : "text-gray-400"
                                }`}
                              size={16}
                              aria-hidden="true"
                            />
                            <span>{child.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>

          {/* Ressources (sans emoji) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Ressources
            </h3>
            <div className="mt-2 space-y-1">
              <Link
                to="/docs"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                onClick={onClose}
              >
                <span className="mr-3 inline-block w-2 h-2 rounded-full bg-gray-400" />
                Documentation
              </Link>
              <Link
                to="/support"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                onClick={onClose}
              >
                <span className="mr-3 inline-block w-2 h-2 rounded-full bg-gray-400" />
                Support
              </Link>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
