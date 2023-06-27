import { getChatRoomList } from '../../lib/server/chat';
import type { ChatRoom } from '../../types';

export interface ChatRoomListResponse {
	chatRooms: ChatRoom[];
}

export function load(): ChatRoomListResponse {
	return {
		chatRooms: getChatRoomList()
	};
}
