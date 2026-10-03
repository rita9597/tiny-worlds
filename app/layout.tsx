import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata={title:'Tiny Worlds — illustrated stories',description:'Create a tiny illustrated world and decide what happens next.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
