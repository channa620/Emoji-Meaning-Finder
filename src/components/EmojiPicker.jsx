import React from 'react'
import { Grid, Button } from '@mui/material'

export default function EmojiPicker({ emojiDict = {}, onSelect }) {
  const emojis = Object.keys(emojiDict)

  return (
    <div>
      <div className="mb-2 text-sm text-gray-700">Pick an emoji from the grid:</div>
      <div className="emoji-grid max-h-80 overflow-auto p-1 w-[700px]">
        <Grid container spacing={7}>
          {emojis.map((e) => (
            <Grid item xs={2} sm={1} key={e}>
              <Button
                onClick={() => onSelect(e, emojiDict[e])}
                className="emoji-btn w-full h-12 text-xl"
                variant="outlined"
              >
                {e}
              </Button>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  )
}
