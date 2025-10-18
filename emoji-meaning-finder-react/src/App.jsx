import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import EmojiSearch from './components/EmojiSearch'
import EmojiPicker from './components/EmojiPicker'
import EmojiCard from './components/EmojiCard'
import emojiDict from './data/emojiDict' // adjust path if your emojiDict is elsewhere

export default function App() {
  const [selected, setSelected] = useState(null)

  const handleSelect = (emoji, meaning) => {
    setSelected({ emoji, meaning })
  }

  return (
    <Container className="app-shell px-4" maxWidth="md" sx={{ py: 4 }}>
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-semibold mb-2">
          Emoji Meaning Finder
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Type an emoji or pick from the grid.
        </Typography>
      </Box>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            {/* pass emojiDict down so EmojiSearch can match against it */}
            <EmojiSearch emojiDict={emojiDict} onSelect={handleSelect} />
            <div className="mt-4">
              <EmojiPicker emojiDict={emojiDict} onSelect={handleSelect} />
            </div>
          </CardContent>
        </Card>

        <div>
          <Typography variant="h6" className="mb-3">Result</Typography>
          {selected ? (
            <EmojiCard emoji={selected.emoji} meaning={selected.meaning} />
          ) : (
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Select or search an emoji to see its meaning.
                </Typography>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {Object.keys(emojiDict).slice(0, 4).map((e) => (
                    <div key={e} className="p-2 border rounded text-center">{e}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Container>
  )
}
