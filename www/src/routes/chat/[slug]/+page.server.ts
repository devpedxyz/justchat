import { error } from '@sveltejs/kit';
import {
	addMessageToChatRoom,
	getChatRoomMessageList,
	getOneChatRoom
} from '../../../lib/server/chat';
import type { ChatMessage, ChatRoom } from '../../../types';

export interface ChatRoomResponse {
	chatRoom: ChatRoom | null;
	messages: ChatMessage[];
}
export function load({ params }): ChatRoomResponse {
	const chatRoom = getOneChatRoom(params.slug);

	if (!chatRoom) throw error(404, 'Chat room not found');

	const messages = getChatRoomMessageList(params.slug);

	return {
		chatRoom,
		messages
	};
}

export const actions = {
	sendMessage: async ({ request }) => {
		const data = await request.formData();
		const chatRoomId = data.get('chatRoomId');
		const message = data.get('message');

		if (!chatRoomId) throw error(400, 'Chat room id is required');
		if (!message) throw error(400, 'Message is required');

		addMessageToChatRoom(chatRoomId.toString(), {
			author_id: '1',
			message: message.toString()
		});
	}
};
