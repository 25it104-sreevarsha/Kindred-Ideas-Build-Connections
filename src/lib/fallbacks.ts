import { joinNaturally } from '@/lib/interests';
import type { ReplyOption, Tone } from '@/types';

interface IcebreakerContext {
  firstName: string;
  sharedInterests: string[];
  tone: Tone;
}

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const SHARED_TEMPLATES: Record<Tone, ((firstName: string, topics: string) => string)[]> = {
  casual: [
    (name, topics) => `Hey ${name}! We're both into ${topics}, so I had to say hi. What got you hooked on it?`,
    (name, topics) => `Hi ${name}! Turns out we share a love for ${topics}. Any recommendations you'd throw my way?`,
  ],
  professional: [
    (name, topics) => `Hello ${name}, I noticed we share an interest in ${topics}. I would welcome the chance to exchange ideas if you are open to it.`,
    (name, topics) => `Hi ${name}, it is great to meet another member who enjoys ${topics}. Would you be open to comparing notes sometime?`,
  ],
  shy: [
    (name, topics) => `Hi ${name}, no pressure at all, but I noticed we both enjoy ${topics}. If you ever feel like chatting about it, I would be glad to.`,
    (name, topics) => `Hey ${name}... I hope this is not too forward, but we both love ${topics}. Would you like to swap a few thoughts sometime?`,
  ],
};

const NO_OVERLAP_TEMPLATES: Record<Tone, ((firstName: string) => string)[]> = {
  casual: [
    (name) => `Hi ${name}! Our interests look pretty different, which makes this more interesting. What has been keeping you busy lately?`,
    (name) => `Hey ${name}! I'd love to hear what you're into these days. What's something you've been enjoying lately?`,
  ],
  professional: [
    (name) => `Hello ${name}, our interests may differ, and I would value that perspective. Would you be open to sharing what you are currently working on?`,
    (name) => `Hi ${name}, I would appreciate learning more about your interests. Is there something you have been focused on recently?`,
  ],
  shy: [
    (name) => `Hi ${name}, I know we don't have much in common on paper, but I would really like to hear your story if you feel like sharing.`,
    (name) => `Hey ${name}, no pressure, but I'd be curious to know what you enjoy most these days. Only if you feel like it!`,
  ],
};

export function fallbackIcebreaker({ firstName, sharedInterests, tone }: IcebreakerContext): string {
  if (sharedInterests.length === 0) {
    return pick(NO_OVERLAP_TEMPLATES[tone])(firstName);
  }
  return pick(SHARED_TEMPLATES[tone])(firstName, joinNaturally(sharedInterests));
}

const WARM_WRAPPERS: Record<Tone, { opener: string; closer: string }> = {
  casual: { opener: 'Hey there! ', closer: ' No pressure at all, and thanks for reading!' },
  professional: { opener: 'Hello, I hope you are doing well. ', closer: ' Thank you for considering this.' },
  shy: { opener: 'Hi, I hope it is okay to reach out. ', closer: ' No rush at all, and thank you for reading!' },
};

export function fallbackWarmer(text: string, tone: Tone): string {
  const body = text.trim().replace(/\s+/g, ' ');
  const ending = /[.!?]$/.test(body) ? '' : '.';
  const { opener, closer } = WARM_WRAPPERS[tone];
  return `${opener}${body}${ending}${closer}`;
}

export const REPLY_LABELS = ['Ask a question', 'Share something about you', 'Light humor'] as const;

const REPLY_TEMPLATES: Record<Tone, string[]> = {
  casual: [
    "That's interesting! What first made you pick that up?",
    "Ha, I can relate. I have been on a similar kick lately, so I'm glad you mentioned it.",
    'Okay, you have officially made me curious. Should I be worried or impressed?',
  ],
  professional: [
    'Thank you for sharing that. Could you tell me more about what led you to it?',
    'That resonates with me. In my own experience it has been a rewarding path.',
    'That is a great answer, and I may need to work harder to match it next time.',
  ],
  shy: [
    'Thanks for telling me that. If you feel like it, what do you enjoy most about it?',
    "That's nice to hear. I'm a little shy about these things, but I really like that too.",
    'That made me smile. No pressure to reply fast, though!',
  ],
};

export function fallbackReplies(tone: Tone): ReplyOption[] {
  return REPLY_LABELS.map((label, index) => ({ label, message: REPLY_TEMPLATES[tone][index] }));
}

const TOPIC_TEMPLATES = [
  (interest: string) => `What first got you into ${interest}?`,
  (interest: string) => `What is a hidden gem in ${interest} you would recommend?`,
  (interest: string) => `If you could spend a weekend on ${interest}, what would you do?`,
];

export function fallbackTopics(interests: string[]): string[] {
  if (interests.length === 0) return [];
  return TOPIC_TEMPLATES.map((makeTopic, index) => makeTopic(interests[index % interests.length]));
}
