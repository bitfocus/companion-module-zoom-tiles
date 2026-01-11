import { CompanionActionDefinition } from '@companion-module/base'
import { createCommand, sendActionCommand } from './action-utilities/action-utils.js'
import { InstanceBaseExt } from '../utils.js'
import { ZoomConfig } from '../config.js'

export enum ActionIdBlock {
	blockByIndex = 'blockByIndex',
	blockByUserName = 'blockByUserName',
	unBlockByIndex = 'unBlockByIndex',
	unBlockByUserName = 'unBlockByUserName',
}

/**
 * @help-description
 * Block actions prevent specific participants from appearing in your gallery views.
 * UnBlock actions allow previously blocked participants to appear again.
 * You can block/unblock by user name or by their position in a specific gallery.
 */
export function GetActionsBlock(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdBlock]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdBlock]: CompanionActionDefinition | undefined } = {
		[ActionIdBlock.blockByIndex]: {
			name: 'Block by Index',
			description: 'Block a tile using the gallery index and tile index.',
			options: [
				{
					type: 'textinput',
					label: 'Gallery Index',
					id: 'galleryIndex',
					default: '1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Tile Index',
					id: 'tileIndex',
					default: '1',
					useVariables: true,
				},
			],
			callback: async (action): Promise<void> => {
				const command = createCommand('/tileIndex/block')

				const galleryIndexRaw = await instance.parseVariablesInString(String(action.options.galleryIndex ?? ''))
				const tileIndexRaw = await instance.parseVariablesInString(String(action.options.tileIndex ?? ''))
				const galleryIndex = Number.parseInt(galleryIndexRaw, 10)
				const tileIndex = Number.parseInt(tileIndexRaw, 10)

				if (!Number.isInteger(galleryIndex) || !Number.isInteger(tileIndex)) {
					instance.log(
						'error',
						`Block by Index requires integer values. Received gallery='${galleryIndexRaw}', tile='${tileIndexRaw}'`,
					)
					return
				}

				command.args.push({ type: 'i', value: galleryIndex })
				command.args.push({ type: 'i', value: tileIndex })

				const sendToCommand = {
					id: 'blockByIndex',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdBlock.blockByUserName]: {
			name: 'Block by User Name',
			description: 'Block user(s) by User Name. For multiple users, separate names with a comma.',
			options: [
				{
					type: 'textinput',
					label: 'User Name',
					id: 'userName',
					default: '',
					useVariables: true,
				},
			],
			callback: async (action): Promise<void> => {
				const command = createCommand('/userName/block')
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				if (userName.indexOf(',') !== -1) {
					const userNames = userName.split(',')
					for (const name of userNames) {
						command.args = [] // Reset args for each user
						command.args.push({ type: 's', value: name.trim() })

						const sendToCommand = {
							id: 'blockByUserName',
							options: {
								command: command.oscPath,
								args: command.args,
							},
						}

						sendActionCommand(instance, sendToCommand)
					}
				} else {
					command.args.push({ type: 's', value: userName })

					const sendToCommand = {
						id: 'blockByUserName',
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}

					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdBlock.unBlockByIndex]: {
			name: 'UnBlock by Index',
			description: '(does not currently work)UnBlock a tile using the gallery index and tile index.',
			options: [
				{
					type: 'textinput',
					label: 'Gallery Index',
					id: 'galleryIndex',
					default: '1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Tile Index',
					id: 'tileIndex',
					default: '1',
					useVariables: true,
				},
			],
			callback: async (action): Promise<void> => {
				const command = createCommand('/tileIndex/unBlock')

				const galleryIndexRaw = await instance.parseVariablesInString(String(action.options.galleryIndex ?? ''))
				const tileIndexRaw = await instance.parseVariablesInString(String(action.options.tileIndex ?? ''))
				const galleryIndex = Number.parseInt(galleryIndexRaw, 10)
				const tileIndex = Number.parseInt(tileIndexRaw, 10)

				if (!Number.isInteger(galleryIndex) || !Number.isInteger(tileIndex)) {
					instance.log(
						'error',
						`UnBlock by Index requires integer values. Received gallery='${galleryIndexRaw}', tile='${tileIndexRaw}'`,
					)
					return
				}

				command.args.push({ type: 'i', value: galleryIndex })
				command.args.push({ type: 'i', value: tileIndex })

				const sendToCommand = {
					id: 'unBlockByIndex',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdBlock.unBlockByUserName]: {
			name: 'UnBlock by User Name',
			description: 'UnBlock user(s) by User Name. For multiple users, separate names with a comma.',
			options: [
				{
					type: 'textinput',
					label: 'User Name',
					id: 'userName',
					default: '',
					useVariables: true,
				},
			],
			callback: async (action): Promise<void> => {
				const command = createCommand('/userName/unBlock')
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				if (userName.indexOf(',') !== -1) {
					const userNames = userName.split(',')
					for (const name of userNames) {
						command.args = []
						command.args.push({ type: 's', value: name.trim() })

						const sendToCommand = {
							id: 'unBlockByUserName',
							options: {
								command: command.oscPath,
								args: command.args,
							},
						}

						sendActionCommand(instance, sendToCommand)
					}
				} else {
					command.args.push({ type: 's', value: userName })

					const sendToCommand = {
						id: 'unBlockByUserName',
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}

					sendActionCommand(instance, sendToCommand)
				}
			},
		},
	}

	return actions
}
