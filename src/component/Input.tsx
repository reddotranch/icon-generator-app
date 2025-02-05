import React from "react";

export function Input(props: React.ComponentPropsWithoutRef<"input">) {
    return <input {...props} type="text"
    className="border border-grey-800 px-4 py-2 dark:text-gray-800 rounded"></input>;
}