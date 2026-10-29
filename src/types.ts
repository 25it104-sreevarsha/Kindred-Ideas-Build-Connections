export type Tone = 'casual' | 'professional' | 'shy';

export type Tab = 'icebreaker' | 'keepItGoing' | 'sayItBetter';

export interface Member {
  id: string;
  name: string;
  role: string;
  interests: string[];
  tint: string;
}

export interface NewMemberInput {
  name: string;
  interests: string[];
}

export interface ReplyOption {
  label: string;
  message: string;
}

export type HistoryKind = 'icebreaker' | 'rewrite';

export interface HistoryEntry {
  id: string;
  kind: HistoryKind;
  text: string;
  createdAt: number;
}
