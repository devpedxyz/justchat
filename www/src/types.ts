export interface ChatMessage {
	id: string;
	message: string;
	author_id: string;
	created_at: string;
}
export interface ChatMessageWithDate extends ChatMessage {
	date: Date | null;
}
export interface Conversation {
	id: string;
	name: string;
	participants: string[];
	created_at: string;
}
