import type { BaseResponseBody, EntityId } from '$lib/common/types';
import type { User } from '$lib/user/types';

export interface ChatMessage {
	id: EntityId;
	converation_id: EntityId;
	message: string;
	// User ID
	author_id: EntityId;
	created_at: string;
}
export interface ChatMessageWithDate extends ChatMessage {
	date: Date | null;
}
export interface Conversation {
	id: EntityId;
	name: string;
	participants: ConversationParticipant[];
	latest_message: ChatMessage | null;
	created_at: string;
}

export interface ConversationParticipant {
	conversation_id: EntityId;
	user_id: EntityId;
	user: User;
	joined_at: string;
}

export type GetConversationListResponseBody = BaseResponseBody<{
	conversationList: Conversation[];
}>;

export type GetOneConversationResponseBody = BaseResponseBody<{
	conversation: Conversation | null;
	messages: ChatMessage[];
}>;

export type CreateMessageDto = Pick<ChatMessage, 'author_id' | 'message'>;

export type AddMessageToConversationResponseBody = BaseResponseBody<{
	createdMessage: ChatMessage;
}>;
