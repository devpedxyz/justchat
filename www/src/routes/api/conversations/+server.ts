import { getConversationList } from '$lib/chat/api';
import { json } from '@sveltejs/kit';

export async function GET(): Promise<Response> {
	const payload = await getConversationList();

	return json(payload);
}
