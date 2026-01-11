import { CompanionActionDefinition } from '@companion-module/base'
import { createCommand, sendActionCommand } from './action-utilities/action-utils.js'
import { InstanceBaseExt } from '../utils.js'
import { ZoomConfig } from '../config.js'

export enum ActionIdReplace {
	replaceTileIndexByNewUserName = 'replaceTileIndexByNewUserName',
	replaceTileIndexByTileIndex = 'replaceTileIndexByTileIndex',
	replaceUserWithNewTileIndex = 'replaceUserWithNewTileIndex',
	replaceUserWithNewUser = 'replaceUserWithNewUser',
}

/**
 * @help-description
 * Replace actions allow you to swap participants in gallery views.
 * You can replace by user name, tile index, or a combination of both.
 */
export function GetActionsReplace(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdReplace]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdReplace]: CompanionActionDefinition | undefined } = {
		[ActionIdReplace.replaceTileIndexByNewUserName]: {
			name: 'Replace Tile Index in a Gallery with a New User',
			description:
				'Replace a Tile Index with a specific User. If both users are already in the gallery then they swap places in the gallery',
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
				{
					type: 'textinput',
					label: 'User Name',
					id: 'userName',
					default: '',
					useVariables: true,
				},
			],
			callback: async (action): Promise<void> => {
				const command = createCommand('/tileIndex/replaceByName')

				const galleryIndexRaw = await instance.parseVariablesInString(String(action.options.galleryIndex ?? ''))
				const tileIndexRaw = await instance.parseVariablesInString(String(action.options.tileIndex ?? ''))
				const userName = await instance.parseVariablesInString(String(action.options.userName ?? ''))
				const galleryIndex = Number.parseInt(galleryIndexRaw, 10)
				const tileIndex = Number.parseInt(tileIndexRaw, 10)

				if (!Number.isInteger(galleryIndex) || !Number.isInteger(tileIndex)) {
					instance.log(
						'error',
						`Replace by Index Name requires integer values for gallery and tile. Received gallery='${galleryIndexRaw}', tile='${tileIndexRaw}'`,
					)
					return
				}

				if (userName.includes(',')) {
					instance.log('error', `Replace by Index Name expects a single user. Received '${userName}'`)
					return
				}

				command.args.push({ type: 'i', value: galleryIndex })
				command.args.push({ type: 'i', value: tileIndex })
				command.args.push({ type: 's', value: userName })

				const sendToCommand = {
					id: 'replaceByIndexName',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdReplace.replaceTileIndexByTileIndex]: {
			name: 'Replace Tile Index with Tile Index',
			description: 'Replace a Tile Index with another Tile Index.',
			options: [
				{
					type: 'textinput',
					label: 'Current Gallery Index',
					id: 'currentGalleryIndex',
					default: '1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Current Tile Index',
					id: 'currentTileIndex',
					default: '1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'New Gallery Index',
					id: 'newGalleryIndex',
					default: '1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'New Tile Index',
					id: 'newTileIndex',
					default: '1',
					useVariables: true,
				},
			],
			callback: async (action): Promise<void> => {
				const command = createCommand('/tileIndex/replaceByIndex')

				const currentGalleryRaw = await instance.parseVariablesInString(action.options.currentGalleryIndex as string)
				const currentTileRaw = await instance.parseVariablesInString(action.options.currentTileIndex as string)
				const newGalleryRaw = await instance.parseVariablesInString(action.options.newGalleryIndex as string)
				const newTileRaw = await instance.parseVariablesInString(action.options.newTileIndex as string)
				const currentGalleryIndex = Number.parseInt(currentGalleryRaw, 10)
				const currentTileIndex = Number.parseInt(currentTileRaw, 10)
				const newGalleryIndex = Number.parseInt(newGalleryRaw, 10)
				const newTileIndex = Number.parseInt(newTileRaw, 10)

				if (
					!Number.isInteger(currentGalleryIndex) ||
					!Number.isInteger(currentTileIndex) ||
					!Number.isInteger(newGalleryIndex) ||
					!Number.isInteger(newTileIndex)
				) {
					instance.log(
						'error',
						`Replace Index by Index requires integer values. Received currentGallery='${currentGalleryRaw}', currentTile='${currentTileRaw}', newGallery='${newGalleryRaw}', newTile='${newTileRaw}'`,
					)
					return
				}

				command.args.push({ type: 'i', value: currentGalleryIndex })
				command.args.push({ type: 'i', value: currentTileIndex })
				command.args.push({ type: 'i', value: newGalleryIndex })
				command.args.push({ type: 'i', value: newTileIndex })

				const sendToCommand = {
					id: 'replaceIndexByIndex',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdReplace.replaceUserWithNewTileIndex]: {
			name: 'Replace User with Tile Index',
			description: 'Replace a user with a specific gallery/tile index.',
			options: [
				{
					type: 'textinput',
					label: 'User Name',
					id: 'userName',
					default: '',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Replace with Gallery Index',
					id: 'replaceGalleryIndex',
					default: '1',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Replace Tile Index',
					id: 'replaceTileIndex',
					default: '1',
					useVariables: true,
				},
			],
			callback: async (action): Promise<void> => {
				const command = createCommand('/userName/replaceByIndex')

				const userName = await instance.parseVariablesInString(String(action.options.userName ?? ''))
				const galleryIndexRaw = await instance.parseVariablesInString(String(action.options.replaceGalleryIndex ?? ''))
				const tileIndexRaw = await instance.parseVariablesInString(String(action.options.replaceTileIndex ?? ''))
				const galleryIndex = Number.parseInt(galleryIndexRaw, 10)
				const tileIndex = Number.parseInt(tileIndexRaw, 10)

				if (!Number.isInteger(galleryIndex) || !Number.isInteger(tileIndex)) {
					instance.log(
						'error',
						`Replace User with Tile Index requires integer values. Received gallery='${galleryIndexRaw}', tile='${tileIndexRaw}'`,
					)
					return
				}

				command.args.push({ type: 's', value: userName })
				command.args.push({ type: 'i', value: galleryIndex })
				command.args.push({ type: 'i', value: tileIndex })

				const sendToCommand = {
					id: 'replaceUserWithNewTileIndex',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdReplace.replaceUserWithNewUser]: {
			name: 'Replace by User Name',
			description: 'Replace user in the gallery with a new user regardless of where they are in the gallery.',
			options: [
				{
					type: 'textinput',
					label: 'User Name(s). Comma separated values: User To Replace, New User',
					id: 'userName',
					default: '',
					useVariables: true,
				},
			],
			callback: async (action): Promise<void> => {
				const command = createCommand('/userName/replaceByName')
				const userName = await instance.parseVariablesInString(action.options.userName as string)
				const names = userName.split(',')
				if (names.length !== 2) {
					instance.log(
						'error',
						'This action requires exactly two user names separated by a comma: UserToReplace, NewUser',
					)
				} else {
					command.args.push({ type: 's', value: names[0].trim() })
					command.args.push({ type: 's', value: names[1].trim() })

					const sendToCommand = {
						id: 'replaceByUserName',
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
