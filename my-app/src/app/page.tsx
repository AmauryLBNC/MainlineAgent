import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
export default function Home() {
  
  return (
    
    <div className="flex min-h-screen  justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex items-center justify-center mt-0 w-full h-1/8 bg-black ">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
              <NavigationMenuLink>Link2</NavigationMenuLink>
              <NavigationMenuLink>Link3</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
        </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
              <NavigationMenuLink>Link2</NavigationMenuLink>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      </div>

    </div>
  );
}
