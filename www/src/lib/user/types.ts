import type { BaseResponseBody, EntityId } from '$lib/common/types';

export interface User {
	id: EntityId;
	first_name: string;
	last_name: string;
	email: string;
	profile_image_url: string;
	created_at: string;
	update_at: string;
}

export type GetUserResponseBody = BaseResponseBody<{
	user: User;
}>;
