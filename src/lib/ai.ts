import { fallbackIcebreaker, fallbackReplies, fallbackTopics, fallbackWarmer, REPLY_LABELS } from '@/lib/fallbacks';
import type { Member, ReplyOption, Tone } from '@/types';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const REQUEST_TIMEOUT_MS = 15000;
const apiKey = (import.meta.env.VITE_GROQ_API_KEY as string | undefined)?.trim();

const TONE_GUIDANCE: Record<Tone, string> = {
  casual: 'Relaxed, friendly, and conversational, like messaging a new classmate. A light touch of humor is welcome.',
  professional: 'Polite, clear, and respectful, suitable for a formal community. No slang.',
  shy: 'Gentle, low-pressure, and easy to reply to. Make it clear there is no expectation to respond quickly.',
};

const ICEBREAKER_SYSTEM = (tone: Tone) => `You help members of a community start friendly conversations.
Write ONE short first message (2 to 3 sentences) from the sender to the recipient.
Naturally mention the shared interests if any are given, and end with an easy, open question.
Tone: ${TONE_GUIDANCE[tone]}
Output only the message text. No greeting line, no quotes, no sign-off, no emojis.`;

const WARMER_SYSTEM = (tone: Tone) => `You rewrite messages that a person is nervous to send so they feel warm, friendly, and natural.
Keep the original meaning and any specific request. Keep it roughly the same length.
Tone: ${TONE_GUIDANCE[tone]}
Output only the rewritten message. No quotes, no explanation, no emojis.`;

async function askGroq(system: string, user: string): Promise<string | null> {
  if (!apiKey) return null;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.8,
        max_tokens: 200,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
      signal: controller.signal,
    });
    if (!response.ok) return null;

    const data = await response.json();
    const content: unknown = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') return null;

    const cleaned = content.trim().replace(/^["']|["']$/g, '').trim();
    return cleaned || null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

interface IcebreakerRequest {
  member: Member;
  sharedInterests: string[];
  tone: Tone;
  senderName: string;
}

export async function generateIcebreaker({ member, sharedInterests, tone, senderName }: IcebreakerRequest): Promise<string> {
  const firstName = member.name.split(' ')[0];
  const sharedLine =
    sharedInterests.length > 0
      ? `Shared interests with the sender: ${sharedInterests.join(', ')}.`
      : 'They share no interests with the sender, so open with a curious, respectful question about the recipient.';
  const userPrompt = `Recipient: ${member.name} (${member.role}). Their interests: ${member.interests.join(', ')}.\n${sharedLine}`;

  const aiText = await askGroq(ICEBREAKER_SYSTEM(tone), userPrompt);
  const body = aiText ?? fallbackIcebreaker({ firstName, sharedInterests, tone });

  const name = senderName.trim();
  return name ? `${body}\n\n${name}` : body;
}

export async function rewriteWarmer(text: string, tone: Tone): Promise<string> {
  const aiText = await askGroq(WARMER_SYSTEM(tone), text);
  return aiText ?? fallbackWarmer(text, tone);
}

const REPLY_SYSTEM = (tone: Tone) => `You help someone keep a friendly conversation going in a community app.
Write exactly 3 possible next messages from the user, each responding directly to their conversation partner.
Use these labels in order: ${REPLY_LABELS.map((label) => `"${label}"`).join(', ')}.
Each message is 1 to 2 sentences.
Tone: ${TONE_GUIDANCE[tone]}
Respond with only JSON in this shape: {"replies":[{"label":"...","message":"..."},{"label":"...","message":"..."},{"label":"...","message":"..."}]}
No emojis.`;

const TOPICS_SYSTEM = `You suggest friendly conversation topics for community members who want to talk.
Give exactly 3 short, specific prompts or questions based on the interests provided.
Respond with only JSON in this shape: {"topics":["...","...","..."]}
No emojis.`;

function parseJsonObject(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function isReplyOption(value: unknown): value is ReplyOption {
  if (typeof value !== 'object' || value === null) return false;
  const option = value as Record<string, unknown>;
  return (
    typeof option.label === 'string' &&
    option.label.trim() !== '' &&
    typeof option.message === 'string' &&
    option.message.trim() !== ''
  );
}

function parseReplies(text: string): ReplyOption[] | null {
  const replies = (parseJsonObject(text) as { replies?: unknown } | null)?.replies;
  if (!Array.isArray(replies)) return null;
  const valid = replies.filter(isReplyOption);
  if (valid.length < 3) return null;
  return valid
    .slice(0, 3)
    .map((option) => ({ label: option.label.trim(), message: option.message.trim() }));
}

function parseTopics(text: string): string[] | null {
  const topics = (parseJsonObject(text) as { topics?: unknown } | null)?.topics;
  if (!Array.isArray(topics)) return null;
  const valid = topics
    .filter((topic): topic is string => typeof topic === 'string' && topic.trim() !== '')
    .map((topic) => topic.trim());
  return valid.length >= 3 ? valid.slice(0, 3) : null;
}

interface RepliesRequest {
  sentMessage: string;
  theirReply: string;
  tone: Tone;
}

export async function generateReplies({ sentMessage, theirReply, tone }: RepliesRequest): Promise<ReplyOption[]> {
  const sentLine = sentMessage ? `What I sent: "${sentMessage}"\n` : '';
  const userPrompt = `${sentLine}Their reply: "${theirReply}"`;

  const aiText = await askGroq(REPLY_SYSTEM(tone), userPrompt);
  const parsed = aiText ? parseReplies(aiText) : null;
  return parsed ?? fallbackReplies(tone);
}

interface TopicsRequest {
  interests: string[];
  memberName: string | null;
}

export async function generateTopics({ interests, memberName }: TopicsRequest): Promise<string[]> {
  const audience = memberName
    ? `The user is about to talk with ${memberName}.`
    : 'The user is about to start a conversation with a community member.';
  const userPrompt = `${audience} Base the topics on these interests: ${interests.join(', ')}.`;

  const aiText = await askGroq(TOPICS_SYSTEM, userPrompt);
  const parsed = aiText ? parseTopics(aiText) : null;
  return parsed ?? fallbackTopics(interests);
}
