export const metadata = { title: 'SEO Agent' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="ko"><body style={{fontFamily:'system-ui', margin:0}}>{children}</body></html>);
}
