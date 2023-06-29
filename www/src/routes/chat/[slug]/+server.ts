import { json } from '@sveltejs/kit';
import type { ChatMessage, Conversation } from '../../../types';
import {
	addMessageToConversation,
	getConversationMessageList,
	getOneConversation
} from '$lib/chat';

export interface GetConversationResponseBody {
	data: {
		conversation: Conversation | null;
		messages: ChatMessage[];
	};
}

export async function GET({ params }): Promise<Response> {
	const conversation = await getOneConversation(params.slug);
	const messages = await getConversationMessageList(params.slug);

	return json({ data: { conversation, messages } });
}

export interface PostConversationMessageResponseBody {
	data: { message: ChatMessage };
	error?: string;
}

export async function POST({ request, params }): Promise<Response> {
	const data: { message: string } = await request.json();
	const message = await addMessageToConversation(params.slug, {
		author_id: '2',
		message: data.message
	});

	return json({ data: { message } });
}
