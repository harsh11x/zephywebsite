export default function SecurityDocsPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white">Security Whitepaper</h1>
        <p className="text-white/70 mt-4 text-lg">A concise overview of encryption, identity, and transport used by the platform.</p>

        <div className="mt-10 space-y-10">
          <section className="elevated-card outline-glow p-6">
            <h2 className="text-2xl text-white">Threat Model & Goals</h2>
            <p className="text-white/70 mt-2">
              Zero-knowledge architecture: servers cannot read content. Clients perform all encryption/decryption. Identities are emails; no phone numbers required.
            </p>
          </section>

          <section className="elevated-card outline-glow p-6">
            <h2 className="text-2xl text-white">Message & File Encryption</h2>
            <p className="text-white/70 mt-2">
              Client-side symmetric encryption using AES-256/GCM with random IVs. Keys are exchanged out-of-band, or via a mutually authenticated channel.
            </p>
          </section>

          <section className="elevated-card outline-glow p-6">
            <h2 className="text-2xl text-white">Voice/Video E2EE</h2>
            <p className="text-white/70 mt-2">
              Media encrypted end-to-end using SRTP with client-negotiated keys. Email address acts as identity; no SIM. Signaling metadata is minimized.
            </p>
          </section>

          <section className="elevated-card outline-glow p-6">
            <h2 className="text-2xl text-white">Key Management</h2>
            <p className="text-white/70 mt-2">
              Keys are generated client-side and never stored in plaintext on servers. For persistence, encrypted key material can be protected with passphrase-based KDFs.
            </p>
          </section>

          <section className="elevated-card outline-glow p-6">
            <h2 className="text-2xl text-white">Roadmap</h2>
            <ul className="list-disc list-inside text-white/70 mt-2 space-y-1">
              <li>Post-quantum KEM for key exchange</li>
              <li>Forward secrecy rotation for message/file keys</li>
              <li>Private contact discovery with zero-knowledge proofs</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}


