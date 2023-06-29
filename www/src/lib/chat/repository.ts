import { getCurrentUser, getRandomUser } from '$lib/user/repository';
import type { ChatMessage, Conversation, ConversationParticipant } from './types';

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

	const messageList = messageListByConversationId.get(conversationId) || [];

	return messageList;
}

export async function addMessageToConversation(
	conversationId: string,
	message: Pick<ChatMessage, 'author_id' | 'message'>
): Promise<ChatMessage> {
	const conversation = getOneConversation(conversationId);

	if (!conversation) {
		throw new Error('Conversation not found');
	}

	const conversationMessageList = await getConversationMessageList(conversationId);
	const newMessage: ChatMessage = {
		...message,
		created_at: new Date().toISOString(),
		id: Math.random().toString(36).substring(7),
		converation_id: conversationId
	};

	conversationMessageList.push(newMessage);
	messageListByConversationId.set(conversationId, conversationMessageList);

	return newMessage;
}

function generateTwoOrMoreParticipants(): Omit<ConversationParticipant, 'conversation_id'>[] {
	const participants: Omit<ConversationParticipant, 'conversation_id'>[] = [];

	for (let i = 0; i < Math.floor(Math.random() * 8) + 1; i++) {
		const user = getRandomUser();

		participants.push({
			user_id: user.id,
			user,
			joined_at: new Date().toISOString()
		});
	}

	const currentUser = getCurrentUser();

	return [
		{
			user_id: currentUser.id,
			user: currentUser,
			joined_at: new Date().toISOString()
		},
		...participants
	];
}

function generateConversationList(qty = 50) {
	return Array(qty)
		.fill(null)
		.map(() => {
			const id = Math.random().toString(36).substring(7);

			return {
				id,
				name: `Convo #${id}`,
				participants: generateTwoOrMoreParticipants().map((participant) => ({
					...participant,
					conversation_id: id
				})),
				latest_message: null,
				created_at: new Date().toISOString()
			};
		});
}

// Generate message list from the given conversation
// using the participants of the conversation
// as the author of the message
function generateMessageListFromConversation(conversation: Conversation): ChatMessage[] {
	const messageList: ChatMessage[] = [];

	for (let i = 0; i < Math.floor(Math.random() * 100) + 1; i++) {
		const author =
			conversation.participants[Math.floor(Math.random() * conversation.participants.length)];

		messageList.push({
			converation_id: conversation.id,
			id: Math.random().toString(36).substring(7),
			message: `Message #${i + 1}`,
			author_id: author.user_id,
			created_at: new Date().toISOString()
		});
	}

	return messageList;
}

function generateMessageListByConversationIdFromConversationList(
	conversationList: Conversation[]
): MessageListByConversationId {
	const messageListByConversationId: MessageListByConversationId = new Map();

	conversationList.forEach((conversation) => {
		messageListByConversationId.set(
			conversation.id,
			generateMessageListFromConversation(conversation)
		);
	});

	return messageListByConversationId;
}

type MessageListByConversationId = Map<string, ChatMessage[]>;

const conversationList: Conversation[] = generateConversationList();
const messageListByConversationId: MessageListByConversationId =
	generateMessageListByConversationIdFromConversationList(conversationList);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const sleepRandom = () => sleep(Math.random() * 1000);
