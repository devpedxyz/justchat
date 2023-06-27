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
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const sleepRandom = () => sleep(Math.random() * 1000);

export async function getChatRoomList() {
	await sleepRandom();

	return chatRoomList;
}

export async function getOneChatRoom(id: string) {
	await sleepRandom();

	return chatRoomList.find((room) => room.id === id) || null;
}

export async function getChatRoomMessageList(chatRoomId: string) {
	await sleepRandom();

	return chatRoomMessageListMap.get(chatRoomId) || [];
}

export async function addMessageToChatRoom(
	chatRoomId: string,
	message: Pick<ChatMessage, 'author_id' | 'message'>
) {
	const chatRoomMessageList = await getChatRoomMessageList(chatRoomId);

	chatRoomMessageList.push({
		...message,
		created_at: new Date().toISOString(),
		id: Math.random().toString(36).substring(7)
	});
	chatRoomMessageListMap.set(chatRoomId, chatRoomMessageList);
}
