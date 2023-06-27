import { getChatRoomList } from '$lib/chat';
import { json } from '@sveltejs/kit';
import type { ChatRoom } from '../../types';

export interface ChatRoomListResponseBody {
	chatRooms: ChatRoom[];
}

export async function GET(): Promise<Response> {
	const chatRooms = await getChatRoomList();

	return json({ chatRooms });
}
