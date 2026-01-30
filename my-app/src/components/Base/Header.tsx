import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function Header (){

    return(
    <>
    <div className="md:hidden">
      {/*Version Mobile*/ }
    </div>
    <div className="hidden md:flex">
    <div className="w-full h-[10vh]  bg-secondary font-sans ">
      <div className=" h-full grid grid-cols-3 items-center  ">
        <div className="flex items-center gap-3 pl-10 animate-text-reveal">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold shadow-sm animate-text-reveal">
            MA
          </div>
          <div className="leading-tight animate-text-reveal">
            <p className="text-sm font-semibold text-foreground">MainAgent</p>
            <p className="text-xs text-muted-foreground">AI learning suite</p>
          </div>
        </div>
        <div className="flex justify-center gap-15 ">
          <Button asChild size="lg">
            <Link href="/login">Home</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/login">MainGame</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/login">MainLessons</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/login">MainRating</Link>
          </Button>
          
   
        </div>
        <div className="flex justify-end mr-[6vh] gap-10 ">
          <Button asChild size="lg" variant="login">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="lg" variant="signin">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
      </div>
    </div>
    </>
    );
}
