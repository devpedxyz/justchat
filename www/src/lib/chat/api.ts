import type {
	AddMessageToConversationResponseBody,
	CreateMessageDto,
	GetConversationListResponseBody,
	GetOneConversationResponseBody
} from './types';
import {
	getOneConversation as repoGetOneConversation,
	getConversationList as repoGetConversationList,
	addMessageToConversation as repoAddMessageToConversation,
	getConversationMessageList
} from './repository';

export async function getConversationList(): Promise<GetConversationListResponseBody> {
	const conversationList = await repoGetConversationList();

	return { data: { conversationList } };
}

export async function getOneConversation(
	conversationId: string
): Promise<GetOneConversationResponseBody> {
	const conversation = await repoGetOneConversation(conversationId);

	if (!conversation) {
		return { error: { message: 'Conversation not found' }, data: null };
	}

	const messages = await getConversationMessageList(conversationId);

	return { data: { conversation, messages } };
}

export async function addMessageToConversation(
	conversationId: string,
	message: CreateMessageDto
): Promise<AddMessageToConversationResponseBody> {
	try {
		const createdMessage = await repoAddMessageToConversation(conversationId, message);

		return { data: { createdMessage } };
	} catch (e) {
		if (e instanceof Error) {
			return { error: { message: e.message }, data: null };
		}

		return { error: { message: 'Unknown error' }, data: null };
	}
}
