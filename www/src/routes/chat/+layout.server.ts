import { getChatRoomList } from '../../lib/server/chat';
import type { ChatRoom } from '../../types';

export interface ChatRoomListResponse {
	chatRooms: ChatRoom[];
}

export async function load(): Promise<ChatRoomListResponse> {
	return {
		chatRooms: await getChatRoomList()
	};
}
