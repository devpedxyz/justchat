export type EntityId = string;

export interface BaseResponseBody<D = unknown> {
	data: D | null;
	error?: { message: string };
}
