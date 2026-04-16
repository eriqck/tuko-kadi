import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import posterImage from '../assets/poster.jpg'

export default function Groups() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([
    { id: 1, name: "Thika Mbogi", members: "18 joined", time: "Leaving Sunday 10:00 AM", meeting: "Thika stage" },
    { id: 2, name: "Juja Campus Wave", members: "26 joined", time: "Leaving Saturday 9:00 AM", meeting: "Campus main gate" },
    { id: 3, name: "Ruiru Youth Squad", members: "12 joined", time: "Leaving Sunday 8:30 AM", meeting: "Ruiru market" },
  ])

  const [formData, setFormData] = useState({
    name: '',
    meeting: '',
    time: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateGroup = (e) => {
    e.preventDefault()
    if (formData.name && formData.meeting && formData.time) {
      const newGroup = {
        id: groups.length + 1,
        name: formData.name,
        members: "1 joined",
        time: `Leaving ${formData.time}`,
        meeting: formData.meeting
      }
      setGroups([...groups, newGroup])
      setFormData({ name: '', meeting: '', time: '' })
      alert('✅ Group created! Now share it with your friends.')
    }
  }

  const shareGroupOnWhatsApp = (groupName, meetingPoint) => {
    const text = `Join my mbogi: "${groupName}" 🚀\n\nMeeting: ${meetingPoint}\n\nLet's register together! https://yourlink.com/groups`
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

          <button onClick={() => navigate('/centres')} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:scale-[1.02] hover:bg-red-500">
            Find Centre
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase text-red-600 mb-2">Join or Create a Mbogi</h2>
          <p className="text-white/70">Move with your people. Create a group for your estate, church, school, campus, or friend circle.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Existing Groups */}
          <div>
            <h3 className="text-xl font-bold mb-6">Available Groups</h3>
            <div className="grid gap-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-red-500/30 transition"
                >
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="text-lg font-bold">{group.name}</h4>
                      <p className="mt-1 text-sm text-white/60">{group.members}</p>
                      <p className="mt-2 text-xs text-white/50">📍 {group.meeting}</p>
                      <p className="mt-1 text-xs text-white/50">⏰ {group.time}</p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={() => shareGroupOnWhatsApp(group.name, group.meeting)}
                        className="flex-1 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-500 transition"
                      >
                        📱 Join & Share
                      </button>
                      <button
                        onClick={() => shareGroupOnWhatsApp(group.name, group.meeting)}
                        className="flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:border-white/40 transition"
                      >
                        Share Invite
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create Group Form */}
          <div>
            <h3 className="text-xl font-bold mb-6">Start Your Own</h3>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 sticky top-24">
              <form onSubmit={handleCreateGroup} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">Group Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Thika Sunday Mbogi"
                    className="w-full rounded-lg bg-black/25 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">Meeting Point</label>
                  <input
                    type="text"
                    name="meeting"
                    value={formData.meeting}
                    onChange={handleInputChange}
                    placeholder="e.g., Thika stage"
                    className="w-full rounded-lg bg-black/25 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">Departure Time</label>
                  <input
                    type="datetime-local"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-black/25 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-red-500/50 text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white hover:bg-red-500 transition mt-6"
                >
                  Create Group
                </button>
              </form>

              <p className="mt-6 text-xs text-white/50 text-center">
                Your group will be shared and visible to all users
              </p>
            </div>
          </div>
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
