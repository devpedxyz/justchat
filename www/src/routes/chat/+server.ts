import { getConversationList } from '$lib/chat';
import { json } from '@sveltejs/kit';
import type { Conversation } from '../../types';

export interface ConversationListResponseBody {
	conversations: Conversation[];
}

export async function GET(): Promise<Response> {
	const conversations = await getConversationList();

	return json({ conversations });
}
