'use client'

import { useState, useEffect } from 'react'
import { getSettings, saveSettings } from '@/lib/lc-storage'

export default function SettingsPage() {
  const [key, setKey] = useState('')
  const [saved, setSaved] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    getSettings().then(s => setKey(s.geminiApiKey))
  }, [])

  const handleSave = async () => {
    await saveSettings({ geminiApiKey: key.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div>
        <h1 className="grad-text text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Configure your AI assistant</p>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <div>
          <h2 className="font-semibold text-sm mb-0.5">Gemini API Key</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
            Get a free key at{' '}
            <span className="text-violet-500">aistudio.google.com</span>
            {' '}— stored only on this device.
          </p>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="AIza..."
              className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent px-4 py-2.5 pr-12 text-sm outline-none focus:border-violet-400 placeholder:text-stone-400 font-mono"
            />
            <button
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all ${
            saved ? 'bg-green-500 text-white' : 'btn-outline'
          }`}
        >
          {saved ? '✓ Saved!' : 'Save Key'}
        </button>
      </div>

      <div className="glass rounded-2xl p-5 space-y-2">
        <h2 className="font-semibold text-sm">How the AI works</h2>
        <ul className="space-y-1.5 text-xs text-stone-500 dark:text-stone-400">
          <li>• Your key is stored in your device&apos;s local storage</li>
          <li>• Requests go directly from your device to Google</li>
          <li>• Gemini 2.0 Flash Lite is used (free tier)</li>
          <li>• The AI gives hints, not full solutions by default</li>
        </ul>
      </div>
    </div>
  )
}
