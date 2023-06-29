import { addMessageToConversation, getOneConversation } from '$lib/chat/api';
import { getCurrentUser } from '$lib/user/repository.js';
import { json } from '@sveltejs/kit';

export async function GET({ params }): Promise<Response> {
	const payload = await getOneConversation(params.slug);

	return json(payload);
}

export async function POST({ request, params }): Promise<Response> {
	const data: { message: string } = await request.json();
	const payload = await addMessageToConversation(params.slug, {
		author_id: getCurrentUser().id,
		message: data.message
	});

	return json(payload);
}
