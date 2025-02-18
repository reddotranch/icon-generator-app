import Link from "next/link";
import clsx from "clsx";

export function MainLinkButton(props: React.ComponentPropsWithoutRef<"a">) {      
    return (
        <Link 
        {...props}
        href={props.href ?? "#"} 
        className={clsx(
            "rounded px-4 py-2 bg-blue-400 hover:bg-blue-500", 
            props.className?? ""
        )}
        >
            {props.children}
            </Link>
    );
}