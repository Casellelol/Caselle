export default function JarvisLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#050510", color: "#e0e8ff", fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
