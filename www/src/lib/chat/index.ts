import type { ChatMessage, ChatRoom } from '../../types';

const chatRoomList: ChatRoom[] = Array(5)
	.fill(null)
	.map(() => {
		const id = Math.random().toString(36).substring(7);

		return {
			id,
			name: `Room #${id}`,
			participants: [],
			created_at: new Date().toISOString()
		};
	});
const chatRoomMessageListStore: Record<string, ChatMessage[]> = {};
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const sleepRandom = () => sleep(Math.random() * 1000);

export async function getChatRoomList() {
	await sleepRandom();

	return chatRoomList;
}

export async function getOneChatRoom(id: string) {
	await sleepRandom();

	const chatRoom = chatRoomList.find((room) => room.id === id) || null;

	return chatRoom;
}

export async function getChatRoomMessageList(chatRoomId: string) {
	await sleepRandom();

	const messageList = chatRoomMessageListStore[chatRoomId] || [];

	return messageList;
}

export async function addMessageToChatRoom(
	chatRoomId: string,
	message: Pick<ChatMessage, 'author_id' | 'message'>
): Promise<ChatMessage> {
	const chatRoomMessageList = await getChatRoomMessageList(chatRoomId);
	const newMessage = {
		...message,
		created_at: new Date().toISOString(),
		id: Math.random().toString(36).substring(7)
	};

	chatRoomMessageList.push(newMessage);
	chatRoomMessageListStore[chatRoomId] = chatRoomMessageList;

	return newMessage;
}
