type SpinnerProps = {
    color?: string,
    className?: string
    height?: string
}
export default function Spinner({
    color = "blue-500",
    className = "",
    height = "200"
}: SpinnerProps) {

    return (
        <div className={`flex justify-center items-center min-h-${height} ${className}`}>
            <span
                className={`
                inline-block rounded-full animate-spin
                border-current border-t-transparent
                w-6 h-6 border-2  text-${color}
                `}
            />
        </div>
    );
}