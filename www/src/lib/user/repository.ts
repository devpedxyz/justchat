import type { User } from './types';

function generateUserList(quantity = 100): User[] {
	return Array(quantity)
		.fill(null)
		.map(() => {
			const id = Math.random().toString(36).substring(7);

			return {
				id,
				first_name: `User #${id}`,
				last_name: `Last Name #${id}`,
				email: `${id}@devped.xyz`,
				profile_image_url: `https://picsum.photos/seed/${id}/200/200`,
				created_at: new Date().toISOString(),
				update_at: new Date().toISOString()
			};
		});
}

export function getRandomUser(): User {
	const index = Math.floor(Math.random() * userList.length);

	return userList[index];
}

export function getCurrentUser(): User {
	if (!currentUser) {
		currentUser = getRandomUser();
	}

	return currentUser;
}

let currentUser: User | null = null;
const userList: User[] = generateUserList();
