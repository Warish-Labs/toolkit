export interface EmojiItem {
  char: string;
  name: string;
  keywords: string[];
}

export interface EmojiGroup {
  category: string;
  emojis: EmojiItem[];
}

const EMOJI_DATA: EmojiGroup[] = [
  {
    category: 'Smileys & Emotion',
    emojis: [
      { char: '😀', name: 'Grinning Face', keywords: ['happy', 'joy', 'smile'] },
      { char: '😃', name: 'Grinning Face with Big Eyes', keywords: ['happy', 'joy', 'smile'] },
      { char: '😄', name: 'Grinning Face with Smiling Eyes', keywords: ['happy', 'joy', 'smile'] },
      { char: '😁', name: 'Beaming Face with Smiling Eyes', keywords: ['happy', 'joy', 'smile'] },
      { char: '😆', name: 'Grinning Squinting Face', keywords: ['happy', 'joy', 'smile'] },
      { char: '😅', name: 'Grinning Face with Sweat', keywords: ['happy', 'relief', 'nervous'] },
      { char: '🤣', name: 'Rolling on the Floor Laughing', keywords: ['lol', 'laugh', 'funny'] },
      { char: '😂', name: 'Face with Tears of Joy', keywords: ['lol', 'laugh', 'funny'] },
      { char: '🙂', name: 'Slightly Smiling Face', keywords: ['happy', 'smile'] },
      { char: '🙃', name: 'Upside-Down Face', keywords: ['sarcastic', 'silly'] },
      { char: '😉', name: 'Winking Face', keywords: ['wink', 'flirt'] },
      { char: '😊', name: 'Smiling Face with Smiling Eyes', keywords: ['happy', 'blush', 'smile'] },
      { char: '😇', name: 'Smiling Face with Halo', keywords: ['angel', 'innocent'] },
      { char: '🥰', name: 'Smiling Face with Hearts', keywords: ['love', 'affection', 'cute'] },
      { char: '😍', name: 'Smiling Face with Heart-Eyes', keywords: ['love', 'adore', 'heart'] },
      { char: '🤩', name: 'Star-Struck', keywords: ['excited', 'celebrity'] },
      { char: '😘', name: 'Face Blowing a Kiss', keywords: ['kiss', 'flirt', 'love'] },
      { char: '😗', name: 'Kissing Face', keywords: ['kiss', 'love'] }
    ]
  },
  {
    category: 'Animals & Nature',
    emojis: [
      { char: '🐶', name: 'Dog Face', keywords: ['dog', 'puppy', 'pet'] },
      { char: '🐱', name: 'Cat Face', keywords: ['cat', 'kitten', 'pet'] },
      { char: '🐭', name: 'Mouse Face', keywords: ['mouse', 'rodent'] },
      { char: '🐹', name: 'Hamster Face', keywords: ['hamster', 'pet'] },
      { char: '🐰', name: 'Rabbit Face', keywords: ['bunny', 'rabbit'] },
      { char: '🦊', name: 'Fox', keywords: ['fox', 'clever'] },
      { char: '🐻', name: 'Bear', keywords: ['bear', 'wild'] },
      { char: '🐼', name: 'Panda', keywords: ['panda', 'bear'] },
      { char: '🦁', name: 'Lion', keywords: ['lion', 'wild'] },
      { char: '🐯', name: 'Tiger Face', keywords: ['tiger', 'wild'] },
      { char: '🐨', name: 'Koala', keywords: ['koala', 'marsupial'] },
      { char: '🐸', name: 'Frog', keywords: ['frog', 'amphibian'] }
    ]
  },
  {
    category: 'Food & Drink',
    emojis: [
      { char: '🍎', name: 'Red Apple', keywords: ['apple', 'fruit', 'healthy'] },
      { char: '🍌', name: 'Banana', keywords: ['banana', 'fruit'] },
      { char: '🍉', name: 'Watermelon', keywords: ['watermelon', 'fruit', 'summer'] },
      { char: '🍇', name: 'Grapes', keywords: ['grapes', 'fruit'] },
      { char: '🍓', name: 'Strawberry', keywords: ['strawberry', 'fruit', 'sweet'] },
      { char: '🍒', name: 'Cherries', keywords: ['cherries', 'fruit'] },
      { char: '🍕', name: 'Pizza', keywords: ['pizza', 'fast food', 'cheese'] },
      { char: '🍔', name: 'Burger', keywords: ['burger', 'hamburger', 'fast food'] },
      { char: '🍟', name: 'French Fries', keywords: ['fries', 'fast food'] },
      { char: '🌮', name: 'Taco', keywords: ['taco', 'mexican'] },
      { char: '🍣', name: 'Sushi', keywords: ['sushi', 'japanese'] },
      { char: '🍩', name: 'Donut', keywords: ['donut', 'dessert', 'sweet'] }
    ]
  },
  {
    category: 'Objects & Symbols',
    emojis: [
      { char: '💻', name: 'Laptop', keywords: ['computer', 'tech', 'work'] },
      { char: '📱', name: 'Mobile Phone', keywords: ['phone', 'tech', 'screen'] },
      { char: '📷', name: 'Camera', keywords: ['camera', 'photo', 'picture'] },
      { char: '💡', name: 'Light Bulb', keywords: ['idea', 'bulb', 'light'] },
      { char: '🔑', name: 'Key', keywords: ['key', 'lock', 'secure'] },
      { char: '🔒', name: 'Locked', keywords: ['secure', 'lock'] },
      { char: '❤️', name: 'Red Heart', keywords: ['love', 'heart'] },
      { char: '🔥', name: 'Fire', keywords: ['fire', 'hot', 'lit'] },
      { char: '✨', name: 'Sparkles', keywords: ['sparkle', 'clean', 'magic'] },
      { char: '🚀', name: 'Rocket', keywords: ['space', 'launch', 'fast'] }
    ]
  }
];

export function getEmojiGroups(): EmojiGroup[] {
  return EMOJI_DATA;
}

export function searchEmojis(query: string): EmojiItem[] {
  const q = query.toLowerCase().trim();
  if (!q) {
    // Return flat list of all emojis
    return EMOJI_DATA.flatMap(g => g.emojis);
  }

  const results: EmojiItem[] = [];
  for (const group of EMOJI_DATA) {
    for (const emoji of group.emojis) {
      if (
        emoji.name.toLowerCase().includes(q) ||
        emoji.keywords.some(kw => kw.toLowerCase().includes(q))
      ) {
        results.push(emoji);
      }
    }
  }

  return results;
}
