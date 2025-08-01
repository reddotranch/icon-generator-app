import clsx from "clsx"

export function FormGroup(props: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div {...props} className={clsx("flex flex-col gap-4", props.className)}>
        {props.children}
        </div>
        );
}