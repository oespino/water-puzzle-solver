function Icon({ size = 26, children }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {children}
        </svg>
    )
}

export function UndoIcon(props) {
    return (
        <Icon {...props}>
            <path d="M9 14 4 9l5-5" />
            <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
        </Icon>
    )
}

export function DropperIcon(props) {
    return (
        <Icon {...props}>
            <g transform="rotate(40 12 12)">
                <rect x="9.5" y="1.5" width="5" height="5.5" rx="2.5" />
                <path d="M8 7h8" />
                <path d="M9.5 7v9.5L12 21l2.5-4.5V7" />
            </g>
        </Icon>
    )
}

export function EmptyTubeIcon(props) {
    return (
        <Icon {...props}>
            <path d="M6.5 3h11" />
            <path d="M8 3v12.5a4 4 0 0 0 8 0V3" />
        </Icon>
    )
}
