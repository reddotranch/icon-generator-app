import { Button } from "./Button";
import { MainLink } from "./MainLink";
import { signIn, signOut, useSession } from "next-auth/react";
import { useBuyCredits } from "~/hooks/useBuyCredits";


export function Header() {
    const session = useSession();
    const isLoggedIn = !!session.data;
    const buyCredits = useBuyCredits();
    const handleBuyCredits = async () => {
        try {
          const successUrl = `${window.location.origin}/success`; // Define your success URL
          await buyCredits.buyCredits(successUrl);
        } catch (error) {
          console.error(error);
        }
      };
    return ( 
    <header className="container mx-auto flex h-16 items-center justify-between px-4 dark:bg-grey-800">
        
        <MainLink href="/">
        Icon Generator
        </MainLink>
        <ul>
            <li>
                <MainLink href="/generate">Generate</MainLink>
            </li>
        </ul>
        <ul className="flex gap-4">
            {isLoggedIn && (
                <>
                <li>
                    <Button
                        onClick={() => {
                            handleBuyCredits().catch(console.error);
                        }}
                     >
                    Buy Credits
                    </Button>
                </li>
                <li>
                    <Button
                    variant="secondary"
                        onClick={() => {
                        signOut().catch(console.error);
                        }}
                    >
                    Logout
                    </Button>
                </li>
                </>
            )}
            {!isLoggedIn && (
                <li>
                    <Button
                        onClick={() => {
                        signIn().catch(console.error);
                        }}
                    >
                    Login
                    </Button>
                </li>
        )}
        </ul>
    </header>
    );
}