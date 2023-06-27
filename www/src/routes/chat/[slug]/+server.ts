import { json } from '@sveltejs/kit';
import type { ChatMessage, ChatRoom } from '../../../types';
import { addMessageToChatRoom, getChatRoomMessageList, getOneChatRoom } from '$lib/chat';

export interface GetChatRoomResponseBody {
	data: {
		chatRoom: ChatRoom | null;
		messages: ChatMessage[];
	};
}

export async function GET({ params }): Promise<Response> {
	const chatRoom = await getOneChatRoom(params.slug);
	const messages = await getChatRoomMessageList(params.slug);

	return json({ data: { chatRoom, messages } });
}

export interface PostChatRoomMessageResponseBody {
	data: { message: ChatMessage };
	error?: string;
}

export async function POST({ request, params }): Promise<Response> {
	const data: { message: string } = await request.json();
	const message = await addMessageToChatRoom(params.slug, {
		author_id: '1',
		message: data.message
	});

	return json({ data: { message } });
}
