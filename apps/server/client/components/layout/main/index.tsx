import { cn } from "@follow/utils/utils"

export const MainContainer: Component = (props) => {
  return (
    <div
      className={cn(
        "mx-auto mt-[calc(80px+5rem)] flex w-full max-w-[var(--container-max-width)] flex-col items-center justify-center p-4 lg:p-0",
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}
