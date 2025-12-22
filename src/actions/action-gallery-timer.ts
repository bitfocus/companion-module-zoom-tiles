import { CompanionActionDefinition } from '@companion-module/base'
import { createCommand, sendActionCommand } from './action-utilities/action-utils.js'
import { InstanceBaseExt } from '../utils.js'
import { ZoomConfig } from '../config.js'

export enum ActionIdGalleryTimer {
	startQueueTimer = 'startQueueTimer',
	stopQueueTimer = 'stopQueueTimer',
	enableGallery = 'enableGallery',
	disableGallery = 'disableGallery',
	activateHolePunch = 'activateHolePunch',
	deactivateHolePunch = 'deactivateHolePunch',
}

export function GetActionsGalleryTimer(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdGalleryTimer]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdGalleryTimer]: CompanionActionDefinition | undefined } = {
		[ActionIdGalleryTimer.enableGallery]: {
			name: 'Enable Gallery',
			options: [
				{
					type: 'number',
					label: 'Gallery #',
					id: 'galleryIndex',
					min: 0,
					max: 10,
					default: 1,
				},
			],
			callback: (action): void => {
				const command = createCommand('/enableGallery')

				command.args.push({
					type: 'i',
					value: action.options.galleryIndex as number,
				})
				const sendToCommand = {
					id: 'enableGallery',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGalleryTimer.disableGallery]: {
			name: 'Disable Gallery',
			options: [
				{
					type: 'number',
					label: 'Gallery #',
					id: 'galleryIndex',
					min: 0,
					max: 10,
					default: 1,
				},
			],
			callback: (action): void => {
				const command = createCommand('/disableGallery')

				command.args.push({
					type: 'i',
					value: action.options.galleryIndex as number,
				})
				const sendToCommand = {
					id: 'disableGallery',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGalleryTimer.startQueueTimer]: {
			name: 'Start Queue Timer',
			options: [],
			callback: (): void => {
				const command = createCommand('/startQueueTimer')
				const sendToCommand = {
					id: 'startQueueTimer',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGalleryTimer.stopQueueTimer]: {
			name: 'Stop Queue Timer',
			options: [],
			callback: (): void => {
				const command = createCommand('/stopQueueTimer')
				const sendToCommand = {
					id: 'stopQueueTimer',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGalleryTimer.activateHolePunch]: {
			name: 'Activate Hole Punch',
			options: [
				{
					type: 'number',
					label: 'Gallery #',
					id: 'galleryIndex',
					min: 0,
					max: 10,
					default: 1,
				},
			],
			callback: (action): void => {
				const command = createCommand('/activateHolePunch')

				command.args.push({
					type: 'i',
					value: action.options.galleryIndex as number,
				})
				const sendToCommand = {
					id: 'activateHolePunch',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdGalleryTimer.deactivateHolePunch]: {
			name: 'Deactivate Hole Punch',
			options: [
				{
					type: 'number',
					label: 'Gallery #',
					id: 'galleryIndex',
					min: 0,
					max: 10,
					default: 1,
				},
			],
			callback: (action): void => {
				const command = createCommand('/deactivateHolePunch')

				command.args.push({
					type: 'i',
					value: action.options.galleryIndex as number,
				})
				const sendToCommand = {
					id: 'deactivateHolePunch',
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
