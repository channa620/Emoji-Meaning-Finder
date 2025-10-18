import React, { useMemo, useState } from 'react'
import {
  TextField,
  InputAdornment,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'


const normalizeEmoji = (s = '') => {
  if (!s) return ''
  // remove variation selector FE0F and zero width joiners
  let out = s.replace(/\uFE0F/g, '').replace(/\u200D/g, '')
  // try unicode property for emoji modifiers; fallback to explicit range
  try {
    out = out.replace(/\p{Emoji_Modifier}/gu, '')
  } catch (err) {
    out = out.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '')
  }
  return out.trim()
}

function EmojiSearch({ emojiDict = {}, onSelect = () => {} }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [message, setMessage] = useState(null)

  const normalizedEntries = useMemo(() => {
    return Object.entries(emojiDict).map(([emoji, meaning]) => {
      const normKey = normalizeEmoji(emoji)
      const normMeaning = (meaning || '').toLowerCase()
      return { emoji, normKey, meaning, normMeaning }
    })
  }, [emojiDict])

  const searchEmoji = (raw) => {
    const trimmed = (raw || '').trim()
    if (!trimmed) return []

    const normQuery = normalizeEmoji(trimmed)

    // 1) exact normalized lookup
    const exact = normalizedEntries.filter(
      (e) => (e.normKey && e.normKey === normQuery) || e.emoji === trimmed
    )
    if (exact.length) return exact.map((e) => ({ emoji: e.emoji, meaning: e.meaning }))

    // 2) try first grapheme-like symbol (Array.from handles surrogate pairs)
    const first = Array.from(trimmed)[0]
    if (first) {
      const normFirst = normalizeEmoji(first)
      const byFirst = normalizedEntries.filter((e) => e.normKey === normFirst || e.emoji.includes(first))
      if (byFirst.length) return byFirst.map((e) => ({ emoji: e.emoji, meaning: e.meaning }))
    }

    // 3) search meanings or normalized emoji substring match
    const qLower = trimmed.toLowerCase()
    const matches = normalizedEntries
      .filter((e) => {
        if (e.emoji.includes(trimmed) || (e.normKey && e.normKey.includes(normQuery))) return true
        if (e.meaning && e.normMeaning.includes(qLower)) return true
        return false
      })
      .map((e) => ({ emoji: e.emoji, meaning: e.meaning }))

    // 4) fallback: check each grapheme in query against known normalized keys
    if (matches.length === 0) {
      const chars = Array.from(trimmed).map((ch) => normalizeEmoji(ch)).filter(Boolean)
      if (chars.length) {
        const fallback = normalizedEntries.filter((e) => chars.some((c) => e.normKey.includes(c)))
        if (fallback.length) return fallback.map((e) => ({ emoji: e.emoji, meaning: e.meaning }))
      }
    }

    return matches
  }

  const handleSearch = () => {
    setMessage(null)
    const found = searchEmoji(query)
    if (found.length === 0) {
      setResults([])
      setMessage('No matches found locally. Try another emoji or keyword.')
      return
    }

    if (found.length === 1) {
      const { emoji, meaning } = found[0]
      setResults(found)
      onSelect(emoji, meaning)
      setMessage(null)
      return
    }

    setResults(found)
    setMessage(`Found ${found.length} matches — tap one below.`)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handlePick = (emoji, meaning) => {
    setQuery(emoji)
    setResults([{ emoji, meaning }])
    setMessage(null)
    onSelect(emoji, meaning)
  }

  return (
    <div className="space-y-2">
      <TextField
        label="Type an emoji or a word (eg.🔥/fire)"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKey}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />}>
                Find
              </Button>
            </InputAdornment>
          ),
        }}
        fullWidth
      />

      {message ? <div className="text-sm text-gray-600">{message}</div> : null}

      {results.length > 1 && (
        <List dense>
          {results.slice(0, 8).map((r, idx) => (
            <ListItem key={r.emoji + idx} disablePadding>
              <ListItemButton onClick={() => handlePick(r.emoji, r.meaning)}>
                <ListItemText
                  primary={<span style={{ fontSize: 20 }}>{r.emoji} &nbsp; {r.meaning}</span>}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {results.length === 1 && (
        <div className="text-sm text-gray-700">
          Matched: <strong style={{ fontSize: 18 }}>{results[0].emoji}</strong> — {results[0].meaning}
        </div>
      )}

      <div className="text-xs text-gray-500">
        Tip: you can paste an emoji, type a keyword like <em>fire</em> or <em>love</em>, or click one from the picker.
      </div>
    </div>
  )
}

export default EmojiSearch
