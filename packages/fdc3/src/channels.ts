/**
 * Named app channels used across the workspace.
 * Keeps channel identifiers from drifting between broadcasters and listeners.
 */
export const AppChannels = {
	Custom: "CUSTOM-APP-CHANNEL",
} as const;

export type AppChannelId = (typeof AppChannels)[keyof typeof AppChannels];
