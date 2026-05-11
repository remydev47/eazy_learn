const companies = ["Google", "Microsoft", "Meta", "Adobe", "Spotify", "Amazon", "Netflix"];

export default function TrustedBy() {
  return (
    <section className="py-12 border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold tracking-[0.15em] text-slate-400 uppercase mb-8">
          Trusted by employees at leading organizations
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
          {companies.map((name) => (
            <span
              key={name}
              className="text-slate-300 font-bold text-lg tracking-wide select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
