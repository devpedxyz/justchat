import type { ChatMessage, Conversation } from '../../types';

const conversationList: Conversation[] = Array(5)
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
const conversationMessageListStore: Record<string, ChatMessage[]> = {};
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const sleepRandom = () => sleep(Math.random() * 1000);

export async function getConversationList() {
	await sleepRandom();

	return conversationList;
}

export async function getOneConversation(id: string) {
	await sleepRandom();

	const conversation = conversationList.find((room) => room.id === id) || null;

	return conversation;
}

export async function getConversationMessageList(conversationId: string) {
	await sleepRandom();

	const messageList = conversationMessageListStore[conversationId] || [];

	return messageList;
}

export async function addMessageToConversation(
	conversationId: string,
	message: Pick<ChatMessage, 'author_id' | 'message'>
): Promise<ChatMessage> {
	const conversationMessageList = await getConversationMessageList(conversationId);
	const newMessage = {
		...message,
		created_at: new Date().toISOString(),
		id: Math.random().toString(36).substring(7)
	};

	conversationMessageList.push(newMessage);
	conversationMessageListStore[conversationId] = conversationMessageList;

	return newMessage;
}
