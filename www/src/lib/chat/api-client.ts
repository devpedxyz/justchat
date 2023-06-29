import type {
	AddMessageToConversationResponseBody,
	CreateMessageDto,
	GetConversationListResponseBody,
	GetOneConversationResponseBody
} from './types';

export async function getConversationList(): Promise<GetConversationListResponseBody> {
	return fetch('/api/conversations').then((res) => res.json());
}

export async function getOneConversation(
	conversationId: string
): Promise<GetOneConversationResponseBody> {
	return fetch(`/api/conversations/${conversationId}`).then((res) => res.json());
}

export async function addMessageToConversation(
	conversationId: string,
	message: CreateMessageDto
): Promise<AddMessageToConversationResponseBody> {
	return fetch(`/api/conversations/${conversationId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(message)
	}).then((res) => res.json());
}
