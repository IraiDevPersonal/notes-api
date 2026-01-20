export enum EResourceType {
	OWN = "own",
	SHARED = "shared",
	PINNED = "pinned",
}

export type ResoruceQueryModel = {
	type?: EResourceType;
};
