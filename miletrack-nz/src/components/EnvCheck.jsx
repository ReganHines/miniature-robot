const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured =
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseKey.includes('your-anon-key')

export default function EnvCheck({ children }) {
  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="text-4xl mb-4">&#9881;&#65039;</div>
          <h1 className="text-xl font-bold text-navy mb-2">Setup Required</h1>
          <p className="text-gray-600 text-sm mb-6">
            MileTrack NZ needs a Supabase project to run. Follow these steps:
          </p>
          <div className="text-left space-y-4 text-sm">
            <Step num="1" title="Create a Supabase project">
              Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-accent underline">supabase.com/dashboard</a> and create a new project.
            </Step>
            <Step num="2" title="Run the database schema">
              In the Supabase SQL Editor, run the contents of <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">supabase-schema.sql</code> from this project.
            </Step>
            <Step num="3" title="Add environment variables">
              Create a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env</code> file in the project root:
              <pre className="bg-gray-50 border rounded-lg p-3 mt-2 text-xs overflow-x-auto whitespace-pre">
{`VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...`}
              </pre>
            </Step>
            <Step num="4" title="Enable email auth">
              In Supabase Dashboard &rarr; Authentication &rarr; Providers, make sure Email is enabled.
            </Step>
            <Step num="5" title="Restart the dev server">
              Run <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">npm run dev</code> again.
            </Step>
          </div>
          <p className="text-gray-400 text-xs mt-6">
            For Netlify deploys, add these as environment variables in your site settings.
          </p>
        </div>
      </div>
    )
  }

  return children
}

function Step({ num, title, children }) {
  return (
    <div className="flex gap-3">
      <div className="bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
        {num}
      </div>
      <div>
        <p className="font-medium text-navy">{title}</p>
        <div className="text-gray-500 mt-0.5">{children}</div>
      </div>
    </div>
  )
}
