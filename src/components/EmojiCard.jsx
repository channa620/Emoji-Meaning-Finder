import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function EmojiCard({ emoji, meaning }) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <div style={{ fontSize: 48 }}>{emoji}</div>
          <div>
            <Typography variant="h6">{meaning}</Typography>
            <Typography variant="body2" color="textSecondary">Emoji: {emoji}</Typography>
          </div>
        </Box>
      </CardContent>
    </Card>
  )
}
