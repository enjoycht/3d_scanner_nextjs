import type { Metadata } from "next";
import { UrlProvider } from "./compoent/UrlContext";
import { InfoProvider } from './compoent/info';
import Header from "./compoent/header";
import './global.css';

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
        <UrlProvider>
            <InfoProvider>
                <html lang="en">
                    <body>
                        <Header />
                        {children}
                    </body>
                </html>
            </InfoProvider>
        </UrlProvider>
    );
}
