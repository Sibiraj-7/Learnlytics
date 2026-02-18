import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, LayoutGrid, Users, Lightbulb, GraduationCap, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/student", label: "Dashboard", icon: LayoutGrid },
  { href: "/teacher", label: "Students", icon: Users },
  { href: "/student", label: "Insights", icon: Lightbulb },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-sm">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">
            Learn<span className="text-primary">lytics</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.label} to={item.href}>
                <button
                  className={cn(
                    "nav-link",
                    isActive ? "nav-link-active" : "nav-link-inactive"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/teacher">
            <Button className="gradient-primary text-white border-0 rounded-full px-5 shadow-sm hover:shadow-md transition-shadow">
              School
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
