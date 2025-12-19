"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/generated/prisma/browser";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
import clsx from "clsx";
import { HelpCircle, LogIn, LogOut, Mail, Menu, Settings, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { InvertedLogo, Logo } from "./logo";

const authedLinks = [
  { name: "Own", href: "/own" },
  { name: "Administrate", href: "/administrate" },
  { name: "Teach", href: "/teach" },
  { name: "Learn", href: "/learn" },
  { name: "Browse", href: "/courses" },
];

const unauthedLinks = [
  { name: "Home", href: "/" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

type NavbarTheme = "light" | "dark";

interface NavbarThemeContextType {
  theme: NavbarTheme;
  setTheme: Dispatch<SetStateAction<NavbarTheme>>;
}

const NavbarThemeContext = createContext<NavbarThemeContextType | undefined>(undefined);

export const NavbarThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<NavbarTheme>("light");

  return (
    <NavbarThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </NavbarThemeContext.Provider>
  );
};

export const useNavbarTheme = () => {
  const context = useContext(NavbarThemeContext);
  if (context === undefined) {
    throw new Error("useNavbarTheme must be used within a NavbarThemeProvider");
  }
  return context;
};

export const DarkSection = ({ children }: { children: React.ReactNode }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { setTheme } = useNavbarTheme();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setTheme(entry.isIntersecting ? "dark" : "light");
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -95% 0px",
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, [setTheme]);

  useEffect(() => {
    return () => setTheme("light");
  }, [setTheme]);

  return <div ref={sectionRef}>{children}</div>;
};

export default function Navbar() {
  const isMobile = useIsMobile();
  const user: User | null = authClient.useSession().data?.user as User | null;
  const links = user?.roleLevel ? authedLinks.slice(4 - user.roleLevel) : unauthedLinks;
  return (
    <header className="sticky top-0 right-0 left-0 z-50 flex justify-center">
      {isMobile ? (
        <MobileNavbar user={user} links={links} />
      ) : (
        <DesktopNavbar user={user} links={links} />
      )}
    </header>
  );
}

type NavbarProps = {
  user: User | null;
  links: { name: string; href: string }[];
};

export function DesktopNavbar({ user, links }: NavbarProps) {
  const { theme } = useNavbarTheme();
  const isDark = theme === "dark";

  const right = user ? (
    <UserDropdown user={user} />
  ) : (
    <div className="mr-1 flex gap-0.5">
      <Link
        className={`rounded-l-full ${isDark ? "bg-cyan-900" : "bg-secondary"} py-3 pl-4 pr-2 text-sm text-white ${isDark ? "hover:bg-cyan-950" : "hover:bg-slate-900"} transition-colors duration-500`}
        href="/login"
      >
        Login
      </Link>
      <Link
        className="rounded-r-full bg-primary py-3 pl-2 pr-4 text-sm text-white transition-colors duration-500 hover:bg-teal-700"
        href="/courses"
      >
        Courses
      </Link>
    </div>
  );

  return (
    <div
      className={clsx(
        "absolute h-min w-4xl max-w-[97vw] rounded-b-3xl px-2 py-0.5 shadow-md backdrop-blur-lg transition-colors duration-500",
        {
          "border-black/10 bg-white/50": !isDark,
          "border-white/20 bg-secondary/80": isDark,
        }
      )}
    >
      <div className="flex w-full items-center justify-between py-1">
        <Logo isDark={isDark} />

        <div className="absolute left-1/2 -translate-x-1/2">
          <nav aria-label="Global">
            <ul className="flex items-center gap-6 text-sm font-medium uppercase tracking-widest">
              {links.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={clsx("transition-colors hover:text-primary", {
                      "text-secondary": !isDark,
                      "text-slate-400": isDark,
                    })}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {right}
      </div>
    </div>
  );
}

function MobileNavbar({ user, links }: NavbarProps) {
  const [expanded, setExpanded] = useState(false);
  const { theme } = useNavbarTheme();
  const isDark = theme === "dark";

  const right = user ? (
    <UserDropdown user={user} />
  ) : (
    <div className="flex gap-2">
      <Link href="/courses">
        <Store
          strokeWidth={1.5}
          className={clsx({ "text-secondary": !isDark, "text-white": isDark })}
        />
      </Link>
      <Link href="/login">
        <LogIn
          strokeWidth={1.5}
          className={clsx({ "text-secondary": !isDark, "text-white": isDark })}
        />
      </Link>
    </div>
  );

  useEffect(() => {
    if (!expanded) return;
    function handleClickOutside() {
      setExpanded(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [expanded]);

  return (
    <div
      className={clsx(
        "absolute mx-auto flex h-fit w-full flex-col overflow-hidden py-0.5 shadow-sm backdrop-blur-lg transition-colors duration-500",
        {
          "bg-white/50": !isDark,
          "bg-secondary/80": isDark,
        }
      )}
    >
      <div className={`flex w-full items-center justify-between px-3 ${user ? "py-1" : "py-3"}`}>
        <div className="absolute left-1/2 -translate-x-1/2">
          <div className={"transition-colors " + (isDark && "invert saturate-0")}>
            <InvertedLogo />
          </div>
        </div>
        <Menu
          onClick={() => setExpanded((prev) => !prev)}
          strokeWidth={1.5}
          className={clsx("transition-colors", { "text-secondary": !isDark, "text-white": isDark })}
        />
        {right}
      </div>
      <ul
        className={`flex flex-wrap items-center justify-center gap-4 pb-2 text-sm font-medium uppercase tracking-widest ${
          expanded ? "block" : "hidden"
        }`}
      >
        {links.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={clsx("transition hover:text-primary", {
                "text-secondary": !isDark,
                "text-slate-400": isDark,
              })}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UserDropdown({ user }: { user: User }) {
  const { theme } = useNavbarTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={clsx(
            "flex items-center gap-2 rounded-full p-1 transition-colors duration-500 md:pr-3",
            {
              "text-secondary bg-secondary/20 hover:bg-secondary/30 data-[state=open]:bg-secondary data-[state=open]:text-white":
                !isDark,
              "text-slate-400 bg-slate-400/10 hover:bg-slate-400/20 data-[state=open]:bg-white/70 data-[state=open]:text-secondary":
                isDark,
            }
          )}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image ?? undefined} alt={user.name} className="object-cover" />
            <AvatarFallback className="font-semibold transition-colors bg-slate-200 text-secondary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:block">{user.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={clsx("mt-3 w-56 border-0 backdrop-blur-lg transition-colors duration-200", {
            "bg-white/80 text-secondary border-black/10": !isDark,
            "bg-secondary/80 text-slate-400 border-white/20": isDark,
          })}
          align="end"
        >
          <DropdownMenuItem
            asChild
            className={clsx("transition-colors", {
              "focus:bg-black/10": !isDark,
              "focus:bg-white/20": isDark,
            })}
          >
            <Link href="/settings">
              <Settings className="text-slate-400 mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className={clsx("transition-colors", {
              "focus:bg-black/10": !isDark,
              "focus:bg-white/20": isDark,
            })}
          >
            <Link href="/faq">
              <HelpCircle className="text-slate-400 mr-2 h-4 w-4" />
              <span>FAQ</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className={clsx("transition-colors", {
              "focus:bg-black/10": !isDark,
              "focus:bg-white/20": isDark,
            })}
          >
            <Link href="/contact">
              <Mail className="text-slate-400 mr-2 h-4 w-4" />
              <span>Contact</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator
            className={clsx({ "bg-secondary/20": !isDark, "bg-white/20": isDark })}
          />
          <DropdownMenuItem
            className="group bg-red-600/10 text-red-700 transition-colors focus:bg-red-600 focus:text-white"
            onClick={async () => {
              await authClient.signOut();
              router.push("/");
              router.refresh();
            }}
          >
            <LogOut className="text-slate-400 mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
