/** Full-page spinner shown while auth state is being determined. */
export default function RouteSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="block w-10 h-10 rounded-full border-4 border-white/20 border-t-white animate-spin" />
    </div>
  )
}
