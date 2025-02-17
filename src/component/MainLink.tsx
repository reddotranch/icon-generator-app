import Link from "next/link";

export function MainLink(props: React.ComponentPropsWithoutRef<"a">) {      
    return (
        <Link href={props.href ?? "#"} className="hover:text-cyan-500" {...props}>
            {props.children}
            </Link>
    );
}