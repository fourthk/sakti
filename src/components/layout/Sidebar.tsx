import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUser, getMenuItemsByRole } from "@/lib/auth";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const location = useLocation();
  const user = getUser();
  const menuItems = user ? getMenuItemsByRole(user.role) : [];

  return (
    <aside
      className={cn(
        "fixed left-0 transition-transform duration-300 ease-in-out z-40",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      style={{
        top: "80px",
        width: "270px",
        height: "calc(100vh - 80px)",
        backgroundColor: "#384E66",
      }}
    >
      <nav className="py-4 h-full">
        {menuItems.map((item) => {
          if ("subItems" in item && item.subItems) {
            const isExpanded = expandedMenu === item.name;
            const hasActiveChild = item.subItems.some(
              (sub) => location.pathname === sub.path
            );
            return (
              <div key={item.name}>
                <button
                  onClick={() =>
                    setExpandedMenu(isExpanded ? null : item.name)
                  }
                  className={cn(
                    "w-full flex items-center justify-between px-6 py-4 text-primary-foreground transition-all",
                    (isExpanded || hasActiveChild) && "bg-sidebar-hover"
                  )}
                >
                  <span className="text-base">{item.name}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>
                {isExpanded && (
                  <div style={{ backgroundColor: "#2F4256" }}>
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-12 py-3 text-primary-foreground transition-all text-sm",
                            "hover:bg-sidebar-active",
                            isActive &&
                              "bg-sidebar-active border-l-4 border-primary-foreground"
                          )
                        }
                      >
                        <span>{subItem.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <NavLink
              key={item.name}
              to={item.path!}
              className={({ isActive }) =>
                cn(
                  "block px-6 py-4 text-primary-foreground text-base transition-all",
                  "hover:bg-sidebar-hover",
                  isActive && "bg-sidebar-hover border-l-4 border-primary-foreground"
                )
              }
            >
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
