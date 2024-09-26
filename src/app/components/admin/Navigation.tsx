"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/app/components/ui/navigation-menu";
import { cn } from "@/app/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/app/lib/redux/hooks";
import { logOut } from "@/app/lib/redux/features/auth/auth_slice";

const RouteList: { title: string; href: string }[] = [
  {
    title: "Users Tasks",
    href: "/admin/tasks",
  },
  {
    title: "Models",
    href: "/admin/models",
  },
  {
    title: "Compute Resources",
    href: "/admin/resources",
  },
];

function Navigation() {
  const pathname = usePathname();
  const rotuter = useRouter();

  const dispatch = useAppDispatch();

  return (
    <NavigationMenu className="mx-auto">
      <NavigationMenuList>
        {RouteList.map((route, idx) => (
          <NavigationMenuItem key={idx}>
            <Link href={route.href} legacyBehavior passHref>
              <NavigationMenuLink
                {...(pathname === route.href ? { "data-active": true } : {})}
                className={navigationMenuTriggerStyle()}
              >
                {route.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
        <Button
          variant={"secondary"}
          className="fixed top-2 right-2"
          onClick={() => {
            dispatch(logOut());
            rotuter.push("/");
          }}
        >
          Log Out
        </Button>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navigation;
