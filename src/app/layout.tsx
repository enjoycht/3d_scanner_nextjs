import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "3D立體成型掃描機",
    description: "3D立體成型掃描機",
};

export default function RootLayout({
    children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
