import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import posterImage from '../assets/poster.jpg'

export default function Centres() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const centers = [
    { name: "Thika Stadium Grounds", place: "Thika", time: "Open today", distance: "1.8 km", coords: "-0.9405,37.0936" },
    { name: "Juja Town Hall", place: "Juja", time: "Opens 8:00 AM", distance: "3.1 km", coords: "-0.9252,37.1594" },
    { name: "Ruiru Social Hall", place: "Ruiru", time: "Open today", distance: "5.4 km", coords: "-0.9,37.09" },
    { name: "Kiambu Market", place: "Kiambu", time: "Open today", distance: "8.2 km", coords: "-1.0088,36.8132" },
    { name: "Nyeri Town Centre", place: "Nyeri", time: "Opens 9:00 AM", distance: "12.5 km", coords: "-0.4167,36.9667" },
  ]

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.place.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const shareOnWhatsApp = (centerName) => {
    const text = `Found a registration center: ${centerName} 🎯 Let's go together! https://yourlink.com/centres`
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappLink, '_blank')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer hover:opacity-80">
            <img src={posterImage} alt="Tuko Kadi" className="h-14 w-14 rounded-xl object-cover" />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Register Na Mbogi</p>
              <h1 className="text-lg font-black uppercase tracking-wide">Tuko Kadi</h1>
            </div>
          </button>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="/#features" className="hover:text-white">What you can do</a>
            <button onClick={() => navigate('/centres')} className="hover:text-white">Centres</button>
            <button onClick={() => navigate('/groups')} className="hover:text-white">Groups</button>
          </div>

          <button onClick={() => navigate('/groups')} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:scale-[1.02] hover:bg-red-500">
            Create Group
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase text-red-600 mb-2">Find a Registration Centre</h2>
          <p className="text-white/70">No confusion. No long searching. Just clear options, distance, and timing.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by town, estate, or centre name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full bg-white/10 border border-white/20 px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-red-500/50 focus:bg-white/15"
          />
        </div>

        {/* Centers List */}
        <div className="grid gap-4 md:gap-6">
          {filteredCenters.length > 0 ? (
            filteredCenters.map((center) => (
              <div
                key={center.name}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-red-500/30 transition"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-xl font-bold">{center.name}</h4>
                    <p className="mt-1 text-sm text-white/55">{center.place}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em]">
                    <span className="rounded-full border border-white/10 px-3 py-2 text-white/60">{center.time}</span>
                    <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-400">
                      {center.distance}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <a
                      href={`https://www.google.com/maps/search/${center.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white text-center hover:bg-red-500 transition"
                    >
                      View on Maps
                    </a>
                    <button
                      onClick={() => shareOnWhatsApp(center.name)}
                      className="flex-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:border-white/40 transition"
                    >
                      Share on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60">No centres found. Try a different search.</p>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-12">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white hover:border-white/40 transition"
          >
            ← Back to Home
          </button>
        </div>
      </main>
    </div>
  )
}
