import '../public/styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <main className="bg-dark min-h-screen w-full text-white">
    <div style={{ zIndex: 2 }} className="py-12 relative w-full">
      <Component {...pageProps} />
    </div>
    <div style={{ zIndex: 100 }} className="fixed bottom-5 left-5">
      <p>Developed with ❤️ by 
        <a href="https://clqu.live" className="hover:text-purple-500 font-medium transition-all duration-200" target="_blank"> clqu </a>
    </div>
    <div className="layout-colored-background fixed top-0 opacity-10" />
  </main>

}

export default MyApp
