import { CompanionActionDefinition } from '@companion-module/base'
import { createCommand, sendActionCommand } from './action-utilities/action-utils.js'
import { InstanceBaseExt } from '../utils.js'
import { ZoomConfig } from '../config.js'

export enum ActionIdFavorite {
	favoriteByUserName = 'favoriteByUserName',
	favoriteByIndex = 'favoriteByIndex',
}

export function GetActionsFavorite(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdFavorite]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdFavorite]: CompanionActionDefinition | undefined } = {
		[ActionIdFavorite.favoriteByUserName]: {
			name: 'Favorite by User Name',
			description: 'Favorite user(s) by User Name. For multiple users, separate names with a comma.',
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
				const command = createCommand('/userName/favorite')
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				if (userName.indexOf(',') !== -1) {
					const userNames = userName.split(',')
					for (const name of userNames) {
						command.args = [] // Reset args for each user
						command.args.push({ type: 's', value: name.trim() })

						const sendToCommand = {
							id: 'favoriteByUserName',
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
						id: 'favoriteByUserName',
						options: {
							command: command.oscPath,
							args: command.args,
						},
					}

					sendActionCommand(instance, sendToCommand)
				}
			},
		},
		[ActionIdFavorite.favoriteByIndex]: {
			name: 'Favorite by Index',
			description: 'Favorite a tile using the gallery index and tile index.',
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
				const command = createCommand('/tileIndex/favorite')

				const galleryIndexRaw = await instance.parseVariablesInString(String(action.options.galleryIndex ?? ''))
				const tileIndexRaw = await instance.parseVariablesInString(String(action.options.tileIndex ?? ''))
				const galleryIndex = Number.parseInt(galleryIndexRaw, 10)
				const tileIndex = Number.parseInt(tileIndexRaw, 10)

				if (!Number.isInteger(galleryIndex) || !Number.isInteger(tileIndex)) {
					instance.log(
						'error',
						`Favorite by Index requires integer values. Received gallery='${galleryIndexRaw}', tile='${tileIndexRaw}'`,
					)
					return
				}

				command.args.push({ type: 'i', value: galleryIndex })
				command.args.push({ type: 'i', value: tileIndex })

				const sendToCommand = {
					id: 'favoriteByIndex',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
	}

	return actions
}
