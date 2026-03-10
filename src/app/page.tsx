import { createSession } from "@/features/session/actions";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-midnight">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-cyan/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-magical-violet/20 blur-[120px] rounded-full" />

      <div className="z-10 text-center space-y-8 max-w-md w-full">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight text-white font-outfit">
            Bop<span className="text-electric-cyan">.</span>
          </h1>
          <p className="text-white/60 text-lg font-inter">
            Magical Studio. Gesture Powered.
          </p>
        </div>

        <form action={createSession} className="glass p-8 rounded-3xl space-y-6">
          <div className="space-y-2 text-left">
            <label htmlFor="partyName" className="text-sm font-medium text-white/80 px-1">
              Party Name
            </label>
            <input
              id="partyName"
              name="partyName"
              type="text"
              placeholder="e.g. Lan's Vibe Birthday"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-electric-cyan/50 focus:ring-1 focus:ring-electric-cyan/50 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-electric-cyan text-midnight font-bold py-4 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all font-outfit text-lg shadow-[0_0_20px_rgba(0,242,255,0.3)]"
          >
            Start Booth
          </button>
        </form>

        <p className="text-white/30 text-sm italic">
          No sign-up. Photos self-destruct in 24 hours.
        </p>
      </div>
    </main>
  );
}
