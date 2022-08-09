// export function Command<T extends PieceOptions>(target: T): ClassDecorator {
//             new Proxy(target, {
//                 construct: (target, args) => {
//                     const instance = Reflect.construct(target, args);
//                     instance.options = {
//                         ...instance.options,
//                         type: ApplicationCommandType.ChatInput,
//                     };
//                     return instance;
//             })
//     );
// }

// export interface PieceOptions {
// 	/**
// 	 * The name for the piece.
// 	 * @default ''
// 	 */
// 	readonly name?: string;

// 	/**
// 	 * Whether or not the piece should be enabled. If set to false, the piece will be unloaded.
// 	 * @default true
// 	 */
// 	readonly enabled?: boolean;
// }

// export interface ApplyOptionsCallbackParameters {
//     container: Container;
//     context: Piece.Context;
// }
