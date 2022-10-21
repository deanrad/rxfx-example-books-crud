import { defaultBus } from "@rxfx/bus";

export const bus = defaultBus;
bus.spy(console.log);
