import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

import { AuthGate } from '../components/AuthGate'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        // interactive-widget=resizes-content asks the browser to shrink
        // the viewport (rather than overlay) when the on-screen keyboard
        // opens — Chrome/Android honors it; harmless where unsupported.
        // Paired with dvh units on the drawer, this is what keeps the
        // sheet from jumping/clipping oddly once a text field is focused.
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, interactive-widget=resizes-content',
      },
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
      {
        title: 'Where are we going today?',
      },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600&family=Caveat:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script async src="https://www.instagram.com/embed.js"></script>
      </head>
      <body>
        <div className="grain-overlay" />
        <div className="relative z-10">
          <AuthGate>
            {children}
          </AuthGate>
        </div>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
