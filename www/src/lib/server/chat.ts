import type { ChatMessage, ChatRoom } from '../../types';

const chatRoomList: ChatRoom[] = Array(5)
	.fill(null)
	.map(() => ({
		id: Math.random().toString(36).substring(7),
		name: Math.random().toString(36).substring(7),
		participants: [],
		created_at: new Date().toISOString()
	}));
const chatRoomMessageListMap: Map<string, ChatMessage[]> = new Map();

export function getChatRoomList() {
	return chatRoomList;
}

export function getOneChatRoom(id: string) {
	return chatRoomList.find((room) => room.id === id) || null;
}

export function getChatRoomMessageList(chatRoomId: string) {
	return chatRoomMessageListMap.get(chatRoomId) || [];
}

export function addMessageToChatRoom(
	chatRoomId: string,
	message: Pick<ChatMessage, 'author_id' | 'message'>
) {
	const chatRoomMessageList = getChatRoomMessageList(chatRoomId);

	chatRoomMessageList.push({
		...message,
		created_at: new Date().toISOString(),
		id: Math.random().toString(36).substring(7)
	});
	chatRoomMessageListMap.set(chatRoomId, chatRoomMessageList);
}
