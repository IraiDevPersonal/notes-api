export type LoggedUserModel = {
	id: string;
	name: string;
	email: string;
	lastName: string;
	avatar: string | null;
	ownerResourceCount: number;
	sharedResourceCount: number;
	createdAt: Date;
};
