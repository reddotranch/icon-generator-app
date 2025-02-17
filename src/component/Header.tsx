import { Button } from "./Button";
import { MainLink } from "./MainLink";
import { signIn, signOut, useSession } from "next-auth/react";


export function Header() {
    const session = useSession();
    const isLoggedIn = !!session.data;
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
        <ul>
            {isLoggedIn && (
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